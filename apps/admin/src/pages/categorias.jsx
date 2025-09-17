import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import '../index.css'
import Layout from '../components/Layout.jsx'
import { apiFetch } from '../lib/api.js'
import { Button, Input, Select, Card } from '../components/ui/index.js'

function flatten(nodes, acc = []) {
  nodes.forEach((node) => {
    acc.push({ id: node.id, name: node.name })
    if (node.children && node.children.length > 0) flatten(node.children, acc)
  })
  return acc
}

function CategoryNode({ node, depth = 0, onRename, onDelete, onSelectParent }) {
  return (
    <Card className="bg-white/70 dark:bg-slate-900/40" title={node.name} description={`ID: ${node.id}`} actions={(
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => onSelectParent(node)}>Definir como pai</Button>
        <Button size="sm" variant="ghost" onClick={() => onRename(node)}>Renomear</Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(node)}>Excluir</Button>
      </div>
    )}>
      {node.children && node.children.length > 0 && (
        <div className="mt-3 space-y-2" style={{ marginLeft: depth * 12 }}>
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onRename={onRename}
              onDelete={onDelete}
              onSelectParent={onSelectParent}
            />
          ))}
        </div>
      )}
    </Card>
  )
}

function CategoriasPage() {
  const [tree, setTree] = useState([])
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
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
      const data = await apiFetch('/admin/categories')
      setTree(data)
    } catch (err) {
      setError(err.message || 'Erro ao carregar categorias.')
    } finally {
      setLoading(false)
    }
  }

  const flatCategories = useMemo(() => flatten(tree), [tree])

  async function createCategory(event) {
    event.preventDefault()
    if (!name.trim()) return
    setError('')
    setMessage('')
    try {
      await apiFetch('/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), parentId: parentId || null }),
      })
      setName('')
      setParentId('')
      setMessage('Categoria criada com sucesso.')
      load()
    } catch (err) {
      setError(err.message || 'Erro ao criar categoria.')
    }
  }

  async function renameCategory(node) {
    const newName = window.prompt('Novo nome da categoria', node.name)
    if (!newName || newName.trim() === node.name) return
    setError('')
    setMessage('')
    try {
      await apiFetch(`/admin/categories/${node.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: newName.trim() }),
      })
      setMessage('Categoria renomeada.')
      load()
    } catch (err) {
      setError(err.message || 'Erro ao renomear categoria.')
    }
  }

  async function deleteCategory(node) {
    if (!window.confirm(`Excluir categoria "${node.name}" e subcategorias?`)) return
    setError('')
    setMessage('')
    try {
      await apiFetch(`/admin/categories/${node.id}`, { method: 'DELETE' })
      setMessage('Categoria removida.')
      load()
    } catch (err) {
      setError(err.message || 'Erro ao excluir categoria.')
    }
  }

  return (
    <Layout title="Categorias">
      {loading && <p className="text-sm text-slate-500">Carregando categorias...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}

      {!loading && (
        <div className="space-y-4">
          <Card title="Nova categoria">
            <form onSubmit={createCategory} className="grid gap-3 sm:grid-cols-[1fr,240px,auto] items-end">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome da categoria" />
              <Select value={parentId} onChange={(event) => setParentId(event.target.value)}>
                <option value="">Categoria principal</option>
                {flatCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
              <Button type="submit">Criar</Button>
            </form>
          </Card>

          <div className="grid gap-3">
            {tree.map((node) => (
              <CategoryNode
                key={node.id}
                node={node}
                onRename={renameCategory}
                onDelete={deleteCategory}
                onSelectParent={(cat) => setParentId(String(cat.id))}
              />
            ))}
            {tree.length === 0 && <Card>Nenhuma categoria cadastrada.</Card>}
          </div>
        </div>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<CategoriasPage />)

