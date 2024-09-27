// import { unstable_noStore as noCache } from 'next/cache'
import { redirect } from 'next/navigation'

import { getCurrentOrg } from '@/auth/auth'
import { OrganizationSwitcher } from '@/components/organization-switcher'
export default async function Home() {
  // noCache()

  const org = getCurrentOrg()

  return (
    <div className="space-y-4 py-4">
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        {org ? (
          redirect(`/org/${org}`)
        ) : (
          <>
            <h2>Por Favor Selecione uma Organização</h2>
            <OrganizationSwitcher />
          </>
        )}
      </main>
    </div>
  )
}
