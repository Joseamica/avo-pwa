import { Spacer } from '@/components/Util/Spacer'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { Typography } from '@mui/material'
import { createSearchParams, json, useLoaderData } from 'react-router-dom'

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
}

async function fetchBill(venueId, billId) {
  const url = `http://localhost:5000/api/venues/${venueId}/bills/${billId}`
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' // Asegúrate de obtener el token de una fuente segura

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token, // Aquí se incluye el token
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al realizar la solicitud:', error)
  }
}

export async function loader({ request, params }) {
  const { venueId, tableId, billId } = params
  // const searchParams = await request.

  const bill = await fetchBill(venueId, billId)
  console.log('bill', bill)

  return json({ bill })
}

function BillId() {
  const data = useLoaderData() as { bill: Bill }

  const tableNumber = 2

  return (
    <div className="h-screen ">
      <HeaderAvo />
      <Spacer size="xl" />
      <h3 className="flex w-full justify-center">{`Mesa ${tableNumber}`}</h3>
      <div>
        {/* <p>Status</p>
        <p>{data.bill?.status}</p>
        <div>
          <h1></h1>
          {data.bill.orderedProducts.map(product => {
            return <div key={product.id}>{product.name}</div>
          })}
        </div> */}
      </div>
    </div>
  )
}

export default BillId
