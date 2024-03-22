// hooks/useLogout.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/axiosConfig'
import { useAuth } from '@/auth/AuthProvider'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const queryClient = useQueryClient()

  const { mutate: logoutMutate, error } = useMutation({
    mutationFn: () => api.post('/v1/auth/logout', '', { withCredentials: true }),
    onSuccess: () => {
      logout()
      queryClient.invalidateQueries({ queryKey: ['login'] })
      navigate('/auth/login')
    },
  })

  return { logout: logoutMutate, error }
}
