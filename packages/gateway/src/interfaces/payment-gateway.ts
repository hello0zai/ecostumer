export interface PaymentGateway {
  initializePayment(data: InitializePaymentData): Promise<InitializePaymentResult>;
  verifyPayment(data: VerifyPaymentData): Promise<VerifyPaymentResult>;
}

export interface InitializePaymentData {
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  returnUrl: string;
  cancelUrl: string;
}

export interface InitializePaymentResult {
  paymentUrl: string;
  paymentId: string;
}

export interface VerifyPaymentData {
  paymentId: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  paymentId: string;
}
