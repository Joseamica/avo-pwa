import { Flex } from '@/components'
import { StripeCheckoutForm } from '@/components/Forms/StripeCheckoutForm'
import Meta from '@/components/Meta'
import { Spacer } from '@/components/Util/Spacer'
import { H2, H3, H4 } from '@/components/Util/Typography'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { useEffect, useState } from 'react'

const initStripe = async () => {
  const res = await axios.get('http://localhost:5000/publishable-key')
  const publishableKey = await res.data.publishable_key

  return loadStripe(publishableKey)
}

const Checkout = ({
  amount,
}: {
  amount?: {
    amount: number
  }
}) => {
  const stripePromise = initStripe()

  const [tipPercentage, setTipPercentage] = useState(0)

  const tip = amount.amount * tipPercentage
  const avoFee = amount.amount * 0.05
  const total = Math.round(amount.amount + tip + avoFee)

  return (
    <div className="">
      <Meta title="Checkout" />

      <Elements
        stripe={stripePromise}
        options={{
          mode: 'payment',
          amount: total,
          currency: 'mxn',
          setup_future_usage: 'off_session',
          appearance: {
            theme: 'stripe',
            variables: {
              // colorBackground: '#1e1e1e',
              // colorText: '#30313d',
              // colorDanger: '#df1b41',
              fontFamily: 'Ideal Sans, system-ui, sans-serif',
              spacingUnit: '6px',
              colorPrimary: '#4fa94d',
              borderRadius: '20px',
              fontSmooth: 'auto',
            },
          },
        }}
      >
        <div className="flex flex-col justify-center w-full px-4 py-2 bg-white border-2 rounded-xl">
          <H2 bold="normal" as="p">
            Resumen de pago
          </H2>
          <Spacer size="md" />
          <Flex space="sm" align="center" justify="between">
            <H4 variant="secondary" as="span">
              Subtotal (Iva incluido):
            </H4>
            <H4 variant="secondary" as="span">
              ${amount.amount / 100}
            </H4>
          </Flex>
          <Flex space="sm" align="center" justify="between">
            <H4 as="span" variant="secondary">
              Tasa Avoqado:
            </H4>
            <H4 variant="secondary" as="span">
              ${avoFee / 100}
            </H4>
          </Flex>
          <Flex space="sm" align="center" justify="between">
            <H4 bold="normal" as="span">
              Total:
            </H4>
            <H4 as="span">${amount.amount / 100 + avoFee / 100}</H4>
          </Flex>
        </div>
        <Spacer size="md" />
        <StripeCheckoutForm
          amounts={{
            amount: amount.amount,
            avoFee: avoFee,
            total: total,
          }}
          tipPercentage={tipPercentage}
          setTipPercentage={setTipPercentage}
        />
      </Elements>
    </div>
  )
}

export default Checkout
