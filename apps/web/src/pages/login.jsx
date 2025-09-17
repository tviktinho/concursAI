import { createRoot } from 'react-dom/client'
import '../index.css'
import { API_URL } from '../lib/api.js'

function LoginPage() {
  const handleGoogle = () => {
    // Redireciona para o fluxo OAuth do backend
    window.location.href = `${API_URL}/auth/google`
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <button onClick={handleGoogle} className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">
        Entrar com Google
      </button>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<LoginPage />)

