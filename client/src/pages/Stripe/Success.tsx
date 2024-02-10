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
  const [searchParams, setSearchParams] = useSearchParams()
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
    if (isFetched && !isError) {
      showNotification()
    }
  }, [isFetched, isError])

  function showNotification() {
    notificationsActions.push({
      options: {
        // Show fully customized notification
        // Usually, to show a notification, you'll use something like this:
        // notificationsActions.push({ message: ... })
        // `message` accepts string as well as ReactNode
        // If you want to show a fully customized notification, you can define
        // your own `variant`s, see @/sections/Notifications/Notifications.tsx
        variant: 'paymentNotification',
      },
      message: getRandomPaymentMsg(),
    })
  }
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
      <Link to={`/venues/${data.metadata.venueId}/bills/${data.metadata.billId}`}>Volver a la página principal</Link>
    </div>
  )
}

export default Success
