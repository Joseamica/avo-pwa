import api from '@/axiosConfig'
import { Button, Field, Flex } from '@/components'
import Loading from '@/components/Loading'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, Outlet } from 'react-router-dom'
import ErrorMessage from '../Error/ErrorMessage'
import Modal from '@/components/Modal'
import { Fragment, useState } from 'react'
import { z } from 'zod'

const venueSchema = z.object({
  name: z.string().min(4, 'El nombre es requerido'),
  image: z.string().url('Debe ser una URL válida').min(15, 'La imagen es requerida'),
  logo: z.string().url('Debe ser una URL válida').min(1, 'El logo es requerido'),
  tip_one: z.string().min(1, 'El tip 1 es requerido'),
  tip_two: z.string().min(1, 'El tip 2 es requerido'),
  tip_three: z.string().min(1, 'El tip 3 es requerido'),
  pos: z.string().min(1, 'El sistema POS es requerido'),
  stripe: z.string().min(1, 'El ID de cuenta Stripe es requerido'),
})
export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  // NOTE el userId se asigna en el login
  //FIXME - cambiar el key de user a algo mas complejo asignandole algo mas
  const userId = localStorage.getItem('user')
  const {
    data,
    isLoading,
    isError,
    error: chainError,
  } = useQuery({
    queryKey: ['chain'],
    queryFn: async () => {
      const response = await api.get(`/v1/dashboard/get-chain?userId=${userId}`)
      return response.data
    },
  })

  const addVenueMutation = useMutation({
    mutationFn: (adminData: {
      name: string | FormDataEntryValue
      image: string | FormDataEntryValue
      logo: string | FormDataEntryValue
      tip_one: string | FormDataEntryValue
      tip_two: string | FormDataEntryValue
      tip_three: string | FormDataEntryValue
      pos: string | FormDataEntryValue
      stripe: string | FormDataEntryValue
    }) => api.post(`/v1/dashboard/${data.chain.id}/create-venue`, adminData),
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
    const formValues = {
      name: formData.get('name')?.toString() ?? '',
      image: formData.get('image')?.toString() ?? '',
      logo: formData.get('logo')?.toString() ?? '',
      tip_one: formData.get('tip_one')?.toString() ?? '',
      tip_two: formData.get('tip_two')?.toString() ?? '',
      tip_three: formData.get('tip_three')?.toString() ?? '',
      pos: formData.get('pos')?.toString() ?? '',
      stripe: formData.get('stripe')?.toString() ?? '',
    }

    // Validación con Zod
    const result = venueSchema.safeParse(formValues)
    if (!result.success) {
      // Actualiza el estado de errores con los mensajes específicos por campo
      const errors = result.error.flatten().fieldErrors
      setFieldErrors(errors)
      return
    }

    // Si la validación es exitosa, limpia los errores antes de proceder
    setFieldErrors({})
    addVenueMutation.mutate(result.data)
  }
  console.log('error', error)
  if (isLoading) return <Loading message="Cargando el restaurante..." />
  if (isError) return <ErrorMessage responseError={chainError.message} />

  return (
    <div className="flex flex-col justify-between h-full">
      <Flex dir="row" justify="between" align="center" className="p-4 text-white bg-background-admin">
        <Link to="/dashboard">{data.chain.name}</Link>
      </Flex>
      <div className="p-4">
        {data.chain.venues.map(venue => {
          console.log(venue)
          return (
            <Link to={`venues/${venue.id}`} key={venue.id}>
              {venue.name}
            </Link>
          )
        })}
      </div>
      <Button text="Add venue" onClick={() => setShowAddModal(true)} />
      <Modal isOpen={showAddModal} closeModal={() => setShowAddModal(false)} title="Agregar Sucursal">
        {addVenueMutation.isPending ? (
          'Adding todo...'
        ) : (
          <Fragment>
            <form onSubmit={handleSubmit} className="p-4">
              <Field
                inputProps={
                  {
                    // Tus otros props permanecen igual...
                  }
                }
                labelProps={{ children: 'Nombre' }}
                errors={fieldErrors.name?.[0]} // Muestra el mensaje de error para 'name' si existe
              />
              <Field
                inputProps={{
                  placeholder: 'Imagen...',
                  name: 'image',
                  type: 'text',
                  // required: true, // Añade esto
                }}
                labelProps={{ children: 'Imagen' }}
                errors={fieldErrors.image?.[0]} // Muestra el mensaje de error para 'name' si existe
              />
              <Field
                inputProps={{
                  placeholder: 'Logo...',
                  name: 'logo',
                  type: 'url',
                  required: true, // Añade esto
                }}
                labelProps={{ children: 'Logo' }}
              />
              <Field
                inputProps={{
                  placeholder: 'Tip 1...',
                  name: 'tip_one',
                  type: 'text',
                  required: true, // Añade esto
                }}
                labelProps={{ children: 'Tip 1' }}
              />
              <Field
                inputProps={{
                  placeholder: 'Tip 2...',
                  name: 'tip_two',
                  type: 'text',
                  required: true, // Añade esto
                }}
                labelProps={{ children: 'Tip 2' }}
              />
              <Field
                inputProps={{
                  placeholder: 'Tip 3...',
                  name: 'tip_three',
                  type: 'text',
                  required: true, // Añade esto
                }}
                labelProps={{ children: 'Tip 3' }}
              />
              <label htmlFor="pos">POS</label>
              <select
                name="pos"
                id="pos"
                required
                className="tu-clase-css-para-selects" // Añade tus clases de estilo aquí
                defaultValue="" // Para manejar un valor por defecto no seleccionado
              >
                <option value="WANSOFT">WANSOFT</option>
                <option value="SOFTRESTAURANT">SOFTRESTAURANT</option>
              </select>
              {fieldErrors.pos && <div className="tu-clase-css-para-errores">{fieldErrors.pos[0]}</div>}
              <Field
                inputProps={{
                  placeholder: 'STRIPE',
                  name: 'stripe',
                  type: 'text',
                  required: true, // Añade esto
                }}
                labelProps={{ children: 'Stripe Account Id' }}
              />
              <button type="submit">Crear</button>
            </form>

            {addVenueMutation.isError && <div>{error || 'Error desconocido'}</div>}
            {addVenueMutation.isSuccess && <div>Sesión iniciada correctamente!</div>}
          </Fragment>
        )}
      </Modal>
      <Outlet />
    </div>
  )
}
