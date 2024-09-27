import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Loader2 } from 'lucide-react'
import type React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'

interface SubmitButtonProps extends ButtonProps {
  children: React.ReactNode
  isSubmitting: boolean
  isSubmitSuccessful?: boolean
  successMessage?: string
}

export function SubmitButton({
  isSubmitting,
  isSubmitSuccessful,
  children,
  successMessage = 'Salvo!',
  ...props
}: SubmitButtonProps) {
  return (
    <div className="flex items-center gap-4">
      <Button className="w-24" {...props} type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </Button>
      {isSubmitSuccessful && (
        <div className="flex items-center gap-2 text-sm text-emerald-500 dark:text-emerald-400">
          <CheckCircledIcon className="h-3 w-3" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  )
}
