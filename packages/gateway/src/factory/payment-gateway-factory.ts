import { PaymentGateway } from '../interfaces/payment-gateway';
import { StripeGateway } from '../gateways/stripe-gateway';
import { PayPalGateway } from '../gateways/paypal-gateway';
import { env } from '@saas/env';

export class PaymentGatewayFactory {
  static createGateway(): PaymentGateway {
    const gatewayName = env.PAYMENT_GATEWAY || 'stripe';

    switch (gatewayName.toLowerCase()) {
      case 'stripe':
        return new StripeGateway();
      case 'paypal':
        return new PayPalGateway();
      default:
        throw new Error(`Gateway de pagamento não suportado: ${gatewayName}`);
    }
  }
}
