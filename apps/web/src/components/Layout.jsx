import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api.js'
import { getToken, clearSession, getUser as getCachedUser, setUser as cacheUser } from '../lib/auth.js'
import { Button, classNames } from './ui/index.js'

export default function Layout({ children, title }) {
  const [user, setUser] = useState(() => getCachedUser())
  const [message, setMessage] = useState(null)
  const token = getToken()

  useEffect(() => {
    if (!token) {
      setUser(null)
      setMessage(null)
      return
    }

    if (!user) {
      apiFetch('/account/me')
        .then((data) => {
          setUser(data)
          cacheUser(data)
        })
        .catch(() => {})
    }

    apiFetch('/message')
      .then((payload) => {
        if (payload && Object.keys(payload).length > 0) {
          setMessage(payload)
        } else {
          setMessage(null)
        }
      })
      .catch(() => setMessage(null))
  }, [token])

  const navLinks = [
    { href: '/quiz.html', label: 'Quiz' },
    { href: '/resultados.html', label: 'Resultados' },
    { href: '/desempenho.html', label: 'Desempenho' },
    { href: '/account.html', label: 'Conta' },
    { href: '/consentimentos.html', label: 'Consentimentos' },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="container-responsive flex items-center justify-between h-14">
          <a href="/index.html" className="font-semibold text-slate-900 dark:text-slate-100">Concursando</a>
          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map((link) => (
              <a key={link.href} className="hover:text-brand-600" href={link.href}>{link.label}</a>
            ))}
            {!token ? (
              <Button as="a" href="/login.html" size="sm">
                Entrar
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  clearSession()
                  window.location.href = '/index.html'
                }}
              >
                Sair
              </Button>
            )}
          </nav>
        </div>
      </header>

      {title && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/30">
          <div className="container-responsive py-6">
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
        </div>
      )}

      {message && (
        <div className="bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
          <div className="container-responsive py-2 text-sm flex items-center gap-3">
            <span className="font-medium">Aviso:</span>
            <span>{message.message || message.text || 'Mensagem do sistema'}</span>
          </div>
        </div>
      )}

      <section className={classNames('container-responsive flex-1 py-8', title ? '' : '')}>
        {children}
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-sm text-slate-500 mt-8">
        <div className="container-responsive flex flex-wrap items-center justify-between gap-2">
          <span>{new Date().getFullYear()} Concursando</span>
          {user && <span className="text-xs">Logado como {user.name || user.username}</span>}
        </div>
      </footer>
    </main>
  )
}

