import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getPurchases(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/clients/:clientId/purchases',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Get all purchases for a client',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            clientId: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                service: z.string(),
                paymentMethod: z.string(),
                purchaseAmount: z.number(),
                purchaseDate: z.date(),
                description: z.string().nullable(),
                clientId: z.string(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const { slug, clientId } = request.params
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

        const purchases = await prisma.purchase.findMany({
          where: {
            clientId,
          },
          orderBy: {
            purchaseDate: 'desc',
          },
        })

        return reply.status(200).send(purchases)
      },
    )
}
