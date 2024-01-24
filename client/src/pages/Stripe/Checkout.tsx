import { Flex } from '@/components'
import Meta from '@/components/Meta'
import { Spacer } from '@/components/Util/Spacer'
import { H2, H4 } from '@/components/Util/Typography'
import { getUserLS } from '@/utils/localStorage/user'
import { initStripe } from '@/utils/stripe'
import { Elements } from '@stripe/react-stripe-js'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'
import { useState } from 'react'
import CheckoutCard from './CheckoutCard'
import CheckoutForm from './CheckoutForm'
import { CheckCircle } from '@mui/icons-material'
import { Amex, Check, Visa } from '@/components/Icons'
import getIcon from '@/utils/get-icon'

const stripePromise = initStripe('http://localhost:5000/publishable-key')

const Checkout = ({
  amount,
}: {
  amount?: {
    amount: number
  }
}) => {
  const [tipPercentage, setTipPercentage] = useState(0 as number)
  const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false as boolean)
  const [paymentMethodId, setPaymentMethodId] = useState('' as string)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState() as any

  const tip = amount.amount * tipPercentage
  const avoFee = amount.amount * 0.05
  const total = Math.round(amount.amount + tip + avoFee)

  const { user } = getUserLS()

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const response = await axios.post(`http://localhost:5000/payment-methods`, {
        customerId: user.stripeCustomerId,
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

  const handlePaymentOptions = (paymentMethodId?: string) => {
    if (paymentMethodId) {
      setIsPaymentFormVisible(false)
      setPaymentMethodId(paymentMethodId)
    } else {
      setIsPaymentFormVisible(true)
      setPaymentMethodId('')
    }
  }

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
        <PaymentSummary amount={amount.amount} avoFee={avoFee} />
        <Spacer size="md" />
        <div className="space-y-2">
          {data.paymentMethods?.map(paymentMethod => (
            <button
              className={clsx('relative w-full p-3 max-h-16 bg-white border-2 rounded-full flex justify-between items-center')}
              key={paymentMethod.id}
              onClick={() => handlePaymentOptions(paymentMethod.id)}
            >
              <Flex
                align="center"
                justify="center"
                className={clsx(
                  'box-border  left-0  flex-shrink-0 w-8 h-8 p-1 border-4 rounded-full cursor-pointer ',
                  paymentMethodId === paymentMethod.id ? 'bg-buttons-main border-borders-button' : 'border-gray-300',
                )}
              >
                {paymentMethodId === paymentMethod.id ? <Check className="fill-white" /> : null}
              </Flex>

              <Flex align="center" space="md">
                <span>{getIcon(paymentMethod.card.brand)}</span>
                <span>****{paymentMethod.card.last4}</span>
              </Flex>
              <div />
            </button>
          ))}
          <button
            className={clsx(
              'relative w-full p-3 max-h-16 bg-white border-2 rounded-full flex justify-between items-center',
              // isPaymentFormVisible && 'bg-green-500',
            )}
            onClick={() => handlePaymentOptions()}
          >
            <Flex
              align="center"
              justify="center"
              className={clsx(
                'box-border  left-0  flex-shrink-0 w-8 h-8 p-1 border-4 rounded-full cursor-pointer ',
                isPaymentFormVisible ? 'bg-buttons-main border-borders-button' : 'border-gray-300',
              )}
            >
              {isPaymentFormVisible ? <Check className="fill-white" /> : null}
            </Flex>
            <span>Tarjeta de Crédito</span>
            <div />
          </button>
        </div>
        <Spacer size="md" />
        {isPaymentFormVisible ? (
          <CheckoutForm
            setErrorMessage={setErrorMessage}
            amounts={{
              amount: amount.amount,
              avoFee: avoFee,
              total: total,
            }}
            loading={loading}
            setLoading={setLoading}
            tipPercentage={tipPercentage}
            setTipPercentage={setTipPercentage}
            paymentMethods={data.paymentMethods}
          />
        ) : (
          <CheckoutCard
            paymentMethodId={paymentMethodId}
            setErrorMessage={setErrorMessage}
            amounts={{
              amount: amount.amount,
              avoFee: avoFee,
              total: total,
            }}
            loading={loading}
            setLoading={setLoading}
            customerId={user.stripeCustomerId}
            tipPercentage={tipPercentage}
            setTipPercentage={setTipPercentage}
          />
        )}
      </Elements>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  )
}

const PaymentSummary = ({ amount, avoFee }) => {
  return (
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
          ${amount / 100}
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
        <H4 as="span">${amount / 100 + avoFee / 100}</H4>
      </Flex>
    </div>
  )
}
export default Checkout
