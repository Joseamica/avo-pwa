import React, { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import Modal from '../Modal'
import useModal from '@/hooks/useModal'
import { Button, Button2 } from '../Button'
import { Currency } from '@/utils/currency'
import axios from 'axios'
import { H3, H4, JumboTitle } from '../Util/Typography'
import { Flex } from '../Util/Flex'
import clsx from 'clsx'
import { Spacer } from '../Util/Spacer'

const StripeCheckoutForm = ({ amounts, tipPercentage, setTipPercentage }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)

  useEffect(() => {
    setTipPercentage(0.15)
  }, [showTipModal === true])

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

  const completePayment = async () => {
    setLoading(true)

    const response = await axios.post('http://localhost:5000/create-payment-intent', {
      amount: amounts.total, // Usa el monto actualizado
      currency: 'mxn',
    })

    const { client_secret: clientSecret } = response.data

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: 'http://localhost:5173/success',
      },
    })

    if (error) {
      handleError(error)
    } else {
      setShowTipModal(false)
      // Maneja el éxito del pago aquí
    }

    setLoading(false)
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
            <Button size="md" text="Pagar" onClick={completePayment} />
          </div>
        }
      >
        <div className="leading-8 text-center pb">
          <JumboTitle>
            <span>Da las gracias</span> <br /> <span>con una propina</span>
          </JumboTitle>
          <H3 variant="secondary">Todas las propinas van directo a los meseros</H3>
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
        {/* TODO */}
        {/* <button onClick={() => setPersonalizedTipModal(true)}>Personalizar propina</button> */}
        {/* <Modal
          isOpen={personalizedTipModal}
          closeModal={() => setPersonalizedTipModal(false)}
          title="¿Cuánto quieres dar de propina?"
          footer={
            <div className="text-center">
              <Flex space="xs" justify="center" align="center">
                <H3 as="span">Estas Pagando:</H3>
                <H3 as="span" variant="secondary">
                  {Currency(amounts.total)}
                </H3>
              </Flex>
              <Button size="small" text="Confirmar Pago con Propina" onClick={completePayment} />
            </div>
          }
        >
          <div className="flex flex-row items-center w-full px-4 py-2 ">
            <label htmlFor="custom" className={clsx('text-6xl text-texts-disabled')}>
              $
            </label>
            <input
              type="number"
              name="amountToPay"
              min="10"
              id="custom"
              inputMode="decimal"
              onChange={e => setTipPercentage(e.target.value)} // Handle input changes
              className={clsx(
                ` flex h-20 w-full bg-transparent text-6xl placeholder:p-2 placeholder:text-6xl focus:outline-none focus:ring-0`,
                {
                  // 'animate-pulse placeholder:text-warning': actionData?.amountToPay,
                },
              )}
              placeholder="0.00"
            />
          </div>
        </Modal> */}
      </Modal>
      <Spacer size="md" />
      <Button
        size="md"
        className="p-4 rounded-full bg-violet-600 disabled:bg-zinc-400"
        type="submit"
        disabled={!stripe || loading}
        text="  Validar Datos de Pago"
      />

      {/* {errorMessage && <div>{errorMessage}</div>} */}
    </form>
  )
}

export { StripeCheckoutForm }
