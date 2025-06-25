export type Generation = {
  id: string
  user_id: string
  prompt: string
  image_url: string
  created_at: string
  deleted: boolean
}

export type Database = {
  public: {
    Tables: {
      generations: {
        Row: Generation
        Insert: Omit<Generation, 'id' | 'created_at'>
        Update: Partial<Omit<Generation, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
} 