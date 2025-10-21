'use client';
import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';

// Import Prism theme
if (typeof window !== 'undefined') {
  require('prismjs/themes/prism-tomorrow.css');
}

interface CodeEditorProps {
  html: string;
  css: string;
  javascript: string;
  onHtmlChange?: (code: string) => void;
  onCssChange?: (code: string) => void;
  onJsChange?: (code: string) => void;
}

type TabType = 'html' | 'css' | 'js';

export default function CodeEditor({
  html,
  css,
  javascript,
  onHtmlChange,
  onCssChange,
  onJsChange,
}: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [localHtml, setLocalHtml] = useState(html);
  const [localCss, setLocalCss] = useState(css);
  const [localJs, setLocalJs] = useState(javascript);

  const handleHtmlChange = (code: string) => {
    setLocalHtml(code);
    onHtmlChange?.(code);
  };

  const handleCssChange = (code: string) => {
    setLocalCss(code);
    onCssChange?.(code);
  };

  const handleJsChange = (code: string) => {
    setLocalJs(code);
    onJsChange?.(code);
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return localHtml;
      case 'css':
        return localCss;
      case 'js':
        return localJs;
    }
  };

  const handleCodeChange = (code: string) => {
    switch (activeTab) {
      case 'html':
        handleHtmlChange(code);
        break;
      case 'css':
        handleCssChange(code);
        break;
      case 'js':
        handleJsChange(code);
        break;
    }
  };

  const getLanguage = () => {
    switch (activeTab) {
      case 'html':
        return 'markup';
      case 'css':
        return 'css';
      case 'js':
        return 'javascript';
    }
  };

  const highlightCode = (code: string) => {
    return Prism.highlight(code, Prism.languages[getLanguage()], getLanguage());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCurrentCode());
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center justify-between bg-gray-800 px-2">
        <div className="flex">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'html'
                ? 'bg-gray-900 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'css'
                ? 'bg-gray-900 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'js'
                ? 'bg-gray-900 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            JavaScript
          </button>
        </div>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Copy
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-gray-900">
        <Editor
          value={getCurrentCode()}
          onValueChange={handleCodeChange}
          highlight={highlightCode}
          padding={16}
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 13,
            minHeight: '100%',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
          }}
          textareaClassName="focus:outline-none"
        />
      </div>
    </div>
  );
}
