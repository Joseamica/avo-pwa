import { useAuth } from '@/auth/AuthProvider'
import api from '@/axiosConfig'
import { Field } from '@/components/Forms/Field'
import Loading from '@/components/Loading'
import { passwordSchema, usernameSchema } from '@/utils/user-validations'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'
import { z } from 'zod'

const RegisterSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})

const Register = () => {
  const navigation = useNavigation()
  const [error, setError] = useState('')
  const { login } = useAuth()

  const isSubmitting = navigation.state !== 'idle'

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

  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string | FormDataEntryValue; password: string | FormDataEntryValue }) =>
      api.post(
        '/v1/auth/register',
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
      login()
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

  return (
    <div>
      <h1>Register</h1>
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

export default Register
