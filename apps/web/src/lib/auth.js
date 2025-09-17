const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function getToken() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) || '' : ''
}

export function setToken(token) {
  if (typeof localStorage === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function clearSession() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function setUser(user) {
  if (typeof localStorage === 'undefined') return
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function getUser() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (e) {
    console.warn('Invalid user cache, clearing', e)
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function isAuthenticated() {
  return !!getToken()
}

