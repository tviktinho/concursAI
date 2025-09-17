import { createRoot } from 'react-dom/client'
import '../index.css'

function ResultadosPage() {
  return (
    <main className="min-h-screen container-responsive py-8">
      <h1 className="text-2xl font-semibold">Resultados</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Histórico de testes e desempenho por tema.</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<ResultadosPage />)

