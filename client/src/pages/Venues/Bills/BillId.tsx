import { Flex } from '@/components'
import { Button, IconButton } from '@/components/Button'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import { H1, H2 } from '@/components/Util/Typography'
import useModal from '@/hooks/useModal'
import Checkout from '@/pages/Stripe/Checkout'

import ByProductModal from '@/components/Modals/ByProductModal'
import CustomModal from '@/components/Modals/CustomModal'
import EqualPartsModal from '@/components/Modals/EqualPartsModal'
import CallSplit from '@mui/icons-material/CallSplit'
import Edit from '@mui/icons-material/Edit'
import ListAlt from '@mui/icons-material/ListAlt'
import Payment from '@mui/icons-material/Payment'
import SafetyDivider from '@mui/icons-material/SafetyDivider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import clsx from 'clsx'
import { Fragment } from 'react'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/Loading'
import axios from 'axios'
import { useParams } from 'react-router-dom'

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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | any
  products: OrderedProduct[]
  payments: Payment[]
  users: User[]
  total: number
  amount_left: number
  createdAt: number
  updatedAt: number
  tableNumber: number
}

function BillId() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()

  //TODO -  convert to useReducer
  const { isModalOpen, openModal, closeModal, isInnerModalOpen, openInnerModal, closeInnerModal } = useModal()
  const { isPending, error, data, isError, status } = useQuery<Bill>({
    queryKey: ['bill_data'],
    queryFn: async () => {
      try {
        const response = await axios.post(`/api/v1/venues/${params.venueId}/bills/${params.billId}`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Error desconocido, verifica backend para ver que mensaje se envia.')
      }
    },
  })

  if (isPending) return <Loading message="Buscando tu mesa" />
  if (isError) return 'An error has occured: ' + error?.message

  return (
    <Fragment>
      <div className="h-full ">
        <Spacer size="xl" />

        <Flex align="center" direction="col">
          <h1 className="font-neue">Mesa {data.tableNumber} </h1>
          {/* TODO - definir los estados y segun el estado ponerlo */}
          <H2
            className={clsx('text-white', {
              'bg-green-500': data.status === 'OPEN',
              'bg-red-500': data.status === 'CLOSED',
              'bg-yellow-500': data.status === 'PENDING',
            })}
          >
            STATUS {data.status}
          </H2>
          <Flex direction="row" align="center" space="sm">
            <H1>Total</H1>
            <H2>${data.total / 100}</H2>
          </Flex>
          {data.status === 4 ? (
            <Flex direction="row" align="center" space="sm">
              <H1>Por Pagar</H1>

              <H2>${data.amount_left / 100}</H2>
            </Flex>
          ) : null}

          <Spacer size="xl" />

          <div className="max-w-md mx-auto">
            <div className="flex flex-col p-4 space-y-4 bg-white border rounded-md shadow-lg">
              {data.products?.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-semibold">{product.quantity}x</span>
                  <span className="text-gray-600">{product.name}</span>
                  <span className="font-bold text-green-500">${(product.price / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <Spacer size="xl" />
          {data.status === 'OPEN' && (
            <Button onClick={() => openModal('payment_methods')} disabled={data.amount_left <= 0} text={'Pagar'} />
          )}
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
            orderedProducts={data.products}
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
          <Checkout amount={{ amount: data.amount_left }} />
        </Modal>
      </Modal>

      <ReactQueryDevtools initialIsOpen position="right" />
    </Fragment>
  )
}

export default BillId
