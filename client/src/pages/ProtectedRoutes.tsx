import { PrivateRoute } from '@/PrivateRoute'
import { AuthProvider } from '@/auth/AuthProvider'

import { Outlet } from 'react-router-dom'

export default function ProtectedRoutes() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
