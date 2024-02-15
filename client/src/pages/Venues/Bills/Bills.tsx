import { Link, Outlet, useLocation, useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import BillId from './BillId'
import { Spacer } from '@/components/Util/Spacer'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { IncognitoUser } from '@/utils/types/user'
import { LinkButton } from '@/components/Button'
import clsx from 'clsx'
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

  return (
    <>
      <HeaderAvo iconColor={user.user.color} />
      <Spacer size="xl" />

      <div className="flex justify-center w-full px-2">
        <LinkButton
          size="md"
          variant="secondary"
          to={`/venues/${params.venueId}/menus`}
          state={{
            tableId: params.tableId,
            billId: params.billId,
            venueId: params.venueId,
          }}
          text="Menu"
        />
        {/* <Link
          to={`/venues/${params.venueId}/menus`}
          className={clsx(
            'flex items-center  disabled:border-4 justify-center w-full  text-black bg-buttons-main border-4 border-borders-button  rounded-2xl border-gray text-xl',
          )}
        >
          Menu
        </Link> */}
      </div>
      <BillId />
      {/* <BillId data={data} isPending={isPending} /> */}
    </>
  )
}

export default Bills
