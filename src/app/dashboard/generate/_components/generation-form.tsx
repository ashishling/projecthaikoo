'use client'

import { useState, useTransition, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Icons } from '@/components/ui/icons'
import { ImageSelector } from './image-selector'

const TOTAL_FREE_GENERATIONS = 10

export function GenerationForm() {
  const { user } = useAuth()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedPromptId, setSelectedPromptId] = useState<string>('')
  const [prompts, setPrompts] = useState<any[]>([])
  const [previousImages, setPreviousImages] = useState<string[]>([])
  const [generationsCount, setGenerationsCount] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      // Fetch prompts
      const { data: promptsData, error: promptsError } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_active', true)
      if (promptsData) setPrompts(promptsData)

      // Fetch past generations for count and images
      const { data: generationsData, error: generationsError } = await supabase
        .from('generations')
        .select('input_image_url')
        .eq('user_id', user.id)

      if (generationsData) {
        setGenerationsCount(generationsData.length)
        const uniqueImages = [
          ...new Set(generationsData.map((g) => g.input_image_url).filter(Boolean) as string[]),
        ]
        setPreviousImages(uniqueImages)
      }
    }
    fetchData()
  }, [user, supabase])

  const generationsRemaining = TOTAL_FREE_GENERATIONS - generationsCount
  const hasQuota = generationsRemaining > 0

  const handleImageSelect = (file: File | null) => {
    setImageFile(file)
    if (file) {
      setSelectedImage(null)
    }
  }

  const handlePreviousImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setImageFile(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setResult(null)

    if (!imageFile && !selectedImage) {
      setError('Please select or upload an image.')
      return
    }
    if (!selectedPromptId) {
      setError('Please select a style.')
      return
    }
    if (!hasQuota) {
      setError('You have no free generations left.')
      return
    }

    startTransition(async () => {
      try {
        let imagePath = selectedImage

        if (imageFile) {
          if (!user) throw new Error('User not authenticated')
          const uploadedPath = await uploadImage(user.id, imageFile)
          const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(uploadedPath)
          imagePath = publicUrlData.publicUrl
        }

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptId: selectedPromptId,
            imageUrl: imagePath,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong')
        }

        setResult(data)
        // Refresh generation count after successful generation
        setGenerationsCount(generationsCount + 1)

      } catch (err: any) {
        console.error(err)
        setError(err.message)
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 rounded-lg border bg-card p-4 text-center text-card-foreground">
        <p className="text-lg">
          You have{' '}
          <span className="font-bold text-primary">{generationsRemaining}</span>{' '}
          free generations remaining.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="image" className="text-lg font-medium">1. Upload your pet's photo</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
            disabled={!hasQuota}
          />
          {imageFile && (
            <div className="mt-4 text-sm text-muted-foreground">
              Selected: {imageFile.name}
            </div>
          )}
        </div>

        <ImageSelector
          images={previousImages}
          selectedImage={selectedImage}
          onSelectImage={handlePreviousImageSelect}
        />

        <div className="space-y-4">
          <Label className="text-lg font-medium">2. Choose a style</Label>
          <RadioGroup
            value={selectedPromptId}
            onValueChange={setSelectedPromptId}
            className="grid grid-cols-2 gap-4 md:grid-cols-3"
            disabled={!hasQuota}
          >
            {prompts.map((prompt) => (
              <div key={prompt.id}>
                <RadioGroupItem
                  value={prompt.id.toString()}
                  id={prompt.id.toString()}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={prompt.id.toString()}
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {prompt.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full" disabled={isPending || !hasQuota}>
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Generate Portrait
        </Button>
      </form>

      {error && <div className="mt-4 text-center text-red-500">{error}</div>}

      {isPending && (
        <div className="mt-8 text-center">
          <p>Generating your portrait... this can take up to a minute.</p>
        </div>
      )}

      {result && result.imageUrl && (
        <div className="mt-8">
          <h3 className="text-center text-2xl font-bold">Your Haikoo!</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.imageUrl}
            alt="Generated pet portrait"
            className="mt-4 w-full rounded-lg"
          />
        </div>
      )}
    </div>
  )
} 