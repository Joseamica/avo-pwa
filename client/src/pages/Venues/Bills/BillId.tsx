import api from '@/axiosConfig'
import { Flex, H3 } from '@/components'
import { Button, IconButton } from '@/components/Button'
import { LineOnBottom, LineThrough } from '@/components/LineThrough'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import { ByProductModal, CustomModal, EqualPartsModal } from '@/components/Modals'
import { Spacer } from '@/components/Util/Spacer'
import { H1, H4, H5, ModalPadding } from '@/components'
import useModal from '@/hooks/useModal'
import ErrorMessage from '@/pages/Error/ErrorMessage'
import Checkout from '@/pages/Stripe/Checkout'
import { getUserLS } from '@/utils/localStorage/user'
import CallSplit from '@mui/icons-material/CallSplit'
import Edit from '@mui/icons-material/Edit'
import ListAlt from '@mui/icons-material/ListAlt'
import Payment from '@mui/icons-material/Payment'
import SafetyDivider from '@mui/icons-material/SafetyDivider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

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
  payments: any[]
  users: User[]
  total: number
  amount_left: number
  createdAt: number
  updatedAt: number
  tableNumber: number
  pos_order: { Status: number; Orden: number; Total: number }
}

const URL = import.meta.env.PROD ? 'https://avo-pwa.onrender.com' : '/'

export const socket = io(URL, {
  autoConnect: true,
})

function BillId() {
  const { venueId, billId } = useParams()

  const queryClient = useQueryClient()

  const [showDetails, setShowDetails] = useState<any>(false)
  const { user } = getUserLS()

  //TODO -  convert to useReducer
  const { modalState, openModal, closeModal } = useModal()

  const {
    data: billData,
    isPending,
    error,
    isError,
  } = useQuery<Bill>({
    queryKey: ['bill_data', venueId, billId],
    queryFn: async () => {
      try {
        const response = await api.get(`/v1/venues/${venueId}/bills/${billId}`)
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
    // Solo intentar unirse al room si `billData` y `billData.tableNumber` están definidos
    if (billData && billData.tableNumber !== undefined) {
      const roomInfo = { venueId: venueId, table: billData.tableNumber }
      socket.emit('joinRoom', roomInfo)

      socket.on('updateOrder', data => {
        queryClient.setQueryData(['bill_data'], data)
        queryClient.invalidateQueries({ queryKey: ['bill_data'] })
      })

      // Asegurarse de dejar el room al desmontar el componente
      return () => {
        socket.emit('leaveRoom', roomInfo)
        socket.off('updateOrder')
      }
    }
  }, [queryClient, venueId, billData?.tableNumber, billData])

  // if (isFetching) return <Loading message="Buscando tu mesa" />

  if (isPending) return <Loading message="Buscando tu mesa" />
  //FIXME - cambiar a un componente de error y un mensaje amigable!
  if (isError) return <ErrorMessage responseError={error.message} />
  if (!billData) return <div>Cargando datos de la factura...</div>

  const paymentsExist = billData.payments.length > 0

  return (
    <Fragment>
      <div className="h-full max-w-lg px-2 mx-auto ">
        <Spacer size="xl" />

        <Flex align="center" direction="col">
          <H4 bold="light">Mesa {billData.tableNumber} </H4>
          <Spacer size="sm" />
          {/* TODO - definir los estados y segun el estado ponerlo */}
          {/* <H2
            className={clsx('text-white', {
              'bg-green-500': billData.status === 'OPEN',
              'bg-red-500': billData.status === 'PAID',
              'bg-sky-500': billData.status === 'COURTESY',
              'bg-violet-500': billData.status === 'EARLYACCESS',
              'bg-yellow-500': billData.status === 'PENDING',
              'bg-gray-500': billData.status === 'CANCELED',
            })}
          >
            STATUS {billData.status}
            <p>{billData.status === 'EARLYACCESS' && 'el usuario scaneo el qr de la mesa antes de que existiera'}</p>
          </H2> */}
          <Flex direction="col" align="center" className="w-full px-4 py-3 bg-white border rounded-xl ">
            <Flex direction="row" align="center" space="sm" justify="between" className="flex-shrink-0 w-full">
              <H1>Cuenta total</H1>
              <H1 className="relative">
                ${billData.pos_order?.Total || billData.total / 100} {billData.amount_left !== Number(billData.total) && <LineThrough />}
              </H1>
            </Flex>

            {billData.status === 'OPEN' || billData.status === 'PAID' ? (
              <Fragment>
                <Spacer size="xs" />
                <hr className="w-full " />
                <Spacer size="xs" />
                <Flex direction="row" align="center" space="sm" justify="between" className="w-full">
                  <H1>Por pagar</H1>
                  <H1 className="relative">
                    {billData.status === 'PAID' ? (
                      '$0'
                    ) : (
                      <Fragment>
                        ${billData.amount_left / 100} <LineOnBottom />
                      </Fragment>
                    )}
                  </H1>
                </Flex>
                {paymentsExist ? (
                  <Fragment>
                    <Spacer size="md" />
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex flex-row items-center self-end px-2 space-x-2 border rounded-full bg-background-primary"
                    >
                      <H4>Desgloce pagos</H4> {showDetails ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                    </button>
                    <Spacer size="xs" />
                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: showDetails ? 'auto' : 0 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="self-start w-full px-3 py-1 space-y-2 border rounded-xl "
                        >
                          {billData.payments.map((payment, index) => (
                            <div key={index} className="flex flex-row items-center justify-between w-full space-x-2 ">
                              <H4 as="div">
                                {payment.customerId === user.stripeCustomerId ? <H4 bold="semibold">Pagaste</H4> : 'Pagaron'}
                              </H4>
                              <H4>${(payment.amount / 100).toFixed(2)}</H4>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ) : null}
              </Fragment>
            ) : null}
          </Flex>

          <Spacer size="md" />
          {billData.status === 'OPEN' || billData.status === 'PAID' ? (
            <div className="relative w-full max-w-lg mx-auto">
              <div className="relative flex flex-col p-4 space-y-4 bg-white border rounded-xl ">
                {billData.products?.map((product, index) => (
                  <div key={index} className="flex items-center justify-between ">
                    <div className="absolute left-0 w-[5px] rounded-tr-full rounded-br-full h-7 bg-buttons-main opacity-90" />
                    <Flex space="xs">
                      <H5 bold="medium" className="box-border flex items-center justify-center w-6 h-6 rounded-md bg-background-primary">
                        {product.quantity}
                      </H5>
                      <span className="flex-1 overflow-hidden text-gray-600 w-52 whitespace-nowrap text-ellipsis text-over">
                        {product.name}
                      </span>
                    </Flex>
                    <span className="font-light">${(product.price / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <Spacer size="xl" />
          <div className="sticky w-full bottom-5">
            {billData.status === 'OPEN' && (
              <Button onClick={() => openModal('payment_methods')} disabled={billData.amount_left <= 0} text={'Pagar'} />
            )}
          </div>
        </Flex>
      </div>
      {/* TODO modify icons */}
      <Modal isOpen={!!modalState['payment_methods']} closeModal={() => closeModal('payment_methods')} title="Método de pago">
        <ModalPadding>
          <IconButton icon={<CallSplit />} onClick={() => openModal('payment_methods.split_bill')} text={'Dividir Cuenta'} />
          <Spacer size="sm" />
          <IconButton icon={<Payment />} onClick={() => openModal('payment_methods.pay_full_bill')} text={'Pagar Cuenta Completa'} />

          {/* ANCHOR SplitBill */}
          <Modal
            isOpen={!!modalState['payment_methods.split_bill']}
            closeModal={() => closeModal('payment_methods.split_bill')}
            title="Dividir cuenta"
          >
            <ModalPadding>
              <IconButton
                icon={<ListAlt />}
                onClick={() => openModal('payment_methods.split_bill.by_product')}
                text={'Pagar por producto'}
              />
              <Spacer size="sm" />
              <IconButton
                icon={<SafetyDivider />}
                onClick={() => openModal('payment_methods.split_bill.equal_parts')}
                text={'Pagar partes iguales'}
              />
              <Spacer size="sm" />
              <IconButton
                icon={<Edit />}
                onClick={() => openModal('payment_methods.split_bill.custom')}
                text={'Pagar monto personalizado'}
              />
              <ByProductModal
                modalState={modalState}
                isOpen={!!modalState['payment_methods.split_bill.by_product']}
                openModal={openModal}
                closeModal={() => closeModal('payment_methods.split_bill.by_product')}
                orderedProducts={billData.products}
                isPending={isPending}
              />

              <EqualPartsModal
                isOpen={!!modalState['payment_methods.split_bill.equal_parts']}
                modalState={modalState}
                closeModal={closeModal} // Pasando la función que maneja el cierre de modales
                openModal={openModal} // Pasando la función que maneja la apertura de modales
                amountLeft={billData.amount_left} // La cantidad que queda por pagar
                isPending={isPending} // Estado de si la operación está pendiente
              />
              <CustomModal
                isOpen={!!modalState['payment_methods.split_bill.custom']}
                openModal={openModal}
                closeModal={closeModal}
                isPending={isPending}
                modalState={modalState}
              />
            </ModalPadding>
          </Modal>
          {/* ANCHOR FullBill */}
          <Modal
            isOpen={!!modalState['payment_methods.pay_full_bill']}
            closeModal={() => closeModal('payment_methods.pay_full_bill')}
            title="Pagar cuenta completa"
          >
            <Checkout amount={billData.amount_left} />
          </Modal>
        </ModalPadding>
      </Modal>
      <div className="relative w-full text-center">
        {billData?.products.length <= 0 ? <H3 variant="secondary">Aún no existen productos en esta orden.</H3> : null}
      </div>
    </Fragment>
  )
}

export default BillId
