import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Si el usuario está autenticado y trata de acceder a una ruta pública (como /auth/login),
  // redirígelos a su página principal o dashboard.
  // Puedes modificar la ruta "/dashboard" según convenga.
  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/me'
    return <Navigate to={from} replace />
  }

  return children
}
