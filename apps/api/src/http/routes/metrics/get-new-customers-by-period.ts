import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getNewCustomersByPeriod(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/new-customers',
      {
        schema: {
          tags: ['Metrics'],
          summary:
            'Get the number of new customers for an organization by period',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            period: z.enum(['week', 'month']).default('month'),
          }),
          response: {
            200: z.object({
              period: z.string(),
              newCustomers: z.number(),
              customerChange: z.number(),
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
        } else {
          throw new BadRequestError('Invalid period specified.')
        }

        const newCustomers = await prisma.client.count({
          where: {
            organizationId: organization.id,
            createdAt: {
              gte: startDate,
            },
          },
        })

        const previousNewCustomers = await prisma.client.count({
          where: {
            organizationId: organization.id,
            createdAt: {
              gte: previousStartDate,
              lt: startDate,
            },
          },
        })

        const customerChange =
          ((newCustomers - previousNewCustomers) /
            (previousNewCustomers || 1)) *
          100

        return reply.status(200).send({
          period,
          newCustomers,
          customerChange,
        })
      },
    )
}
