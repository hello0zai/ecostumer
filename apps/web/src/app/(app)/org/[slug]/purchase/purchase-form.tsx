'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

import { PurchaseClientInput } from './purchase-client-input'
import { PurchaseProductInput } from './purchase-product-input '

interface Product {
  id: string
  name: string
  price: number
  description: string | null
  status: boolean
}

interface PurchaseFormProp {
  setSelectedProductsDetails: (products: Product[]) => void
  setDiscount: (value: string) => void
}

export const purchaseSchema = z.object({
  client: z
    .string()
    .min(1, { message: 'Por favor, selecione um cliente.' })
    .nullable()
    .refine((value) => value !== null, {
      message: 'Por favor, selecione um cliente.',
    }),
  products: z.array(
    z
      .string()
      .min(1, { message: 'Por favor, selecione pelo menos um produto.' }),
  ),
  date: z.date({
    required_error: 'Por favor, insira uma data válida.',
  }),
  observations: z.string().nullable(),
  paymentMethod: z
    .string()
    .min(3, { message: 'Por favor, insira uma forma de pagamento válida.' }),
  discount: z
    .string()
    .optional()
    .transform((val) => val || '0')
    .refine(
      (val) => {
        const num = parseFloat(val.replace(',', '.'))
        return !isNaN(num) && num >= 0 && num <= 100
      },
      { message: 'Por favor, insira um desconto válido entre 0 e 100%.' },
    ),
})

export type PurchaseFormSchema = z.infer<typeof purchaseSchema>

export function PurchaseForm({
  setSelectedProductsDetails,
  setDiscount,
}: PurchaseFormProp) {
  const methods = useForm<PurchaseFormSchema>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      client: '',
      products: [],
      date: undefined,
      observations: '',
      paymentMethod: '',
      discount: '',
    },
  })

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = methods

  const watchedProducts = watch('products') // Observar o campo 'products'
  const watchedDiscount = watch('discount')
  const isProductsSelected = watchedProducts && watchedProducts.length > 0

  useEffect(() => {
    setDiscount(watchedDiscount || '0')
  }, [watchedDiscount, setDiscount])

  async function handleSavePurchase({
    client,
    date,
    observations,
    paymentMethod,
    products,
    discount,
  }: PurchaseFormSchema) {
    try {
      // O finalPrice está disponível no componente Overview
      // e pode ser utilizado aqui se necessário

      console.log({
        purchase: {
          description: observations,
          paymentMethod,
          products,
          purchaseDate: date,
          discount,
        },
        clientId: client,
      })
    } catch {
      toast.error('Uh oh! Algo deu errado.', {
        description: `Ocorreu um erro ao tentar salvar a compra.`,
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSavePurchase)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="client">Cliente</Label>
            <PurchaseClientInput />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="products">Produtos</Label>
            <PurchaseProductInput
              onSelectProducts={setSelectedProductsDetails}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="date">Data</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={ptBR}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.date.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="discount">Desconto (%)</Label>
            <Input
              id="discount"
              {...register('discount')}
              placeholder="Digite o desconto em %"
              disabled={!isProductsSelected} // Desabilitar se nenhum produto estiver selecionado
            />
            {errors.discount && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.discount.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Input
              id="paymentMethod"
              {...register('paymentMethod')}
              placeholder="Ex.: Cartão de Crédito, Pix"
            />
            {errors.paymentMethod && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-3">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              {...register('observations')}
              placeholder="Anotações adicionais"
            />
            {errors.observations && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.observations.message}
              </p>
            )}
          </div>
        </div>

        <SubmitButton className="w-full" isSubmitting={isSubmitting}>
          Salvar
        </SubmitButton>
      </form>
    </FormProvider>
  )
}
