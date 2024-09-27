import { api } from './api-client'

interface GetPurchasesRequest {
  slug: string | null
  page?: number
  pageSize?: number
}

export interface GetPurchasesResponse {
  purchases: {
    id: string
    paymentMethod: string
    purchaseAmount: number
    purchaseDate: string
    description: string | null
    clientName: string
    products: {
      id: string
      name: string
      price: number
      quantity: number
    }[]
  }[]
  totalPages: number
  currentPage: number
}

export async function getPurchases({
  slug,
  page = 1,
  pageSize = 10,
}: GetPurchasesRequest) {
  if (!slug) throw new Error('Organization slug is required')

  const result = await api
    .get(`organizations/${slug}/purchases`, {
      searchParams: {
        page,
        pageSize,
      },
    })
    .json<GetPurchasesResponse>()

  console.log(result)

  return result
}
