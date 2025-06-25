'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { AuthForm } from '@/components/auth/auth-form'
import Image from 'next/image'
import { Icons } from '@/components/ui/icons'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Icons.spinner className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 flex items-center justify-center">
            <Image
              src="/next.svg"
              alt="Haikoo Logo"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-900">
            Welcome to Haikoo
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl">
            Transform your pet photos into beautiful AI-generated portraits
          </p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <AuthForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">Upload your pet's photo and get an AI-generated portrait in minutes</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Beautiful Results</h3>
            <p className="text-gray-600">Get stunning, unique portraits that capture your pet's personality</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Multiple Styles</h3>
            <p className="text-gray-600">Choose from various artistic styles to create the perfect portrait</p>
          </div>
        </div>
      </div>
    </main>
  )
}
