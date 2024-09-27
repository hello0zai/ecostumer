import { getCurrentOrg } from '@/auth/auth'

import { api } from './api-client'

interface CreateCustomerRequest {
  client: {
    name: string
    email: string | null
    phoneNumber: string
    birthday: string | null
    street: string | null
    complement: string | null
    city: string | null
    state: string | null
  }
}

type CreateCustomerResponse = void

export async function createCustomer({
  client,
}: CreateCustomerRequest): Promise<CreateCustomerResponse> {
  const slug = getCurrentOrg()

  if (!slug) {
    throw new Error('Organização não encontrada no cookie.')
  }

  await api.post(`organizations/${slug}/clients`, {
    json: {
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
      birthday: client.birthday,
      street: client.street,
      complement: client.complement,
      city: client.city,
      state: client.state,
    },
  })
}
