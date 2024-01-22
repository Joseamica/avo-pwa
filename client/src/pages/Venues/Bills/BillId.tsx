import { Flex } from '@/components'
import { Button, IconButton } from '@/components/Button'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import { H1, H2 } from '@/components/Util/Typography'
import useModal from '@/hooks/useModal'
import Checkout from '@/pages/Stripe/Checkout'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { IncognitoUser } from '@/utils/types/user'

import ByProductModal from '@/components/Modals/ByProductModal'
import CustomModal from '@/components/Modals/CustomModal'
import EqualPartsModal from '@/components/Modals/EqualPartsModal'
import CallSplit from '@mui/icons-material/CallSplit'
import Edit from '@mui/icons-material/Edit'
import ListAlt from '@mui/icons-material/ListAlt'
import Payment from '@mui/icons-material/Payment'
import SafetyDivider from '@mui/icons-material/SafetyDivider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Fragment } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'

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

function BillId({ data, isPending }: { data?: Bill; isPending?: boolean }) {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()
  const location = useLocation()

  //TODO - use searchParams to open also modals if the user go back from
  const [searchParams, setSearchParams] = useSearchParams()

  const user = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }

  //TODO -  convert to useReducer
  const { isModalOpen, openModal, closeModal, isInnerModalOpen, openInnerModal, closeInnerModal } = useModal()

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
          {/* ANCHOR innerModal - ByProduct */}
          <ByProductModal
            isInnerModalOpen={isInnerModalOpen}
            closeInnerModal={closeInnerModal}
            openInnerModal={openInnerModal}
            orderedProducts={data.orderedProducts}
            isPending={isPending}
          />
          {/* ANCHOR innerModal - EqualParts */}
          <EqualPartsModal
            isInnerModalOpen={isInnerModalOpen}
            closeInnerModal={closeInnerModal}
            openInnerModal={openInnerModal}
            amountLeft={data.amount_left}
            isPending={isPending}
          />
          {/* ANCHOR innerModal - Custom */}
          <CustomModal
            isInnerModalOpen={isInnerModalOpen}
            closeInnerModal={closeInnerModal}
            openInnerModal={openInnerModal}
            isPending={isPending}
          />
        </Modal>
        {/* ANCHOR FullBill */}
        <Modal isOpen={isModalOpen.pay_full_bill} closeModal={() => closeModal('pay_full_bill')} title="Pagar cuenta completa">
          {/* NOTE - TODO - Decide what approach is better, to go to checkout route or render directly on childModal */}
          {/* <Link
            to="/checkout"
            state={{
              amount: { amount: data.amount_left },
              venueId: params.venueId,
              tableId: params.tableId,
              billId: params.billId,
              redirectTo: location.pathname,
            }}
          >
            
            Checkout
          </Link> */}
          <Checkout amount={{ amount: data.amount_left }} />
        </Modal>
      </Modal>

      <ReactQueryDevtools initialIsOpen />
    </Fragment>
  )
}

export default BillId
