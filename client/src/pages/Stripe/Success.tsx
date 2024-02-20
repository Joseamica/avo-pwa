import useModal from '@/hooks/useModal'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link, useSearchParams } from 'react-router-dom'
import Receipt from './Receipt'
import { Button } from '@/components/Button'
import useNotifications from '@/store/notifications'
import { getRandomPaymentMsg } from '@/utils/get-msgs'
import { useEffect } from 'react'

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
    <div>
      <h1>Payment Successful!</h1>
      <p>Pagaste: {data.amount / 100}</p>

      <Receipt isOpen={isModalOpen.receipt} closeModal={() => closeModal('receipt')} paymentIntentId={paymentIntentId} />
      <Button type="button" text="Obtener recibo" onClick={() => openModal('receipt')} />
      <Link to={`/venues/${data.metadata.venueId}/bills/${data.metadata.billId}`} reloadDocument replace={true}>
        Volver a la página principal
      </Link>
    </div>
  )
}

export default Success
