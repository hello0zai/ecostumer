import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getAllPurchases(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/purchases',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Get all purchases for an organization with pagination',
          security: [{ bearerAuth: [] }],
          querystring: z.object({
            page: z.coerce.number().min(1).default(1),
            pageSize: z.coerce.number().min(1).max(100).default(10),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              purchases: z.array(
                z.object({
                  id: z.string(),
                  paymentMethod: z.string(),
                  purchaseAmount: z.number(),
                  purchaseDate: z.date(),
                  description: z.string().nullable(),
                  clientName: z.string(),
                  products: z.array(
                    z.object({
                      id: z.string(),
                      name: z.string(),
                      price: z.number(),
                      quantity: z.number(),
                    }),
                  ),
                }),
              ),
              totalPages: z.number(),
              currentPage: z.number(),
              pageSize: z.number(), // Adicionando pageSize na resposta
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { page, pageSize } = request.query
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Purchase')) {
          throw new UnauthorizedError(
            `You do not have permission to view purchases.`,
          )
        }

        // Busca o total de compras e as compras da página atual
        const [totalCount, purchases] = await Promise.all([
          prisma.purchase.count({
            where: {
              client: {
                organization: {
                  slug,
                },
              },
            },
          }),
          prisma.purchase.findMany({
            where: {
              client: {
                organization: {
                  slug,
                },
              },
            },
            select: {
              id: true,
              paymentMethod: true,
              purchaseAmount: true,
              purchaseDate: true,
              description: true,
              client: {
                select: {
                  name: true,
                },
              },
              products: {
                select: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                    },
                  },
                  quantity: true,
                },
              },
            },
            orderBy: {
              purchaseDate: 'desc',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
        ])

        // Cálculo do total de páginas
        const totalPages = Math.ceil(totalCount / pageSize)

        // Formata as compras para o formato esperado na resposta
        const purchasesWithClientInfo = purchases.map((purchase) => ({
          id: purchase.id,
          paymentMethod: purchase.paymentMethod,
          purchaseAmount: purchase.purchaseAmount,
          purchaseDate: purchase.purchaseDate,
          description: purchase.description,
          clientName: purchase.client?.name || 'Unknown',
          products: purchase.products.map((purchaseProduct) => ({
            id: purchaseProduct.product.id,
            name: purchaseProduct.product.name,
            price: purchaseProduct.product.price,
            quantity: purchaseProduct.quantity,
          })),
        }))

        return reply.status(200).send({
          purchases: purchasesWithClientInfo,
          totalPages,
          currentPage: page,
          pageSize,
        })
      },
    )
}
