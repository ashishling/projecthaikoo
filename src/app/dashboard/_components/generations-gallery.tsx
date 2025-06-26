'use client'

import Image from 'next/image'

interface Generation {
  id: number
  output_image_url: string | null
}

interface GenerationsGalleryProps {
  generations: Generation[]
}

export function GenerationsGallery({ generations }: GenerationsGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {generations.map(
        (gen) =>
          gen.output_image_url && (
            <div key={gen.id} className="group relative">
              <Image
                src={gen.output_image_url}
                alt={`Generated image ${gen.id}`}
                width={512}
                height={512}
                className="aspect-square w-full rounded-lg object-cover transition-all group-hover:brightness-90"
              />
            </div>
          )
      )}
    </div>
  )
}