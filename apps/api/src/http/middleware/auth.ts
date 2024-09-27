import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../routes/_error/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new UnauthorizedError('Inavlid token')
      }
    }

    request.getUserSubscription = async () => {
      const userId = await request.getCurrentUserId()

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          subscription: true,
        },
      })

      if (!user) {
        throw new UnauthorizedError('User not found.')
      }

      return user.subscription
    }

    request.getUserMembership = async (slug: string) => {
      const userId = await request.getCurrentUserId()

      const member = await prisma.member.findFirst({
        where: {
          userId,
          organization: {
            slug,
          },
        },
        include: {
          organization: true,
        },
      })

      if (!member) {
        throw new UnauthorizedError(`You're not a member of this organization.`)
      }

      const { organization, ...membership } = member

      return {
        organization,
        membership,
      }
    }
  })
})
