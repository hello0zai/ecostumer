import { z } from 'zod'

export const purchaseSchema = z.object({
  __typename: z.literal('Purchase').default('Purchase'),
  id: z.string(),
  organizationId: z.string(),
})

export type Purchase = z.infer<typeof purchaseSchema>
