/**
 * Centralized AI Model Configuration
 *
 * This file manages all AI model selections across the application.
 * Free models are used by default to minimize costs.
 */

export const AI_MODELS = {
  // Vision analysis - uses Google Gemini directly (free tier available)
  vision: 'gemini-1.5-flash',

  // Layout analysis - uses free model via OpenRouter
  // Alternative free models:
  // - 'meta-llama/llama-3.1-8b-instruct:free'
  // - 'mistralai/mistral-7b-instruct:free'
  layout: 'google/gemini-flash-1.5',

  // Component mapping - uses free model via OpenRouter
  components: 'google/gemini-flash-1.5',

  // HTML generation - uses free model via OpenRouter
  htmlGen: 'google/gemini-flash-1.5',

  // CSS generation - uses free model via OpenRouter
  cssGen: 'google/gemini-flash-1.5',

  // JavaScript generation - uses free model via OpenRouter
  jsGen: 'google/gemini-flash-1.5',
} as const;

/**
 * Premium models (PAID - use only if you have OpenRouter credits)
 * Uncomment to use premium models with better quality but higher cost
 */
export const PREMIUM_MODELS = {
  layout: 'anthropic/claude-3.5-sonnet',      // $3/1M input tokens
  components: 'anthropic/claude-3.5-sonnet',  // $3/1M input tokens
  htmlGen: 'anthropic/claude-3.5-sonnet',     // $3/1M input tokens
  cssGen: 'anthropic/claude-3.5-sonnet',      // $3/1M input tokens
  jsGen: 'anthropic/claude-3.5-sonnet',       // $3/1M input tokens
} as const;

/**
 * Model configuration notes:
 *
 * FREE MODELS (via OpenRouter):
 * - google/gemini-flash-1.5: Fast, capable, free tier available
 * - meta-llama/llama-3.1-8b-instruct:free: Good for code generation
 * - mistralai/mistral-7b-instruct:free: Balanced performance
 *
 * PAID MODELS (via OpenRouter):
 * - anthropic/claude-3.5-sonnet: Highest quality, but costs ~$3/1M tokens
 * - openai/gpt-4-turbo: Good alternative, ~$10/1M tokens
 * - openai/gpt-4o: Multimodal capable, ~$5/1M tokens
 *
 * RECOMMENDATION:
 * - Development: Use FREE models
 * - Production (high quality needed): Use PREMIUM_MODELS
 * - Hybrid: Use free for layout/components, premium for code generation
 */

/**
 * Temperature settings for different tasks
 */
export const TEMPERATURE = {
  analysis: 0.7,   // Higher creativity for understanding sketches
  codeGen: 0.3,    // Lower temperature for deterministic code
} as const;

/**
 * OpenRouter configuration
 */
export const OPENROUTER_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'AI Website Builder',
  },
} as const;
