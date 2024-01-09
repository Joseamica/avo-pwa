// Layout.js
import React from 'react'
import { Outlet, json, redirect, useLoaderData, useLocation, useNavigation } from 'react-router-dom'
import Modal from './components/Modal'

import { z } from 'zod'

import { Button } from './components/Button'
import Form from './components/Form'
import { Field } from './components/Forms/Field'
import { getRandomColor } from './utils/misc'

const IncognitoUser = z.object({
  name: z.string().min(3, "That's not a real name"),
  color: z.string().min(3, "That's not a real color").default('##2e8857'),
  createdAt: z.number().default(Date.now()).optional(),
})

type IncognitoUser = z.infer<typeof IncognitoUser>

export async function loader({ request }) {
  //   const { user, login, logout } = useAuth()
  //TODO Implementar que verifique si el usuario esta registrado o no
  const localStorageUser = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }

  if (localStorageUser) {
    return json({ user: localStorageUser.user })
  } else {
    return json({ user: null })
  }
}

export async function action({ request }) {
  const formData = Object.fromEntries(await request.formData())

  localStorage.setItem('persist:user', JSON.stringify({ user: { name: formData.name, color: getRandomColor(), createdAt: Date.now() } }))

  return redirect(formData.redirectTo || '/')
}

const Layout = ({}) => {
  const data = useLoaderData() as { user: IncognitoUser }
  const navigation = useNavigation()
  const location = useLocation()

  const [showModal, setShowModal] = React.useState(true)
  const user = data.user
  const isSubmitting = navigation.state !== 'idle'

  if (!user) {
    return (
      <Modal isOpen={showModal} onClose={user ? () => setShowModal(false) : null}>
        <Form validator={IncognitoUser}>
          {(register, errors) => (
            <>
              <Field
                labelProps={{ children: 'hola' }}
                inputProps={{
                  placeholder: 'Name...',
                  name: 'name',
                  type: 'text',
                  ...register('name'),
                }}
                errorSize="lg"
                errors={errors.name?.message}
              />

              <Button type="submit" className="p-2 bg-blue-400 border" disabled={isSubmitting}>
                Send
              </Button>
              <input type="hidden" name="redirectTo" value={location.pathname} />
            </>
          )}
        </Form>
      </Modal>
    )
  }

  return (
    <>
      <p>name: {data.user.name}</p>
      <Outlet />
    </>
  )
}

export default Layout
