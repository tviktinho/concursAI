import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import '../index.css'
import { apiFetch } from '../lib/api.js'
import { getToken } from '../lib/auth.js'
import Layout from '../components/Layout.jsx'
import { Button, Card } from '../components/ui/index.js'

function Stat({ title, value }) {
  return (
    <Card className="p-4" title={title}>
      <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </Card>
  )
}

function DesempenhoPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const data = await apiFetch('/user/stats')
        setStats(data)
      } catch (err) {
        setError(err.message || 'Erro ao carregar desempenho.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const hasToken = !!getToken()

  return (
    <Layout title="Desempenho">
      {!hasToken && (
        <Card>
          <p className="text-slate-600 dark:text-slate-300">Entre para visualizar suas estatisticas.</p>
          <Button as="a" href="/login.html" className="mt-3">
            Entrar
          </Button>
        </Card>
      )}

      {hasToken && (
        <div className="space-y-4">
          {loading && <p className="text-slate-600 dark:text-slate-300">Carregando...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {stats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat title="Precisao" value={`${stats.accuracy ?? 0}%`} />
              <Stat title="Quizzes" value={stats.totalQuizzes ?? 0} />
              <Stat title="Media" value={stats.averageScore ?? 0} />
              <Stat title="Melhor" value={stats.bestScore ?? 0} />
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<DesempenhoPage />)
