import { Flex } from '@/components'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import { H4, JumboTitle, H3 } from '@/components/Util/Typography'
import { Currency } from '@/utils/currency'
import { getUserLS } from '@/utils/localStorage/user'
import { IncognitoUser } from '@/utils/types/user'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TipModal from './TipModal'

const CheckoutForm = ({ paymentMethods, amounts, tipPercentage, setTipPercentage, loading, setLoading, setErrorMessage }) => {
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

      const { client_secret: clientSecret } = response.data

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: 'http://localhost:5173/success',
          //NOTE sirve?
          // payment_method: paymentMethodId,
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
      <PaymentElement />
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
      <Button size="md" className="p-4 rounded-full disabled:bg-zinc-400" type="submit" disabled={!stripe || loading} text="Confirmar" />
    </form>
  )
}

export default CheckoutForm
