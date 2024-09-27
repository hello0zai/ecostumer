import Link from 'next/link'

import { getCurrentOrg } from '@/auth/auth'
import { CustomerItemActions } from '@/components/customer-item-actions'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getProducts } from '@/http/get-products'
import { formatCurrency } from '@/utils/format-currency'

export default async function ProductsPage() {
  const slug = getCurrentOrg()
  const { products } = await getProducts({ slug })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead style={{ width: 100 }}>Status</TableHead>
            <TableHead style={{ width: 154 }}>Preço</TableHead>
            <TableHead style={{ width: 220 }} />
          </TableRow>
        </TableHeader>

        <TableBody>
          {products && products.length > 0 ? (
            products.map((product) => {
              return (
                <TableRow
                  key={product.id}
                  className="has-[a:focus-visible]:bg-muted"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`/products/${product.id}`}
                        prefetch={false}
                        className="font-medium text-primary outline-none hover:underline"
                      >
                        {product.name}
                      </Link>

                      <span className="text-xs text-muted-foreground">
                        {product.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <Badge>{product.status ? 'Ativo' : 'Inativo'}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(product.price)}
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <time title={product.createdAt.toLocaleString()}>
                        {dayjs(product.createdAt).fromNow()}
                      </time>
                      {product.author?.avatarUrl && (
                        <TooltipProvider>
                          <Tooltip>
                            <div className="flex items-center gap-2">
                              <span>por</span>
                              <TooltipTrigger asChild>
                                <Image
                                  src={product.author?.avatarUrl}
                                  className="size-5 rounded-full"
                                  width={20}
                                  height={20}
                                  alt=""
                                />
                              </TooltipTrigger>
                              {product.author?.name && (
                                <TooltipContent>
                                  {product.author?.name}
                                </TooltipContent>
                              )}
                            </div>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell> */}
                  <TableCell>
                    <CustomerItemActions customerId={product.id} />
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
