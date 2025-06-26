'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { GenerationsGallery } from './_components/generations-gallery'
import { InspoGallery } from './_components/inspo-gallery'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

type Generation = {
  id: number
  output_image_url: string | null
}

type InspoImage = {
  id: number
  image_url: string
}

export default function DashboardHubPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [inspoImages, setInspoImages] = useState<InspoImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return

      setLoading(true)

      const [generationsResult, inspoResult] = await Promise.all([
        supabase
          .from('generations')
          .select('id, output_image_url')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('inspo_images')
          .select('id, image_url')
          .order('created_at', { ascending: false })
          .limit(6),
      ])

      if (generationsResult.data) {
        setGenerations(generationsResult.data)
      }

      if (inspoResult.data) {
        setInspoImages(inspoResult.data)
      }

      setLoading(false)
    }

    fetchDashboardData()
  }, [user, supabase])

  return (
    <div className="container py-8">
      {loading ? (
        <div className="flex justify-center p-12">
          <Icons.spinner className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          {/* Your Library Section */}
          <section id="library">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Your Library
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  All your AI-generated masterpieces in one place.
                </p>
              </div>
              <Link href="/dashboard/generate">
                <Button>
                  <Icons.add className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </Link>
            </div>
            {generations.length > 0 ? (
              <GenerationsGallery generations={generations} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/40 p-12 text-center">
                <h3 className="text-xl font-semibold">No creations yet!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Click "Create New" to generate your first pet portrait.
                </p>
              </div>
            )}
          </section>

          {/* Inspiration Gallery Section */}
          <section id="inspiration">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Inspiration Gallery
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                See what's possible and get ideas for your next creation.
              </p>
            </div>
            {inspoImages.length > 0 ? (
              <InspoGallery images={inspoImages} />
            ) : (
              <p className="text-center text-muted-foreground">
                The inspiration gallery is currently empty.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
