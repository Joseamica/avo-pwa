import api from '@/axiosConfig'
import { Button, Field, Flex, H1, H2 } from '@/components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, Outlet } from 'react-router-dom'
import ErrorMessage from '../Error/ErrorMessage'
import Loading from '@/components/Loading'
import { Spacer } from '@/components/Util/Spacer'
import { Fragment, useState } from 'react'
import Modal from '@/components/Modal'
import VenueListAdmin from './Venues/VenueList.admin'
import { useLogout } from '@/hooks/useLogout'

export default function Admin() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState(null)
  const { logout } = useLogout()

  const addVenueMutation = useMutation({
    mutationFn: (venueData: { name: string | FormDataEntryValue }) => api.post('/v1/admin/create-chain', venueData),

    onSuccess: data => {
      setShowAddModal(false)
    },
    onError: (error: any) => {
      setError(error.response.data.error) // Asume que tu backend envía un campo 'error' con la descripción del error
    },
  })
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') // Cambio aquí para usar 'name' en lugar de 'nombre'
    if (typeof name === 'string' && name.length > 0) {
      addVenueMutation.mutate({ name })
    }
  }

  const {
    isLoading,
    isError,
    error: queryError,
    data: chains,
  } = useQuery({
    queryKey: ['chains'],
    queryFn: async () => {
      const response = await api.get('/v1/admin/get-chains')
      return response.data
    },
  })

  if (isLoading) return <Loading message="Cargando el restaurante..." />
  if (isError) return <ErrorMessage responseError={queryError.message} />

  // if (chains.length > 0) {
  //   return <div>
  //       <Flex dir="row" justify="between" align="center" className="p-4 text-black bg-background-primary">
  //       <Link to="/admin">Admin</Link>
  //       <button className="flex items-center justify-center w-10 h-10 bg-white border rounded-full" onClick={() => setShowAddModal(true)}>
  //         +
  //       </button>
  //     </Flex>
  //     <H1>Chains</H1>
  //     <div>
  //       {chains.map(chain => {
  //         return (
  //           <Flex key={chain.id}>
  //             <Link to={`/admin/chains/${chain.id}`} className="w-32 text-center text-black border-2 border-black rounded-xl">
  //               {chain.name}
  //             </Link>
  //           </Flex>
  //         )
  //       })}
  //     </div>
  //     <Spacer size="sm" />
  //     <hr />
  //     <Spacer size="sm" />
  //     {/* <H2>Venue</H2> */}
  //     <VenueListAdmin />
  //   </div>
  // }
  return (
    <div className="flex flex-col justify-between h-full">
      <Flex dir="row" justify="between" align="center" className="p-4 text-black bg-background-primary">
        <Link to="/admin">Admin</Link>
        <button className="flex items-center justify-center w-10 w-32 bg-white border rounded-full" onClick={() => setShowAddModal(true)}>
          + Chain
        </button>
      </Flex>
      <div className="p-4">
        <H1>Chains</H1>
        <div className="flex p-2">
          {chains.map(chain => {
            return (
              <Flex key={chain.id} className="p-2">
                <Link to={`/admin/chains/${chain.id}`} className="w-32 text-center text-black border-2 border-black rounded-xl">
                  {chain.name}
                </Link>
              </Flex>
            )
          })}
        </div>
        <Spacer size="sm" />
        <hr />
        <Spacer size="sm" />
        {/* <H2>Venue</H2> */}
        {/* <VenueListAdmin /> */}
        <Outlet />
        <Modal isOpen={showAddModal} closeModal={() => setShowAddModal(false)} title="Create chain">
          {addVenueMutation.isPending ? (
            'Adding todo...'
          ) : (
            <Fragment>
              <form onSubmit={handleSubmit}>
                {/* {addVenueMutation.error && <h5 onClick={() => addVenueMutation.reset()}>{addVenueMutation.error}</h5>} */}
                <Field
                  inputProps={{
                    placeholder: 'Nombre...',
                    name: 'name', // Asegúrate de que los names coincidan con lo que tu backend espera
                    type: 'text', // 'type' debe ser 'text' para el username
                  }}
                  labelProps={{ children: 'Nombre' }}
                />
                <button type="submit">Crear</button>
              </form>
              {addVenueMutation.isError && <div>{error}</div>}
              {addVenueMutation.isSuccess && <div>Sesión iniciada correctamente!</div>}
            </Fragment>
          )}
        </Modal>
        <Button
          text="Logout"
          onClick={e => {
            e.preventDefault()
            logout()
          }}
        />
        {error && <div>{error}</div>}
      </div>
    </div>
  )
}
