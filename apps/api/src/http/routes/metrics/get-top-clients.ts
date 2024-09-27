import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getTopClients(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/top-clients',
      {
        schema: {
          tags: ['Metrics'],
          summary:
            'Get the clients with the most purchases for an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                clientId: z.string(),
                clientName: z.string(),
                purchaseCount: z.number(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Metrics')) {
          throw new UnauthorizedError(
            'You do not have permission to view metrics.',
          )
        }

        const topClients = await prisma.purchase.groupBy({
          by: ['clientId'],
          _count: {
            clientId: true,
          },
          where: {
            client: {
              organizationId: organization.id,
            },
          },
          orderBy: {
            _count: {
              clientId: 'desc',
            },
          },
          take: 10,
        })

        const clientDetails = await prisma.client.findMany({
          where: {
            id: {
              in: topClients.map((client) => client.clientId),
            },
          },
          select: {
            id: true,
            name: true,
          },
        })

        const result = topClients.map((client) => {
          const clientDetail = clientDetails.find(
            (detail) => detail.id === client.clientId,
          )
          return {
            clientId: client.clientId,
            clientName: clientDetail?.name || '',
            purchaseCount: client._count.clientId,
          }
        })

        return reply.status(200).send(result)
      },
    )
}
