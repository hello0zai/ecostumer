'use client'

import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import useDebounceValue from '@/hooks/useDebounceValue'
import { getClients } from '@/http/get-clients'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from './ui/command'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

interface Client {
  id: string
  name: string
  avatarUrl?: string
}

interface ClientAutocompleteProps {
  value: string | null
  onValueChange: (clientId: string | null) => void
  error?: string
}

export function ClientAutocomplete({
  value,
  onValueChange,
  error,
}: ClientAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounceValue(search, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const slug = getCookie('org') ?? ''

  const fetchClients = async (searchTerm: string) => {
    const { clients } = await getClients({ slug })

    const filteredClients = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Se um cliente estiver selecionado, garanta que ele esteja nos resultados
    if (value) {
      const selectedClient = clients.find((client) => client.id === value)
      if (selectedClient && !filteredClients.includes(selectedClient)) {
        filteredClients.push(selectedClient)
      }
    }

    return filteredClients
  }

  const {
    data: clients = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['clients', debouncedSearch],
    queryFn: () => fetchClients(debouncedSearch),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: debouncedSearch.length > 0 && !value, // Desabilita quando um cliente está selecionado
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Sincroniza o valor do campo com o estado de pesquisa
  useEffect(() => {
    if (value && clients.length > 0) {
      const selectedClient = clients.find(
        (client: Client) => client.id === value,
      )
      if (selectedClient && selectedClient.name !== search) {
        setSearch(selectedClient.name)
      }
    }
  }, [value, clients, search])

  function handleSelect(client: Client) {
    console.log('Cliente selecionado:', client)
    setSearch(client.name)
    onValueChange(client.id)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <Input
        ref={inputRef}
        placeholder="Digite o nome do cliente..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setOpen(true)
          if (value) {
            onValueChange(null)
          }
        }}
        onFocus={() => {
          if (search.length > 0) {
            setOpen(true)
          }
        }}
        className="w-full"
      />
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <Command>
            {isFetching && (
              <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando...</span>
              </div>
            )}
            <CommandList>
              {!isLoading && clients.length > 0 ? (
                <ScrollArea className="max-h-60">
                  <CommandGroup className="p-1.5">
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        onSelect={() => handleSelect(client)}
                      >
                        <Avatar className="mr-2 h-6 w-6">
                          {client.author?.avatarUrl ? (
                            <AvatarImage src={client.author.avatarUrl} />
                          ) : (
                            <AvatarFallback>
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {client.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              ) : (
                !isFetching && (
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                )
              )}
            </CommandList>
          </Command>
        </div>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
