import api from '@/axiosConfig' // Asegúrate de que esta instancia de Axios esté configurada correctamente
import { Field } from '@/components' // Asumiendo que estos componentes están correctamente importados
import Loading from '@/components/Loading'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { isLoading } = useQuery({
    queryKey: ['login'],
    queryFn: async () => {
      const res = await api.get('/v1/auth/status', {
        withCredentials: true,
      })
      if (res.data.loggedIn) {
        navigate('/me')
      }
      return res.data
    },
  })

  // Definición de la mutación usando useMutation
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string | FormDataEntryValue; password: string | FormDataEntryValue }) =>
      api.post(
        '/v1/auth/login',
        { username, password },
        {
          headers: {
            // Importante: No establecer 'Content-Type': 'multipart/form-data' manualmente.
            // Dejar que el navegador lo haga automáticamente para asegurar que el boundary se añada correctamente.
          },
          withCredentials: true,
        },
      ),
    onSuccess: () => {
      navigate('/me')
    },
    onError: (error: any) => {
      console.log(error)
      setError(error.response.data.error)
    },
    // onSuccess: () => {
    //   // Invalidar queries o realizar acciones después de un login exitoso
    //   queryClient.invalidateQueries(['login'])
    // },
  })

  const handleSubmit = event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password = formData.get('password')

    // Usar la mutación con los datos del formulario
    loginMutation.mutate({ username, password })
  }

  if (isLoading) return <Loading message="Cargando..." />

  // Mostrar formulario y manejar el estado de la mutación (cargando, error, éxito)
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Field
          inputProps={{
            placeholder: 'Usuario...',
            name: 'username', // Asegúrate de que los names coincidan con lo que tu backend espera
            type: 'text', // 'type' debe ser 'text' para el username
          }}
          labelProps={{ children: 'Usuario' }}
        />
        <Field
          inputProps={{
            placeholder: 'Contraseña...',
            name: 'password', // Asegúrate de que los names coincidan con lo que tu backend espera
            type: 'password', // 'type' debe ser 'password' para la contraseña
          }}
          labelProps={{ children: 'Contraseña' }}
        />

        <button type="submit">Iniciar Sesión</button>
      </form>

      {loginMutation.isError && <div>{error}</div>}
      {loginMutation.isSuccess && <div>Sesión iniciada correctamente!</div>}
    </div>
  )
}
