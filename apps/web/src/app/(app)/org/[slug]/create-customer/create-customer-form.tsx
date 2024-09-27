'use client'

import StatusAlert from '@/components/alert-status'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { createCustomerAction } from './actions'

export function CreateCustomerForm() {
  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(createCustomerAction)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StatusAlert
        success={success}
        message={message}
        successTitle="Cliente salvo!"
        failTitle="Falha ao criar cliente!"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" />
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        {/* E-mail */}
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        {/* Telefone */}
        {/* TODO: mask phone input */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Telefone</Label>
          <Input id="phoneNumber" name="phoneNumber" />
          {errors?.phoneNumber && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.phoneNumber[0]}
            </p>
          )}
        </div>

        {/* Data de Nascimento */}
        <div className="space-y-2">
          <Label htmlFor="birthday">Data de nascimento</Label>
          <Input id="birthday" name="birthday" />
          {errors?.birthday && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.birthday[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Endereço */}
        <div className="space-y-2">
          <Label htmlFor="street">Endereço</Label>
          <Input id="street" name="street" />
          {errors?.street && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.street[0]}
            </p>
          )}
        </div>

        {/* Complemento */}
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" name="complement" />
          {errors?.complement && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.complement[0]}
            </p>
          )}
        </div>

        {/* Cidade */}
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" name="city" />
          {errors?.city && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.city[0]}
            </p>
          )}
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" name="state" />
          {errors?.state && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.state[0]}
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
