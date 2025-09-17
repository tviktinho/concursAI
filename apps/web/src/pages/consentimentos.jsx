import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import '../index.css'
import Layout from '../components/Layout.jsx'
import { apiFetch } from '../lib/api.js'
import { getToken } from '../lib/auth.js'
import { Button, Card } from '../components/ui/index.js'

const TOGGLES = [
  { key: 'performance_analysis', label: 'Analise de desempenho', description: 'Permite usar seus dados para melhorar estatisticas e recomendacoes.' },
  { key: 'personalization', label: 'Personalizacao', description: 'Ajusta o conteudo exibido com base em suas preferencias.' },
  { key: 'marketing_emails', label: 'Emails de novidades', description: 'Recebe comunicados, atualizacoes e promocoes.' },
  { key: 'analytics_cookies', label: 'Cookies de analytics', description: 'Coleta dados anonimos de uso para aprimoramentos.' },
]

function RequestCard({ request }) {
  const statusLabels = {
    pending: { text: 'Pendente', className: 'bg-amber-100 text-amber-800' },
    processing: { text: 'Processando', className: 'bg-blue-100 text-blue-800' },
    completed: { text: 'Concluido', className: 'bg-emerald-100 text-emerald-800' },
    cancelled: { text: 'Cancelado', className: 'bg-slate-200 text-slate-700' },
    denied: { text: 'Negado', className: 'bg-red-100 text-red-800' },
  }
  const status = statusLabels[request.status] || statusLabels.pending
  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium capitalize">{request.request_type}</span>
        <span className={`text-xs px-2 py-1 rounded ${status.className}`}>{status.text}</span>
      </div>
      <div className="text-xs text-slate-500">Solicitado em {new Date(request.requested_at).toLocaleString('pt-BR')}</div>
      {request.response_details && <p className="text-sm text-slate-600 dark:text-slate-300">{request.response_details}</p>}
    </Card>
  )
}

function ConsentimentosPage() {
  const [consents, setConsents] = useState(() => {
    const initial = {}
    TOGGLES.forEach(({ key }) => { initial[key] = false })
    return initial
  })
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)

  const token = getToken()
  const hasToken = !!token

  useEffect(() => {
    if (!hasToken) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const consentData = await apiFetch('/user/consents')
        if (consentData?.success && consentData.consents) {
          setConsents((prev) => ({ ...prev, ...consentData.consents }))
        }
      } catch (err) {
        // 404 significa que ainda nao ha registro
      }
      try {
        const requestData = await apiFetch('/user/data-requests')
        if (requestData?.success && Array.isArray(requestData.requests)) setRequests(requestData.requests)
      } catch (err) {
        setError(err.message || 'Erro ao carregar solicitacoes.')
      } finally {
        setLoading(false)
      }
    })()
  }, [hasToken])

  function toggleConsent(key) {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function saveConsents() {
    setProcessing(true)
    setMessage('')
    setError('')
    try {
      await apiFetch('/user/consents', {
        method: 'PUT',
        body: JSON.stringify({
          consents: {
            performance: consents.performance_analysis,
            personalization: consents.personalization,
            marketing: consents.marketing_emails,
            analytics: consents.analytics_cookies,
          },
        }),
      })
      setMessage('Preferencias atualizadas.')
    } catch (err) {
      setError(err.message || 'Erro ao salvar consentimentos.')
    } finally {
      setProcessing(false)
    }
  }

  async function handleAction(path, body, successMessage) {
    setProcessing(true)
    setMessage('')
    setError('')
    try {
      await apiFetch(path, { method: 'POST', body: JSON.stringify(body || {}) })
      setMessage(successMessage)
      const requestData = await apiFetch('/user/data-requests')
      if (requestData?.success && Array.isArray(requestData.requests)) setRequests(requestData.requests)
    } catch (err) {
      setError(err.message || 'Operacao nao pode ser concluida.')
    } finally {
      setProcessing(false)
    }
  }

  function requestExport() {
    handleAction('/user/export-data', null, 'Solicitacao de exportacao registrada. Verifique seu e-mail em breve.')
  }

  function requestDeletion() {
    const confirmation = window.prompt('Para confirmar a exclusao definitiva, digite: EXCLUIR MINHA CONTA')
    if (!confirmation) return
    handleAction('/user/delete-account', { confirmation }, 'Solicitacao de exclusao registrada. Voce pode cancelar em ate 30 dias.')
  }

  function cancelDeletion() {
    handleAction('/user/cancel-deletion', null, 'Solicitacao de exclusao cancelada.')
  }

  return (
    <Layout title="Consentimentos e privacidade">
      {!hasToken && (
        <Card>
          <p className="text-slate-600 dark:text-slate-300">Entre para gerenciar seus consentimentos e solicitacoes LGPD.</p>
          <Button as="a" href="/login.html" className="mt-3">
            Entrar
          </Button>
        </Card>
      )}

      {hasToken && (
        <div className="space-y-4">
          {loading && <p className="text-slate-600 dark:text-slate-300">Carregando preferencias...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-emerald-600 text-sm">{message}</p>}

          {!loading && (
            <>
              <Card title="Preferencias" description="Escolha os consentimentos opcionais.">
                <div className="space-y-3">
                  {TOGGLES.map(({ key, label, description }) => (
                    <label key={key} className={`flex items-start gap-3 rounded border p-3 ${consents[key] ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 dark:border-slate-800'}`}>
                      <input type="checkbox" checked={!!consents[key]} onChange={() => toggleConsent(key)} className="mt-1" />
                      <span>
                        <span className="block font-medium">{label}</span>
                        <span className="block text-sm text-slate-500">{description}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <Button onClick={saveConsents} disabled={processing} className="mt-4">
                  {processing ? 'Salvando...' : 'Salvar preferencias'}
                </Button>
              </Card>

              <Card title="Solicitacoes LGPD" description="Gerencie exportacao e exclusao de dados.">
                <div className="flex flex-wrap gap-3">
                  <Button onClick={requestExport} disabled={processing} variant="outline">Exportar dados</Button>
                  <Button onClick={requestDeletion} disabled={processing} variant="danger">Excluir conta</Button>
                  <Button onClick={cancelDeletion} disabled={processing} variant="ghost">Cancelar exclusao</Button>
                </div>
              </Card>

              <Card title="Historico de solicitacoes">
                {requests.length === 0 && <p className="text-sm text-slate-500">Nenhuma solicitacao registrada.</p>}
                <div className="grid gap-3">
                  {requests.map((request) => (
                    <RequestCard key={`${request.request_type}-${request.requested_at}`} request={request} />
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<ConsentimentosPage />)
