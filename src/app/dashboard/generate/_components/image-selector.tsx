'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageSelectorProps {
  images: string[]
  selectedImage: string | null
  onSelectImage: (imageUrl: string) => void
}

export function ImageSelector({
  images,
  selectedImage,
  onSelectImage,
}: ImageSelectorProps) {
  if (images.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Or select a previous image</h3>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {images.map((img) => (
          <div
            key={img}
            className={cn(
              'relative cursor-pointer rounded-lg border-2 border-transparent transition-all hover:border-primary',
              selectedImage === img && 'border-primary'
            )}
            onClick={() => onSelectImage(img)}
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
  )
} 