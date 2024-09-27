import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function createClient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/clients',
      {
        schema: {
          tags: ['Clients'],
          summary: 'Create a new Client',
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
          }),
          response: {
            201: z.object({
              client: z.object({
                name: z.string(),
                email: z.string().email().nullable(),
                phoneNumber: z.string(),
                birthday: z.coerce.date().nullable(),
                street: z.string().nullable(),
                complement: z.string().nullable(),
                city: z.string().nullable(),
                state: z.string().nullable(),
              }),
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

        if (cannot('create', 'Client')) {
          throw new UnauthorizedError(
            'You do not have permission to create a client.',
          )
        }

        // Usar a função getUserSubscription para verificar o tipo de assinatura do usuário
        const subscription = await request.getUserSubscription()

        if (subscription !== 'PRO') {
          const clientCount = await prisma.client.count({
            where: { organizationId: organization.id },
          })

          if (clientCount >= 200) {
            throw new BadRequestError(
              'You have reached the maximum number of clients allowed for your current plan.',
            )
          }
        }

        const {
          name,
          email,
          birthday,
          city,
          complement,
          phoneNumber,
          state,
          street,
        } = request.body

        if (email) {
          const clientEmailExist = await prisma.client.findFirst({
            where: { email },
          })

          if (clientEmailExist) {
            throw new BadRequestError(
              'Another client with the same email already exists',
            )
          }
        }

        const clientPhoneExist = await prisma.client.findFirst({
          where: { phoneNumber },
        })

        if (clientPhoneExist) {
          throw new BadRequestError(
            'Another client with the same phone number already exists',
          )
        }

        // Pega o id do usuário autenticado como autor
        const authorId = await request.getCurrentUserId()

        const client = await prisma.client.create({
          data: {
            name,
            email,
            birthday,
            city,
            complement,
            phoneNumber,
            state,
            street,
            organizationId: organization.id,
            authorId,
          },
        })

        return reply.status(201).send({ client })
      },
    )
}
