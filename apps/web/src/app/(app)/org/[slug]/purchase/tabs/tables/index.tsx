'use client'

import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { EyeIcon, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPurchases, GetPurchasesResponse } from '@/http/get-purchases'
import { formatCurrency } from '@/utils/format-currency'

import { TablesPagination } from './tables-pagination'

export interface PurchasesProps {
  videoId: string
}

interface Purchase {
  id: string
  clientName: string
  purchaseAmount: number
  paymentMethod: string
  purchaseDate: string
  description: string
  products: string[]
}

export function Purchases() {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null,
  )

  const slug = getCookie('org') as string | null
  const searchParams = useSearchParams()

  const pageIndex = parseInt(searchParams.get('pageIndex') || '0', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '5', 10)

  const {
    data: purchasesResponse,
    isLoading,
    // isFetching,
  } = useQuery<GetPurchasesResponse>({
    queryKey: ['purchases', slug, pageIndex, pageSize],
    queryFn: async () =>
      await getPurchases({ slug, page: pageIndex + 1, pageSize }),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })

  const purchases: Purchase[] = Array.isArray(purchasesResponse?.purchases)
    ? purchasesResponse.purchases
    : []

  console.log(purchasesResponse)

  console.log(purchases)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Compras</CardTitle>
          <CardDescription>
            Lista de todas as compras realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Cliente</TableHead>
                <TableHead>Valor da Compra</TableHead>
                <TableHead>Método de Pagamento</TableHead>
                <TableHead>Data da Compra</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.clientName}</TableCell>
                    <TableCell>
                      {formatCurrency(purchase.purchaseAmount)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {purchase.paymentMethod}
                    </TableCell>
                    <TableCell>
                      {new Date(purchase.purchaseDate).toLocaleDateString(
                        'pt-BR',
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPurchase(purchase)}
                          >
                            <EyeIcon className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Detalhes da Compra</DialogTitle>
                          </DialogHeader>
                          {selectedPurchase && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Nome
                                </Label>
                                <div id="name" className="col-span-3">
                                  {selectedPurchase.clientName}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                  Valor
                                </Label>
                                <div id="amount" className="col-span-3">
                                  {formatCurrency(
                                    selectedPurchase.purchaseAmount,
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="method" className="text-right">
                                  Método
                                </Label>
                                <div
                                  id="method"
                                  className="col-span-3 capitalize"
                                >
                                  {selectedPurchase.paymentMethod}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">
                                  Data
                                </Label>
                                <div id="date" className="col-span-3">
                                  {new Date(
                                    selectedPurchase.purchaseDate,
                                  ).toLocaleString('pt-BR')}
                                </div>
                              </div>
                              <Separator />
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="description"
                                  className="text-right"
                                >
                                  Descrição
                                </Label>
                                <div id="description" className="col-span-3">
                                  {selectedPurchase.description}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="products"
                                  className="text-right"
                                >
                                  Produtos
                                </Label>
                                <div id="products" className="col-span-3">
                                  {selectedPurchase.products.join(', ') ||
                                    'Nenhum produto listado'}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhuma compra encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter>
          <Suspense>
            <TablesPagination
              pageCount={purchasesResponse?.totalPages || 1}
              pageIndex={pageIndex}
              pageSize={pageSize}
              slug={slug}
            />
          </Suspense>
        </CardFooter>
      </Card>
    </>
  )
}
