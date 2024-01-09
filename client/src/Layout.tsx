// Layout.js
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Outlet, useFetcher, useLoaderData, useNavigation } from 'react-router-dom'
import Modal from './components/Modal'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Form from './components/Form'

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
  const formData = Object.fromEntries(await request.formData())
  localStorage.setItem('name', formData.name)
  localStorage.setItem('color', formData.color)
  return { success: true }
}

const Layout = ({}) => {
  const data = useLoaderData() as { name: string; color: string }
  const fetcher = useFetcher()

  const [showModal, setShowModal] = React.useState(true)
  //   const { user } = useAuth()
  const user = data.color && data.name
  const navigation = useNavigation()
  const isSubmitting = navigation.state !== 'idle'

  if (!user) {
    return (
      <Modal isOpen={showModal} onClose={user ? () => setShowModal(false) : null}>
        <Form validator={IncognitoUser}>
          {(register, errors) => (
            <>
              <input type="text" placeholder="Name..." name="name" className="border" {...register('name')} />
              <p className="text-black">{errors.name?.message}</p>
              <input type="color" placeholder="color..." name="color" className="border" {...register('color')} defaultValue={'##2e8857'} />
              <p className="text-black">{errors.color?.message}</p>

              <button type="submit" className="p-2 bg-blue-400 border" disabled={isSubmitting}>
                Send
              </button>
            </>
          )}
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
