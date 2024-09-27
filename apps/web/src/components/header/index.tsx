import { PlusCircle, Slash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import logoIcon from '@/assets/logo-icon.svg'
import { ability, getCurrentOrg, getCurrentPathName } from '@/auth/auth'

import { OrganizationSwitcher } from '../organization-switcher'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { MenuLink } from './menu-link'
import { ProfileButton } from './profile-button'
import { ThemeSwitcher } from './theme-switcher'

export async function Header() {
  const org = getCurrentOrg()
  const path = getCurrentPathName()

  const isHome = path === '/'

  // const permissions = await ability()

  return (
    <div className="border-b">
      <div className="flex min-h-14 items-center justify-between px-8">
        <div className="flex items-center space-x-4">
          <Image className="size-6 dark:invert" src={logoIcon} alt="Logo" />

          {/* {permissions?.can('get', 'Client') && <p>.</p>} */}

          {isHome ? (
            ''
          ) : (
            <>
              <Slash className="size-3 -rotate-[24deg] text-border" />
              <OrganizationSwitcher />

              <Separator orientation="vertical" className="h-6" />

              <nav className="flex items-center space-x-2 lg:space-x-3">
                <MenuLink href={`/org/${org}`}>Dashboard</MenuLink>
                <MenuLink href={`/org/${org}/customers`}>Clientes</MenuLink>
                <MenuLink href={`/org/${org}/products`}>Produtos</MenuLink>
              </nav>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* <Search />

          <Separator orientation="vertical" className="h-6" /> */}
          <Button size="sm" asChild>
            <Link href={`/org/${org}/purchase`}>
              <PlusCircle className="mr-2 size-4" />
              Criar Vendas
            </Link>
          </Button>

          <Separator orientation="vertical" className="h-6" />
          <ThemeSwitcher />
          <Separator orientation="vertical" className="h-6" />
          <ProfileButton />
        </div>
      </div>
    </div>
  )
}
