import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getClients(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/clients',
      {
        schema: {
          tags: ['Clients'],
          summary: 'Get all organization clients',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              clients: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  active: z.boolean().nullable(),
                  email: z.string().email().nullable(),
                  phoneNumber: z.string(),
                  birthday: z.coerce.date().nullable(),
                  street: z.string().nullable(),
                  complement: z.string().nullable(),
                  city: z.string().nullable(),
                  state: z.string().nullable(),
                  createdAt: z.date(),
                  author: z
                    .object({
                      id: z.string(),
                      name: z.string().nullable(),
                      email: z.string().email().nullable(),
                      avatarUrl: z.string().nullable(),
                    })
                    .nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )
        if (cannot('get', 'Client')) {
          throw new UnauthorizedError(
            'You do not have permission to view clients.',
          )
        }

        // Inclui o author (id, name, email, avatarUrl) no select
        const clients = await prisma.client.findMany({
          select: {
            createdAt: true,
            active: true,
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            birthday: true,
            street: true,
            complement: true,
            city: true,
            state: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.status(200).send({ clients })
      },
    )
}
