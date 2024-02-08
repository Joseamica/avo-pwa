// Layout.js
import { Outlet, json } from 'react-router-dom'

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
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
    const stripeCustomer = await axios.post('/api/v1/stripe/create-incognito-customer', {
      name: user.color + ' ' + uuidv4(),
    })

    localStorage.setItem('persist:user', JSON.stringify({ user: { ...user, stripeCustomerId: stripeCustomer.data.id } }))

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
