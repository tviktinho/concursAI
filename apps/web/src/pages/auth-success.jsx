import { createRoot } from 'react-dom/client'
import '../index.css'
import { setToken } from '../lib/auth.js'

function Success() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  if (token) {
    setToken(token)
    window.location.replace('/index.html')
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-slate-600 dark:text-slate-300">Finalizando login...</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<Success />)
