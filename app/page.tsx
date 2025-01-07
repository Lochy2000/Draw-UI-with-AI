import DrawingCanvas from '@/components/DrawingCanvas'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">UI to HTML Converter</h1>
      <DrawingCanvas />
    </main>
  )
}