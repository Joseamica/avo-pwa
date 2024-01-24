import { Flex } from '@/components'
import { StripeCheckoutForm } from '@/components/Forms/StripeCheckoutForm'
import Meta from '@/components/Meta'
import { Spacer } from '@/components/Util/Spacer'
import { H2, H4 } from '@/components/Util/Typography'
import { initStripe } from '@/utils/stripe'
import { Elements } from '@stripe/react-stripe-js'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

const Checkout = ({
  amount,
}: {
  amount?: {
    amount: number
  }
}) => {
  const stripePromise = initStripe('http://localhost:5000/publishable-key')

  const [tipPercentage, setTipPercentage] = useState(0)
  const [paymentMethodId, setPaymentMethodId] = useState('' as string)

  const [showStripeForm, setShowStripeForm] = useState(false)

  const tip = amount.amount * tipPercentage
  const avoFee = amount.amount * 0.05
  const total = Math.round(amount.amount + tip + avoFee)

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const response = await axios.post(`http://localhost:5000/payment-methods`, {
        customerId: 'cus_PQaa2AUl0jsSpH',
      })
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
    <div className="">
      <Meta title="Checkout" />
      {/* {data.paymentMethods.map((paymentMethod, index) => (
        <Flex key={index}>
          <button onClick={() => handleCardClick(paymentMethod.id)}>{paymentMethod.card.brand}</button>
          <button onClick={() => handleCardClick(paymentMethod.id)}>{paymentMethod.card.last4}</button>
        </Flex>
      ))} */}
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
            <H4 as="span" variant="avoqado">
              Tasa Avoqado:
            </H4>
            <H4 variant="avoqado" as="span">
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
          setPaymentMethodId={setPaymentMethodId}
          paymentMethodId={paymentMethodId}
          paymentMethods={data.paymentMethods}
        />
      </Elements>
    </div>
  )
}

export default Checkout
