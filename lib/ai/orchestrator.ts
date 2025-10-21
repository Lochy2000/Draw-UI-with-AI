// Multi-agent orchestrator for sketch-to-website pipeline
import { analyzeSketchWithGemini } from './gemini';
import {
  analyzeLayoutStructure,
  mapSketchToComponents,
  generateHTML,
  generateCSS,
  generateJavaScript,
} from './openrouter';
import { SketchAnalysis, ComponentSuggestion } from '@/types/components';

export interface OrchestrationResult {
  visionAnalysis: any;
  layoutAnalysis: any;
  componentSuggestions: ComponentSuggestion[];
  fullAnalysis: SketchAnalysis;
  status: 'success' | 'partial' | 'error';
  errors?: string[];
}

export interface CodeGenerationResult {
  html: string;
  css: string;
  javascript: string;
  complete: boolean;
  errors?: string[];
}

/**
 * Orchestrates the multi-agent analysis of a sketch
 * Phase 1: Gemini Vision Agent analyzes the sketch image
 * Phase 2: OpenRouter Layout Agent suggests optimal structure
 * Phase 3: OpenRouter Component Agent maps elements to components
 */
export async function analyzeSketch(imageBase64: string): Promise<OrchestrationResult> {
  const errors: string[] = [];
  let visionAnalysis = null;
  let layoutAnalysis = null;
  let componentMapping = null;

  try {
    // PHASE 1: Vision Analysis with Gemini
    console.log('🎨 Phase 1: Vision Agent analyzing sketch...');
    visionAnalysis = await analyzeSketchWithGemini(imageBase64);
    console.log('✅ Vision analysis complete');

    // PHASE 2: Layout Structure Analysis with OpenRouter
    console.log('📐 Phase 2: Layout Agent analyzing structure...');
    layoutAnalysis = await analyzeLayoutStructure(visionAnalysis);
    console.log('✅ Layout analysis complete');

    // PHASE 3: Component Mapping with OpenRouter
    console.log('🧩 Phase 3: Component Agent mapping elements...');
    componentMapping = await mapSketchToComponents(visionAnalysis, layoutAnalysis);
    console.log('✅ Component mapping complete');

    // Transform to ComponentSuggestion format
    const componentSuggestions: ComponentSuggestion[] =
      componentMapping.components?.map((comp: any, index: number) => ({
        suggestedType: comp.type,
        confidence: comp.confidence || 0.8,
        bounds: {
          x: comp.position?.x || 0,
          y: comp.position?.y || index * 100,
          width: comp.size?.width || 200,
          height: comp.size?.height || 100,
        },
        properties: comp.properties || {},
        reasoning: comp.reasoning || 'Identified from sketch',
        alternatives: comp.alternatives || [],
      })) || [];

    const fullAnalysis: SketchAnalysis = {
      layout: {
        type: layoutAnalysis.containerStructure?.type || 'single-column',
        sections:
          layoutAnalysis.sections?.map((section: any) => ({
            type: section.name,
            bounds: { x: 0, y: 0, width: 1200, height: 400 },
            description: section.htmlTag || section.name,
          })) || [],
        gridColumns: layoutAnalysis.containerStructure?.columns,
      },
      components: componentSuggestions,
      hierarchy: componentMapping.hierarchy || 'Standard web layout',
      colorScheme: visionAnalysis.colorIndications
        ? [visionAnalysis.colorIndications]
        : undefined,
    };

    return {
      visionAnalysis,
      layoutAnalysis,
      componentSuggestions,
      fullAnalysis,
      status: 'success',
    };
  } catch (error) {
    console.error('Orchestration error:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');

    // Return partial results if any phase succeeded
    if (visionAnalysis || layoutAnalysis) {
      return {
        visionAnalysis: visionAnalysis || {},
        layoutAnalysis: layoutAnalysis || {},
        componentSuggestions: [],
        fullAnalysis: {
          layout: {
            type: 'single-column',
            sections: [],
          },
          components: [],
          hierarchy: 'Analysis incomplete',
        },
        status: 'partial',
        errors,
      };
    }

    throw error;
  }
}

/**
 * Generates final HTML/CSS/JS code from approved components
 * Phase 4: HTML Generation Agent
 * Phase 5: CSS Generation Agent
 * Phase 6: JavaScript Generation Agent
 */
export async function generateCode(
  components: any[],
  layoutAnalysis: any
): Promise<CodeGenerationResult> {
  const errors: string[] = [];
  let html = '';
  let css = '';
  let javascript = '';

  try {
    // PHASE 4: Generate HTML
    console.log('📝 Phase 4: HTML Agent generating markup...');
    html = await generateHTML(components);
    console.log('✅ HTML generation complete');

    // PHASE 5: Generate CSS
    console.log('🎨 Phase 5: CSS Agent generating styles...');
    css = await generateCSS(components, html);
    console.log('✅ CSS generation complete');

    // PHASE 6: Generate JavaScript (if needed)
    console.log('⚡ Phase 6: JavaScript Agent generating interactivity...');
    const interactiveComponents = components.filter(
      (c) => c.type === 'button' || c.type === 'form' || c.type === 'navbar'
    );
    javascript = await generateJavaScript(
      components,
      interactiveComponents.map((c) => c.type)
    );
    console.log('✅ JavaScript generation complete');

    return {
      html,
      css,
      javascript,
      complete: true,
    };
  } catch (error) {
    console.error('Code generation error:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');

    return {
      html,
      css,
      javascript,
      complete: false,
      errors,
    };
  }
}
