import { clientSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { UnauthorizedError } from '@/http/routes/_error/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'

export async function updateClient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/clients/:clientId',
      {
        schema: {
          tags: ['Clients'],
          summary: 'Update a client',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().min(2),
            email: z.string().email().nullable(),
            phoneNumber: z.string().min(4),
            birthday: z.coerce.date().nullable(),
            street: z.string().nullable(),
            complement: z.string().nullable(),
            city: z.string().nullable(),
            state: z.string().nullable(),
          }),
          params: z.object({
            slug: z.string(),
            clientId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, clientId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const client = await prisma.client.findUnique({
          where: {
            id: clientId,
            organizationId: organization.id,
          },
        })

        if (!client) {
          throw new BadRequestError('Client not found.')
        }

        const { cannot } = getUserPermissions(userId, membership.role)
        const authClient = clientSchema.parse(client)

        if (cannot('delete', authClient)) {
          throw new UnauthorizedError(
            `You're not allowed to delete this client.`,
          )
        }

        const {
          name,
          email,
          phoneNumber,
          birthday,
          street,
          complement,
          city,
          state,
        } = request.body

        // Verificação de email existente
        if (email && email !== client.email) {
          const emailExists = await prisma.client.findFirst({
            where: {
              email,
              organizationId: organization.id,
              NOT: {
                id: clientId,
              },
            },
          })

          if (emailExists) {
            throw new BadRequestError(
              'Another client with the same email already exists.',
            )
          }
        }

        // Verificação de número de telefone existente
        if (phoneNumber && phoneNumber !== client.phoneNumber) {
          const phoneExists = await prisma.client.findFirst({
            where: {
              phoneNumber,
              organizationId: organization.id,
              NOT: {
                id: clientId,
              },
            },
          })

          if (phoneExists) {
            throw new BadRequestError(
              'Another client with the same phone number already exists.',
            )
          }
        }

        await prisma.client.update({
          where: {
            id: clientId,
          },
          data: {
            name,
            email,
            phoneNumber,
            birthday,
            street,
            complement,
            city,
            state,
          },
        })

        return reply.status(204).send()
      },
    )
}
