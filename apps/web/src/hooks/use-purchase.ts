import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
}

export function usePurchase() {
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

  return {
    selectedProductsDetails,
    setSelectedProductsDetails,
    totalPrice,
    finalPrice,
    discountAmount,
    discount,
    setDiscount,
  }
}
