'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { MemoryGame } from './MemoryGame'

interface GenerationViewProps {
  step: 'generating' | 'result';
  generationId: string | null;
  onStartOver: () => void;
}

export function GenerationView({ step, generationId, onStartOver }: GenerationViewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (step === 'result' && generationId) {
      const supabase = createClient()
      const channel = supabase
        .channel(`generation-complete:${generationId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'generations', filter: `id=eq.${generationId}` },
          (payload) => {
            const newGeneration = payload.new as { output_image_url?: string };
            if (newGeneration.output_image_url) {
              setImageUrl(newGeneration.output_image_url)
              setLoading(false)
              channel.unsubscribe()
            }
          }
        )
        .subscribe()

      // Also fetch initially in case it's already complete
      async function fetchInitial() {
        const { data, error } = await supabase
            .from('generations')
            .select('output_image_url')
            .eq('id', generationId)
            .single()
        
        if (error) {
            console.error(error)
            setError("Could not fetch the generated image.")
            setLoading(false)
        } else if (data?.output_image_url) {
            setImageUrl(data.output_image_url)
            setLoading(false)
            channel.unsubscribe()
        }
      }

      fetchInitial();

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [step, generationId])

  const handleDownload = () => {
    if(imageUrl) {
        // Use a link to trigger download
        const link = document.createElement('a');
        link.href = imageUrl;
        link.setAttribute('download', 'haikoo-masterpiece.png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }

  if (step === 'generating' || (step === 'result' && loading)) {
    return (
      <div className="text-center space-y-8 py-8">
        <div>
            <h2 className="text-2xl font-bold">Your Haikoo is being created!</h2>
            <p className="text-muted-foreground">Feel free to play a game while you wait. This can take up to a minute.</p>
        </div>
        <div className="flex justify-center">
            {step === 'generating' || loading ? <MemoryGame /> : null}
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    )
  }

  if (step === 'result' && imageUrl) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Your Masterpiece is Ready!</h2>
        <div className="relative aspect-square rounded-lg overflow-hidden border shadow-lg">
          <Image
            src={imageUrl}
            alt="Generated pet portrait"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex justify-center gap-4">
            <Button onClick={handleDownload} size="lg">
                <Icons.download className="mr-2 h-4 w-4"/>
                Download
            </Button>
            <Button onClick={onStartOver} variant="outline" size="lg">
                <Icons.refresh className="mr-2 h-4 w-4"/>
                Start Over
            </Button>
        </div>
      </div>
    )
  }

  return null
} 