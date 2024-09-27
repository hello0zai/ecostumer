import { getCookie } from 'cookies-next'

import { api } from './api-client'

interface CreatePurchaseRequest {
  purchase: {
    service: string
    purchaseAmount: number
    purchaseDate: Date
    description: string | null
    paymentMethod: string
  }
  clientId: string
}

type CreatePurchaseResponse = void

export async function createPurchase({
  purchase,
  clientId,
}: CreatePurchaseRequest): Promise<CreatePurchaseResponse> {
  const slug = getCookie('org')

  if (!slug) {
    throw new Error('Organização não encontrada no cookie.')
  }

  await api.post(`organizations/${slug}/clients/${clientId}/purchases`, {
    json: {
      service: purchase.service,
      purchaseAmount: purchase.purchaseAmount,
      purchaseDate: purchase.purchaseDate,
      description: purchase.description,
      paymentMethod: purchase.paymentMethod,
      clientId,
    },
  })
}
