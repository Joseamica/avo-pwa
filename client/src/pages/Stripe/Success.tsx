import { Flex } from '@/components'
import { Button, LinkButton } from '@/components/Button'
import { H1 } from '@/components/Util/Typography'
import useModal from '@/hooks/useModal'
import useNotifications from '@/store/notifications'
import { getRandomPaymentMsg } from '@/utils/get-msgs'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Receipt from './Receipt'
import { Spacer } from '@/components/Util/Spacer'

const Success: React.FC = () => {
  const [searchParams] = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')

  const { openModal, closeModal, isModalOpen } = useModal()
  const [, notificationsActions] = useNotifications()

  const { data, isLoading, isError, error, isFetched } = useQuery({
    queryKey: ['paymentIntent', paymentIntentId],
    queryFn: async () => {
      // const response = await axios.get(`/api/v1/stripe/payment-intent/${paymentIntentId}`)
      const response = await axios.get(`/api/v1/stripe/payment-intent/${paymentIntentId}`)
      return response.data
    },
  })

  useEffect(() => {
    function showNotification() {
      notificationsActions.push({
        options: {
          variant: 'paymentNotification',
        },
        message: getRandomPaymentMsg(),
      })
    }

    if (isFetched && !isError) {
      showNotification()
    }
  }, [isFetched, isError, notificationsActions])

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className="w-full max-w-md py-3 mx-auto mt-40">
      <Flex justify="between" align="center" className="px-4 py-2 rounded-full bg-background-success ">
        <H1 variant="success">Pagaste ✅</H1>
        <H1 className="line-through">${data.amount / 100}</H1>
      </Flex>
      <Spacer size="xl" />
      <Receipt isOpen={isModalOpen.receipt} closeModal={() => closeModal('receipt')} paymentIntentId={paymentIntentId} />
      <Button type="button" text="Obtener recibo" onClick={() => openModal('receipt')} />
      <LinkButton
        to={`/venues/${data.metadata.venueId}/bills/${data.metadata.billId}`}
        reloadDocument={true}
        replace={true}
        text="Volver a la página principal"
      />
    </div>
  )
}

export default Success
