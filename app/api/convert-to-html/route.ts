import OpenAI from 'openai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('API route started')
    const { image } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Convert image data to a simple text description
    const mockupDescription = "A UI mockup containing: [any shapes or elements you've drawn]"

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a UI developer who converts mockup descriptions into HTML and Tailwind CSS code."
        },
        {
          role: "user",
          content: `Please generate responsive HTML and Tailwind CSS code for this UI mockup: ${mockupDescription}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })

    return NextResponse.json({ html: completion.choices[0].message.content })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: 'Failed to process image',
      details: error.message
    }, { status: 500 })
  }
}