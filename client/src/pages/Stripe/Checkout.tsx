import api from '@/axiosConfig'
import { Flex } from '@/components'
import { Amex, Check, MasterCard, Visa } from '@/components/Icons'
import Loading from '@/components/Loading'
import Meta from '@/components/Meta'
import { Spacer } from '@/components/Util/Spacer'
import { H2, H4 } from '@/components/Util/Typography'
import useNotifications from '@/store/notifications'
import getIcon from '@/utils/get-icon'
import { getUserLS } from '@/utils/localStorage/user'
import { initStripe } from '@/utils/stripe'
import { Elements } from '@stripe/react-stripe-js'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import ErrorMessage from '../Error/ErrorMessage'
import ErrorParagraph from '../Error/ErrorParagraph'
import CheckoutCard from './CheckoutCard'
import CheckoutForm from './CheckoutForm'

const stripePublishableKey =
  import.meta.env.MODE === 'production'
    ? 'https://avo-pwa.onrender.com/v1/stripe/publishable-key'
    : 'http://localhost:5000/v1/stripe/publishable-key'
const stripePromise = initStripe(stripePublishableKey)

/**
 * Checkout component for processing payments.
 *
 * @component
 * @param {number} amount - The amount to be paid in Int format.
 * @returns {JSX.Element} The rendered Checkout component.
 */
const Checkout = ({ amount }: { amount: number }) => {
  const [tipPercentage, setTipPercentage] = useState(0 as number)
  const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false as boolean)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState() as any
  const [, notificationsActions] = useNotifications()

  //CHECKOUT CARD ONLY
  const [paymentMethodId, setPaymentMethodId] = useState('' as string)
  const [isInternationalCard, setIsInternationalCard] = useState(false as boolean)

  const { user } = getUserLS()

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const response = await api.post(`/v1/stripe/payment-methods`, {
        // const response = await api.post(`/api/v1/stripe/payment-methods`, {
        customerId: user.stripeCustomerId,
      })

      return response.data
    },
  })

  useEffect(() => {
    setErrorMessage(null)
  }, [isPaymentFormVisible])

  if (amount / 100 < 10) {
    return <div>El monto mínimo es de $10</div>
  }

  const tip = amount * tipPercentage
  const userFee = Math.round((amount * 0.025) / (1 - 0.025))
  const total = Math.round(amount + tip + userFee)

  if (isLoading) return <Loading message="Cargando stripe..." />
  if (isError) return <ErrorMessage responseError={error.message} />

  const handlePaymentOptions = (paymentMethodId?: string) => {
    if (paymentMethodId) {
      const selectedCard = data.paymentMethods.find(card => card.id === paymentMethodId)
      if (selectedCard.card.country !== 'MX') {
        setIsInternationalCard(true)
      } else {
        setIsInternationalCard(false)
      }
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
          paymentMethodCreation: 'manual', //NOTE ES NECESARIA?
          currency: 'mxn',
          setup_future_usage: 'off_session',
          appearance: {
            theme: 'flat',
            variables: {
              // colorBackground: errorMessage ? '#E57373' : '#f8f9fa',
              // colorText: errorMessage ? '#FF3B3C' : '#000',
              // colorDanger: '#df1b41',
              fontFamily: 'Ideal Sans, system-ui, sans-serif',
              spacingUnit: '5px',
              colorPrimary: '#4fa94d',
              borderRadius: '20px',
              fontSmooth: 'auto',
            },
          },
        }}
      >
        <div className="px-4 pt-4">
          <PaymentSummary amount={amount} userFee={userFee} />
        </div>
        <Spacer size="md" />
        <div className="px-4 space-y-2">
          {data.paymentMethods?.map(paymentMethod => (
            <button
              className={clsx('relative w-full p-3 max-h-16 bg-white border-2 rounded-full flex justify-start space-x-4 items-center')}
              key={paymentMethod.id}
              onClick={() => handlePaymentOptions(paymentMethod.id)}
            >
              <Flex
                align="center"
                justify="center"
                className={clsx(
                  'box-border  left-0  flex-shrink-0 w-8 h-8 p-1 border-2 rounded-full cursor-pointer ',
                  paymentMethodId === paymentMethod.id ? 'bg-buttons-main border-borders-button' : 'border-gray-300',
                )}
              >
                {paymentMethodId === paymentMethod.id ? <Check className="w-3 h-3 fill-white" /> : null}
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
              'relative w-full space-x-4 p-3 max-h-16 bg-white border-2 rounded-full flex justify-start items-center',
              // isPaymentFormVisible && 'bg-green-500',
            )}
            onClick={() => handlePaymentOptions()}
          >
            <Flex
              align="center"
              justify="center"
              className={clsx(
                'box-border  left-0  flex-shrink-0 w-8 h-8 p-1 border-2 rounded-full cursor-pointer ',
                isPaymentFormVisible ? 'bg-buttons-main border-borders-button' : 'border-gray-300',
              )}
            >
              {isPaymentFormVisible ? <Check className="w-3 h-3 fill-white" /> : null}
            </Flex>
            <Flex align="center" space="md">
              <H4 className="tracking-wide">Tarjeta</H4>
              <Visa />
              <Amex />
              <MasterCard />
            </Flex>
            <div />
          </button>
        </div>
        <Spacer size="md" />
        {errorMessage && (
          <div className="px-4 ">
            <ErrorParagraph message={errorMessage} />
          </div>
        )}
        {isPaymentFormVisible ? (
          <CheckoutForm
            setErrorMessage={setErrorMessage}
            amounts={{
              amount: amount,
              userFee: userFee,
              total: total,
            }}
            loading={loading}
            setLoading={setLoading}
            tipPercentage={tipPercentage}
            setTipPercentage={setTipPercentage}
            notificationsActions={notificationsActions}
          />
        ) : (
          <CheckoutCard
            paymentMethodId={paymentMethodId}
            isInternationalCard={isInternationalCard}
            setErrorMessage={setErrorMessage}
            amounts={{
              amount: amount,
              userFee: userFee,
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
    </div>
  )
}

const PaymentSummary = ({ amount, userFee }: { amount: number; userFee: number }) => {
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
          ${(amount / 100).toFixed(2)}
        </H4>
      </Flex>
      <Flex space="sm" align="center" justify="between">
        <H4 as="span" variant="avoqado">
          Tasa Avoqado:
        </H4>
        <H4 variant="avoqado" as="span">
          ${(userFee / 100).toFixed(2)}
        </H4>
      </Flex>
      <Flex space="sm" align="center" justify="between">
        <H4 bold="normal" as="span">
          Total:
        </H4>
        <H4 as="span">${(amount / 100 + userFee / 100).toFixed(2)}</H4>
      </Flex>
    </div>
  )
}
export default Checkout
