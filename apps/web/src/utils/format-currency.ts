export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function parseCurrencyToNumber(value: string): number {
  const numericValue = value.replace(/\D/g, '')
  const numberValue = parseInt(numericValue, 10)
  if (isNaN(numberValue)) {
    return 0
  }
  return numberValue / 100
}
