import { getCookie } from 'cookies-next'

import { api } from './api-client'

interface DeleteCustomerRequest {
  clientId: string
}

type DeleteCustomerResponse = void

export async function deleteCustomer({
  clientId,
}: DeleteCustomerRequest): Promise<DeleteCustomerResponse> {
  const slug = getCookie('org')

  if (!slug) {
    throw new Error('Organização não encontrada no cookie.')
  }
  await api.delete(`organizations/${slug}/clients/${clientId}`)
}
