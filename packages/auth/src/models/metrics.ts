import { z } from 'zod'

export const metricSchema = z.object({
  __typename: z.literal('Metrics').default('Metrics'),
  id: z.string(),
  organizationId: z.string(),
})

export type Metric = z.infer<typeof metricSchema>
