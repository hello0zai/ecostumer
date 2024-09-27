'use client'

import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/utils/format-currency'

interface PurchaseSummaryProps {
  selectedProductsDetails: { id: string; name: string; price: number }[]
  totalPrice: number
  discount: string
  discountAmount: number
  finalPrice: number
}

export function PurchaseSummary({
  selectedProductsDetails,
  totalPrice,
  discount,
  discountAmount,
  finalPrice,
}: PurchaseSummaryProps) {
  return (
    <div className="space-y-1 sm:col-span-3">
      <Label>Resumo da Compra</Label>
      <div className="rounded bg-gray-100 p-4">
        {selectedProductsDetails.length > 0 ? (
          <>
            <ul>
              {selectedProductsDetails.map((product) => (
                <li key={product.id}>
                  {product.name} - {formatCurrency(product.price)}
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <p>Valor Total: {formatCurrency(totalPrice)}</p>
              <p>
                Desconto ({discount || '0'}%): -{formatCurrency(discountAmount)}
              </p>
              <p className="font-bold">
                Valor Final: {formatCurrency(finalPrice)}
              </p>
            </div>
          </>
        ) : (
          <p>Nenhum produto selecionado.</p>
        )}
      </div>
    </div>
  )
}
