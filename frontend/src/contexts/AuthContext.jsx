import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify session on mount.
  // We deliberately catch the 401 here and set admin = null (not logged in).
  // Using the shared `api` instance is fine because the interceptor now skips
  // the redirect on public pages (/login, /register).
  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setAdmin(data.admin))
      .catch(() => {
        // 401 = not logged in, any other error = treat as logged out
        setAdmin(null)
      })
      .finally(() => setLoading(false))
  }, []) // ← empty deps: runs exactly once on mount, never loops

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setAdmin(data.admin)
    return data
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout')
    setAdmin(null)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
