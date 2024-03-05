import instance from '@/axiosConfig'
import { Flex } from '@/components'
import { IconButton, LinkButton } from '@/components/Button'
import { LineOnBottom } from '@/components/LineThrough'
import { Spacer } from '@/components/Util/Spacer'
import { H1 } from '@/components/Util/Typography'
import useModal from '@/hooks/useModal'
import useNotifications from '@/store/notifications'
import { getRandomPaymentMsg } from '@/utils/get-msgs'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FaReceipt } from 'react-icons/fa'
import { useSearchParams } from 'react-router-dom'
import Receipt from './Receipt'
import Review from './Review'

const Success: React.FC = () => {
  const [searchParams] = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')

  const { openModal, closeModal, isModalOpen } = useModal()
  const [, notificationsActions] = useNotifications()

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['paymentIntent', paymentIntentId],
    queryFn: async () => {
      const response = await instance.get(`/v1/stripe/payment-intent/${paymentIntentId}`)
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

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <span>Error: {error?.message}</span>
  }

  return (
    <div className="w-full max-w-lg p-3 mx-auto mt-40 ">
      <Flex justify="between" align="center" className="px-4 py-2 rounded-full bg-background-success">
        <H1 variant="success">Pagaste ✅</H1>
        <H1 className="relative">
          ${data?.amount / 100}
          <LineOnBottom />
        </H1>
      </Flex>
      <Spacer size="xl" />
      <Receipt isOpen={isModalOpen.receipt} closeModal={() => closeModal('receipt')} paymentIntentId={paymentIntentId} />
      <Review isOpen={isModalOpen.review} closeModal={() => closeModal('review')} venueId={data?.metadata.venueId} />
      <IconButton icon={<FaReceipt />} text="Obtener recibo" onClick={() => openModal('receipt')} />
      <Spacer size="sm" />
      <LinkButton
        to={`/venues/${data?.metadata.venueId}/bills/${data?.metadata.billId}`}
        reloadDocument={true}
        replace={true}
        text="Volver a la página principal"
      />
    </div>
  )
}

export default Success
