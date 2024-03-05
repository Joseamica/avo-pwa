import Loading from '@/components/Loading'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('isAuthenticated')
    if (token) {
      // Aquí podrías decodificar el token para obtener la información del usuario si es necesario
      // y verificar si el token aún es válido según tu lógica de negocio
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async ({ isAdmin }) => {
    if (isAdmin) {
      localStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
    }
    // Implementa la lógica de inicio de sesión
    // Asegúrate de guardar el token en localStorage tras un inicio de sesión exitoso
    localStorage.setItem('isAuthenticated', 'true')
    // Actualiza el estado del usuario
    setIsAuthenticated(true)
  }

  const logout = async () => {
    // Limpia el localStorage y el estado de usuario
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('persist:user')
    localStorage.removeItem('paymentIntents')
    localStorage.removeItem('isAdmin')
    setIsAuthenticated(false)
  }
  if (loading) return <Loading message="Cargando..." />

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, isAdmin }}>{!loading && children}</AuthContext.Provider>
}
