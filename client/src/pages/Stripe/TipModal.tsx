import { Flex } from '@/components'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import { H3, H4, JumboTitle } from '@/components/Util/Typography'
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
    avoFee: number
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
  return (
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
    </Modal>
  )
}
