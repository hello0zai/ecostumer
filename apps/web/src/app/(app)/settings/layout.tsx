import { Building, Code2, SquareDashedBottomCode, User2 } from 'lucide-react'
import { ReactNode } from 'react'

import { AsideLink } from './aside-link'

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="grid grid-cols-5 gap-12 p-8">
        <aside className="-mx-4 space-y-4">
          <h2 className="mx-4 text-2xl font-bold tracking-tight">Settings</h2>

          <nav className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xxs mb-2 px-4 font-semibold uppercase text-muted-foreground">
                General
              </span>
              <AsideLink href="/settings/profile">
                <User2 className="mr-2 size-4" />
                Profile
              </AsideLink>
              <AsideLink href="/settings/organization">
                <Building className="mr-2 size-4" />
                Organization
              </AsideLink>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xxs mb-2 px-4 font-semibold uppercase text-muted-foreground">
                Developers
              </span>
              <AsideLink href="/settings/developers">
                <Code2 className="mr-2 size-4" />
                API & Webhooks
              </AsideLink>
              <AsideLink href="/settings/developers/logs">
                <SquareDashedBottomCode className="mr-2 size-4" />
                Webhook Logs
              </AsideLink>
            </div>
          </nav>
        </aside>

        <div className="col-span-4">{children}</div>
      </div>
    </>
  )
}
