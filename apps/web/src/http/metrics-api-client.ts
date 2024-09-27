import { api } from './api-client'

interface GetTotalCustomersRequest {
  slug: string | null
}

interface GetTotalCustomersResponse {
  totalCustomers: number
}

export async function getTotalCustomers({ slug }: GetTotalCustomersRequest) {
  const result = await api
    .get(`organizations/${slug}/metrics/total-customers`)
    .json<GetTotalCustomersResponse>()

  return result
}

interface GetNewCustomersRequest {
  slug: string | null
  period?: 'week' | 'month'
}

interface GetNewCustomersResponse {
  period: string
  newCustomers: number
  customerChange: number
}

export async function getNewCustomers({
  slug,
  period = 'month',
}: GetNewCustomersRequest) {
  const result = await api
    .get(`organizations/${slug}/metrics/new-customers`, {
      searchParams: { period },
    })
    .json<GetNewCustomersResponse>()

  return result
}

interface GetActiveCustomersRequest {
  slug: string | null
}

interface GetActiveCustomersResponse {
  activeCustomers: number
  activeChange: number
}

export async function getActiveCustomers({ slug }: GetActiveCustomersRequest) {
  const result = await api
    .get(`organizations/${slug}/metrics/active-customers`)
    .json<GetActiveCustomersResponse>()

  return result
}

interface GetRevenueByPeriodRequest {
  slug: string | null
  period?: 'week' | 'month'
}

interface GetRevenueByPeriodResponse {
  period: string
  totalRevenue: number
  revenueChange: number
}

export async function getRevenueByPeriod({
  slug,
  period = 'month',
}: GetRevenueByPeriodRequest) {
  const result = await api
    .get(`organizations/${slug}/metrics/revenue-by-period`, {
      searchParams: { period },
    })
    .json<GetRevenueByPeriodResponse>()

  return result
}
