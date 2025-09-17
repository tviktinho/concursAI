import { createRoot } from 'react-dom/client'
import '../index.css'

function Failure() {
  const params = new URLSearchParams(window.location.search)
  const error = params.get('error') || 'Falha na autenticação'

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-semibold">Erro ao autenticar</h1>
      <p className="text-slate-600 dark:text-slate-300">{error}</p>
      <a href="/login.html" className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">Tentar novamente</a>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<Failure />)

