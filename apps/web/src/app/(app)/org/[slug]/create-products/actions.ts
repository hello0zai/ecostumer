'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, { message: 'Por favor, forneça um nome válido.' }),
  description: z
    .string()
    .min(1, { message: 'Por favor, forneça uma descrição válida.' }),
  price: z.coerce
    .number()
    .positive({ message: 'O preço deve ser um valor positivo.' }),
})

export async function createProductAction(data: FormData) {
  const result = productSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const objData = result.data

  try {
    console.log(objData)
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
    message: 'Successfully saved the product.',
    errors: null,
  }
}
