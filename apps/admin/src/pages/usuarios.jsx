import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import '../index.css'
import Layout from '../components/Layout.jsx'
import { apiFetch } from '../lib/api.js'
import { Button, Input, Card, Table, THead, TBody, TR, TH, TD } from '../components/ui/index.js'

function UsuariosPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [drafts, setDrafts] = useState({})
  const [saving, setSaving] = useState({})

  useEffect(() => {
    apiFetch('/admin/users')
      .then((data) => {
        setUsers(data)
        const initial = {}
        data.forEach((user) => {
          initial[user.id] = {
            is_pay: !!user.is_pay,
            subscription_expires_at: user.subscription_expires_at ? user.subscription_expires_at.slice(0, 10) : '',
          }
        })
        setDrafts(initial)
      })
      .catch((err) => setError(err.message || 'Erro ao carregar usuarios.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!query) return users
    const term = query.toLowerCase()
    return users.filter((user) => [user.name, user.username, user.email].some((field) => field && field.toLowerCase().includes(term)))
  }, [users, query])

  function updateDraft(id, key, value) {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }))
  }

  async function saveUser(id) {
    const draft = drafts[id]
    if (!draft) return
    setSaving((prev) => ({ ...prev, [id]: true }))
    setMessage('')
    setError('')
    try {
      const payload = {
        is_pay: !!draft.is_pay,
        subscription_expires_at: draft.subscription_expires_at || null,
      }
      const updated = await apiFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...updated } : user)))
      setMessage(`Usuario ${updated.username || updated.id} atualizado.`)
    } catch (err) {
      setError(err.message || 'Nao foi possivel atualizar o usuario.')
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }))
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('Excluir este usuario? Esta acao e irreversivel.')) return
    setSaving((prev) => ({ ...prev, [id]: true }))
    setMessage('')
    setError('')
    try {
      await apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
      setUsers((prev) => prev.filter((user) => user.id !== id))
      setMessage('Usuario excluido com sucesso.')
    } catch (err) {
      setError(err.message || 'Erro ao excluir usuario.')
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <Layout title="Usuarios">
      {loading && <p className="text-sm text-slate-500">Carregando usuarios...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {!loading && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, usuario ou email"
              className="w-full max-w-md"
            />
            <span className="text-xs text-slate-500">{filtered.length} usuarios</span>
          </div>

          <Table>
            <THead>
              <TR>
                <TH>Nome</TH>
                <TH>Usuario</TH>
                <TH>Email</TH>
                <TH>VIP</TH>
                <TH>Assinatura expira</TH>
                <TH>Acoes</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.length === 0 && (
                <TR>
                  <TD colSpan={6} className="text-center text-sm text-slate-500">Nenhum usuario encontrado.</TD>
                </TR>
              )}
              {filtered.map((user) => {
                const draft = drafts[user.id] || { is_pay: user.is_pay, subscription_expires_at: user.subscription_expires_at ? user.subscription_expires_at.slice(0, 10) : '' }
                return (
                  <TR key={user.id}>
                    <TD>{user.name || '—'}</TD>
                    <TD className="font-medium">{user.username}</TD>
                    <TD>{user.email || '—'}</TD>
                    <TD>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!draft.is_pay}
                          onChange={(event) => updateDraft(user.id, 'is_pay', event.target.checked)}
                        />
                        <span>{draft.is_pay ? 'Sim' : 'Nao'}</span>
                      </label>
                    </TD>
                    <TD>
                      <Input
                        type="date"
                        value={draft.subscription_expires_at || ''}
                        onChange={(event) => updateDraft(user.id, 'subscription_expires_at', event.target.value)}
                        className="w-40"
                      />
                    </TD>
                    <TD>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => saveUser(user.id)} disabled={saving[user.id]} size="sm">
                          {saving[user.id] ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button onClick={() => deleteUser(user.id)} disabled={saving[user.id]} size="sm" variant="danger">
                          Excluir
                        </Button>
                      </div>
                    </TD>
                  </TR>
                )
              })}
            </TBody>
          </Table>
        </Card>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<UsuariosPage />)

