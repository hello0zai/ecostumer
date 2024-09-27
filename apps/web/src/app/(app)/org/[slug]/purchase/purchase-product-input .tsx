import { useController, useFormContext } from 'react-hook-form'

import { type Product, ProductInput } from '@/components/product-input'

import type { PurchaseFormSchema } from './purchase-form'

interface PurchaseProductInputProps {
  // products: Product[]
  onSelectProducts?: (selectedProducts: Product[]) => void
}

export function PurchaseProductInput({
  // products,
  onSelectProducts,
  ...props
}: PurchaseProductInputProps) {
  const { control } = useFormContext<PurchaseFormSchema>()

  const {
    field,
    fieldState: { error },
  } = useController({
    name: 'products',
    control,
    defaultValue: [],
  })

  const { value, onChange } = field

  return (
    <ProductInput
      {...props}
      value={value}
      onValueChange={onChange}
      onSelectProducts={onSelectProducts}
      error={error?.message}
    />
  )
}
