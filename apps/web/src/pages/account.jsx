import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import '../index.css'
import Layout from '../components/Layout.jsx'
import { apiFetch } from '../lib/api.js'
import { getToken, setUser } from '../lib/auth.js'
import { Button, Input, Card } from '../components/ui/index.js'

function AccountPage() {
  const [form, setForm] = useState(null)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingTags, setSavingTags] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = getToken()
  const hasToken = !!token

  useEffect(() => {
    if (!hasToken) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const account = await apiFetch('/account/me')
        setForm(account)
        setUser(account)
        const storedTags = await apiFetch('/account/tags')
        if (Array.isArray(storedTags)) setTags(storedTags)
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados da conta.')
      } finally {
        setLoading(false)
      }
    })()
  }, [hasToken])

  async function saveProfile(event) {
    event.preventDefault()
    if (!form) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = { name: form.name }
      const updated = await apiFetch('/account/me', { method: 'PUT', body: JSON.stringify(payload) })
      setForm((prev) => ({ ...prev, ...updated }))
      setUser(updated)
      setMessage('Informacoes atualizadas com sucesso.')
    } catch (err) {
      setError(err.message || 'Erro ao salvar dados.')
    } finally {
      setSaving(false)
    }
  }

  async function persistTags(nextTags) {
    setSavingTags(true)
    setError('')
    setMessage('')
    try {
      await apiFetch('/account/tags', {
        method: 'PUT',
        body: JSON.stringify({ tags: nextTags }),
      })
      setTags(nextTags)
      setMessage('Tags atualizadas.')
    } catch (err) {
      setError(err.message || 'Erro ao atualizar tags.')
    } finally {
      setSavingTags(false)
    }
  }

  function handleAddTag(event) {
    event.preventDefault()
    const value = tagInput.trim()
    if (!value || tags.includes(value)) {
      setTagInput('')
      return
    }
    persistTags([...tags, value])
    setTagInput('')
  }

  function handleRemoveTag(tag) {
    persistTags(tags.filter((item) => item !== tag))
  }

  return (
    <Layout title="Minha conta">
      {!hasToken && (
        <Card>
          <p className="text-slate-600 dark:text-slate-300">Entre para gerenciar as informacoes da sua conta.</p>
          <Button as="a" href="/login.html" className="mt-3">
            Entrar
          </Button>
        </Card>
      )}

      {hasToken && (
        <div className="space-y-4">
          {loading && <p className="text-slate-600 dark:text-slate-300">Carregando dados...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-emerald-600 text-sm">{message}</p>}

          {!loading && form && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card title="Dados basicos" description="Atualize seu nome de exibicao.">
                <form onSubmit={saveProfile} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Nome</label>
                    <Input id="name" value={form.name ?? ''} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="username">Usuario</label>
                    <Input id="username" value={form.username ?? ''} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <Input id="email" value={form.email ?? ''} disabled />
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar alteracoes'}
                  </Button>
                </form>
              </Card>

              <Card title="Tags" description="Use tags para organizar seus interesses.">
                <div className="flex flex-wrap gap-2">
                  {tags.length === 0 && <span className="text-sm text-slate-500">Nenhuma tag cadastrada.</span>}
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="font-semibold">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <form onSubmit={handleAddTag} className="mt-4 flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    placeholder="Nova tag"
                  />
                  <Button type="submit" variant="outline" disabled={savingTags}>
                    Adicionar
                  </Button>
                </form>
              </Card>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<AccountPage />)

