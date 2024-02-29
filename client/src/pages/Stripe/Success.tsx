import { Flex } from '@/components'
import { Button, LinkButton } from '@/components/Button'
import { Spacer } from '@/components/Util/Spacer'
import { H1 } from '@/components/Util/Typography'
import useModal from '@/hooks/useModal'
import useNotifications from '@/store/notifications'
import { getRandomPaymentMsg } from '@/utils/get-msgs'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Receipt from './Receipt'
import Review from './Review'
import instance from '@/axiosConfig'

const Success: React.FC = () => {
  const [searchParams] = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')

  const { openModal, closeModal, isModalOpen } = useModal()
  const [, notificationsActions] = useNotifications()

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['paymentIntent', paymentIntentId],
    queryFn: async () => {
      // const response = await axios.get(`/api/v1/stripe/payment-intent/${paymentIntentId}`)
      const response = await instance.get(`/v1/stripe/payment-intent/${paymentIntentId}`)
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
    const reviewModalShownKey = `reviewModalShown_${paymentIntentId}`
    const reviewModalShown = localStorage.getItem(reviewModalShownKey)

    if (isSuccess && !isError && !reviewModalShown) {
      openModal('review')
      showNotification()
      localStorage.setItem(reviewModalShownKey, 'true')
    }
  }, [isSuccess, isError, notificationsActions, openModal, paymentIntentId])

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className="w-full max-w-lg py-3 mx-auto mt-40">
      <Flex justify="between" align="center" className="px-4 py-2 rounded-full bg-background-success ">
        <H1 variant="success">Pagaste ✅</H1>
        <H1 className="line-through">${data.amount / 100}</H1>
      </Flex>
      <Spacer size="xl" />
      <Receipt isOpen={isModalOpen.receipt} closeModal={() => closeModal('receipt')} paymentIntentId={paymentIntentId} />
      <Review isOpen={isModalOpen.review} closeModal={() => closeModal('review')} />
      <Button type="button" text="Obtener recibo" onClick={() => openModal('receipt')} />
      <LinkButton
        to={`/venues/${data?.metadata.venueId}/bills/${data.metadata.billId}`}
        reloadDocument={true}
        replace={true}
        text="Volver a la página principal"
      />
    </div>
  )
}

export default Success
