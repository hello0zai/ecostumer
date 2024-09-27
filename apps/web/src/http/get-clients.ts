import { api } from './api-client'

interface GetClientsRequest {
  slug: string | null
}

interface Author {
  id: string
  name: string | null
  email: string | null
  avatarUrl: string | null
}

interface GetClientsResponse {
  clients: {
    id: string
    name: string
    email: string | null
    active: boolean
    phoneNumber: string
    birthday: Date | null
    street: string | null
    complement: string | null
    city: string | null
    state: string | null
    author: Author | null
    createdAt: string
  }[]
}

export async function getClients({ slug }: GetClientsRequest) {
  const result = await api
    .get(`organizations/${slug}/clients`)
    .json<GetClientsResponse>()

  return result
}
