import { useAuth } from '@/auth/AuthProvider'
import api from '@/axiosConfig' // Asegúrate de que esta instancia de Axios esté configurada correctamente
import { Field } from '@/components' // Asumiendo que estos componentes están correctamente importados
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

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
      // FIXME - en algun punto tengo que cambiar el localStorage de persist:user para asignarle el stripeCustomerId y se guarden los datos del usuario
      navigate('/me')
      login()
    },
    onError: (error: any) => {
      console.log(error)
      setError(error.response.data.error)
    },
  })

  const handleSubmit = event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password = formData.get('password')

    // Usar la mutación con los datos del formulario
    loginMutation.mutate({ username, password })
  }

  // if (isLoading) return <Loading message="Cargando..." />

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
