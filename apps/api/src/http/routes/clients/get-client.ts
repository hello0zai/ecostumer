import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getClient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/client/:clientId',
      {
        schema: {
          tags: ['Clients'],
          summary: 'Get client details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            clientId: z.string(),
          }),
          response: {
            200: z.object({
              client: z.object({
                name: z.string(),
                email: z.string().email().nullable(),
                phoneNumber: z.string(),
                birthday: z.coerce.date().nullable(),
                street: z.string().nullable(),
                complement: z.string().nullable(),
                city: z.string().nullable(),
                state: z.string().nullable(),
                purchases: z.array(
                  z.object({
                    id: z.string(),
                    paymentMethod: z.string(),
                    purchaseAmount: z.coerce.number(),
                    purchaseDate: z.coerce.date(),
                    description: z.string().nullable(),
                    products: z.array(
                      z.object({
                        product: z.object({
                          name: z.string(), // Acessa o nome do produto
                        }),
                      }),
                    ),
                  }),
                ),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, clientId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Client')) {
          throw new UnauthorizedError(
            'You do not have permission to view clients.',
          )
        }

        const client = await prisma.client.findUnique({
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            birthday: true,
            street: true,
            complement: true,
            city: true,
            state: true,
            purchases: {
              select: {
                id: true,
                paymentMethod: true,
                purchaseAmount: true,
                purchaseDate: true,
                description: true,
                products: {
                  select: {
                    product: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          where: {
            id: clientId,
            organizationId: organization.id,
          },
        })

        if (!client) {
          throw new BadRequestError('Client not found.')
        }

        return reply.send({ client })
      },
    )
}
