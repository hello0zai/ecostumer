'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { createPurchase } from '@/http/create-purchase'

const purchaseSchema = z.object({
  service: z
    .string()
    .min(4, { message: 'Please, include at least 4 characters.' }),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: 'Please, enter a valid date.',
  }),
  observations: z.string().nullable(),
  paymentMethod: z
    .string()
    .min(3, { message: 'Please, enter a valid payment method.' }),
  value: z.number().positive({ message: 'The value must be positive.' }),
})

export async function createPurchaseAction(data: FormData) {
  console.log(Object.fromEntries(data))
  const result = purchaseSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  // const { service, date, observations, paymentMethod, value } = result.data

  try {
    await createPurchase({ purchase, clientId })
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
    message: 'Purchase saved successfully.',
    errors: null,
  }
}
