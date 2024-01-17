// Layout.js
import { Link, Outlet, json, useLoaderData } from 'react-router-dom'

import { z } from 'zod'

import { Person } from '@mui/icons-material'
import { getRandomPastelHex } from './utils/misc'
import { IncognitoUser } from './utils/types/user'

const User = IncognitoUser

export async function loader({ request }) {
  const localStorageUser = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }

  if (localStorageUser) {
    return json({ user: localStorageUser.user })
  } else {
    const randomColor = getRandomPastelHex()
    const user = {
      color: randomColor,
      createdAt: Date.now(),
    }
    localStorage.setItem('persist:user', JSON.stringify({ user }))

    return json({ user })
  }
}

export async function action({ request }) {
  // const formData = Object.fromEntries(await request.formData())

  // localStorage.setItem('persist:user', JSON.stringify({ user: { name: formData.name, color: getRandomColor(), createdAt: Date.now() } }))

  // return redirect(formData.redirectTo || '/')
  return json({ user: null })
}

const Layout = ({}) => {
  const data = useLoaderData() as { user: IncognitoUser }

  // const navigation = useNavigation()
  // const location = useLocation()
  // console.log('data', data)
  // const [showModal, setShowModal] = React.useState(true)
  // const user = data.user
  // const isSubmitting = navigation.state !== 'idle'

  // if (!user) {
  //   return (
  //     // <Modal isOpen={showModal} onClose={user ? () => setShowModal(false) : null}>
  //     //   <Form validator={IncognitoUser}>
  //     //     {(register, errors) => (
  //     //       <>
  //     //         <Field
  //     //           labelProps={{ children: 'hola' }}
  //     //           inputProps={{
  //     //             placeholder: 'Name...',
  //     //             name: 'name',
  //     //             type: 'text',
  //     //             ...register('name'),
  //     //           }}
  //     //           errorSize="lg"
  //     //           errors={errors.name?.message}
  //     //         />

  //     //         <Button type="submit" className="p-2 bg-blue-400 border" disabled={isSubmitting}>
  //     //           Send
  //     //         </Button>
  //     //         <input type="hidden" name="redirectTo" value={location.pathname} />
  //     //       </>
  //     //     )}
  //     //   </Form>
  //     // </Modal>
  //   )
  // }

  return (
    <>
      {/* <Link to="/me" className="flex items-center justify-center w-12 h-12 border rounded-full">
        <Person style={{ color: data.user.color }} />
      </Link> */}
      <Outlet />
    </>
  )
}

export default Layout
