import api from '@/axiosConfig'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Me() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const { isLoading } = useQuery({
    queryKey: ['login'],
    queryFn: async () => {
      const res = await api.get('/v1/auth/status', {
        withCredentials: true,
      })
      console.log('res.data', res.data)
      if (!res.data.loggedIn) {
        localStorage.removeItem('persist:user')
        localStorage.removeItem('paymentIntents')

        navigate('/auth/login')
      }
      return res.data
    },
  })

  const loginMutation = useMutation({
    mutationFn: () =>
      api.post('/v1/auth/logout', {
        headers: {
          // Importante: No establecer 'Content-Type': 'multipart/form-data' manualmente.
          // Dejar que el navegador lo haga automáticamente para asegurar que el boundary se añada correctamente.
        },
        withCredentials: true,
      }),
    onSuccess: () => {
      navigate('/auth/login')
      queryClient.invalidateQueries({ queryKey: ['login'] })
    },
    onError: (error: any) => {
      console.log(error)
      setError(error.response.data.error)
    },
  })

  if (isLoading) return <div>Loading...</div>
  return (
    <form>
      <button
        onClick={e => {
          e.preventDefault()
          loginMutation.mutate()
        }}
      >
        Logout
      </button>
      {error && <div>{error}</div>}
    </form>
  )
}
