'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { Icons } from '@/components/ui/icons'
import { NavBar } from '@/components/layout/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Icons.spinner className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        isLoggedIn={!!user}
        onSignOut={signOut}
      />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  )
} 