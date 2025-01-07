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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert UI developer who creates responsive HTML and Tailwind CSS code based on UI mockups."
        },
        {
          role: "user",
          content: `Please analyze this SVG mockup and create responsive HTML and Tailwind CSS code that would create a similar interface. Include comments explaining each section.`
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })

    return NextResponse.json({ html: completion.choices[0].message.content })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: 'Failed to process image',
      details: (error as Error).message
    }, { status: 500 })
  }
}