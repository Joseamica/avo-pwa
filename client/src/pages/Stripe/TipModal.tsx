import { Flex } from '@/components'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import { H3, JumboTitle } from '@/components/Util/Typography'
import { Currency } from '@/utils/currency'
import clsx from 'clsx'

export default function TipModal({
  amounts,
  tipPercentage,
  setTipPercentage,
  showTipModal,
  setShowTipModal,
  loading,
  completePayment,
  stripe,
}: {
  amounts: {
    amount: number
    userFee: number
    total: number
  }
  tipPercentage: number
  setTipPercentage: (tipPercentage: number) => void
  showTipModal: boolean
  setShowTipModal: (showTipModal: boolean) => void
  loading: boolean
  completePayment: () => void
  stripe: any
}) {
  // const [showCustomTipModal, setShowCustomTipModal] = useState(false)
  // const [tipAmount, setTipAmount] = useState(0)

  // const handleAmountChange = e => {
  //   const amountInCents = e.target.value
  //   setTipAmount(amountInCents)
  //   // setTipPercentage(((amountInCents * 100) / amounts.total) * 100)
  // }

  return (
    <Modal
      isOpen={showTipModal}
      closeModal={() => setShowTipModal(false)}
      footer={
        <div className="text-center">
          <Flex space="xs" justify="center" align="center">
            <H3 as="span" variant="primary">
              Estás pagando:
            </H3>
            <H3 as="span" variant="secondary">
              {Currency(amounts.total)}
            </H3>
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
      <div className="p-4 leading-8 text-center">
        <JumboTitle>
          <span>Da las gracias</span> <br /> <span>con una propina</span>
        </JumboTitle>
        <Spacer size="md" />
        <H3 variant="secondary">Todas las propinas van directo a los meseros</H3>
      </div>
      <Flex direction="row" space="sm" justify="center" className="px-4 py-2 mb-2">
        <button
          type="button"
          onClick={() => setTipPercentage(0.0)}
          className={clsx(`relative border-2 h-20 w-44 rounded-3xl`, {
            'bg-buttons-main text-white': tipPercentage === 0.0,
            'bg-white': tipPercentage !== 0.0,
          })}
        >
          0%
          <span className="absolute inset-x-0 text-4xl -bottom-3">🥺</span>
        </button>
        <button
          type="button"
          onClick={() => setTipPercentage(0.1)}
          className={clsx(`relative border-2 h-20 w-44 rounded-3xl`, {
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
          className={clsx(`relative border-2 h-20 w-44 rounded-3xl`, {
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
          className={clsx(`relative border-2 h-20 w-44 rounded-3xl`, {
            'bg-buttons-main text-white': tipPercentage === 0.2,
            'bg-white': tipPercentage !== 0.2,
          })}
        >
          20%
          <span className="absolute inset-x-0 text-4xl -bottom-3">💚</span>
        </button>
      </Flex>
      {/* <button
        type="button"
        onClick={() => setShowCustomTipModal(true)}
        className={clsx(`relative border-2 h-20 w-44 rounded-3xl`, {
          'bg-buttons-main text-white': tipPercentage === 0.2,
          'bg-white': tipPercentage !== 0.2,
        })}
      >
        Propina personalizada
        <span className="absolute inset-x-0 text-4xl -bottom-3">💚</span>
      </button>
      <Modal isOpen={showCustomTipModal} closeModal={() => setShowCustomTipModal(false)}>
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
            onChange={handleAmountChange} // Handle input changes
            className={clsx(
              ` flex h-20 w-full bg-transparent text-6xl placeholder:p-2 placeholder:text-6xl focus:outline-none focus:ring-0`,
              {
                // 'animate-pulse placeholder:text-warning': actionData?.amountToPay,
              },
            )}
            placeholder="10.00"
          />
          <span className="text-[14px] w-32  flex justify-center text-center rounded-3xl shrink-0 px-2 text-texts-disabled">5%</span>
        </div>
        <p>{tipAmount}</p>
        <Button
          onClick={() => {
            setTipPercentage(tipAmount / amounts.total)
          }}
          disabled={loading}
          text={'Confirmar'}
        />
      </Modal> */}
    </Modal>
  )
}
