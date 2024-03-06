import { useAuth } from '@/auth/AuthProvider'
import api from '@/axiosConfig'
import { Flex } from '@/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

export default function TableListDashboard() {
  const { venueId } = useParams()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const queryClient = useQueryClient() // Hook para acceder al cliente de query

  const {
    data: tables,
    isLoading,
    isError,
    error: tableError,
  } = useQuery({
    queryKey: ['tables_list', venueId],
    queryFn: async () => {
      const response = await api.get(`/v1/admin/${venueId}/get-tables`)
      return response.data
    },
  })

  const { isAdmin } = useAuth()

  const tableMutation = useMutation({
    mutationFn: (tableNumber: any) =>
      api.post('/v1/admin/create-table', {
        tableNumber,
        venueId: venueId,
        headers: {
          // Importante: No establecer 'Content-Type': 'multipart/form-data' manualmente.
          // Dejar que el navegador lo haga automáticamente para asegurar que el boundary se añada correctamente.
        },
        withCredentials: true,
      }),
    onSuccess: () => {
      setSuccess('Table added')
      queryClient.invalidateQueries({ queryKey: ['tables_list', venueId] })
    },
    onError: (error: any) => {
      console.log(error)
      setError(error.response.data.error)
    },
  })

  const deleteTableMutation = useMutation({
    mutationFn: (tableNumber: any) =>
      api.delete(`/v1/admin/${venueId}/delete-table`, {
        headers: {
          // Importante: No establecer 'Content-Type': 'multipart/form-data' manualmente.
          // Dejar que el navegador lo haga automáticamente para asegurar que el boundary se añada correctamente.
        },
        data: { tableNumber },

        withCredentials: true,
      }),
    onSuccess: () => {
      setSuccess('table deleted')
      queryClient.invalidateQueries({ queryKey: ['tables_list', venueId] })
    },
    onError: (error: any) => {
      console.log(error)
      setError(error.response.data.error)
    },
  })

  if (!isAdmin) return <div>Not authorized</div>
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {tableError.message}</div>

  const handleSubmit = event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const tableNumber = formData.get('tableNumber')
    tableMutation.mutate(tableNumber)
  }

  return (
    <div className="py-2 bg-blue-200">
      <div className="flex flex-col flex-wrap gap-2">
        <form onSubmit={handleSubmit} className="mx-auto ">
          <input type="number" name="tableNumber" className="border-2 rounded-full" />
          <button className="w-20 px-2 py-1 border rounded-full">Add</button>
          {error && <p className="text-texts-error">{error}</p>}
          {success && <p>{success}</p>}
        </form>

        {tables.map(table => {
          return (
            // ANCHOR TABLE NUMBERS
            <Flex dir="row" space="sm" key={table.tableNumber}>
              <Link to={`${table.tableNumber}`} className="w-16 px-2 py-1 text-white bg-black rounded-full">
                {table.tableNumber}
              </Link>
              <div>
                {!showVerification ? (
                  <button className="w-6 h-6 border rounded-full bg-background-warning" onClick={() => setShowVerification(true)}>
                    X
                  </button>
                ) : (
                  <Fragment>
                    <Flex dir="col">
                      <span className="text-xs">Erase?</span>
                    </Flex>
                    <Flex dir="row" space="sm">
                      <button onClick={() => deleteTableMutation.mutate(table.tableNumber)}>
                        <span className="px-2 text-xs text-white border rounded-full bg-background-warning">Yes</span>
                      </button>
                      <button onClick={() => setShowVerification(false)}>
                        <span className="px-2 text-xs border rounded-full">No</span>
                      </button>
                    </Flex>
                  </Fragment>
                )}
              </div>
            </Flex>
          )
        })}
      </div>

      <Outlet />
    </div>
  )
}
