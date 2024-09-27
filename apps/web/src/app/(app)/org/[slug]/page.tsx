// import { unstable_noStore as noCache } from 'next/cache'

import { getCurrentOrg } from '@/auth/auth'
import { ActiveCustomersCard } from '@/components/active-customers-card'
import { NewCustomersCard } from '@/components/new-customers-card'
import { RevenueByPeriodCard } from '@/components/revenue-by-period-card'
import RevenueChart from '@/components/revenue-chart'
import { TotalCustomersCard } from '@/components/total-customers-card'

export default async function OrganizationsPage() {
  // noCache()

  const slug = getCurrentOrg()

  return (
    <div className="space-y-4 py-4">
      <main className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4">
            <TotalCustomersCard slug={slug} />
            <NewCustomersCard slug={slug} />
            <ActiveCustomersCard slug={slug} />
            <RevenueByPeriodCard slug={slug} />
          </div>
          <div className="grid grid-cols-9 gap-4">
            <RevenueChart />
          </div>
        </div>
      </main>
    </div>
  )
}
