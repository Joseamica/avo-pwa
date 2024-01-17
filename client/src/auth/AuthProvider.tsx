// // src/context/AuthProvider.tsx
// import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'

// // Define el tipo para el contexto de autenticación
// interface AuthContextType {
//   user: any // Cambia 'any' por el tipo de tu usuario
//   login: (username: string, password: string) => void
//   logout: () => void
// }

// // Crea el contexto de autenticación
// const AuthContext = createContext<AuthContextType>(null!)

// // Define el tipo para las props del proveedor
// interface AuthProviderProps {
//   children: ReactNode
// }

// // Componente proveedor
// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [loggedIn, setLoggedIn] = useState(null)
//   const [user, setUser] = useState(null)
//   const checkLoginState = useCallback(async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/auth/status`)
//       const data = await response.json()
//       if (data.loggedIn) {
//         setUser(data.user)
//       } else {
//         setUser(null)
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }, [])

//   useEffect(() => {
//     checkLoginState()
//   }, [checkLoginState])

//   return <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>{children}</AuthContext.Provider>
// }

// // Hook personalizado para usar el contexto de autenticación
// export const useAuth = () => useContext(AuthContext)
