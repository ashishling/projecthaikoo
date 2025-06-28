import Image from 'next/image'

type GridImage = {
  src: string
  alt: string
}

export function ImageGrid({ images }: { images: GridImage[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
} 