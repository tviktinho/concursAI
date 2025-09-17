import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import '../index.css'
import Layout from '../components/Layout.jsx'
import { apiFetch } from '../lib/api.js'
import { Button, Card } from '../components/ui/index.js'

function RelatoriosPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/admin/reports')
      setReports(data)
    } catch (err) {
      setError(err.message || 'Erro ao carregar relatorios.')
    } finally {
      setLoading(false)
    }
  }

  async function resolveReport(report) {
    if (!report.question_id) {
      setError('Questao nao informada para este reporte.')
      return
    }
    setMessage('')
    setError('')
    try {
      await apiFetch(`/admin/questions/${report.question_id}/resolve-reports`, { method: 'PUT' })
      setMessage('Reportes relacionados resolvidos.')
      load()
    } catch (err) {
      setError(err.message || 'Erro ao resolver reporte.')
    }
  }

  return (
    <Layout title="Relatorios de questoes">
      {loading && <p className="text-sm text-slate-500">Carregando relatorios...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {!loading && (
        <div className="grid gap-3">
          {reports.length === 0 && <Card>Nenhum reporte pendente.</Card>}
          {reports.map((report) => (
            <Card
              key={report.id}
              title={`Questao #${report.question_id || '—'}`}
              description={new Date(report.reported_at).toLocaleString('pt-BR')}
              actions={(
                <Button size="sm" onClick={() => resolveReport(report)}>
                  Resolver
                </Button>
              )}
            >
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">{report.question}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span>Status: {report.status}</span>
                <span>Tipo: {report.error_type}</span>
                <span>Reportado por: {report.reported_by}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{report.details}</p>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<RelatoriosPage />)

