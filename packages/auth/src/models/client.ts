import { z } from 'zod'

export const clientSchema = z.object({
  __typename: z.literal('Client').default('Client'),
  id: z.string(),
  organizationId: z.string(),
})

export type Client = z.infer<typeof clientSchema>
