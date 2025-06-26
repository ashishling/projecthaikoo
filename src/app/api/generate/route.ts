import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI, { toFile } from 'openai'
import { Database } from '@/lib/supabase/types'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { promptId, imageBase64 } = await req.json()

    if (!promptId || !imageBase64) {
      return NextResponse.json({ error: 'Missing prompt ID or image' }, { status: 400 })
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const jwt = authHeader.split(' ')[1]

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const imageBuffer = Buffer.from(imageBase64, 'base64')
    const inputPath = `${user.id}/${Date.now()}_input.png`
    const { error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(inputPath, imageBuffer, {
        contentType: 'image/png',
      })

    if (uploadError) {
      console.error('Error uploading input image:', uploadError)
      return NextResponse.json({ error: 'Failed to upload input image' }, { status: 500 })
    }

    const { data: { publicUrl: inputImageUrl } } = supabase.storage.from('generated-images').getPublicUrl(inputPath)

    // Check user's generation count
    const { count, error: countError } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.error('Error fetching generation count:', countError)
      return NextResponse.json({ error: 'Error checking usage quota' }, { status: 500 })
    }

    if (count !== null && count >= 10) {
      return NextResponse.json({ error: 'You have reached your generation limit of 10 images.' }, { status: 402 })
    }

    // Fetch the prompt text from the database
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .select('text')
      .eq('id', promptId)
      .single()

    if (promptError || !promptData) {
      console.error('Error fetching prompt:', promptError)
      return NextResponse.json({ error: 'Failed to find the selected prompt' }, { status: 404 })
    }
    
    const fullPrompt = promptData.text

    const file = await toFile(imageBuffer, 'input.png', { type: 'image/png' })

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: file,
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
    })

    if (!response.data || response.data.length === 0) {
      return NextResponse.json({ error: 'Failed to generate image from OpenAI' }, { status: 500 })
    }

    const generatedImage = response.data[0]?.b64_json
    if (!generatedImage) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
    }

    const generatedImageBuffer = Buffer.from(generatedImage, 'base64')
    const outputPath = `${user.id}/${Date.now()}_output.png`
    const { error: outputUploadError } = await supabase.storage
      .from('generated-images')
      .upload(outputPath, generatedImageBuffer, {
        contentType: 'image/png',
      })
    
    if (outputUploadError) {
      console.error('Error uploading output image:', outputUploadError)
      return NextResponse.json({ error: 'Failed to upload generated image' }, { status: 500 })
    }
    
    const { data: { publicUrl: outputImageUrl } } = supabase.storage.from('generated-images').getPublicUrl(outputPath)

    // Log the generation in the database
    const { error: insertError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        prompt_id: promptId,
        input_image_url: inputImageUrl,
        output_image_url: outputImageUrl,
      })

    if (insertError) {
      // Log the error but don't block the user from getting their image
      console.error('Failed to log generation:', insertError)
    }

    return NextResponse.json({ imageBase64: generatedImage })
  } catch (error) {
    console.error('Unexpected error in generate route:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
} 