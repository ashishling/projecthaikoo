import { createServerSupabaseClient } from '@/lib/supabase/config'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    }
  }

  // Return to home page if code exchange fails
  return NextResponse.redirect(new URL('/', requestUrl.origin))
} 