# AI Website Builder

![draw-ui](https://github.com/user-attachments/assets/f5cb57a8-80a3-4cf9-8725-a0c134b1b5f4)

Transform your website sketches into production-ready HTML, CSS, and JavaScript using AI! This tool uses multiple AI agents to analyze your hand-drawn designs and generate clean, semantic code.

## Features

### Multi-Agent AI Pipeline
- **Vision Agent (Gemini)**: Analyzes your sketch and identifies UI elements, layout structure, and design intent
- **Layout Agent (OpenRouter)**: Suggests optimal HTML/CSS layout strategies (Flexbox, Grid, etc.)
- **Component Agent (OpenRouter)**: Maps sketched elements to web components
- **Code Generation Agents**: Generate clean HTML, CSS, and JavaScript

### Interactive Workflow
1. **Sketch**: Draw your website design on an infinite canvas
2. **Analyze**: AI agents analyze your sketch and identify components
3. **Review**: Review AI suggestions and modify component mappings
4. **Generate**: Generate production-ready code
5. **Preview & Edit**: See live preview and edit code in real-time
6. **Export**: Download HTML, CSS, and JS files

### Key Capabilities
- Free-form sketch interface with tldraw
- Real-time AI analysis with multiple specialized agents
- Component suggestion system with alternatives
- Live preview in iframe
- Code editor with syntax highlighting
- Export to separate HTML/CSS/JS files
- Pure HTML/CSS/JavaScript output (no frameworks)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- API keys for:
  - [Google Gemini AI](https://makersuite.google.com/app/apikey)
  - [OpenRouter](https://openrouter.ai/keys)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Draw-UI-with-AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open the app**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Step 1: Sketch Your Design
- Use the drawing tools to sketch your website layout
- Draw rectangles for sections, buttons, images, etc.
- Add text labels to indicate content
- Be as detailed or rough as you like

### Step 2: Analyze
- Click "Analyze Sketch" to start the AI analysis
- Multiple AI agents will process your sketch:
  - Vision agent identifies elements
  - Layout agent suggests structure
  - Component agent maps to web components

### Step 3: Review Suggestions
- Review the AI-suggested components
- See confidence scores and reasoning
- Switch component types from dropdown if AI got it wrong
- Click "Accept & Build" to generate code

### Step 4: Preview & Edit
- See live preview of your generated website
- Edit HTML, CSS, or JavaScript in the code editor
- Changes update in real-time
- Click "Export Files" to download your website

## Project Structure

```
Draw-UI-with-AI/
├── app/
│   ├── api/
│   │   ├── analyze-sketch/    # Multi-agent analysis endpoint
│   │   └── generate-code/     # Code generation endpoint
│   ├── page.tsx               # Main page
│   └── layout.tsx             # Root layout
├── components/
│   ├── EnhancedDrawingCanvas.tsx  # Main workflow orchestrator
│   ├── SuggestionPanel.tsx        # AI suggestions UI
│   ├── LivePreview.tsx            # Live preview iframe
│   └── CodeEditor.tsx             # Code editor with highlighting
├── lib/
│   └── ai/
│       ├── gemini.ts          # Gemini vision service
│       ├── openrouter.ts      # OpenRouter services
│       └── orchestrator.ts    # Multi-agent orchestrator
├── types/
│   └── components.ts          # TypeScript type definitions
└── .env.local                 # API keys (you create this)
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Drawing Canvas**: tldraw
- **AI Services**:
  - Google Gemini (vision analysis)
  - OpenRouter (layout & code generation)
- **Code Editor**: react-simple-code-editor + Prism.js

## API Keys Setup

### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Copy your key to `.env.local`

### OpenRouter API Key
1. Go to [OpenRouter Keys](https://openrouter.ai/keys)
2. Create an account / sign in
3. Generate a new API key
4. Copy your key to `.env.local`

**Note**: OpenRouter provides access to multiple AI models (Claude, GPT-4, etc.) through a single API. You'll need credits in your OpenRouter account.

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Clean build cache
npm run clean
```

## Limitations & Future Improvements

Current limitations:
- Sketch quality affects AI accuracy
- No component nesting editor yet
- No responsive design preview
- Limited component library

Planned features:
- [ ] More component types (cards, galleries, etc.)
- [ ] Responsive breakpoint preview
- [ ] Component nesting visual editor
- [ ] Save/load projects
- [ ] Template library
- [ ] Direct deployment options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Troubleshooting

### "API key not configured" error
- Make sure you created `.env.local` file
- Check that your API keys are correctly set
- Restart the dev server after adding keys

### "Failed to analyze sketch" error
- Check your internet connection
- Verify API keys are valid
- Check API service status (Gemini, OpenRouter)
- Ensure you have credits in OpenRouter account

### Sketch not exporting
- Make sure you drew something on the canvas
- Try refreshing the page
- Check browser console for errors

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [tldraw](https://tldraw.dev)
- [Google Gemini AI](https://ai.google.dev)
- [OpenRouter](https://openrouter.ai)

---

**Note**: This is an experimental project. AI-generated code should be reviewed before production use.
