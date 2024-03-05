import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirigir al usuario a la página de inicio de sesión, pero guarda la ubicación actual
    // para que podamos redirigirlo de vuelta después de iniciar sesión
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return children
}
