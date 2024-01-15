import { useAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/Button'
import Form from '@/components/Form'
import { Field } from '@/components/Forms/Field'
import { getRandomColor } from '@/utils/misc'
import { emailSchema, passwordSchema, usernameSchema } from '@/utils/user-validations'
import { Link, json, redirect, useActionData, useLoaderData, useLocation, useNavigation } from 'react-router-dom'
import { z } from 'zod'

export const LoginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  redirectTo: z.string().optional(),
})

type LoginSchema = z.infer<typeof LoginSchema>

export async function loader({ request }) {
  //   try {
  //     // Realizar una solicitud al endpoint que verifica el estado de autenticación
  //     const response = await fetch('http://localhost:5000/auth/status', {
  //       credentials: 'include', // Importante para incluir las cookies en la solicitud
  //     })

  //     if (!response.ok) {
  //       // Si la respuesta no es OK, significa que el usuario no está autenticado
  //       return { isAuthenticated: false }
  //     } else {
  //       return redirect('/')
  //     }
  //   } catch (error) {
  //     console.error('Error al verificar el estado de autenticación Login.tsx linea 48:', error)
  //     return { isAuthenticated: false }
  //   }
  return { user: null }
}

export async function action({ request, params }) {
  const formData = Object.fromEntries(await request.formData())
  //   const submission = await
  try {
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify({ username: formData.username, password: formData.password }),

      credentials: 'include',
    })
    if (res.ok) {
      return redirect(formData.redirectTo || '/')
    }

    return json({ res })
  } catch (e) {
    return json({ res: { error: 'Error desconocido' } }, { status: 500 })
  }
}

const Login = () => {
  const data = useLoaderData() as { user: LoginSchema }

  const actionData = useActionData() as { res: any }

  const navigation = useNavigation()
  const location = useLocation()
  const isSubmitting = navigation.state !== 'idle'

  return (
    <div>
      <Form validator={LoginSchema}>
        {(register, errors) => (
          <>
            <Field
              labelProps={{ children: 'Usuario' }}
              inputProps={{
                placeholder: 'Usuario...',
                name: 'username',
                type: 'username',
                ...register('username'),
              }}
              errors={errors.username?.message}
            />
            <Field
              labelProps={{ children: 'Contraseña' }}
              inputProps={{
                placeholder: 'Contraseña...',
                name: 'password',
                type: 'password',
                ...register('password'),
              }}
              errors={errors.password?.message}
            />
            <div className="flex justify-between">
              <div className="flex items-center">
                <input type="checkbox" name="remember" id="remember" />
                <label htmlFor="remember" className="ml-2">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <input type="hidden" name="redirectTo" value={location.pathname} />
            <div className="mt-4">
              <span className="text-muted-foreground">Don't have an account?</span>
              <Link to="/auth/register" className="text-blue-400 hover:underline">
                Sign up
              </Link>
            </div>
            {/* <div className="mt-4">
              <span className="text-muted-foreground">Or login with</span>
              <div className="flex justify-between mt-2">
                <Button className="bg-blue-400 hover:bg-blue-500 border-0">Facebook</Button>
                <Button className="bg-red-400 hover:bg-red-500 border-0">Google</Button>
              </div>
            </div> */}
            {actionData?.res?.error && <p className="text-red-500">{actionData.res.error}</p>}
            <Button type="submit" className="p-2 bg-blue-400 border" disabled={isSubmitting}>
              Send
            </Button>
          </>
        )}
      </Form>
    </div>
  )
}

export default Login
