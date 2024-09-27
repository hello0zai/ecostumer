import { api } from './api-client'

interface GetProductsRequest {
  slug: string | null
  searchTerm?: string
  pageSize?: number
  pageIndex?: number
}

export interface GetProductsResponse {
  products: {
    description: string | null
    name: string
    price: number
    id: string
    status: boolean
  }[]
}

export async function getProducts({ slug }: GetProductsRequest) {
  const result = await api
    .get(`organizations/${slug}/products`)
    .json<GetProductsResponse>()

  return result
}
