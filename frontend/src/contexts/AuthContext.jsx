import { createContext, useState, useContext, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('authToken') || null)
  const [user, setUser] = useState(null) // Guarda o perfil completo
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData) // Salva o perfil completo
          } else {
            logout() // Se o token for inválido, desloga
          }
        } catch (error) {
          logout()
        }
      }
      setLoading(false)
    }
    fetchUserData()
  }, [token])

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken)
    setToken(newToken) // Isso vai disparar o useEffect para buscar os dados
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setToken(null)
    setUser(null)
  }

  const value = {
    token,
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    setUser,
  }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
