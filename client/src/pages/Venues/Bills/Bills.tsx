import { Link, Outlet, useParams } from 'react-router-dom'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Meta from '@/components/Meta'
import { FullSizeCenteredFlexBox } from '@/components/styled'
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
}

function Bills() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()

  const { isPending, error, data, isFetching } = useQuery<Bill>({
    queryKey: ['bill_data'],
    queryFn: async () => await axios.get(`http://localhost:5000/api/venues/${params.venueId}/bills/${params.billId}`).then(res => res.data),
  })

  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
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
