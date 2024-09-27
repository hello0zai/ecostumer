import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'

export async function getProducts(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/products',
      {
        schema: {
          tags: ['Products'],
          summary: 'List Products',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            search: z.string().optional(), // Param de busca
            status: z.boolean().optional(), // Filtrar por status (ativo/inativo)
            minPrice: z.number().optional(), // Filtrar por preço mínimo
            maxPrice: z.number().optional(), // Filtrar por preço máximo
          }),
          response: {
            200: z.object({
              products: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  description: z.string().nullable(),
                  status: z.boolean(),
                  price: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { search, status, minPrice, maxPrice } = request.query

        // Obter a organização do usuário logado
        const { organization } = await request.getUserMembership(slug)

        // Tipar o objeto `whereClause` explicitamente
        const whereClause: {
          organizationId: string
          name?: { contains: string; mode: 'insensitive' }
          status?: boolean
          price?: { gte?: number; lte?: number }
        } = {
          organizationId: organization.id,
        }

        // Aplicar filtros dinamicamente
        if (search) {
          whereClause.name = {
            contains: search,
            mode: 'insensitive',
          }
        }

        if (status !== undefined) {
          whereClause.status = status
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
          whereClause.price = {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          }
        }

        // Consultar produtos com os filtros aplicados
        const products = await prisma.product.findMany({
          where: whereClause,
        })

        return reply.status(200).send({ products })
      },
    )
}
