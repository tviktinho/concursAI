import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import '../index.css'
import { apiFetch } from '../lib/api.js'
import { getToken } from '../lib/auth.js'
import Layout from '../components/Layout.jsx'
import { Button, Select, Input, Card } from '../components/ui/index.js'

function QuizPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [themes, setThemes] = useState([])
  const [selected, setSelected] = useState([])
  const [difficulty, setDifficulty] = useState('')
  const [count, setCount] = useState(10)

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const data = await apiFetch('/themes')
        setThemes(data)
      } catch (err) {
        setError(err.message || 'Erro ao carregar temas.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const hasToken = !!getToken()
  const inProgress = questions.length > 0
  const canStart = selected.length > 0 && !inProgress

  async function startQuiz() {
    if (!canStart) return
    setError('')
    try {
      const body = { themeIds: selected, count }
      if (difficulty) body.difficulties = [difficulty]
      const list = await apiFetch('/questions', { method: 'POST', body: JSON.stringify(body) })
      setQuestions(list)
      setCurrent(0)
      setAnswers({})
    } catch (err) {
      setError(err.message || 'Erro ao inicializar quiz.')
    }
  }

  const currentQuestion = useMemo(() => questions[current], [questions, current])

  function chooseOption(id, option) {
    setAnswers((prev) => ({ ...prev, [id]: option }))
  }

  function goNext() {
    if (current < questions.length - 1) setCurrent((prev) => prev + 1)
  }

  function goPrev() {
    if (current > 0) setCurrent((prev) => prev - 1)
  }

  async function finishQuiz() {
    try {
      setFinishing(true)
      let score = 0
      const payloadAnswers = questions.map((question) => {
        const selectedOption = answers[question.id]
        const correct = selectedOption === question.answer
        if (correct) score += 1
        return {
          questionId: question.id,
          selectedOption: selectedOption ?? null,
          isCorrect: !!correct,
        }
      })
      await apiFetch('/quiz/finish', {
        method: 'POST',
        body: JSON.stringify({ score, totalQuestions: questions.length, answers: payloadAnswers }),
      })
      window.location.href = '/resultados.html'
    } catch (err) {
      setError(err.message || 'Erro ao finalizar quiz.')
    } finally {
      setFinishing(false)
    }
  }

  return (
    <Layout title="Quiz">
      {!hasToken && (
        <Card>
          <p className="text-slate-600 dark:text-slate-300">Voce precisa entrar para iniciar um quiz.</p>
          <Button as="a" href="/login.html" className="mt-3">
            Entrar
          </Button>
        </Card>
      )}

      {hasToken && (
        <div className="space-y-6">
          {loading && <p className="text-slate-600 dark:text-slate-300">Carregando temas...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && !inProgress && (
            <div className="space-y-4">
              <Card title="Selecione temas" description="Escolha ao menos um tema para gerar o quiz.">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {themes.map((theme) => {
                    const checked = selected.includes(theme.id)
                    return (
                      <label
                        key={theme.id}
                        className={`flex items-center gap-2 rounded border p-3 text-sm ${checked ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 dark:border-slate-800'}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            setSelected((prev) => (event.target.checked ? [...prev, theme.id] : prev.filter((id) => id !== theme.id)))
                          }}
                        />
                        <span className="flex-1">
                          <span className="font-medium">{theme.name}</span>
                          <span className="ml-2 text-xs text-slate-500">{theme.question_count ?? 0} questoes</span>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </Card>

              <Card title="Configuracoes" description="Ajuste dificuldade e quantidade de questoes.">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="w-full max-w-xs">
                    <label className="block text-sm font-medium mb-1" htmlFor="difficulty">Dificuldade</label>
                    <Select id="difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                      <option value="">Qualquer</option>
                      <option value="easy">Facil</option>
                      <option value="medium">Media</option>
                      <option value="hard">Dificil</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="question-count">Quantidade</label>
                    <Input
                      id="question-count"
                      type="number"
                      min={1}
                      max={50}
                      value={count}
                      onChange={(event) => setCount(parseInt(event.target.value || '1', 10))}
                      className="w-28"
                    />
                  </div>
                  <Button onClick={startQuiz} disabled={!canStart} variant={canStart ? 'primary' : 'ghost'}>
                    Iniciar Quiz
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {inProgress && currentQuestion && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Questao {current + 1} de {questions.length}
                </div>
                <Button onClick={finishQuiz} disabled={finishing} variant="secondary">
                  {finishing ? 'Enviando...' : 'Finalizar'}
                </Button>
              </div>

              <Card>
                <p className="font-medium">{currentQuestion.question}</p>
                <div className="mt-3 grid gap-2">
                  {Array.isArray(currentQuestion.options) ? (
                    currentQuestion.options.map((option, index) => {
                      const checked = answers[currentQuestion.id] === option
                      return (
                        <label
                          key={index}
                          className={`flex items-center gap-2 rounded border p-2 text-sm ${checked ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 dark:border-slate-800'}`}
                        >
                          <input
                            type="radio"
                            name={`question_${currentQuestion.id}`}
                            checked={checked}
                            onChange={() => chooseOption(currentQuestion.id, option)}
                          />
                          <span>{option}</span>
                        </label>
                      )
                    })
                  ) : (
                    <em className="text-sm text-slate-500">Opcoes indisponiveis.</em>
                  )}
                </div>
              </Card>

              <div className="flex justify-between">
                <Button onClick={goPrev} disabled={current === 0} variant="outline">
                  Anterior
                </Button>
                <Button onClick={goNext} disabled={current >= questions.length - 1}>
                  Proxima
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<QuizPage />)

