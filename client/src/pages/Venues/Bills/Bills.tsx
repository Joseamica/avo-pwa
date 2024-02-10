import { Link, useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import BillId from './BillId'
import { Spacer } from '@/components/Util/Spacer'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { IncognitoUser } from '@/utils/types/user'
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
  products: OrderedProduct[]
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
  const user = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }
  const { isPending, error, data, isError, status } = useQuery<Bill>({
    queryKey: ['bill_data'],

    queryFn: async () => {
      try {
        const response = await axios.get(`/api/v1/bills/${params.billId}?venueId=${params.venueId}`)

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
      <HeaderAvo iconColor={user.user.color} />
      <Spacer size="xl" />

      <div className="flex justify-center w-full">
        <Link
          to={`/venues/${params.venueId}/menus`}
          className="flex justify-center w-40 p-2 text-black bg-white border-2 border-black rounded-md"
          state={{
            tableId: params.tableId,
            billId: params.billId,
            venueId: params.venueId,
          }}
        >
          Menu
        </Link>
      </div>

      <BillId data={data} isPending={isPending} />
    </>
  )
}

export default Bills
