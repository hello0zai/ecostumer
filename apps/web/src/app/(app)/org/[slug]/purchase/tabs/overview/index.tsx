'use client'

import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { PurchaseForm } from '../../purchase-form'
import { PurchaseSummaryCard } from './summary'

interface Product {
  description: string | null
  name: string
  price: number
  id: string
  status: boolean
}

interface OverviewProps {
  products: Product[]
}

export function Overview({ products }: OverviewProps) {
  const [selectedProductsDetails, setSelectedProductsDetails] = useState<
    Product[]
  >([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [finalPrice, setFinalPrice] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discount, setDiscount] = useState('0')

  useEffect(() => {
    if (selectedProductsDetails.length > 0) {
      const total = selectedProductsDetails.reduce(
        (sum, product) => sum + product.price,
        0,
      )

      const discountValue = parseFloat(discount.replace(',', '.')) || 0
      const discountAmt = total * (discountValue / 100)
      const final = total - discountAmt

      setTotalPrice(total)
      setFinalPrice(final)
      setDiscountAmount(discountAmt)
    } else {
      setTotalPrice(0)
      setFinalPrice(0)
      setDiscountAmount(0)
    }
  }, [selectedProductsDetails, discount])

  return (
    <div className="grid flex-1 grid-cols-[1fr_minmax(320px,480px)] gap-4">
      <Card className="self-start">
        <CardHeader>
          <CardTitle>Criar Venda</CardTitle>
          <CardDescription>Preencha os detalhes da venda</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseForm
            products={products}
            setSelectedProductsDetails={setSelectedProductsDetails}
            discount={discount}
            setDiscount={setDiscount}
          />
        </CardContent>
      </Card>

      <PurchaseSummaryCard
        selectedProductsDetails={selectedProductsDetails}
        totalPrice={totalPrice}
        discount={discount}
        discountAmount={discountAmount}
        finalPrice={finalPrice}
      />
    </div>
  )
}
