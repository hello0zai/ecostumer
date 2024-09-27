'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { createCustomer } from '@/http/create-customer'

const createCustomerFormSchema = z.object({
  name: z.string().min(1, { message: 'Por favor, forneça um nome válido.' }),
  email: z.string().email({ message: 'Por favor, forneça um e-mail válido.' }),
  street: z
    .string()
    .min(1, { message: 'Por favor, forneça um endereço válido.' }),
  complement: z.string().nullable(), // Ajustado para permitir null
  city: z.string().min(1, { message: 'Por favor, forneça uma cidade válida.' }),
  state: z.string().min(1, { message: 'Por favor, forneça um estado válido.' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Por favor, forneça um número de telefone válido.' }),
  birthday: z.string().nullable(),
})

export async function createCustomerAction(data: FormData) {
  const result = createCustomerFormSchema.safeParse(Object.fromEntries(data))
  console.log(Object.fromEntries(data))
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const {
    birthday,
    city,
    complement,
    email,
    name,
    phoneNumber,
    state,
    street,
  } = result.data

  try {
    await createCustomer({
      client: {
        birthday: birthday ? new Date(birthday).toISOString() : null,
        city,
        complement,
        email,
        name,
        phoneNumber,
        state,
        street,
      },
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the customer.',
    errors: null,
  }
}
