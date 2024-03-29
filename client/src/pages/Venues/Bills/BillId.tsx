import { Flex } from '@/components'
import { Button, IconButton } from '@/components/Button'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import { H1, H2, H4 } from '@/components/Util/Typography'
import useModal from '@/hooks/useModal'
import Checkout from '@/pages/Stripe/Checkout'

import instance from '@/axiosConfig'
import Loading from '@/components/Loading'
import ByProductModal from '@/components/Modals/ByProductModal'
import CustomModal from '@/components/Modals/CustomModal'
import EqualPartsModal from '@/components/Modals/EqualPartsModal'
import CallSplit from '@mui/icons-material/CallSplit'
import Edit from '@mui/icons-material/Edit'
import ListAlt from '@mui/icons-material/ListAlt'
import Payment from '@mui/icons-material/Payment'
import SafetyDivider from '@mui/icons-material/SafetyDivider'
import { useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import ModalPadding from '@/components/Util/ModalPadding'

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
  key: string
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
  pos_order: { Status: number; Orden: number; Total: number }
}

const URL = '/'

export const socket = io(URL, {
  autoConnect: true,
})

function BillId() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()
  // const queryClient = useQueryClient()
  const [billData, setBillData] = useState<Bill | null>(null)

  //TODO -  convert to useReducer
  const { isModalOpen, openModal, closeModal, isInnerModalOpen, openInnerModal, closeInnerModal } = useModal()

  const {
    data: initialData,
    isPending,
    error,
    isError,
  } = useQuery<Bill>({
    queryKey: ['bill_data'],
    queryFn: async () => {
      try {
        // const response = await instance.post(`/api/v1/venues/${params.venueId}/bills/${params.billId}`)
        const response = await instance.post(`/v1/venues/${params.venueId}/bills/${params.billId}`)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Error desconocido, verifica backend para ver que mensaje se envia.')
      }
    },
    retry: false,
    staleTime: Infinity,
    // FIXME - Una solucion podria ser que si detecta que hay mas de 1 usuario, solo 1 usuario haga el fetch y los demas esperen a la actualizacion del socket
    // refetchInterval: 15000,
    // refetchIntervalInBackground: true,
    // refetchOnWindowFocus: true,
  })

  useEffect(() => {
    // Suponiendo que `params` contiene `venueId` y `billId`
    socket.emit('joinRoom', { venueId: params.venueId, billId: params.billId })

    socket.on('updateOrder', data => {
      setBillData(data)
      // Aquí puedes manejar la actualización en el estado del cliente
    })

    // Asegurarse de dejar el room al desmontar el componente
    return () => {
      socket.emit('leaveRoom', { venueId: params.venueId, billId: params.billId })
      socket.off('updateOrder')
    }
  }, [params.venueId, params.billId])

  useEffect(() => {
    if (initialData) {
      setBillData(initialData)
    }
  }, [initialData])

  // if (isFetching) return <Loading message="Buscando tu mesa" />

  if (isPending) return <Loading message="Buscando tu mesa" />
  if (isError) return 'An error has occured: ' + error?.message
  if (!billData) return <div>Cargando datos de la factura...</div>

  let status

  if (billData?.pos_order?.Status === 4 || billData.status === 'OPEN') {
    status = 'OPEN'
  } else if (billData.status === 'PENDING') {
    status = 'PENDING'
  } else if (billData?.pos_order?.Status === 0 || billData.status === 'CLOSED') {
    status = 'CLOSED'
  } else if (billData.status === 'PRECREATED') {
    status = 'PRECREATED'
  } else {
    status = 'UNKNOWN'
  }

  return (
    <Fragment>
      <div className="h-full max-w-lg px-2 mx-auto ">
        <Spacer size="xl" />

        <Flex align="center" direction="col">
          <H4 className="font-neue">Mesa {billData.tableNumber} </H4>
          <Spacer size="sm" />

          {/* TODO - definir los estados y segun el estado ponerlo */}
          {/* <H2
            className={clsx('text-white', {
              'bg-green-500': status === 'OPEN',
              'bg-red-500': status === 'CLOSED',
              'bg-yellow-500': status === 'PENDING',
              'bg-gray-500': status === 'PRECREATED',
            })}
          >
            STATUS {status}
          </H2> */}
          <Flex direction="col" align="center" className="w-full p-3 bg-white border rounded-md">
            <Flex direction="row" align="center" space="sm" justify="between" className="w-full">
              <H1>Pagar la cuenta</H1>
              <H2>${billData.pos_order?.Total || billData.total / 100}</H2>
            </Flex>
            <Spacer size="sm" />
            {status === 'OPEN' ? (
              <Flex direction="row" align="center" space="sm" justify="between" className="w-full">
                <H1>Por pagar</H1>
                <H2>${billData.amount_left / 100}</H2>
              </Flex>
            ) : null}
          </Flex>

          <Spacer size="xl" />

          <div className="w-full max-w-lg mx-auto">
            <div className="flex flex-col p-4 space-y-4 bg-white border rounded-md ">
              {billData.products?.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Flex space="xs">
                    <span className="box-border flex items-center justify-center w-6 h-6 font-semibold rounded-md bg-background-primary">
                      {product.quantity}
                    </span>
                    <span className="flex-1 overflow-hidden text-gray-600 w-52 whitespace-nowrap text-ellipsis text-over">
                      {product.name}
                    </span>
                  </Flex>
                  <span className="font-extralight">${(product.price / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <Spacer size="xl" />
          <div className="sticky w-full bottom-5">
            {status === 'OPEN' && (
              <Button onClick={() => openModal('payment_methods')} disabled={billData.amount_left <= 0} text={'Pagar'} />
            )}
          </div>
        </Flex>
      </div>
      {/* TODO modify icons */}
      <Modal isOpen={isModalOpen.payment_methods} closeModal={() => closeModal('payment_methods')} title="Método de pago">
        <ModalPadding>
          <IconButton icon={<CallSplit />} onClick={() => openModal('split_bill')} text={'Dividir Cuenta'} />
          <Spacer size="sm" />
          <IconButton icon={<Payment />} onClick={() => openModal('pay_full_bill')} text={'Pagar Cuenta Completa'} />

          {/* ANCHOR SplitBill */}
          <Modal isOpen={isModalOpen.split_bill} closeModal={() => closeModal('split_bill')} title="Dividir cuenta">
            <ModalPadding>
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
                orderedProducts={billData.products}
                isPending={isPending}
              />
              {/* ANCHOR innerModal - EqualParts */}
              <EqualPartsModal
                isInnerModalOpen={isInnerModalOpen}
                closeInnerModal={closeInnerModal}
                openInnerModal={openInnerModal}
                amountLeft={billData.amount_left}
                isPending={isPending}
              />
              {/* ANCHOR innerModal - Custom */}
              <CustomModal
                isInnerModalOpen={isInnerModalOpen}
                closeInnerModal={closeInnerModal}
                openInnerModal={openInnerModal}
                isPending={isPending}
              />
            </ModalPadding>
          </Modal>
          {/* ANCHOR FullBill */}
          <Modal isOpen={isModalOpen.pay_full_bill} closeModal={() => closeModal('pay_full_bill')} title="Pagar cuenta completa">
            <Checkout amount={billData.amount_left} />
          </Modal>
        </ModalPadding>
      </Modal>

      <ReactQueryDevtools initialIsOpen position="bottom" />
    </Fragment>
  )
}

export default BillId
