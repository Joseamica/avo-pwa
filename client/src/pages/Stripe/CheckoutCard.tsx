import instance from '@/axiosConfig'
import { Button } from '@/components/Button'
import { Spacer } from '@/components/Util/Spacer'
import { useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TipModal from './TipModal'

export default function CheckoutCard({
  paymentMethodId,
  isInternationalCard,
  customerId,
  amounts,
  setErrorMessage,
  loading,
  setLoading,
  tipPercentage,
  setTipPercentage,
}: {
  paymentMethodId: string
  isInternationalCard: boolean
  customerId: string
  amounts: {
    amount: number
    userFee: number
    total: number
  }
  setErrorMessage: (message: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  tipPercentage: number
  setTipPercentage: (tipPercentage: number) => void
}) {
  const stripe = useStripe()
  const params = useParams()

  const navigate = useNavigate()
  const [showTipModal, setShowTipModal] = useState(false as boolean)

  const completePayment = async () => {
    try {
      setLoading(true)
      const response = await instance.post('/v1/stripe/create-payment-intent', {
        currency: 'mxn',
        customerId: customerId,
        isInternationalCard,
        paymentMethodId: paymentMethodId, // Usa el método de pago guardado
        params: {
          venueId: params.venueId,
          billId: params.billId,
        },
        amounts: {
          amount: amounts.amount,
          tipPercentage: tipPercentage,
          userFee: amounts.userFee,
          total: amounts.total,
        },
      })

      const clientSecret = response.data.client_secret

      // Confirma el pago con el método de pago guardado
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
        return_url: `${window.location.origin}/success`,
      })

      if (error) {
        setErrorMessage(error.message)
      } else {
        // Maneja el éxito del pago aquí
        // TODO redirigir a success o cerrar todos los modales y mostrar notificacion

        navigate(`/success?payment_intent=${paymentIntent.id}`, { replace: true })
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-between">
      <TipModal
        amounts={amounts}
        tipPercentage={tipPercentage}
        setTipPercentage={setTipPercentage}
        showTipModal={showTipModal}
        setShowTipModal={setShowTipModal}
        loading={loading}
        completePayment={completePayment}
        stripe={stripe}
      />
      <Spacer size="jumbo" />
      <div className="fixed inset-x-4 bottom-4">
        <div className="flex-1">
          <Button
            size="md"
            text={loading ? 'Confirmando...' : 'Confirmar'}
            onClick={() => {
              setTipPercentage(0.15) // Set tipPercentage to 0.15
              setShowTipModal(true) // Open the modal
            }}
            disabled={!stripe || loading || !paymentMethodId}
            className="sticky bottom-0 p-4 rounded-full disabled:bg-zinc-400"
          />
        </div>
      </div>
    </div>
  )
}
