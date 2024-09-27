import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getPurchase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/clients/:clientId/purchases/:purchaseId',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Get a specific purchase for a client',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            clientId: z.string(),
            purchaseId: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string(),
              paymentMethod: z.string(),
              purchaseAmount: z.number(),
              purchaseDate: z.date(),
              description: z.string().nullable(),
              clientId: z.string(),
              products: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  price: z.number(),
                  quantity: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, clientId, purchaseId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Purchase')) {
          throw new UnauthorizedError(
            `You do not have permission to view purchases.`,
          )
        }

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

        const purchase = await prisma.purchase.findFirst({
          where: {
            id: purchaseId,
            clientId,
          },
          include: {
            products: {
              include: {
                product: true, // Inclui os detalhes do produto da tabela `Product`
              },
            },
          },
        })

        if (!purchase) {
          throw new BadRequestError('Purchase not found.')
        }

        // Transformando a estrutura de produtos da compra para incluir detalhes e quantidade
        const products = purchase.products.map((purchaseProduct) => ({
          id: purchaseProduct.product.id,
          name: purchaseProduct.product.name,
          price: purchaseProduct.product.price,
          quantity: purchaseProduct.quantity,
        }))

        return reply.status(200).send({
          id: purchase.id,
          paymentMethod: purchase.paymentMethod,
          purchaseAmount: purchase.purchaseAmount, // Esse valor pode ser somado a partir dos produtos
          purchaseDate: purchase.purchaseDate,
          description: purchase.description,
          clientId: purchase.clientId,
          products,
        })
      },
    )
}
