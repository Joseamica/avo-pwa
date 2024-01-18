import { Flex } from '@/components'
import { Button, IconButton } from '@/components/Button'
import Modal from '@/components/Modal'
import ByProduct from '@/components/Payments/ByProduct'
import { Spacer } from '@/components/Util/Spacer'
import { H1, H2 } from '@/components/Util/Typography'
import useModal from '@/hooks/useModal'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { Currency } from '@/utils/currency'
import { IncognitoUser } from '@/utils/types/user'
import { CallSplit, Edit, ListAlt, Payment, SafetyDivider } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'

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

function BillId() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()

  const { isPending, error, data, isFetching } = useQuery<Bill>({
    queryKey: ['bill_data'],
    queryFn: async () => await axios.get(`http://localhost:5000/api/venues/${params.venueId}/bills/${params.billId}`).then(res => res.data),
  })

  const { isModalOpen, openModal, closeModal, isInnerModalOpen, openInnerModal, closeInnerModal } = useModal()

  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  const user = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }

  return (
    <Fragment>
      <div className="h-full ">
        <HeaderAvo iconColor={user.user.color} />
        <Spacer size="xl" />
        {/* <h3 className="flex justify-center w-full">{`Mesa ${tableNumber}`}</h3> */}
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
          <Flex direction="row" align="center" space="sm">
            <H1>Total</H1>
            <H2>${data.total / 100}</H2>
          </Flex>
          <Flex direction="row" align="center" space="sm">
            <H1>Por Pagar</H1>
            <H2>${data.amount_left / 100}</H2>
          </Flex>

          <Spacer size="xl" />

          <Flex direction="col" space="xs" className="border">
            {data.orderedProducts.map(product => {
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
          <IconButton icon={<SafetyDivider />} onClick={() => openInnerModal('equal_parts')} text={'Pagar partes iguales'} />
          <Spacer size="sm" />
          <IconButton icon={<Edit />} onClick={() => openInnerModal('custom')} text={'Pagar monto personalizado'} />
          <Modal
            isFullScreen={true}
            isOpen={isInnerModalOpen.by_product}
            closeModal={() => closeInnerModal('by_product')}
            title="Pagar por producto"
          >
            <ByProduct orderedProducts={data.orderedProducts} />
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
      <ReactQueryDevtools initialIsOpen />
    </Fragment>
  )
}

export default BillId
