import { NextResponse } from 'next/server';
import { generateCode } from '@/lib/ai/orchestrator';

export async function POST(request: Request) {
  try {
    console.log('🚀 Starting code generation...');
    const { components, layoutAnalysis } = await request.json();

    if (!components || components.length === 0) {
      return NextResponse.json(
        { error: 'No components provided' },
        { status: 400 }
      );
    }

    // Check for required API key
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Generate HTML/CSS/JS
    const result = await generateCode(components, layoutAnalysis);

    console.log('✅ Code generation complete');

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('❌ Code generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate code',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
