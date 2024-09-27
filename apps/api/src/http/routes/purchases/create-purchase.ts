import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function createPurchase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/clients/:clientId/purchases',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Create a new purchase',
          security: [{ bearerAuth: [] }],
          body: z.object({
            products: z
              .array(
                z.object({
                  id: z.string().uuid(), // ID do produto
                  quantity: z.number().positive(), // Quantidade do produto
                }),
              )
              .min(1, 'At least one product must be included'),
            paymentMethod: z.string().min(1),
            purchaseAmount: z.number().positive(),
            purchaseDate: z.coerce.date(),
            description: z.string().nullable(),
          }),
          params: z.object({
            slug: z.string(),
            clientId: z.string(),
          }),
          response: {
            201: z.object({
              id: z.string(),
              products: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  price: z.number(),
                  quantity: z.number(),
                }),
              ),
              paymentMethod: z.string(),
              purchaseAmount: z.number(),
              purchaseDate: z.date(),
              description: z.string().nullable(),
              clientId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, clientId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Purchase')) {
          throw new UnauthorizedError(
            `You do not have permission to create purchases.`,
          )
        }

        // Verificar se o cliente pertence à organização usando o slug
        const client = await prisma.client.findFirst({
          where: {
            id: clientId,
            organization: {
              slug,
            },
          },
        })

        if (!client) {
          throw new BadRequestError('Client not found in this organization.')
        }

        const {
          products,
          paymentMethod,
          purchaseAmount,
          purchaseDate,
          description,
        } = request.body

        // Verificar se os produtos existem
        const productIds = products.map((product) => product.id)
        const foundProducts = await prisma.product.findMany({
          where: {
            id: { in: productIds },
            organization: {
              slug,
            },
          },
        })

        if (foundProducts.length !== productIds.length) {
          throw new BadRequestError(
            'Some products were not found in the organization.',
          )
        }

        // Criar a nova compra
        const purchase = await prisma.purchase.create({
          data: {
            paymentMethod,
            purchaseAmount, // Esse valor pode ser calculado somando os produtos
            purchaseDate,
            description,
            clientId,
            products: {
              create: products.map((product) => ({
                productId: product.id,
                quantity: product.quantity,
              })),
            },
          },
          include: {
            products: {
              include: {
                product: true,
              },
            },
          },
        })

        const response = {
          id: purchase.id,
          products: purchase.products.map((purchaseProduct) => ({
            id: purchaseProduct.product.id,
            name: purchaseProduct.product.name,
            price: purchaseProduct.product.price,
            quantity: purchaseProduct.quantity,
          })),
          paymentMethod: purchase.paymentMethod,
          purchaseAmount: purchase.purchaseAmount,
          purchaseDate: purchase.purchaseDate,
          description: purchase.description,
          clientId: purchase.clientId,
        }

        return reply.status(201).send(response)
      },
    )
}
