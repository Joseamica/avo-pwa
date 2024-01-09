// src/context/AuthProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  user: any // Cambia 'any' por el tipo de tu usuario
  login: (username: string, password: string) => void
  logout: () => void
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextType>(null!)

// Define el tipo para las props del proveedor
interface AuthProviderProps {
  children: ReactNode
}

// Componente proveedor
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null)

  const login = (username: string, password: string) => {
    // const res = fetch('http://localhost:5000/api/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ username: username, password: password }),
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data)
    //     setUser(data)
    //   })
  }

  const logout = () => {
    // Aquí va la lógica para cerrar sesión
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext)
