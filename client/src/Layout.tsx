// Layout.js
import { Link, Outlet, json, useParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'
import instance from './axiosConfig'
import Loading from './components/Loading'
import { H3 } from './components/Util/Typography'
import { getRandomPastelHex } from './utils/misc'
import { IncognitoUser } from './utils/types/user'

const User = IncognitoUser

export async function loader() {
  const localStorageUser = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }
  const mode = import.meta.env.MODE
  console.log('mode', mode)
  if (localStorageUser) {
    return json({ user: localStorageUser.user })
  } else {
    const randomColor = getRandomPastelHex()
    const user = {
      color: randomColor,
      createdAt: Date.now(),
    }
    const stripeCustomer = await instance.post('/v1/stripe/create-incognito-customer', {
      name: user.color + ' ' + uuidv4(),
    })

    localStorage.setItem('persist:user', JSON.stringify({ user: { ...user, stripeCustomerId: stripeCustomer.data.id } }))

    return json({ user })
  }
}

export async function action() {
  // const formData = Object.fromEntries(await request.formData())

  // localStorage.setItem('persist:user', JSON.stringify({ user: { name: formData.name, color: getRandomColor(), createdAt: Date.now() } }))

  // return redirect(formData.redirectTo || '/')
  return json({ user: null })
}

const Layout = () => {
  const params = useParams<{ venueId: string; tableId: string }>()
  const {
    isPending,
    error,
    isError,
    isLoading,
    data: venues,
  } = useQuery<any>({
    queryKey: ['tables_data', params.venueId], // Incluye params.venueId en queryKey
    queryFn: async () => {
      try {
        const response = await instance.get(`/v1/venues/listVenues`)

        return response.data
      } catch (error) {
        throw new Error('error', error.message)
      }
    },
  })

  if (isPending) return <Loading message="Buscando tu mesa" />
  if (isLoading) return <Loading message="Buscando tu mesa" />
  if (isError) return <H3 variant="error">Error: {error?.message}</H3>
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
      <div>
        {venues.map(venue => {
          return (
            <div key={venue.id}>
              <h1>{venue.name}</h1>
              <div className="flex flex-row flex-wrap space-y-1">
                {venue.tables.map(table => (
                  <Link
                    to={`/venues/${venue.id}/tables/${table.tableNumber}`}
                    key={table.tableNumber}
                    className="flex items-center justify-center w-20 h-10 border rounded-full"
                  >
                    <h3>{table.tableNumber}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <Outlet />
    </>
  )
}

export default Layout
