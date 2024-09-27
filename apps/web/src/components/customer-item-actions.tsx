'use client'

import { Pencil2Icon } from '@radix-ui/react-icons'
import { Loader2, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { deleteCustomer } from '@/http/delete-customer'

interface CustomerItemActionsProps {
  customerId: string
}

export function CustomerItemActions({ customerId }: CustomerItemActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const isDeletingCustomer = false

  // const { mutate: handleDeleteCustomer, isLoading: isDeletingCustomer } =
  //   useMutation(async () => await deleteCustomer({ clientId: customerId }), {
  //     onSuccess: () => {
  //       setIsDeleteDialogOpen(false)
  //       toast.success('Customer deleted successfully.')
  //       // Invalida queries relacionadas a clientes para refetch
  //       queryClient.invalidateQueries(['customers'])
  //     },
  //     onError: () => {
  //       toast.error('Uh oh! Something went wrong.', {
  //         description:
  //           'An error occurred while trying to delete the customer. If the error persists, please contact an administrator.',
  //       })
  //     },
  //   })

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            className="data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-3" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link href={`/customers/${customerId}`} prefetch={false}>
              <Pencil2Icon className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-500 data-[highlighted]:text-red-500 dark:text-red-400 dark:data-[highlighted]:text-red-400"
              disabled={isDeletingCustomer}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Deletar
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Esta ação não pode ser desfeita e o cliente será permanentemente
              excluído do servidor.
            </p>
            <p>
              Isso irá
              <span className="font-semibold text-accent-foreground">
                permanentemente
              </span>
              :
            </p>
            <ol className="list-disc space-y-2 pl-4">
              <li>Excluir os arquivos MP4, MP3 e legendas do armazenamento;</li>
              <li>Excluir o cliente no provedor externo;</li>
              <li>Excluir os clientes em qualquer integração externa;</li>
            </ol>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            disabled={isDeletingCustomer}
            variant="destructive"
            className="w-20"
            onClick={() => handleDeleteCustomer()}
          >
            {isDeletingCustomer ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Deletar'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
