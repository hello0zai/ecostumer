'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/utils/format-currency'

interface PurchaseSummaryProps {
  selectedProductsDetails: { id: string; name: string; price: number }[]
  totalPrice: number
  discount: string
  discountAmount: number
  finalPrice: number
}

export function PurchaseSummaryCard({
  selectedProductsDetails,
  totalPrice,
  discount,
  discountAmount,
  finalPrice,
}: PurchaseSummaryProps) {
  return (
    <Card className="h-full self-start">
      <CardHeader>
        <CardTitle>Resumo da Compra</CardTitle>
        <CardDescription>Detalhes da venda</CardDescription>
      </CardHeader>
      <CardContent className="p-4 leading-relaxed">
        <div className="space-y-1 sm:col-span-3">
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
                  Desconto ({discount || '0'}%): -
                  {formatCurrency(discountAmount)}
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
      </CardContent>
    </Card>
  )
}
