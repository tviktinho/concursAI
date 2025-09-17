import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import '../index.css'
import { apiFetch } from '../lib/api.js'
import { getToken } from '../lib/auth.js'
import Layout from '../components/Layout.jsx'
import { Button, Card, Table, THead, TBody, TR, TH, TD } from '../components/ui/index.js'

function formatDate(value) {
  try {
    return new Date(value).toLocaleString('pt-BR')
  } catch (err) {
    return value
  }
}

function ResultadosPage() {
  const [items, setItems] = useState([])
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
        const data = await apiFetch('/history')
        setItems(data)
      } catch (err) {
        setError(err.message || 'Erro ao carregar historico.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const hasToken = !!getToken()

  return (
    <Layout title="Resultados">
      {!hasToken && (
        <Card>
          <p className="text-slate-600 dark:text-slate-300">Entre para visualizar o historico de quizzes realizados.</p>
          <Button as="a" href="/login.html" className="mt-3">
            Entrar
          </Button>
        </Card>
      )}

      {hasToken && (
        <Card>
          {loading && <p className="text-slate-600 dark:text-slate-300">Carregando...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {!loading && !error && (
            <Table>
              <THead>
                <TR>
                  <TH>Data</TH>
                  <TH>Acertos</TH>
                  <TH>Total</TH>
                  <TH>Percentual</TH>
                  <TH>Detalhes</TH>
                </TR>
              </THead>
              <TBody>
                {items.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="text-center text-sm text-slate-500">Nenhum resultado registrado.</TD>
                  </TR>
                )}
                {items.map((item) => (
                  <TR key={item.id}>
                    <TD>{formatDate(item.created_at)}</TD>
                    <TD>{item.score}</TD>
                    <TD>{item.total_questions}</TD>
                    <TD>{item.percentage}%</TD>
                    <TD>
                      <Button as="a" href={`/history.html?id=${item.id}`} variant="ghost" size="sm">
                        Ver detalhes
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </Card>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<ResultadosPage />)

