import { AlertTriangle, CheckCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface StatusAlertProps {
  success: boolean | null
  message: string | null
  successTitle?: string
  failTitle?: string
}

export default function StatusAlert({
  success,
  message,
  successTitle = 'Success',
  failTitle = 'Error',
}: StatusAlertProps) {
  if (success === null || !message) {
    return null
  }

  return (
    <Alert variant={success ? 'success' : 'destructive'}>
      {success ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <AlertTitle>{success ? successTitle : failTitle}</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
      </AlertDescription>
    </Alert>
  )
}
