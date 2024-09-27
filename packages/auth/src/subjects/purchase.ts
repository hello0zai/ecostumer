import { z } from 'zod'

import { purchaseSchema } from '../models/purchase'

export const purchaseSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('delete'),
    z.literal('get'),
    z.literal('update'),
    z.literal('create'),
  ]),
  z.union([z.literal('Purchase'), purchaseSchema]),
])

export type PurchaseSubject = z.infer<typeof purchaseSubject>
