'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { ImageSelectionStep } from './_components/ImageSelectionStep'
import { StyleSelectionStep } from './_components/StyleSelectionStep'
import { GenerationView } from './_components/GenerationView'

type Step = 'image-select' | 'style-select' | 'generating' | 'result'

export default function GeneratePage() {
  const { user } = useAuth()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  const [step, setStep] = useState<Step>('image-select')
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelected = (file: File | null, imageUrl: string | null) => {
    setSelectedImageFile(file)
    setSelectedImageUrl(imageUrl)
  }

  const handleStartOver = () => {
    setStep('image-select');
    setSelectedImageFile(null);
    setSelectedImageUrl(null);
    setSelectedPromptId(null);
    setGenerationId(null);
    setError(null);
  }

  const handleGenerate = () => {
    setError(null)
    if ((!selectedImageFile && !selectedImageUrl) || !selectedPromptId) {
      setError("An image and a style must be selected.");
      return;
    }
    
    startTransition(async () => {
      try {
        let imagePath = selectedImageUrl;

        if (selectedImageFile) {
          if (!user) throw new Error('User not authenticated');
          const uploadedPath = await uploadImage(user.id, selectedImageFile);
          const { data: publicUrlData } = createClient().storage
            .from('images')
            .getPublicUrl(uploadedPath);
          imagePath = publicUrlData.publicUrl;
        }

        setStep('generating');

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptId: selectedPromptId,
            imageUrl: imagePath,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Something went wrong');
        }
        
        setGenerationId(result.id)
        setStep('result')
        
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStep('style-select'); // Go back to style select on error
      }
    });
  };

  const renderStep = () => {
    switch (step) {
      case 'image-select':
        return <ImageSelectionStep onImageSelected={handleImageSelected} onNext={() => setStep('style-select')} />
      case 'style-select':
        return <StyleSelectionStep 
                  selectedImageUrl={selectedImageUrl}
                  selectedImageFile={selectedImageFile}
                  onStyleSelected={(id) => setSelectedPromptId(id)}
                  onBack={() => setStep('image-select')}
                  onGenerate={handleGenerate}
                />
      case 'generating':
      case 'result':
        return <GenerationView 
                  step={step} 
                  generationId={generationId} 
                  onStartOver={handleStartOver} 
                />
      default:
        return <div>Invalid step</div>
    }
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {renderStep()}
        {error && (
            <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-md">
                {error}
            </div>
        )}
      </div>
    </div>
  )
}