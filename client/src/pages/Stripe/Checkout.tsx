import { useEffect, useState } from 'react'
import axios from 'axios'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { StripeCheckoutForm } from '@/components/Forms/StripeCheckoutForm'
import Meta from '@/components/Meta'

const initStripe = async () => {
  const res = await axios.get('/api/publishable-key')
  const publishableKey = await res.data.publishable_key

  return loadStripe(publishableKey)
}

const Checkout = () => {
  const stripePromise = initStripe()

  const [clientSecretSettings, setClientSecretSettings] = useState({
    clientSecret: '',
    loading: true,
  })

  useEffect(() => {
    async function createPaymentIntent() {
      const response = await axios.post('/api/create-payment-intent', {})

      setClientSecretSettings({
        clientSecret: response.data.client_secret,
        loading: false,
      })
    }

    createPaymentIntent()
  }, [])

  return (
    <div>
      <Meta title="Checkout" />

      {clientSecretSettings.loading ? (
        <h1>Loading ...</h1>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecretSettings.clientSecret,
            appearance: { theme: 'stripe' },
          }}
        >
          <StripeCheckoutForm />
        </Elements>
      )}
    </div>
  )
}

export default Checkout
