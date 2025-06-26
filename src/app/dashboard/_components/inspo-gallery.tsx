'use client'

import Image from 'next/image'

interface InspoImage {
  id: number
  image_url: string
}

interface InspoGalleryProps {
  images: InspoImage[]
}

export function InspoGallery({ images }: InspoGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {images.map((img) => (
        <div key={img.id} className="group relative">
          <Image
            src={img.image_url}
            alt={`Inspiration image ${img.id}`}
            width={512}
            height={512}
            className="aspect-square w-full rounded-lg object-cover"
          />
        </div>
      ))}
    </div>
  )
}