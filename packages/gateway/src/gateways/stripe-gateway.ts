import { env } from '@saas/env';
import { PaymentGateway, InitializePaymentData, InitializePaymentResult, VerifyPaymentData, VerifyPaymentResult } from '../interfaces/payment-gateway';
import Stripe from 'stripe';

export class StripeGateway implements PaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-06-20',
    });
  }

  async initializePayment(data: InitializePaymentData): Promise<InitializePaymentResult> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: 'Plano de Assinatura',
            },
            unit_amount: data.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: data.returnUrl,
      cancel_url: data.cancelUrl,
      metadata: data.metadata,
    });

    return {
      paymentUrl: session.url || '',
      paymentId: session.id,
    };
  }

  async verifyPayment(data: VerifyPaymentData): Promise<VerifyPaymentResult> {
    const session = await this.stripe.checkout.sessions.retrieve(data.paymentId);

    return {
      success: session.payment_status === 'paid',
      paymentId: data.paymentId,
    };
  }
}
