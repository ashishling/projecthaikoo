import { createClient } from './client'

const supabase = createClient()
const STORAGE_BUCKET = 'generated-images'

export async function uploadImage(userId: string, imageFile: File) {
  const filePath = `${userId}/${Date.now()}-${imageFile.name}`
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, imageFile)
    
  if (error) throw error
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)
    
  return publicUrl
}

export async function deleteImage(imageUrl: string) {
  // Extract file path from URL
  const urlParts = imageUrl.split(`${STORAGE_BUCKET}/`)
  if (urlParts.length !== 2) throw new Error('Invalid image URL')
  
  const filePath = urlParts[1]
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath])
    
  if (error) throw error
}

interface Bucket {
  id: string
  name: string
  owner: string
  created_at: string
  updated_at: string
  public: boolean
}

// Initialize storage bucket if it doesn't exist
export async function initializeStorage() {
  const { data: buckets } = await supabase.storage.listBuckets()
  
  if (!buckets?.find((b: Bucket) => b.name === STORAGE_BUCKET)) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    })
    
    if (error) throw error
  }
} 