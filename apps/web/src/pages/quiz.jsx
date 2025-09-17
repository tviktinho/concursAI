import { createRoot } from 'react-dom/client'
import '../index.css'

function QuizPage() {
  return (
    <main className="min-h-screen container-responsive py-8">
      <h1 className="text-2xl font-semibold">Quiz</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Em breve: integração com perguntas, timer e resultados.</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<QuizPage />)

