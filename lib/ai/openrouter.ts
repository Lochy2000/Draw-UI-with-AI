// OpenRouter AI service for layout and component analysis
import OpenAI from 'openai';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not set in environment variables');
}

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'AI Website Builder',
  },
});

export async function analyzeLayoutStructure(visionAnalysis: any): Promise<any> {
  try {
    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet', // or 'openai/gpt-4-turbo'
      messages: [
        {
          role: 'system',
          content: `You are a web layout expert. Analyze sketch descriptions and suggest optimal HTML/CSS layout structures.
Focus on semantic HTML5, modern CSS (Flexbox/Grid), and responsive design principles.`,
        },
        {
          role: 'user',
          content: `Based on this vision analysis of a website sketch, suggest the optimal layout structure:

${JSON.stringify(visionAnalysis, null, 2)}

Provide a detailed layout plan in JSON:
{
  "layoutStrategy": "describe overall approach",
  "containerStructure": {
    "type": "flexbox | grid | hybrid",
    "columns": number,
    "rows": number,
    "areas": ["header", "main", "sidebar", "footer"]
  },
  "sections": [
    {
      "name": "header",
      "htmlTag": "header",
      "layout": "flex",
      "justifyContent": "space-between",
      "children": ["logo", "nav"]
    }
  ],
  "responsiveBreakpoints": {
    "mobile": "< 768px - strategy",
    "tablet": "768px - 1024px - strategy",
    "desktop": "> 1024px - strategy"
  },
  "recommendations": ["list of best practices"]
}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { raw: content };
  } catch (error) {
    console.error('OpenRouter layout analysis error:', error);
    throw error;
  }
}

export async function mapSketchToComponents(
  visionAnalysis: any,
  layoutAnalysis: any
): Promise<any> {
  try {
    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: `You are a component mapping expert. Map sketched elements to pre-built web components.
Available components: header, hero, text, button, image, container, navbar, footer, form, input, textarea, grid, card, section.
Provide detailed component specifications with properties.`,
        },
        {
          role: 'user',
          content: `Map these sketch elements to components:

Vision Analysis:
${JSON.stringify(visionAnalysis, null, 2)}

Layout Structure:
${JSON.stringify(layoutAnalysis, null, 2)}

For each identified element, suggest:
{
  "components": [
    {
      "id": "unique-id",
      "type": "component type",
      "confidence": 0.0-1.0,
      "position": { "section": "header|main|footer", "order": number },
      "properties": {
        // component-specific properties
        "text": "content",
        "variant": "style variant",
        "size": "small|medium|large"
      },
      "styles": {
        "backgroundColor": "",
        "color": "",
        "padding": ""
      },
      "reasoning": "why this component",
      "alternatives": ["other possible component types"]
    }
  ],
  "hierarchy": "description of component tree",
  "interactions": ["any interactive elements noted"]
}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { raw: content };
  } catch (error) {
    console.error('OpenRouter component mapping error:', error);
    throw error;
  }
}

export async function generateHTML(components: any[]): Promise<string> {
  try {
    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: `You are an expert HTML developer. Generate clean, semantic HTML5 code.
Use proper tags, accessibility attributes, and modern best practices.
Do NOT use any frameworks or libraries - only pure HTML.`,
        },
        {
          role: 'user',
          content: `Generate HTML for these components:

${JSON.stringify(components, null, 2)}

Requirements:
- Semantic HTML5 tags
- Proper structure and nesting
- Accessibility attributes (alt, aria-labels, etc.)
- Clean, readable code with comments
- No inline styles (we'll add CSS separately)

Return ONLY the HTML code, no markdown formatting.`,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter HTML generation error:', error);
    throw error;
  }
}

export async function generateCSS(components: any[], htmlCode: string): Promise<string> {
  try {
    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: `You are an expert CSS developer. Generate modern, responsive CSS.
Use CSS Grid, Flexbox, custom properties, and mobile-first approach.
Do NOT use any frameworks - only pure CSS.`,
        },
        {
          role: 'user',
          content: `Generate CSS for this website:

Components:
${JSON.stringify(components, null, 2)}

HTML:
${htmlCode}

Requirements:
- Modern CSS3 with custom properties (variables)
- Responsive design (mobile-first)
- Flexbox and Grid where appropriate
- Smooth transitions and hover effects
- Accessibility (focus states, etc.)
- Clean, organized structure
- Comments for sections

Return ONLY the CSS code, no markdown formatting.`,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter CSS generation error:', error);
    throw error;
  }
}

export async function generateJavaScript(components: any[], interactivity: string[]): Promise<string> {
  try {
    // Only generate JS if there are interactive elements
    if (!interactivity || interactivity.length === 0) {
      return '// No JavaScript needed for this page\n';
    }

    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: `You are an expert JavaScript developer. Generate clean, vanilla JavaScript.
No frameworks or libraries - only pure JavaScript (ES6+).
Focus on accessibility, performance, and best practices.`,
        },
        {
          role: 'user',
          content: `Generate JavaScript for these interactions:

Components:
${JSON.stringify(components, null, 2)}

Interactive Elements:
${JSON.stringify(interactivity, null, 2)}

Requirements:
- Vanilla JavaScript (ES6+)
- Event delegation where appropriate
- Accessibility (keyboard navigation, focus management)
- Error handling
- Comments explaining functionality
- No external dependencies

Return ONLY the JavaScript code, no markdown formatting.`,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter JS generation error:', error);
    throw error;
  }
}
