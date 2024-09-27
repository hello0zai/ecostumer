import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'

import { getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'

import { ProductsFilters } from './products-filters'

export default async function Layout({ children }: { children: ReactNode }) {
  const slug = getCurrentOrg()
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Suspense fallback={null}>
            <ProductsFilters />
          </Suspense>
          <Button size="sm" asChild>
            <Link href={`/org/${slug}/create-products`}>
              <PlusCircle className="mr-2 size-4" />
              Cadastrar Produtos
            </Link>
          </Button>
        </div>

        {children}
      </div>
    </>
  )
}
