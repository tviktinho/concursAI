import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import '../index.css'
import Layout from '../components/Layout.jsx'
import { API_URL } from '../lib/api.js'
import { setToken } from '../lib/auth.js'
import { Button, Input, Card } from '../components/ui/index.js'

const ENABLE_BASIC_LOGIN = import.meta.env.VITE_ENABLE_BASIC_LOGIN !== 'false'

function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginIdentifier: identifier, password }),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Credenciais invalidas.')
      }
      const data = await response.json()
      if (data?.token) {
        setToken(data.token)
        window.location.href = '/index.html'
      } else {
        setError('Resposta inesperada do servidor.')
      }
    } catch (err) {
      setError(err.message || 'Nao foi possivel autenticar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Entrar">
      <div className="mx-auto max-w-md space-y-4">
        <Card>
          <Button onClick={handleGoogle} className="w-full">
            Entrar com Google
          </Button>
        </Card>

        {ENABLE_BASIC_LOGIN && (
          <Card title="Login manual" description="Use apenas em ambientes de teste.">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="identifier">Usuario ou email</label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">Senha</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full" variant="secondary">
                {loading ? 'Entrando...' : 'Entrar manualmente'}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<LoginPage />)
