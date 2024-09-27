import { env } from '@agender/env'
import { prisma } from '@agender/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import Stripe from 'stripe'

import { auth } from '@/http/middleware/auth'

export async function stripeWebhook(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/webhooks/stripe',
      {
        config: {
          rawBody: true,
        },
      },
      async (request, reply) => {
        const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
          apiVersion: '2024-06-20',
        })

        const sig = request.headers['stripe-signature'] as string
        const webhookSecret = env.STRIPE_WEBHOOK_SECRET || ''

        let event: Stripe.Event

        try {
          event = stripe.webhooks.constructEvent(
            request.rawBody!,
            sig,
            webhookSecret,
          )
        } catch (err) {
          if (err instanceof Error) {
            app.log.error(
              `Webhook signature verification failed: ${err.message}`,
            )
            return reply.status(400).send(`Webhook Error: ${err.message}`)
          } else {
            app.log.error(
              `Webhook signature verification failed: ${String(err)}`,
            )
            return reply.status(400).send(`Webhook Error: ${String(err)}`)
          }
        }

        // Processar o evento
        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            await handleCheckoutSessionCompleted(session)
            break
          }
          // ... tratar outros tipos de eventos se necessário
          default:
            app.log.warn(`Unhandled event type ${event.type}`)
        }

        reply.status(200).send({ received: true })
      },
    )

  async function handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const subscriptionId = session.metadata?.subscriptionId as string
    const paymentId = session.id

    if (!subscriptionId) {
      throw new Error('subscriptionId não encontrado nos metadados da sessão.')
    }

    await prisma.$transaction(async (tx) => {
      // Atualizar o pagamento
      await tx.payment.updateMany({
        where: { transactionId: paymentId },
        data: { status: 'COMPLETED' },
      })

      // Obter a assinatura e o plano
      const subscription = await tx.subscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: true },
      })

      if (!subscription) {
        throw new Error('Assinatura não encontrada.')
      }

      // Atualizar a assinatura
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(
            new Date().getTime() + subscription.plan.duration * 86400000,
          ),
        },
      })
    })
  }
}
