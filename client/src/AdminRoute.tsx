import { useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import ErrorMessage from './pages/Error/ErrorMessage'

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isSuperAdmin } = useAuth()
  const location = useLocation()
  console.log('isSuperAdmin', isSuperAdmin)

  if (!isAuthenticated || !isSuperAdmin) {
    // Redirigir al usuario a la página de inicio de sesión, pero guarda la ubicación actual
    // para que podamos redirigirlo de vuelta después de iniciar sesión
    return <ErrorMessage responseError="No estas permitido" />
  }

  return children
}
