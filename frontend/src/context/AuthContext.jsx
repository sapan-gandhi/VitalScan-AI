import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('vs_token') || null)
  const [loading, setLoading] = useState(true)

  // On mount — verify stored token is still valid
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return }
      try {
        const data = await authAPI.getMe(token)
        if (data.success) setUser(data.user)
        else              logout()
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])  // eslint-disable-line

  const login = useCallback(async (email, password) => {
    const data = await authAPI.login({ email, password })
    if (data.success) {
      setUser(data.user)
      setToken(data.access_token)
      localStorage.setItem('vs_token', data.access_token)
      localStorage.setItem('vs_user',  JSON.stringify(data.user))
    }
    return data
  }, [])

  const register = useCallback(async (email, password, full_name) => {
    const data = await authAPI.register({ email, password, full_name })
    if (data.success && data.access_token) {
      setUser(data.user)
      setToken(data.access_token)
      localStorage.setItem('vs_token', data.access_token)
      localStorage.setItem('vs_user',  JSON.stringify(data.user))
    }
    return data
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('vs_token')
    localStorage.removeItem('vs_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
