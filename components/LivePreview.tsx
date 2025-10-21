'use client';
import { useEffect, useRef } from 'react';

interface LivePreviewProps {
  html: string;
  css: string;
  javascript: string;
}

export default function LivePreview({ html, css, javascript }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!doc) return;

    // Build complete HTML document
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    /* Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    /* Generated CSS */
    ${css}
  </style>
</head>
<body>
  ${html}

  <script>
    ${javascript}
  </script>
</body>
</html>
    `;

    // Write to iframe
    doc.open();
    doc.write(fullHTML);
    doc.close();
  }, [html, css, javascript]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <span className="text-sm text-gray-600 ml-2">Live Preview</span>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-[calc(100%-42px)] border-0"
        sandbox="allow-scripts"
        title="Website Preview"
      />
    </div>
  );
}
