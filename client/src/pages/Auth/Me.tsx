import { useAuth } from '@/auth/AuthProvider'
import api from '@/axiosConfig'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Me() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { logout } = useAuth()

  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: () =>
      api.post('/v1/auth/logout', '', {
        withCredentials: true,
      }),
    onSuccess: () => {
      logout()
      queryClient.invalidateQueries({ queryKey: ['login'] })
      navigate('/auth/login')
    },
    onError: (error: any) => {
      console.log(error)
      setError(error.response.data.error)
    },
  })

  return (
    <form>
      <button
        onClick={e => {
          e.preventDefault()
          logoutMutation.mutate()
        }}
      >
        Logout
      </button>
      {error && <div>{error}</div>}
    </form>
  )
}
