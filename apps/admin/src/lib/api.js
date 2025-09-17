import { getToken, clearSession } from './auth.js'

const API_URL = import.meta.env.VITE_API_URL || ''

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      clearSession()
      if (typeof window !== 'undefined') {
        window.location.href = '/login.html'
      }
    }
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export { API_URL }

