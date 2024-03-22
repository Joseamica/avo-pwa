import api from '@/axiosConfig'
import { Flex } from '@/components'
import { LinkButton } from '@/components/Button'
import { Amex, MasterCard, Visa } from '@/components/Icons'
import Loading from '@/components/Loading'
import { Spacer } from '@/components/Util/Spacer'
import { H1, H3, H4, H5 } from '@/components/Util/Typography'
import useModal from '@/hooks/useModal'
import useNotifications from '@/store/notifications'
import { getRandomPaymentMsg } from '@/utils/get-msgs'
import { RandomShapesSVG } from '@/utils/random-shapes'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FaCheckCircle, FaEye } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'
import { Link, useSearchParams } from 'react-router-dom'
import ErrorMessage from '../Error/ErrorMessage'
import Receipt from './Receipt'
import Review from './Review'

const Success: React.FC = () => {
  const [searchParams] = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')

  const { modalState, openModal, closeModal } = useModal()
  const [, notificationsActions] = useNotifications()

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['paymentIntent', paymentIntentId],
    queryFn: async () => {
      const response = await api.get(`/v1/stripe/payment-intent/${paymentIntentId}`)
      return response.data
    },
  })

  useEffect(() => {
    const paymentIntentsKey = 'paymentIntents'
    const paymentIntentId = searchParams.get('payment_intent')
    const paymentIntents = JSON.parse(localStorage.getItem(paymentIntentsKey) || '[]')

    if (isSuccess && !isError && !paymentIntents.includes(paymentIntentId)) {
      openModal('review')
      notificationsActions.push({
        options: {
          variant: 'paymentNotification',
        },
        message: getRandomPaymentMsg(),
      })

      // Agrega el nuevo paymentIntentId al array y lo guarda en el almacenamiento local
      paymentIntents.push(paymentIntentId)
      localStorage.setItem(paymentIntentsKey, JSON.stringify(paymentIntents))
    }
  }, [isSuccess, isError, notificationsActions, openModal, paymentIntentId, searchParams])

  if (isLoading) return <Loading message="Cargando el pago..." />
  if (isError) return <ErrorMessage responseError={error.message} />

  const card = data.payment_method_details.card
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-primary">
      <div className="relative flex-1 p-8 bg-white rounded-b-3xl">
        <RandomShapesSVG />
        <div className="relative flex flex-col items-center justify-center w-full space-y-4 ">
          <div className="tracking-tight text-center">
            <H1>Detalles de la transacción</H1>
          </div>
          <Spacer size="lg" />
          <div className="flex flex-col items-center justify-center ">
            <div className="p-3  bg-[#E7F9F0] rounded-full w-fit flex">
              <FaCheckCircle className="fill-[#36C073] h-20 w-20" />
            </div>
            <Spacer size="md" />
            <H3 bold="medium" className="tracking-tighter ">
              Pago Exitoso
            </H3>
            <Spacer size="sm" />
            <h1 className="text-5xl bg-white">${data?.amount / 100}</h1>
            <Spacer size="sm" />
            <Flex align="center" space="md" className="bg-white">
              <H3>{card.brand === 'visa' ? <Visa /> : card.brand === 'amex' ? <Amex /> : <MasterCard />}</H3>
              <H4 variant="secondary">***{card.last4}</H4>
            </Flex>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-1 p-5 bg-background-primary">
        <div>
          <Flex direction="col">
            <H4 variant="secondary" className="font-light">
              Transaction ID
            </H4>
            <H5 bold="semibold">{paymentIntentId}</H5>
          </Flex>
          <Spacer size="md" />
          <Flex direction="col">
            <H4 variant="secondary" className="font-light">
              Fecha & Hora
            </H4>
            <H5 bold="semibold">
              {new Date(data?.created * 1000).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </H5>
          </Flex>
          <Spacer size="md" />
          <div className="flex flex-row justify-between w-full">
            <Flex direction="col">
              <H4 variant="secondary" className="self-start">
                Recibo
              </H4>
              <H5 bold="semibold">{data.id.slice(-8)}</H5>
            </Flex>
            <div className="flex space-x-2">
              <Link
                to={data.receipt_url}
                className="flex flex-row items-center pl-4 space-x-2 border rounded-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Ver</span>
                <div className="flex items-center justify-center w-10 h-10 p-2 bg-white border rounded-full">
                  <FaEye />
                </div>
              </Link>
              <button onClick={() => openModal('receipt')} className="flex flex-row items-center pl-4 space-x-2 border rounded-full">
                <span>Enviar</span>
                <div className="flex items-center justify-center w-10 h-10 p-2 bg-white border rounded-full">
                  <MdSend />
                </div>
              </button>
            </div>
          </div>
          <Spacer size="sm" />
          <hr />
          <Spacer size="sm" />
          <Flex direction="col" className="w-full ">
            <Flex direction="row" align="center" justify="between">
              <H4 variant="secondary">Monto</H4>
              <H3 bold="medium" className="tracking-tighter ">
                ${(data?.metadata.amount / 100).toFixed(2)}
              </H3>
            </Flex>
            <Flex direction="row" align="center" justify="between">
              <H4 variant="secondary">Propina</H4>
              <H3 bold="medium" className="tracking-tighter ">
                ${((data?.amount * data?.metadata.tipPercentage) / 100).toFixed(2)}
              </H3>
            </Flex>
            {/* <Flex direction="row" align="center" justify="between">
              <H6 variant="secondary">Fee</H6>
              <H5 bold="medium" className="tracking-tighter ">
                ${Math.round((data.amount * 0.025) / (1 - 0.025) / 100)}
              </H5>
            </Flex> */}
            <Flex direction="row" align="center" justify="between">
              <H4 variant="secondary">Total</H4>
              <H3 bold="medium" className="tracking-tighter ">
                ${(data?.amount / 100).toFixed(2)}
              </H3>
            </Flex>
          </Flex>
        </div>
        <LinkButton
          to={`/venues/${data?.metadata.venueId}/bills/${data?.metadata.billId}`}
          reloadDocument={true}
          replace={true}
          size="md"
          text="Volver a la página principal"
        />
      </div>
      <Receipt isOpen={!!modalState['receipt']} closeModal={() => closeModal('receipt')} paymentIntentId={paymentIntentId} />
      <Review isOpen={!!modalState['review']} closeModal={() => closeModal('review')} venueId={data?.metadata.venueId} />
    </div>
  )
}

export default Success
