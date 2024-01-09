// Layout.js
import React from 'react'
import { useAuth } from './auth/AuthProvider'
import { Form, LoaderFunctionArgs, Outlet, useFetcher, useLoaderData, useSubmit } from 'react-router-dom'
import Modal from './components/Modal'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'

const IncognitoUser = z.object({
  name: z.string().min(3, "That's not a real name"),
  color: z.string().min(3, "That's not a real color").default('##2e8857'),
})

type IncognitoUser = z.infer<typeof IncognitoUser>

export async function loader() {
  const name = localStorage.getItem('name')
  const color = localStorage.getItem('color')

  if (name && color) {
    return { name, color }
  }

  return {}
}

export async function action({ request }) {
  const formData = await request.formData()
  const name = formData.get('name')
  const color = formData.get('color')

  try {
    // Validar los datos con Zod
    IncognitoUser.parse({ name, color })

    // Si la validación es exitosa, guardar en localStorage
    localStorage.setItem('name', name)
    localStorage.setItem('color', color)

    // Retornar un estado de éxito
    return { success: true }
  } catch (error) {
    // Manejar los errores de validación
    // Puedes decidir cómo mostrar estos errores en tu UI
    console.error(error)
    return { success: false, error: error.message }
  }
}

const Layout = ({}) => {
  const data = useLoaderData() as { name: string; color: string }
  const fetcher = useFetcher()

  const [showModal, setShowModal] = React.useState(true)
  //   const { user } = useAuth()
  const user = data.color && data.name

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IncognitoUser>({ resolver: zodResolver(IncognitoUser) })

  const onSubmitValid: SubmitHandler<IncognitoUser> = data => {
    // Aquí puedes preparar los datos para el envío, si es necesario
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('color', data.color)

    // Usar fetcher.submit para enviar el formulario
    fetcher.submit(formData, { method: 'post' })
  }

  if (!user) {
    return (
      <Modal isOpen={showModal} onClose={user ? () => setShowModal(false) : null}>
        <Form method="POST" onSubmit={handleSubmit(onSubmitValid)}>
          <input type="text" placeholder="Name..." name="name" className="border" {...register('name')} />
          <p className="text-black">{errors.name?.message}</p>
          <input type="color" placeholder="color..." name="color" className="border" {...register('color')} defaultValue={'##2e8857'} />
          <p className="text-black">{errors.color?.message}</p>

          <button type="submit" className="p-2 bg-blue-400 border">
            Send
          </button>
        </Form>
      </Modal>
    )
  }

  return (
    <>
      <p>layout</p>
      <Outlet />
    </>
  )
}

export default Layout
