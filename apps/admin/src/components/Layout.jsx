import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api.js'
import { getToken, clearSession, getUser as getCachedUser, setUser as cacheUser } from '../lib/auth.js'
import { Button, classNames } from './ui/index.js'

const NAV_ITEMS = [
  { href: '/index.html', label: 'Dashboard' },
  { href: '/usuarios.html', label: 'Usuarios' },
  { href: '/temas.html', label: 'Temas' },
  { href: '/categorias.html', label: 'Categorias' },
  { href: '/relatorios.html', label: 'Relatorios' },
]

export default function Layout({ title, children }) {
  const [user, setUser] = useState(() => getCachedUser())
  const [error, setError] = useState('')
  const token = getToken()

  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }
    apiFetch('/account/me')
      .then((data) => {
        cacheUser(data)
        setUser(data)
        setError('')
      })
      .catch((err) => {
        setError(err.message || 'Nao foi possivel carregar seus dados.')
      })
  }, [token])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur">
        <div className="container-responsive flex items-center justify-between h-14">
          <a href="/index.html" className="font-semibold">Concursando - Admin</a>
          <nav className="flex items-center gap-4 text-sm">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-brand-500">{item.label}</a>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                clearSession()
                window.location.href = '/login.html'
              }}
            >
              Sair
            </Button>
          </nav>
        </div>
      </header>

      <div className="container-responsive flex-1 w-full py-6 space-y-6">
        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {children}
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-xs text-slate-500">
        <div className="container-responsive flex items-center justify-between">
          <span>{new Date().getFullYear()} Concursando</span>
          {user?.username && <span>Admin: {user.username}</span>}
        </div>
      </footer>
    </div>
  )
}
