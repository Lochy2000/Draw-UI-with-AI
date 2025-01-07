'use client'
import { useState } from 'react'
import { Tldraw, Editor } from '@tldraw/tldraw'
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
      console.log('Export started')
      if (!editor) {
        console.log('No editor found')
        return
      }
      setIsLoading(true)

      // Get all shapes from the current page
      const shapes = editor.getCurrentPageShapeIds()
      console.log('Got shapes:', shapes.size)

      // Get SVG of all shapes
      const svg = await editor.getSvg(Array.from(shapes))
      if (!svg) {
        console.log('No SVG data')
        return
      }

      // Convert SVG to string
      const svgString = svg.outerHTML
      console.log('SVG string created')

      const response = await fetch('/api/convert-to-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: svgString
        })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(`API Error: ${errorData.error}`)
      }

      const data = await response.json()
      setGeneratedHTML(data.html)
      console.log('HTML generated successfully')
    } catch (error) {
      console.error('Export error:', error)
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