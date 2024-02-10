import { Flex } from '@/components'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import { H4, JumboTitle } from '@/components/Util/Typography'
import { getRandomJoke } from '@/sections/Header/utils'
import useNotifications from '@/store/notifications'
import { Currency } from '@/utils/currency'
import { getRandomPaymentMsg } from '@/utils/get-msgs'
import { useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import clsx from 'clsx'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function CheckoutCard({
  paymentMethodId,
  customerId,
  amounts,
  setErrorMessage,
  loading,
  setLoading,
  tipPercentage = 0 ? 0.15 : 0,
  setTipPercentage,
}) {
  const stripe = useStripe()
  const params = useParams()

  const navigate = useNavigate()
  const [showTipModal, setShowTipModal] = useState(false as boolean)

  const completePayment = async () => {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/stripe/create-payment-intent', {
        currency: 'mxn',
        customerId: customerId,
        paymentMethodId: paymentMethodId, // Usa el método de pago guardado
        params: {
          venueId: params.venueId,
          billId: params.billId,
        },
        amounts: {
          amount: amounts.amount,
          tipPercentage: tipPercentage,
          avoFee: amounts.avoFee,
          total: amounts.total,
        },
      })

      const clientSecret = response.data.client_secret

      // Confirma el pago con el método de pago guardado
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
        return_url: `http://localhost:5173/success`,
      })

      if (error) {
        setErrorMessage(error.message)
      } else {
        // Maneja el éxito del pago aquí
        // TODO redirigir a success o cerrar todos los modales y mostrar notificacion

        navigate(`/success?payment_intent=${paymentIntent.id}`)
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-between">
      <Modal
        isOpen={showTipModal}
        closeModal={() => setShowTipModal(false)}
        footer={
          <div className="text-center">
            <Flex space="xs" justify="center" align="center">
              <H4 as="span" variant="secondary">
                Estas Pagando:
              </H4>
              <H4 as="span" variant="secondary">
                {Currency(amounts.total)}
              </H4>
            </Flex>
            <Spacer size="md" />
            <Button
              size="md"
              text={loading ? 'Pagando...' : 'Pagar'}
              onClick={completePayment}
              disabled={!stripe || loading}
              className="disabled:bg-buttons-disabled"
            />
          </div>
        }
      >
        <div className="mb-5 leading-8 text-center">
          <JumboTitle>
            <span>Da las gracias</span> <br /> <span>con una propina</span>
          </JumboTitle>
          <H4 variant="secondary">Todas las propinas van directo a los meseros</H4>
        </div>
        <Flex direction="row" space="sm" justify="center" className="mb-2">
          <button
            type="button"
            onClick={() => setTipPercentage(0.1)}
            className={clsx(`relative border-2 h-28 w-44 rounded-xl`, {
              'bg-buttons-main text-white': tipPercentage === 0.1,
              'bg-white': tipPercentage !== 0.1,
            })}
          >
            10%
            <span className="absolute inset-x-0 text-4xl -bottom-3">😘</span>
          </button>
          <button
            type="button"
            onClick={() => setTipPercentage(0.15)}
            className={clsx(`relative border-2 h-28 w-44 rounded-xl`, {
              'bg-buttons-main text-white': tipPercentage === 0.15,
              'bg-white': tipPercentage !== 0.15,
            })}
          >
            15%
            <span className="absolute inset-x-0 text-4xl -bottom-3">🥰</span>
          </button>
          <button
            type="button"
            onClick={() => setTipPercentage(0.2)}
            className={clsx(`relative border-2 h-28 w-44 rounded-xl`, {
              'bg-buttons-main text-white': tipPercentage === 0.2,
              'bg-white': tipPercentage !== 0.2,
            })}
          >
            20%
            <span className="absolute inset-x-0 text-4xl -bottom-3">💚</span>
          </button>
        </Flex>
      </Modal>
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
