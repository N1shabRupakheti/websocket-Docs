import './App.css'
import Connection from './websocket/Connection'
import Editor from './editor/Editor.tsx'
import { useState } from 'react'

function App() {

  const [content, setContent] = useState('')

  return (
    <div className='p-4 bg-gray-100 min-h-screen flex flex-col gap-4'>
      <Connection content={content} onDocumentUpdate={setContent}  />
      <Editor value={content} onChange={setContent}/>
    </div>
  )
}

export default App
