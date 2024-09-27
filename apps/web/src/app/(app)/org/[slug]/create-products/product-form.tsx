'use client'

import { useState } from 'react'

import StatusAlert from '@/components/alert-status'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/use-form-state'

import { createProductAction } from './actions'

interface CurrencySymbols {
  [key: string]: string
}

export function CreateProductForm() {
  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(createProductAction)

  const [currency] = useState('BRL')

  const currencySymbols: CurrencySymbols = {
    BRL: 'R$',
    USD: '$',
    PYG: '₲',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StatusAlert
        message={message}
        success={success}
        failTitle="Falha ao Salvar produto!"
        successTitle="Salvo!"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input id="name" name="name" />
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preço</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {currencySymbols[currency]}
            </span>
            <Input id="price" name="price" className="pl-10" />
          </div>
          {errors?.price && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.price[0]}
            </p>
          )}
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="currency">Moeda</Label>
          <Select onValueChange={setCurrency} defaultValue={currency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a moeda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">Real (BRL)</SelectItem>
              <SelectItem value="USD">Dólar (USD)</SelectItem>
              <SelectItem value="PYG">Guarani (PYG)</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" name="description" />
          {errors?.description && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.description[0]}
            </p>
          )}
        </div>
      </div>

      <SubmitButton isSubmitting={isPending} isSubmitSuccessful={success}>
        Salvar
      </SubmitButton>
    </form>
  )
}
