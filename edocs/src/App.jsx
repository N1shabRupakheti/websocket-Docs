import './App.css'
import Connection from './websocket/Connection.tsx'
import Editor from './editor/Editor.tsx'
import { useState } from 'react'
import useWebSocket from './hooks/useWebsocket.ts'


function App() {

  const [content, setContent] = useState('')
  const { sendMessage } = useWebSocket();

  const handleEditorChange = (newContent) => {
    setContent(newContent)
    sendMessage(newContent)
  }

  return (
    <div className='p-4 bg-gray-100 min-h-screen flex flex-col gap-4'>
      <Connection />
      <Editor value={content} onChange={handleEditorChange} />
    </div>
  )
}

export default App
