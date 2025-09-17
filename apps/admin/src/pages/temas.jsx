import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import '../index.css'
import Layout from '../components/Layout.jsx'
import { apiFetch } from '../lib/api.js'
import { Button, Select, Card } from '../components/ui/index.js'

function flattenCategories(nodes, depth = 0, acc = []) {
  nodes.forEach((node) => {
    const prefix = depth > 0 ? `${'- '.repeat(depth)}` : ''
    acc.push({ id: node.id, label: `${prefix}${node.name}` })
    if (node.children && node.children.length > 0) flattenCategories(node.children, depth + 1, acc)
  })
  return acc
}

function TemasPage() {
  const [themes, setThemes] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState({})

  useEffect(() => {
    async function load() {
      try {
        const [themeData, categoryTree] = await Promise.all([
          apiFetch('/themes'),
          apiFetch('/admin/categories'),
        ])
        setThemes(themeData)
        setCategories(flattenCategories(categoryTree))
      } catch (err) {
        setError(err.message || 'Erro ao carregar temas.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredThemes = useMemo(() => {
    if (!selectedCategory) return themes
    const id = parseInt(selectedCategory, 10)
    return themes.filter((theme) => theme.category_id === id)
  }, [themes, selectedCategory])

  async function updateThemeCategory(theme, categoryId) {
    setSaving((prev) => ({ ...prev, [theme.id]: true }))
    setError('')
    setMessage('')
    try {
      const updated = await apiFetch(`/admin/themes/${theme.id}`, {
        method: 'PUT',
        body: JSON.stringify({ categoryId: categoryId || null }),
      })
      setThemes((prev) => prev.map((item) => (item.id === theme.id ? { ...item, category_id: updated.category_id } : item)))
      setMessage(`Tema ${theme.name} atualizado.`)
    } catch (err) {
      setError(err.message || 'Erro ao atualizar tema.')
    } finally {
      setSaving((prev) => ({ ...prev, [theme.id]: false }))
    }
  }

  async function deleteTheme(theme) {
    if (!window.confirm(`Excluir tema "${theme.name}" e suas questoes?`)) return
    setSaving((prev) => ({ ...prev, [theme.id]: true }))
    setError('')
    setMessage('')
    try {
      await apiFetch(`/admin/themes/${theme.id}`, { method: 'DELETE' })
      setThemes((prev) => prev.filter((item) => item.id !== theme.id))
      setMessage('Tema excluido com sucesso.')
    } catch (err) {
      setError(err.message || 'Erro ao excluir tema.')
    } finally {
      setSaving((prev) => ({ ...prev, [theme.id]: false }))
    }
  }

  return (
    <Layout title="Temas">
      {loading && <p className="text-sm text-slate-500">Carregando temas...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {!loading && (
        <div className="space-y-4">
          <Card title="Filtros">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="w-full max-w-xs">
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </Select>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory('')}>
                Limpar filtro
              </Button>
            </div>
          </Card>

          <div className="grid gap-3">
            {filteredThemes.map((theme) => (
              <Card key={theme.id} title={theme.name} description={`${theme.question_count || 0} questoes`}>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={theme.category_id || ''}
                    onChange={(event) => updateThemeCategory(theme, event.target.value || null)}
                    disabled={saving[theme.id]}
                    className="w-full max-w-xs"
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </Select>
                  <Button onClick={() => deleteTheme(theme)} disabled={saving[theme.id]} size="sm" variant="danger">
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
            {filteredThemes.length === 0 && <Card>Nenhum tema encontrado para o filtro atual.</Card>}
          </div>
        </div>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<TemasPage />)
