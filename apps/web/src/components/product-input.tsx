'use client'

import { CheckIcon, PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { Loader2, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import useDebounceValue from '@/hooks/useDebounceValue'
import { getProducts } from '@/http/get-products'

import { CreateNewTagDialog } from './create-new-product-dialog'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Dialog } from './ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

export interface Product {
  id: string
  name: string
  price: number
  description: string | null
  status: boolean
}

export interface ProductInputProps {
  value: string[]
  onValueChange: (products: string[]) => void
  onSelectProducts?: (selectedProducts: Product[]) => void // Nova propriedade
  error?: string
  previewProductsAmount?: number
  allowProductCreation?: boolean
  onApplyToAll?: () => void
}

export function ProductInput({
  value,
  onValueChange,
  onSelectProducts,
  error,
  previewProductsAmount = 5,
  allowProductCreation = true,
  onApplyToAll,
}: ProductInputProps) {
  const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const slug = getCookie('org') ?? ''

  // Usar debounce para evitar chamadas excessivas à API
  const searchTerm = useDebounceValue(search, 300)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: async () => await getProducts({ slug }),
    enabled: true,
  })

  const [selectedProductsDetails, setSelectedProductsDetails] = useState<
    Product[]
  >([])

  function handleAddProduct(product: Product) {
    onValueChange([...value, product.id])
    const updatedProducts = [...selectedProductsDetails, product]
    setSelectedProductsDetails(updatedProducts)
    if (onSelectProducts) {
      onSelectProducts(updatedProducts)
    }
  }

  function handleRemoveProduct(product: Product) {
    onValueChange(value.filter((id) => id !== product.id))
    const updatedProducts = selectedProductsDetails.filter(
      (p) => p.id !== product.id,
    )
    setSelectedProductsDetails(updatedProducts)
    if (onSelectProducts) {
      onSelectProducts(updatedProducts)
    }
  }

  return (
    <Dialog
      open={createProductDialogOpen}
      onOpenChange={setCreateProductDialogOpen}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            data-error={!!error}
            variant="outline"
            size="sm"
            className="flex h-8 items-center border-dashed px-2 data-[error=true]:border-red-400 data-[error=true]:bg-red-50"
          >
            <ShoppingCart className="mr-2 h-3 w-3" />
            <span className="text-xs">Produtos</span>

            {!!error && (
              <span className="ml-2 text-xs font-normal">{error}</span>
            )}

            {value.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="flex gap-1">
                  {value.length > previewProductsAmount ? (
                    <Badge
                      variant="secondary"
                      className="pointer-events-none text-nowrap rounded-sm px-1 font-normal"
                    >
                      {value.length} selecionados
                    </Badge>
                  ) : (
                    selectedProductsDetails.map((product) => (
                      <Badge
                        variant="secondary"
                        key={product.id}
                        className="pointer-events-none rounded-sm px-1 font-normal"
                      >
                        {product.name}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Produtos"
              onValueChange={setSearch}
              value={search}
            />

            <CommandList>
              <ScrollArea className="h-[240px] w-full">
                <CommandGroup>
                  {allowProductCreation && (
                    <CommandItem
                      onSelect={() => {
                        setCreateProductDialogOpen(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Criar novo produto
                    </CommandItem>
                  )}

                  {isLoading || isFetching ? (
                    <div className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm p-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Carregando produtos...</span>
                    </div>
                  ) : data?.products && data.products.length === 0 ? (
                    <div className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm p-2 text-sm text-muted-foreground">
                      Nenhum produto encontrado.
                    </div>
                  ) : (
                    data?.products &&
                    data.products.map((option) => {
                      const isSelected = value.includes(option.id)

                      const product: Product = {
                        id: option.id,
                        name: option.name,
                        price: option.price, // Certifique-se de que o preço está disponível
                      }

                      return (
                        <CommandItem
                          key={option.id}
                          value={option.id}
                          onSelect={() => {
                            if (isSelected) {
                              handleRemoveProduct(product)
                            } else {
                              handleAddProduct(product)
                            }
                          }}
                        >
                          <div
                            className={twMerge(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50 [&_svg]:invisible',
                            )}
                          >
                            <CheckIcon className={twMerge('h-4 w-4')} />
                          </div>
                          <span>{option.name}</span>
                        </CommandItem>
                      )
                    })
                  )}
                </CommandGroup>
              </ScrollArea>
            </CommandList>

            {onApplyToAll && (
              <div className="border-t">
                <CommandItem
                  disabled={value.length === 0}
                  onSelect={onApplyToAll}
                  className="m-1 justify-center text-center text-sm font-normal"
                >
                  Aplicar a todos
                </CommandItem>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {allowProductCreation && (
        <CreateNewTagDialog
          onRequestClose={() => {
            setCreateProductDialogOpen(false)
          }}
        />
      )}
    </Dialog>
  )
}
