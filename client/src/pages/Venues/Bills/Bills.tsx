import { useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import BillId from './BillId'
// import { useAuth } from '@/auth/AuthProvider'
interface Tip {
  id: number
  amount: number
}

interface Payment {
  id: number
  method: string
  amount: number
  userId: number
  tips: Tip[]
}

interface User {
  id: number
  name: string
  color: string
}

interface OrderedProduct {
  id: number
  name: string
  price: number
  comments: string
  quantity: number
  description: string
  visible: boolean
  status: 'pending' | 'delivered' | 'cancelled'
  userId: number
  createdAt: number
  updatedAt: number
}

interface Bill {
  id: number
  venueId: number
  tableId: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' // Asumiendo posibles estados
  orderedProducts: OrderedProduct[]
  payments: Payment[]
  users: User[]
  total: number
  amount_left: number
  createdAt: number
  updatedAt: number
  tableNumber: number
}

function Bills() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()

  const { isPending, error, data, isError, status } = useQuery<Bill>({
    queryKey: ['bill_data'],

    queryFn: async () => {
      try {
        const response = await axios.get(`/api/v1/bills/${params.billId}`)
        return response.data
      } catch (error) {
        throw new Error('No existe la mesa o la cuenta no está disponible en este momento.')
      }
    },
  })

  if (isPending) return <Loading message="Buscando tu mesa" />
  if (isError) return 'An error has occurrsed: ' + error?.message

  return (
    <>
      {/* <Meta title="Bills" />
      <FullSizeCenteredFlexBox flexDirection="column">
        <Typography variant="h3">Bills</Typography>
        <p>Layout</p>
        <h2>TODO</h2>
        <ol>
          <li>cargar todos los tables existentes y mostrarlos con un boton</li>
        </ol> */}
      <BillId data={data} isPending={isPending} />
      {/* </FullSizeCenteredFlexBox> */}
    </>
  )
}

export default Bills
