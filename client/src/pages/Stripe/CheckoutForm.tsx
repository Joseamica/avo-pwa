import api from '@/axiosConfig'
import { Flex } from '@/components'
import { Button } from '@/components/Button'
import { Spacer } from '@/components/Util/Spacer'
import { getUserLS } from '@/utils/localStorage/user'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import TipModal from './TipModal'

const CheckoutForm = ({
  amounts,
  tipPercentage,
  setTipPercentage,
  loading,
  setLoading,
  setErrorMessage,
  notificationsActions,
}: {
  amounts: {
    amount: number
    userFee: number
    total: number
  }
  tipPercentage: number
  setTipPercentage: (value: number) => void
  loading: boolean
  setLoading: (value: boolean) => void
  setErrorMessage: (value: string) => void
  notificationsActions: any
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [showTipModal, setShowTipModal] = useState(false)
  const [isInternationalCard, setIsInternationalCard] = useState(false as boolean)
  const [saveCard, setSaveCard] = useState(true as boolean)
  const params = useParams()

  const handleError = error => {
    setLoading(false)
    notificationsActions.push({
      options: {
        variant: 'errorNotification',
      },
      message: error.message,
    })
    setShowTipModal(false)
    setErrorMessage(error.message)
  }

  const validatePayment = async () => {
    if (!stripe || !elements) {
      return false
    }

    setLoading(true)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      handleError(submitError)
      setLoading(false)
      return false
    }

    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    })

    if (paymentMethodError) {
      handleError(paymentMethodError)
      setLoading(false)
      return false
    }

    if (paymentMethod.card.country !== 'MX') {
      setIsInternationalCard(true)
    }

    setLoading(false)
    return true
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const isValid = await validatePayment()

    if (isValid) {
      setShowTipModal(true)
    }
  }

  // ANCHOR Complete Payment
  const completePayment = async () => {
    setLoading(true)

    try {
      const { user } = getUserLS()

      const response = await api.post(`/v1/stripe/create-payment-intent`, {
        currency: 'mxn',
        customerId: user.stripeCustomerId,
        isInternationalCard,
        saveCard,
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
      const { client_secret: clientSecret } = response.data

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      })

      if (error) {
        handleError(error)
      } else {
        setShowTipModal(false)
        // Maneja el éxito del pago aquí
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4">
      <div className="p-4 bg-white border-2 rounded-3xl">
        <PaymentElement />
        <Flex direction="row" space="xs" align="center" className="flex justify-end w-full mt-3">
          <span>Guardar tarjeta</span>
          <button onClick={() => setSaveCard(!saveCard)} type="button">
            <div
              className={`relative w-12 h-5 rounded-full transition-all duration-300 ease-in-out ${
                saveCard ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute w-5 h-5 rounded-full transition-all duration-300 ease-in-out transform ${
                  saveCard ? 'translate-x-7 border' : 'border'
                } bg-white`}
              ></div>
            </div>
          </button>
        </Flex>
      </div>
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
      <Spacer size="md" />

      <Button
        size="md"
        className="p-4 mb-5 rounded-full bottom-4 disabled:bg-zinc-400"
        type="submit"
        disabled={!stripe || loading}
        text="Confirmar"
      />
    </form>
  )
}

export default CheckoutForm
