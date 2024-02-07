import useModal from '@/hooks/useModal'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import Receipt from './Receipt'
import { Button } from '@/components/Button'

const Success: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')

  const { openModal, closeModal, isModalOpen } = useModal()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['paymentIntent', paymentIntentId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/payment-intent/${paymentIntentId}`)
      return response.data
    },
  })

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
    </div>
  )
}

export default Success
