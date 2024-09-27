import { z } from 'zod'

import { metricSchema } from '../models/metrics'

export const metricSubject = z.tuple([
  z.union([z.literal('get'), z.literal('create'), z.literal('delete')]),
  z.union([z.literal('Metrics'), metricSchema]),
])

export type MetricSubject = z.infer<typeof metricSubject>
