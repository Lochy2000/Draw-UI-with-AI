'use client';
import { useState } from 'react';
import { Tldraw, Editor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import SuggestionPanel from './SuggestionPanel';
import LivePreview from './LivePreview';
import CodeEditor from './CodeEditor';
import { ComponentSuggestion, WebsiteComponent } from '@/types/components';

type WorkflowStage = 'sketch' | 'analyze' | 'suggestions' | 'edit' | 'preview';

export default function EnhancedDrawingCanvas() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [stage, setStage] = useState<WorkflowStage>('sketch');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Analysis results
  const [visionAnalysis, setVisionAnalysis] = useState<any>(null);
  const [layoutAnalysis, setLayoutAnalysis] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<ComponentSuggestion[]>([]);

  // Accepted components
  const [components, setComponents] = useState<WebsiteComponent[]>([]);

  // Generated code
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJavascript] = useState('');

  const handleMount = (editor: Editor) => {
    setEditor(editor);
  };

  const convertSVGToImage = async (svgElement: SVGElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width || 1200;
          canvas.height = img.height || 800;
          ctx?.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          const base64 = dataUrl.split(',')[1];
          resolve(base64);
        };

        img.onerror = reject;
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleAnalyze = async () => {
    try {
      if (!editor) {
        alert('Editor not ready');
        return;
      }

      setIsLoading(true);
      setLoadingMessage('Exporting sketch...');

      // Get all shapes
      const shapes = editor.getCurrentPageShapeIds();
      if (shapes.size === 0) {
        alert('Please draw something first!');
        setIsLoading(false);
        return;
      }

      // Get SVG
      const svg = await editor.getSvg(Array.from(shapes));
      if (!svg) {
        alert('Failed to export sketch');
        setIsLoading(false);
        return;
      }

      setLoadingMessage('Converting to image...');
      const imageBase64 = await convertSVGToImage(svg);

      setLoadingMessage('🎨 Vision Agent analyzing sketch...');
      setStage('analyze');

      // Call analysis API
      const response = await fetch('/api/analyze-sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error);
      }

      const result = await response.json();

      setVisionAnalysis(result.visionAnalysis);
      setLayoutAnalysis(result.layoutAnalysis);
      setSuggestions(result.componentSuggestions);

      setStage('suggestions');
      setLoadingMessage('');
    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Analysis failed: ${(error as Error).message}`);
      setStage('sketch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestions = async (acceptedComponents: WebsiteComponent[]) => {
    try {
      setIsLoading(true);
      setLoadingMessage('📝 Generating HTML...');
      setComponents(acceptedComponents);

      // Generate code
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: acceptedComponents,
          layoutAnalysis,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error);
      }

      const result = await response.json();

      setHtml(result.html);
      setCss(result.css);
      setJavascript(result.javascript);

      setStage('preview');
    } catch (error) {
      console.error('Code generation error:', error);
      alert(`Code generation failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReject = () => {
    setStage('sketch');
    setSuggestions([]);
    setVisionAnalysis(null);
    setLayoutAnalysis(null);
  };

  const handleModify = (modifiedSuggestions: ComponentSuggestion[]) => {
    setSuggestions(modifiedSuggestions);
    // Could add more modification UI here
  };

  const handleExport = () => {
    // Create downloadable files
    const files = [
      { name: 'index.html', content: html },
      { name: 'styles.css', content: css },
      { name: 'script.js', content: javascript },
    ];

    files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleStartOver = () => {
    setStage('sketch');
    setSuggestions([]);
    setVisionAnalysis(null);
    setLayoutAnalysis(null);
    setComponents([]);
    setHtml('');
    setCss('');
    setJavascript('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Website Builder</h1>
            <p className="text-sm text-gray-600">
              Sketch your idea → AI analyzes → Review suggestions → Generate code
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Stage indicators */}
            <div className="flex gap-2">
              {['sketch', 'analyze', 'suggestions', 'preview'].map((s, i) => (
                <div
                  key={s}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    stage === s
                      ? 'bg-blue-500 text-white'
                      : i < ['sketch', 'analyze', 'suggestions', 'preview'].indexOf(stage)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-4">
        {stage === 'sketch' && (
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 border rounded-lg overflow-hidden bg-white shadow-lg">
              <Tldraw onMount={handleMount} />
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium shadow-md transition-all"
              >
                {isLoading ? loadingMessage : 'Analyze Sketch ✨'}
              </button>
            </div>
          </div>
        )}

        {stage === 'analyze' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-700">{loadingMessage}</p>
              <p className="text-sm text-gray-500 mt-2">
                Multiple AI agents are analyzing your sketch...
              </p>
            </div>
          </div>
        )}

        {stage === 'suggestions' && (
          <div className="h-full">
            <SuggestionPanel
              visionAnalysis={visionAnalysis}
              layoutAnalysis={layoutAnalysis}
              suggestions={suggestions}
              onAccept={handleAcceptSuggestions}
              onReject={handleReject}
              onModify={handleModify}
            />
          </div>
        )}

        {stage === 'preview' && (
          <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <LivePreview html={html} css={css} javascript={javascript} />
              <CodeEditor
                html={html}
                css={css}
                javascript={javascript}
                onHtmlChange={setHtml}
                onCssChange={setCss}
                onJsChange={setJavascript}
              />
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleStartOver}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Export Files 📦
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && stage !== 'analyze' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">{loadingMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
