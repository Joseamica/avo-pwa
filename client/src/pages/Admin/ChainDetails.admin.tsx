import api from '@/axiosConfig'
import { Button, Field, Flex, H1 } from '@/components'
import Loading from '@/components/Loading'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import ErrorMessage from '../Error/ErrorMessage'
import Modal from '@/components/Modal'

export default function ChainDetails() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState(null)
  const { chainId } = useParams()

  const loginMutation = useMutation({
    mutationFn: (adminData: { username: string | FormDataEntryValue; password: string | FormDataEntryValue }) =>
      api.post(`/v1/admin/${chainId}/create-admin`, adminData),
    onSuccess: data => {
      setShowAddModal(false)
    },
    onError: (error: any) => {
      setError(error?.response.data.error) // Asume que tu backend envía un campo 'error' con la descripción del error
    },
  })
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
    if (typeof username === 'string' && typeof password === 'string') {
      loginMutation.mutate({ username, password })
      // Usar la mutación con los datos del formulario
    }
  }

  const {
    isLoading,
    isError,
    error: chainError,
    data: chain,
  } = useQuery({
    queryKey: ['chain', chainId],
    queryFn: async () => {
      const response = await api.get(`/v1/admin/${chainId}/get-chain`)
      return response.data
    },
  })

  if (isLoading) return <Loading message="Cargando el restaurante..." />
  if (isError) return <ErrorMessage responseError={chainError.message} />

  return (
    <Fragment>
      <Flex dir="row" align="center" space="sm">
        <H1>{chain.name}</H1>
      </Flex>
      <hr />
      <div className="p-4">
        <Button text={`Add admin to ${chain.name}`} onClick={() => setShowAddModal(true)} />
      </div>

      <Flex dir="row" align="center" className="">
        <div className="flex flex-col self-start w-1/4 divide-y divide-black bg-violet-700">
          {/* <Link to={`venues`} className="py-4 pl-4 font-semibold text-violet-100">
            • Venues
          </Link> */}
          {/* 
          <Link to={`bills`} className="py-4 pl-4 font-semibold text-violet-100">
            • Bills
          </Link>

          <Link to={`menus`} className="py-4 pl-4 font-semibold text-violet-100">
            • Menus
          </Link> */}
        </div>
        <div className="w-3/4">
          <Outlet />
        </div>
      </Flex>
      <Modal isOpen={showAddModal} closeModal={() => setShowAddModal(false)}>
        {loginMutation.isPending ? (
          'Adding todo...'
        ) : (
          <Fragment>
            <form onSubmit={handleSubmit}>
              {/* {loginMutation.error && <h5 onClick={() => loginMutation.reset()}>{loginMutation.error}</h5>} */}
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
              <button type="submit">Crear</button>
            </form>

            {loginMutation.isError && <div>{error || 'Error desconocido'}</div>}
            {loginMutation.isSuccess && <div>Sesión iniciada correctamente!</div>}
          </Fragment>
        )}
      </Modal>
    </Fragment>
  )
}
