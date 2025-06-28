'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Icons } from '@/components/ui/icons'

interface Prompt {
  id: string;
  name: string;
}

interface StyleSelectionStepProps {
  selectedImageUrl: string | null;
  selectedImageFile: File | null;
  onStyleSelected: (promptId: string) => void;
  onBack: () => void;
  onGenerate: () => void;
}

export function StyleSelectionStep({
  selectedImageUrl,
  selectedImageFile,
  onStyleSelected,
  onBack,
  onGenerate,
}: StyleSelectionStepProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPromptId, setSelectedPromptId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const displayUrl = selectedImageFile 
    ? URL.createObjectURL(selectedImageFile) 
    : selectedImageUrl;

  useEffect(() => {
    async function fetchPrompts() {
      setLoading(true)
      const { data } = await supabase
        .from('prompts')
        .select('id, name')
        .eq('is_active', true)
      if (data) setPrompts(data)
      setLoading(false)
    }
    fetchPrompts()
  }, [supabase])
  
  const handleSelect = (promptId: string) => {
    setSelectedPromptId(promptId)
    onStyleSelected(promptId)
  }

  return (
    <div className="space-y-8">
       <div>
        <h2 className="text-2xl font-bold">Step 2: Choose Your Style</h2>
        <p className="text-muted-foreground">Select an artistic style for your masterpiece.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Selected Image</h3>
            {displayUrl && (
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                        src={displayUrl}
                        alt="Selected pet"
                        fill
                        className="object-cover"
                    />
                </div>
            )}
        </div>
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Available Styles</h3>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Icons.spinner className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <RadioGroup
                    value={selectedPromptId}
                    onValueChange={handleSelect}
                    className="grid grid-cols-2 gap-4"
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
                        className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                        {prompt.name}
                        </Label>
                    </div>
                    ))}
                </RadioGroup>
            )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onGenerate} disabled={!selectedPromptId}>
          Generate
        </Button>
      </div>
    </div>
  )
} 