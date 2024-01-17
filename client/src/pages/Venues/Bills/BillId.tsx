import { Flex } from '@/components'
import IconButton, { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import useModal from '@/hooks/useModal'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { IncognitoUser } from '@/utils/types/user'
import { CallSplit, Fullscreen, JoinFull, ListAlt, OpenInFull, Payment, Splitscreen } from '@mui/icons-material'
import { Fragment, useState } from 'react'
import { Link, json, useLoaderData, useParams } from 'react-router-dom'

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

  try {
    const response = await fetch(url)

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

  const localStorageUser = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }

  return json({ bill, user: localStorageUser.user })
}

function BillId() {
  const data = useLoaderData() as { bill: Bill; user: IncognitoUser }
  const params = useParams()
  const tableNumber = data.bill.tableId

  const { isModalOpen, openModal, closeModal, isInnerModalOpen, openInnerModal, closeInnerModal } = useModal()

  return (
    <Fragment>
      <div className="h-full ">
        <HeaderAvo iconColor={data.user.color} />
        <Spacer size="xl" />
        <h3 className="flex justify-center w-full">{`Mesa ${tableNumber}`}</h3>
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
        <Spacer size="xl" />

        <Flex align="center" direction="col">
          <h1>Orden</h1>
          <Flex direction="col" space="xs" className="border">
            {data.bill.orderedProducts.map(product => {
              return (
                <div key={product.id}>
                  <span>{product.quantity}</span> <span>{product.name}</span> <span>${product.price / 100}</span>
                </div>
              )
            })}
          </Flex>
          <Spacer size="xl" />
          <Button onClick={() => openModal('payment_methods')} text={'Pagar'} />
        </Flex>
      </div>
      {/* TODO modify icons */}
      <Modal isOpen={isModalOpen.payment_methods} closeModal={() => closeModal('payment_methods')} title="Método de pago">
        <IconButton icon={<CallSplit />} onClick={() => openModal('split_bill')} text={'Dividir Cuenta'} />
        <Spacer size="sm" />
        <IconButton icon={<Payment />} onClick={() => openModal('pay_full_bill')} text={'Pagar Cuenta Completa'} />

        {/* ANCHOR SplitBill */}
        <Modal isOpen={isModalOpen.split_bill} closeModal={() => closeModal('split_bill')} title="Dividir cuenta">
          <IconButton icon={<ListAlt />} onClick={() => openInnerModal('by_product')} text={'Pagar por producto'} />
          <Spacer size="sm" />
          <IconButton icon={<ListAlt />} onClick={() => openInnerModal('equal_parts')} text={'Pagar partes iguales'} />
          <Spacer size="sm" />
          <IconButton icon={<ListAlt />} onClick={() => openInnerModal('custom')} text={'Pagar monto personalizado'} />
          <Modal isOpen={isInnerModalOpen.by_product} closeModal={() => closeInnerModal('by_product')} title="Pagar por producto">
            <h1>By product</h1>
          </Modal>
          <Modal isOpen={isInnerModalOpen.equal_parts} closeModal={() => closeInnerModal('equal_parts')} title="Pagar partes iguales">
            <h1>Equal parts</h1>
          </Modal>
          <Modal isOpen={isInnerModalOpen.custom} closeModal={() => closeInnerModal('custom')} title="Pagar monto personalizado">
            <h1>Custom</h1>
          </Modal>
        </Modal>
        {/* ANCHOR FullBill */}
        <Modal isOpen={isModalOpen.pay_full_bill} closeModal={() => closeModal('pay_full_bill')} title="Pagar cuenta completa">
          <h1>Pay full bill</h1>
        </Modal>
      </Modal>
    </Fragment>
  )
}

export default BillId
