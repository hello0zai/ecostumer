import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'

export async function deleteProduct(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/products/:productId',
      {
        schema: {
          tags: ['Products'],
          summary: 'Delete a Product',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            productId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { productId } = request.params

        // Verifica a permissão do usuário
        // const { organization } = await request.getUserMembership(slug)
        // const { cannot } = getUserPermissions(
        //   membership.userId,
        //   membership.role,
        // )
        // if (cannot('delete', 'Product')) {
        //   throw new UnauthorizedError(
        //     'You do not have permission to delete this product.',
        //   )
        // }

        await prisma.product.delete({
          where: { id: productId },
        })

        return reply.status(204).send()
      },
    )
}
