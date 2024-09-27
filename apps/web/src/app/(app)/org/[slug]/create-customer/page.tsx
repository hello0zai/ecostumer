import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { CreateCustomerForm } from './create-customer-form'

export default function CreateCustomer() {
  return (
    <main className="mx-auto w-full max-w-[1000px] space-y-4">
      <Card className="self-start">
        <CardHeader>
          <CardTitle>Criar cliente</CardTitle>
          <CardDescription>Preencha os detalhes do cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCustomerForm />
        </CardContent>
      </Card>
    </main>
  )
}
