import { getCookie } from 'cookies-next'

import { api } from './api-client'

interface CreateProductsRequest {
  product: {
    description: string | null
    name: string
    price: number
  }
}

type CreateProductsResponse = void

export async function createProducts({
  product,
}: CreateProductsRequest): Promise<CreateProductsResponse> {
  const slug = getCookie('org')

  if (!slug) {
    throw new Error('Organização não encontrada no cookie.')
  }

  const { name, description, price } = product

  await api.post(`organizations/${slug}/products`, {
    json: {
      description,
      name,
      price,
    },
  })
}
