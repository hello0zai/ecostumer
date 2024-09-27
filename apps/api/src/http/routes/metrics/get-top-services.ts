import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getTopServices(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/top-services',
      {
        schema: {
          tags: ['Metrics'],
          summary: 'Get the most sold services for an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                service: z.string(),
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

        const topServices = await prisma.purchase.groupBy({
          by: ['service'],
          _count: {
            service: true,
          },
          where: {
            client: {
              organizationId: organization.id,
            },
          },
          orderBy: {
            _count: {
              service: 'desc',
            },
          },
          take: 10,
        })

        const result = topServices.map((service) => ({
          service: service.service,
          purchaseCount: service._count.service,
        }))

        return reply.status(200).send(result)
      },
    )
}
