// Gemini AI service for vision analysis
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeSketchWithGemini(imageBase64: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a UX/UI expert analyzing a hand-drawn website sketch.

Analyze this sketch and identify:

1. **Layout Structure**: Describe the overall layout (header, hero, content sections, footer, etc.)
2. **Components**: List all UI elements you see (buttons, text blocks, images, forms, navigation, etc.)
3. **Hierarchy**: Describe the visual hierarchy and importance of elements
4. **Text Content**: Extract any visible text or labels
5. **Positioning**: Describe where elements are positioned (top, center, bottom, left, right)
6. **Intended Purpose**: What type of website is this? (landing page, blog, portfolio, etc.)

Return your analysis in JSON format:
{
  "layoutType": "single-column | two-column | grid | complex",
  "sections": [
    {
      "type": "header | hero | content | footer | etc",
      "position": "top | middle | bottom",
      "description": "detailed description",
      "elements": ["list of elements in this section"]
    }
  ],
  "components": [
    {
      "type": "button | text | image | form | navbar | etc",
      "position": { "x": "left|center|right", "y": "top|middle|bottom" },
      "content": "text content or description",
      "size": "small | medium | large",
      "importance": "primary | secondary | tertiary"
    }
  ],
  "textContent": ["list of all text found"],
  "websiteType": "landing | blog | portfolio | ecommerce | etc",
  "colorIndications": "any color notes from sketch"
}

Be detailed and precise. If something is unclear, provide your best interpretation.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/png',
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { raw: text };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

export async function refineComponentSuggestion(
  sketchAnalysis: any,
  componentType: string
): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on this sketch analysis, provide detailed properties for a ${componentType} component:

Analysis: ${JSON.stringify(sketchAnalysis, null, 2)}

Return JSON with specific properties:
{
  "type": "${componentType}",
  "properties": {
    // specific properties for this component type
  },
  "styling": {
    "backgroundColor": "",
    "color": "",
    "padding": "",
    "fontSize": ""
  },
  "content": {
    // text, images, links, etc.
  }
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { raw: text };
  } catch (error) {
    console.error('Gemini refinement error:', error);
    throw error;
  }
}
