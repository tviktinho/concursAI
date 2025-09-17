import { createRoot } from 'react-dom/client'
import '../index.css'

function UsuariosPage() {
  return (
    <main className="min-h-screen container-responsive py-8">
      <h1 className="text-2xl font-semibold">Usuários</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Lista, filtros e ações de administração de usuários virão aqui.</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<UsuariosPage />)

