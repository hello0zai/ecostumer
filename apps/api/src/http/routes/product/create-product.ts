import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'

export async function createProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/products',
      {
        schema: {
          tags: ['Products'],
          summary: 'Create a new Product',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().min(2),
            description: z.string().nullable(),
            price: z.number().positive(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              product: z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                status: z.boolean(),
                price: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { name, description, price } = request.body

        // Verifica a permissão do usuário
        const { organization } = await request.getUserMembership(slug)

        // const { cannot } = getUserPermissions(
        //   membership.userId,
        //   membership.role,
        // )
        // if (cannot('create', 'Product')) {
        //   throw new UnauthorizedError(
        //     'You do not have permission to create a product.',
        //   )
        // }

        const product = await prisma.product.create({
          data: {
            name,
            description,
            price,
            organizationId: organization.id,
          },
        })

        return reply.status(201).send({ product })
      },
    )
}
