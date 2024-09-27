import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function updatePurchase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/clients/:clientId/purchases/:purchaseId',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Update a purchase',
          security: [{ bearerAuth: [] }],
          body: z.object({
            service: z.string().min(1),
            paymentMethod: z.string().min(1),
            purchaseAmount: z.number().positive(),
            purchaseDate: z.coerce.date(),
            description: z.string().nullable(),
          }),
          params: z.object({
            slug: z.string(),
            clientId: z.string(),
            purchaseId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, clientId, purchaseId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Purchase')) {
          throw new UnauthorizedError(
            `You do not have permission to update purchases.`,
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

        const purchase = await prisma.purchase.findUnique({
          where: {
            id: purchaseId,
            clientId,
          },
        })

        if (!purchase) {
          throw new BadRequestError('Purchase not found.')
        }

        const {
          service,
          paymentMethod,
          purchaseAmount,
          purchaseDate,
          description,
        } = request.body

        await prisma.purchase.update({
          where: {
            id: purchaseId,
          },
          data: {
            service,
            paymentMethod,
            purchaseAmount,
            purchaseDate,
            description,
          },
        })

        return reply.status(204).send()
      },
    )
}
