import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import '../index.css'
import { apiFetch } from '../lib/api.js'
import { getToken } from '../lib/auth.js'
import Layout from '../components/Layout.jsx'
import { Button, Card } from '../components/ui/index.js'

function HistoryDetails() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    if (!id) {
      setError('ID do historico nao informado.')
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const data = await apiFetch(`/history/${id}`)
        setRows(data)
      } catch (err) {
        setError(err.message || 'Erro ao carregar detalhes.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const hasToken = !!getToken()

  return (
    <Layout title="Detalhes do historico">
      {!hasToken && (
        <Card>
          <p className="text-slate-600 dark:text-slate-300">Entre para visualizar os detalhes.</p>
          <Button as="a" href="/login.html" className="mt-3">
            Entrar
          </Button>
        </Card>
      )}

      {hasToken && (
        <div className="space-y-4">
          <Button as="a" href="/resultados.html" variant="ghost" size="sm">
            Voltar para resultados
          </Button>
          {loading && <p className="text-slate-600 dark:text-slate-300">Carregando...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {!loading && !error && (
            <div className="grid gap-3">
              {rows.length === 0 && <Card>Nenhum dado localizado.</Card>}
              {rows.map((row, index) => (
                <Card key={index}>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{row.question}</div>
                  <div className="mt-2 text-sm">
                    <span className="font-semibold">Escolhida:</span> {row.selected_option ?? 'Nenhuma'}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Correta:</span> {row.correct_answer}
                  </div>
                  <div className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs ${row.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {row.is_correct ? 'Acertou' : 'Errou'}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<HistoryDetails />)

