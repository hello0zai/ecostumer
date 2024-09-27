import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getActiveCustomers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/active-customers',
      {
        schema: {
          tags: ['Metrics'],
          summary: 'Get the number of active customers for an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            period: z.enum(['week', 'month']).default('month'),
          }),
          response: {
            200: z.object({
              activeCustomers: z.number(),
              activeChange: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { period } = request.query
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('get', 'Metrics')) {
          throw new UnauthorizedError(
            'You do not have permission to view metrics.',
          )
        }

        const now = new Date()
        let startDate
        let previousStartDate

        if (period === 'week') {
          startDate = new Date(now.setDate(now.getDate() - 7))
          previousStartDate = new Date(now.setDate(now.getDate() - 14))
        } else if (period === 'month') {
          startDate = new Date(now.setMonth(now.getMonth() - 1))
          previousStartDate = new Date(now.setMonth(now.getMonth() - 2))
        }

        const activeCustomers = await prisma.client.count({
          where: {
            organizationId: organization.id,
            // Define what makes a customer active
            // For example, customers who made a purchase in the last period
            purchases: {
              some: {
                purchaseDate: {
                  gte: startDate,
                },
              },
            },
          },
        })

        const previousActiveCustomers = await prisma.client.count({
          where: {
            organizationId: organization.id,
            purchases: {
              some: {
                purchaseDate: {
                  gte: previousStartDate,
                  lt: startDate,
                },
              },
            },
          },
        })

        const activeChange =
          ((activeCustomers - previousActiveCustomers) /
            (previousActiveCustomers || 1)) *
          100

        return reply.status(200).send({ activeCustomers, activeChange })
      },
    )
}
