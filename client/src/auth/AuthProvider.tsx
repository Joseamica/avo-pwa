// src/context/AuthProvider.tsx
import { getUserLS } from '@/utils/localStorage/user'
import React, { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from 'react'

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
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState()

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext)
