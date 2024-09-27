import { SymbolIcon } from '@radix-ui/react-icons'
import { dayjs, setDayjsLocale } from '@saas/dayjs'
import { CopyIcon, Smartphone } from 'lucide-react'
import { Metadata } from 'next'
// import { unstable_noStore as noCache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { CopyButton } from '@/components/copy-button'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getClients } from '@/http/get-clients'

export const metadata: Metadata = {
  title: 'Clientes',
}

setDayjsLocale('pt-br')

const customersPageSearchParams = z.object({
  pageIndex: z.coerce.number().default(0),
  pageSize: z.coerce.number().default(10),
  tagsFilter: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional(),
  titleFilter: z.string().default(''),
})

type CustomersPageSearchParams = z.infer<typeof customersPageSearchParams>

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: CustomersPageSearchParams
}) {
  // noCache()

  const { pageIndex, pageSize, titleFilter } =
    customersPageSearchParams.parse(searchParams)

  // const { videos, pageCount } = await serverClient.getCustomers({
  //   pageIndex,
  //   pageSize,
  //   titleFilter,
  //   tagsFilter,
  // })

  const slug = getCurrentOrg()

  const { clients } = await getClients({
    slug,
    pageIndex,
    pageSize,
    titleFilter,
  })

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead style={{ width: 100 }}>Status</TableHead>
              <TableHead style={{ width: 154 }}>Nascimento</TableHead>
              <TableHead style={{ width: 200 }}>
                <div className="flex items-center gap-2">
                  <Smartphone className="size-4" />
                  Telefone
                </div>
              </TableHead>
              <TableHead style={{ width: 200 }} />
              <TableHead style={{ width: 64 }} />
            </TableRow>
          </TableHeader>

          <TableBody>
            {clients && clients.length > 0 ? (
              clients.map((client) => {
                return (
                  <TableRow
                    key={client.id}
                    className="has-[a:focus-visible]:bg-muted"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/clients/${client.id}`}
                          prefetch={false}
                          className="font-medium text-primary outline-none hover:underline"
                        >
                          {client.name}
                        </Link>

                        <span className="text-xs text-muted-foreground">
                          {client.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <Badge>{client.active ? 'Ativo' : 'Inativo'}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {dayjs(client.birthday).format('DD MMMM YYYY')}
                    </TableCell>
                    <TableCell>
                      {client.phoneNumber ? (
                        <div className="flex items-center gap-2 font-medium">
                          <span className="truncate text-xs text-muted-foreground">
                            {client.phoneNumber}
                          </span>
                          <CopyButton
                            size="xs"
                            variant="outline"
                            textToCopy={client.phoneNumber}
                          >
                            <CopyIcon className="mr-1 h-3 w-3" />
                            Copiar
                          </CopyButton>
                        </div>
                      ) : (
                        <div className="flex items-center font-medium text-muted-foreground/80">
                          <SymbolIcon className="mr-2 h-3 w-3 animate-spin" />
                          <span>Processing</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <time title={client.createdAt.toLocaleString()}>
                          {dayjs(client.createdAt).fromNow()}
                        </time>
                        {client.author?.avatarUrl && (
                          <TooltipProvider>
                            <Tooltip>
                              <div className="flex items-center gap-2">
                                <span>por</span>
                                <TooltipTrigger asChild>
                                  <Image
                                    src={client.author?.avatarUrl}
                                    className="size-5 rounded-full"
                                    width={20}
                                    height={20}
                                    alt=""
                                  />
                                </TooltipTrigger>
                                {client.author?.name && (
                                  <TooltipContent>
                                    {client.author?.name}
                                  </TooltipContent>
                                )}
                              </div>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <CustomerItemActions customerId={client.id} />
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

      <Suspense fallback={null}>
        {/* <CustomersPagination
          pageSize={pageSize}
          pageIndex={pageIndex}
          pageCount={pageCount}
        /> */}
      </Suspense>
    </>
  )
}
