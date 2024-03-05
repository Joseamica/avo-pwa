import Loading from '@/components/Loading'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('isAuthenticated')
    if (token) {
      // Aquí podrías decodificar el token para obtener la información del usuario si es necesario
      // y verificar si el token aún es válido según tu lógica de negocio
      setIsAuthenticated(true)
      navigate('/me')
    }
    setLoading(false)
  }, [])

  const login = async () => {
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
    setIsAuthenticated(false)
  }
  if (loading) return <Loading message="Cargando..." />

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>{!loading && children}</AuthContext.Provider>
}
