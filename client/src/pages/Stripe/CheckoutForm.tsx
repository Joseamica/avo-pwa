import { Button } from '@/components/Button'
import { Spacer } from '@/components/Util/Spacer'
import { getUserLS } from '@/utils/localStorage/user'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useState } from 'react'
import TipModal from './TipModal'

const CheckoutForm = ({ amounts, tipPercentage, setTipPercentage, loading, setLoading, setErrorMessage }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [showTipModal, setShowTipModal] = useState(false)

  const handleError = error => {
    setLoading(false)
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

    setLoading(false)
    return true
  }

  // ANCHOR Complete Payment
  const completePayment = async () => {
    setLoading(true)

    try {
      // Verifica si estás utilizando un método de pago guardado

      const { user } = getUserLS()

      const response = await axios.post('http://localhost:5000/create-payment-intent', {
        amount: amounts.total,
        currency: 'mxn',
        customerId: user.stripeCustomerId,
      })
      const { client_secret: clientSecret, id } = response.data

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:5173/success`,
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

  const handleSubmit = async event => {
    event.preventDefault()
    const isValid = await validatePayment()

    if (isValid) {
      setShowTipModal(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-3 bg-white border-2 rounded-xl">
        <PaymentElement />
        {/* <h1>guardar tarjeta</h1>
        <input type="checkbox" checked={saveCard} onChange={() => setSaveCard(!saveCard)} /> */}
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
        className="sticky bottom-0 p-4 rounded-full disabled:bg-zinc-400"
        type="submit"
        disabled={!stripe || loading}
        text="Confirmar"
      />
    </form>
  )
}

export default CheckoutForm
