'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'

interface ImageSelectionStepProps {
  onImageSelected: (file: File | null, imageUrl: string | null) => void;
  onNext: () => void;
}

export function ImageSelectionStep({ onImageSelected, onNext }: ImageSelectionStepProps) {
  const { user } = useAuth()
  const supabase = createClient()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedPreviousImage, setSelectedPreviousImage] = useState<string | null>(null)
  const [previousImages, setPreviousImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPreviousImages() {
      if (!user) return
      setLoading(true)
      const { data } = await supabase
        .from('generations')
        .select('input_image_url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        const uniqueImages = [...new Set(data.map((g) => g.input_image_url).filter(Boolean) as string[])]
        setPreviousImages(uniqueImages)
      }
      setLoading(false)
    }
    fetchPreviousImages()
  }, [user, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    setSelectedPreviousImage(null)
    onImageSelected(file, null)
  }

  const handlePreviousImageSelect = (imageUrl: string) => {
    setSelectedPreviousImage(imageUrl)
    setImageFile(null)
    onImageSelected(null, imageUrl)
  }

  const canProceed = imageFile !== null || selectedPreviousImage !== null

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Step 1: Choose Your Image</h2>
        <p className="text-muted-foreground">Upload a new photo or select one you've used before.</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="image" className="text-lg font-medium">Upload a new photo</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imageFile && (
          <div className="mt-4 text-sm text-muted-foreground">
            Selected: {imageFile.name}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center"><Icons.spinner className="h-6 w-6 animate-spin" /></div>
      ) : previousImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Or select a previous image</h3>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {previousImages.map((img) => (
              <div
                key={img}
                className={cn(
                  'relative cursor-pointer rounded-lg border-2 border-transparent transition-all hover:border-primary',
                  selectedPreviousImage === img && 'border-primary'
                )}
                onClick={() => handlePreviousImageSelect(img)}
              >
                <Image
                  src={img}
                  alt="Previously used pet image"
                  width={150}
                  height={150}
                  className="aspect-square rounded-md object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canProceed}>
          Next
        </Button>
      </div>
    </div>
  )
} 