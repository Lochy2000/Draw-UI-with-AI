import { NextResponse } from 'next/server';
import { analyzeSketch } from '@/lib/ai/orchestrator';

export async function POST(request: Request) {
  try {
    console.log('🚀 Starting sketch analysis...');
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Check for required API keys
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Run multi-agent analysis
    const result = await analyzeSketch(imageBase64);

    console.log('✅ Analysis complete:', result.status);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('❌ Analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze sketch',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
