import './App.css'
import Layout from './components/Layout.jsx'
import { getToken } from './lib/auth.js'
import { Button } from './components/ui/index.js'

function App() {
  const authed = !!getToken()
  return (
    <Layout>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Estude para concursos com mais eficiencia</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Refatoramos o frontend com React + Tailwind e mantivemos os mesmos endpoints, garantindo uma experiencia consistente enquanto
          aprimoramos performance, acessibilidade e organizacao do codigo.
        </p>
        <div className="flex gap-3">
          <Button as="a" href="/quiz.html">
            Comecar agora
          </Button>
          {!authed && (
            <Button as="a" href="/login.html" variant="outline">
              Entrar
            </Button>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default App

