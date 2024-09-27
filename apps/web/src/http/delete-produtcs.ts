import { getCookie } from 'cookies-next'

import { api } from './api-client'

interface DeleteProductsRequest {
  productId: string
}

type DeleteProductsResponse = void

export async function deleteProducts({
  productId,
}: DeleteProductsRequest): Promise<DeleteProductsResponse> {
  const slug = getCookie('org')

  if (!slug) {
    throw new Error('Organização não encontrada no cookie.')
  }
  await api.delete(`organizations/${slug}/products/${productId}`)
}
