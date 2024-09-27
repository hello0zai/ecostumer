import { useController, useFormContext } from 'react-hook-form'

import { ClientAutocomplete } from '@/components/client-input'

import type { PurchaseFormSchema } from './purchase-form'

export function PurchaseClientInput({ ...props }) {
  const { control } = useFormContext<PurchaseFormSchema>()

  const {
    field,
    fieldState: { error },
  } = useController({
    name: 'client',
    control,
    defaultValue: '',
  })

  const { value, onChange } = field

  return (
    <ClientAutocomplete
      {...props}
      value={value}
      onValueChange={onChange}
      error={error?.message}
    />
  )
}
