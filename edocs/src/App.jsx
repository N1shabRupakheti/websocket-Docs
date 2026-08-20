import './App.css'
import Connection from './websocket/Connection'
import Editor from './editor/Editor.tsx'

function App() {

  return (
    <div className='p-4 bg-gray-100 min-h-screen flex flex-col gap-4'>
      <Connection/>
      <Editor/>
    </div>
  )
}

export default App
