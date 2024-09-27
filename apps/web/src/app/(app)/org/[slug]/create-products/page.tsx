import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { CreateProductForm } from './product-form'

export default function CreateProduct() {
  return (
    <main className="mx-auto w-full max-w-[1000px] space-y-4">
      <Card className="self-start">
        <CardHeader>
          <CardTitle>Criar produto</CardTitle>
          <CardDescription>Preencha os detalhes do produto</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm />
        </CardContent>
      </Card>
    </main>
  )
}
