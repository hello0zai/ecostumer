import { PaymentGatewayFactory } from '@saas/gateway'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { auth } from '../../middleware/auth'
import { BadRequestError } from '../_error/bad-request-error'

export async function createPayment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/payments',
      {
        schema: {
          tags: ['Payments'],
          summary: 'Inicia um novo pagamento',
          body: z.object({
            planId: z.coerce.string().cuid(),
          }),
          response: {
            200: z.object({
              paymentUrl: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { planId } = request.body
        const userId = await request.getCurrentUserId()

        app.log.info(
          `Usuário ${userId} iniciando pagamento para o plano ${planId}`,
        )

        // Verificar se o plano existe
        const plan = await prisma.plan.findUnique({
          where: { id: planId },
        })

        if (!plan) {
          throw new BadRequestError('Plano não encontrado.')
        }

        app.log.info('Plano encontrado:', plan)

        if (
          !plan.price ||
          typeof plan.price !== 'number' ||
          isNaN(plan.price)
        ) {
          throw new BadRequestError(
            'O plano selecionado não possui um preço válido.',
          )
        }

        const subscription = await prisma.subscription.create({
          data: {
            userId,
            planId,
            startDate: new Date(),
            endDate: new Date(),
            status: 'PENDING',
          },
        })

        app.log.info('Assinatura criada:', subscription)

        // Inicializar o pagamento através do gateway
        const paymentGateway = PaymentGatewayFactory.createGateway()

        app.log.info(
          `Usando o gateway de pagamento: ${paymentGateway.constructor.name}`,
        )

        try {
          const amountInCents = plan.price * 100
          const returnUrl = `${env.APP_URL}/payments/success?subscriptionId=${subscription.id}`
          const cancelUrl = `${env.APP_URL}/payments/cancel`

          app.log.info('Inicializando pagamento com os seguintes dados:', {
            amount: amountInCents,
            currency: 'BRL',
            metadata: {
              subscriptionId: subscription.id,
            },
            returnUrl,
            cancelUrl,
          })

          const initializePaymentResult =
            await paymentGateway.initializePayment({
              amount: amountInCents,
              currency: 'BRL',
              metadata: {
                subscriptionId: subscription.id,
              },
              returnUrl,
              cancelUrl,
            })

          app.log.info(
            'Resultado da inicialização do pagamento:',
            initializePaymentResult,
          )

          if (
            !initializePaymentResult.paymentId ||
            !initializePaymentResult.paymentUrl
          ) {
            throw new Error(
              'Dados inválidos retornados pelo gateway de pagamento.',
            )
          }

          // Registrar o pagamento no banco de dados
          const payment = await prisma.payment.create({
            data: {
              subscriptionId: subscription.id,
              amount: plan.price,
              currency: 'BRL',
              status: 'PENDING',
              paymentGateway: paymentGateway.constructor.name,
              transactionId: initializePaymentResult.paymentId,
            },
          })

          app.log.info('Pagamento registrado no banco de dados:', payment)

          return reply.status(200).send({
            paymentUrl: initializePaymentResult.paymentUrl,
          })
        } catch (error) {
          app.log.error('Erro ao iniciar o pagamento:', error)

          if (error instanceof Error) {
            throw new BadRequestError(
              `Erro ao iniciar o pagamento: ${error.message}`,
            )
          } else {
            throw new BadRequestError(
              'Erro ao iniciar o pagamento: Erro desconhecido',
            )
          }
        }
      },
    )
}
