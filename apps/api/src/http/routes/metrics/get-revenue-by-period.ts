import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getRevenueByPeriod(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/revenue-by-period',
      {
        schema: {
          tags: ['Metrics'],
          summary: 'Get the total revenue for an organization by period',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            period: z.enum(['week', 'month']),
          }),
          response: {
            200: z.object({
              period: z.string(),
              totalRevenue: z.number(),
              revenueChange: z.number(),
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

        const totalRevenue = await prisma.purchase.aggregate({
          _sum: {
            purchaseAmount: true,
          },
          where: {
            client: {
              organizationId: organization.id,
            },
            purchaseDate: {
              gte: startDate,
            },
          },
        })

        const previousRevenue = await prisma.purchase.aggregate({
          _sum: {
            purchaseAmount: true,
          },
          where: {
            client: {
              organizationId: organization.id,
            },
            purchaseDate: {
              gte: previousStartDate,
              lt: startDate,
            },
          },
        })

        const revenueChange =
          (((totalRevenue._sum.purchaseAmount || 0) -
            (previousRevenue._sum.purchaseAmount || 0)) /
            (previousRevenue._sum.purchaseAmount || 1)) *
          100

        return reply.status(200).send({
          period,
          totalRevenue: totalRevenue._sum.purchaseAmount || 0,
          revenueChange,
        })
      },
    )
}
