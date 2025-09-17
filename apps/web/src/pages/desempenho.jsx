import { createRoot } from 'react-dom/client'
import '../index.css'

function DesempenhoPage() {
  return (
    <main className="min-h-screen container-responsive py-8">
      <h1 className="text-2xl font-semibold">Desempenho</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Métricas de acertos, tempo e evolução.</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<DesempenhoPage />)

