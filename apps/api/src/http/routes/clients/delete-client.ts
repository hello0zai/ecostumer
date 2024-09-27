import { clientSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { UnauthorizedError } from '@/http/routes/_error/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'

export async function deleteClient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/clients/:clientId',
      {
        schema: {
          tags: ['Clients'],
          summary: 'Delete a client',
          security: [{ bearerAuth: [] }],
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

        await prisma.client.delete({
          where: {
            id: clientId,
          },
        })

        return reply.status(204).send()
      },
    )
}
