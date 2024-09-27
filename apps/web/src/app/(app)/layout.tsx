import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import { Header } from '@/components/header'

export default function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
          {children}
          {sheet}
        </div>
      </div>
    </>
  )
}
