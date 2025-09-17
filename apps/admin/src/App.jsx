import './App.css'
import { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout.jsx'
import { apiFetch } from './lib/api.js'
import { Button, Card, Select, Input } from './components/ui/index.js'

function StatCard({ label, value, highlighted = false }) {
  return (
    <Card className={highlighted ? 'bg-brand-50/60 dark:bg-brand-900/20' : ''}>
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </Card>
  )
}

function BarList({ items, valueKey = 'count', labelKey = 'label', max }) {
  const maxValue = max ?? Math.max(1, ...items.map((item) => Number(item[valueKey]) || 0))
  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const value = Number(item[valueKey]) || 0
        const width = `${Math.max(4, Math.round((value / maxValue) * 100))}%`
        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{item[labelKey]}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{value}</span>
            </div>
            <div className="h-2 rounded bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded bg-brand-500" style={{ width }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SessionsChart({ sessions }) {
  if (sessions.length === 0) {
    return <p className="text-sm text-slate-500">Sem sessoes registradas.</p>
  }
  const maxValue = Math.max(1, ...sessions.map((item) => item.count))
  return (
    <div className="flex h-32 items-end gap-2">
      {sessions.map((item) => {
        const height = `${Math.max(10, Math.round((item.count / maxValue) * 100))}%`
        return (
          <div key={item.date} className="flex-1 text-center text-xs text-slate-500">
            <div className="mx-auto mb-2 w-full max-w-[24px] rounded bg-brand-500" style={{ height }} />
            <div>{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
          </div>
        )
      })}
    </div>
  )
}

function App() {
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [minCategoryCount, setMinCategoryCount] = useState(0)
  const [timeframe, setTimeframe] = useState(7)

  useEffect(() => {
    apiFetch('/admin/dashboard/metrics')
      .then((data) => setMetrics(data))
      .catch((err) => setError(err.message || 'Nao foi possivel carregar metricas.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredDifficulty = useMemo(() => {
    if (!metrics) return []
    if (difficultyFilter === 'all') return metrics.questionStats.byDifficulty
    return metrics.questionStats.byDifficulty.filter((item) => (item.difficulty || '').toLowerCase() === difficultyFilter)
  }, [metrics, difficultyFilter])

  const filteredCategories = useMemo(() => {
    if (!metrics) return []
    return metrics.questionStats.byCategory.filter((item) => item.count >= Number(minCategoryCount || 0))
  }, [metrics, minCategoryCount])

  const filteredSessions = useMemo(() => {
    if (!metrics) return []
    const sorted = [...metrics.activity.sessionsPerDay].sort((a, b) => new Date(a.date) - new Date(b.date))
    return sorted.slice(-Number(timeframe || 7))
  }, [metrics, timeframe])

  return (
    <Layout title="Visao geral">
      {loading && <p className="text-sm text-slate-500">Carregando metricas...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {metrics && (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3">Resumo</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="Usuarios" value={metrics.overview.totalUsers} highlighted />
              <StatCard label="Questoes" value={metrics.overview.totalQuestions} />
              <StatCard label="Categorias" value={metrics.overview.totalCategories} />
              <StatCard label="Temas" value={metrics.overview.totalThemes} />
              <StatCard label="Relatorios" value={metrics.overview.totalReports} />
              <StatCard label="Usuarios ativos (30d)" value={metrics.overview.activeUsers} />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card title="Questoes por dificuldade" description="Visualize a distribuicao de questoes.">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)} className="w-full max-w-xs">
                  <option value="all">Todas</option>
                  <option value="easy">Facil</option>
                  <option value="medium">Media</option>
                  <option value="hard">Dificil</option>
                  <option value="n/a">N/A</option>
                </Select>
              </div>
              {filteredDifficulty.length === 0 ? (
                <p className="text-sm text-slate-500">Sem dados para o filtro selecionado.</p>
              ) : (
                <BarList
                  items={filteredDifficulty.map((item) => ({ label: item.difficulty, count: item.count }))}
                />
              )}
            </Card>

            <Card title="Questoes por categoria" description="Filtre por volume minimo de questoes.">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Input
                  type="number"
                  min={0}
                  value={minCategoryCount}
                  onChange={(event) => setMinCategoryCount(event.target.value)}
                  className="w-full max-w-[160px]"
                  placeholder="Minimo de questoes"
                />
                <Button variant="ghost" size="sm" onClick={() => setMinCategoryCount(0)}>
                  Limpar filtro
                </Button>
              </div>
              {filteredCategories.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma categoria atende ao filtro.</p>
              ) : (
                <BarList items={filteredCategories.map((item) => ({ label: item.category, count: item.count }))} />
              )}
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card title="Relatorios por status">
              {metrics.reports.byStatus.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum relatorio registrado.</p>
              ) : (
                <BarList items={metrics.reports.byStatus.map((item) => ({ label: item.status, count: item.count }))} />
              )}
            </Card>

            <Card title="Top usuarios" description="Usuarios com mais atividade recente.">
              {metrics.activity.topUsers.length === 0 ? (
                <p className="text-sm text-slate-500">Sem dados suficientes.</p>
              ) : (
                <div className="space-y-2">
                  {metrics.activity.topUsers.map((user, index) => (
                    <div key={`${user.username}-${index}`} className="rounded border border-slate-200 dark:border-slate-800 p-3">
                      <div className="font-medium text-sm">{user.username}</div>
                      <div className="text-xs text-slate-500">{user.email || 'sem email'}</div>
                      <div className="text-xs mt-1">Quizzes: {user.quizCount}</div>
                      {user.lastActivity && <div className="text-xs text-slate-500">Ultima atividade: {new Date(user.lastActivity).toLocaleString('pt-BR')}</div>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card title="Sessoes por dia" description="Selecione o horizonte de dias para visualizar.">
              <div className="flex items-center gap-3 mb-4">
                <Select value={timeframe} onChange={(event) => setTimeframe(event.target.value)} className="w-32">
                  <option value={7}>7 dias</option>
                  <option value={14}>14 dias</option>
                  <option value={30}>30 dias</option>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => setTimeframe(7)}>
                  Padrao
                </Button>
              </div>
              <SessionsChart sessions={filteredSessions} />
            </Card>

            <Card title="Estatisticas de desempenho">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Media de score</span>
                  <span className="font-medium">{metrics.performance.avgScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimo</span>
                  <span className="font-medium">{metrics.performance.minScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Maximo</span>
                  <span className="font-medium">{metrics.performance.maxScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total de sessoes</span>
                  <span className="font-medium">{metrics.performance.totalSessions}</span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      )}
    </Layout>
  )
}

export default App

