'use client'
import { useState } from 'react'
import { Tldraw, Editor, TLShapeId } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

export default function DrawingCanvas() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleMount = (editor: Editor) => {
    setEditor(editor)
  }

  const handleExport = async () => {
    try {
      if (!editor) {
        console.error('Editor not initialized')
        return
      }

      setIsLoading(true)
      console.log('Starting export...')

      // Get the shape IDs and convert Set to Array
      const shapeIds = Array.from(editor.getCurrentPageShapeIds())
      if (shapeIds.length === 0) {  // Changed from size to length
        alert("Please draw something first")
        setIsLoading(false)
        return
      }

      // Get SVG using the new API
      const svg = await editor.getSvg(shapeIds)
      if (!svg) {
        throw new Error('Failed to export SVG')
      }

      // Convert SVG to base64
      const svgString = new XMLSerializer().serializeToString(svg)
      const base64data = btoa(svgString)

      const response = await fetch('/api/convert-to-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: `data:image/svg+xml;base64,${base64data}` 
        })
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(`API Error: ${errorData.error}`)
      }
  
      const data = await response.json()
      setGeneratedHTML(data.html)
    } catch (error) {
      console.error('Export error:', error)
      if (error instanceof Error) {
        alert('Failed to generate HTML: ' + error.message)
      } else {
        alert('Failed to generate HTML: An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-[500px] w-full border rounded-lg overflow-hidden">
        <Tldraw onMount={handleMount} />
      </div>
      <button 
        onClick={handleExport}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? 'Converting...' : 'Generate HTML'}
      </button>
      {generatedHTML && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <pre className="whitespace-pre-wrap">{generatedHTML}</pre>
        </div>
      )}
    </div>
  )
}