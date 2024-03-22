import api from '@/axiosConfig'
import { Flex } from '@/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { Fragment, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function BillListDashboard() {
  const { venueId } = useParams()

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const queryClient = useQueryClient() // Hook para acceder al cliente de query
  const {
    data: bills,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['bills_details', venueId],
    queryFn: async () => {
      const response = await api.get(`/v1/dashboard/${venueId}/get-bills`)
      return response.data
    },
  })

  const deleteBillMutation = useMutation({
    mutationFn: (billId: any) =>
      api.delete(`/v1/dashboard/${venueId}/delete-bill`, {
        headers: {
          // Importante: No establecer 'Content-Type': 'multipart/form-data' manualmente.
          // Dejar que el navegador lo haga automáticamente para asegurar que el boundary se añada correctamente.
        },
        data: { billId },

        withCredentials: true,
      }),
    onSuccess: () => {
      setSuccess('table deleted')
      queryClient.invalidateQueries({ queryKey: ['bills_details', venueId] })
    },
    onError: (error: any) => {
      console.log(error)
      setError(error.response.data.error)
    },
  })

  if (isLoading) return <div>Cargando...</div>
  if (isError) return <div>Error al cargar los detalles de la mesa</div>

  return (
    <div className="bg-blue-200 ">
      <div>
        {bills.map(bill => {
          return (
            // ANCHOR TABLE NUMBERS
            <Flex dir="row" space="sm" key={bill.id}>
              <Link
                to={`${bill.id}`}
                className={clsx('w-fit px-2 py-1 rounded-full', {
                  'bg-violet-500': bill.status === 'OPEN',
                  'bg-red-500': bill.status === 'CLOSED',
                  'bg-green-500': bill.status === 'PAID',
                  'bg-teal-200': bill.status === 'EARLYACCESS',
                  'bg-yellow-200': bill.status === 'PENDING',
                })}
              >
                {bill.posOrder ?? bill.status}
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
                      <button onClick={() => deleteBillMutation.mutate(bill.id)}>
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
        {bills.length === 0 && <p>No bills</p>}
      </div>
    </div>
  )
}
