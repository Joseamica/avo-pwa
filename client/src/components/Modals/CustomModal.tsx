import { Currency } from '@/utils/currency'

import Checkout from '@/pages/Stripe/Checkout'
import clsx from 'clsx'
import { useState } from 'react'
import { Button } from '../Button'
import Modal from '../Modal'
import { Flex } from '../Util/Flex'

/**
 * Renders a custom modal component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isInnerModalOpen - Indicates whether the inner modal is open.
 * @param {Function} props.closeInnerModal - The function to close the inner modal.
 * @param {Function} props.openInnerModal - The function to open the inner modal.
 * @param {number} props.customAmount - The custom amount value.
 * @param {Function} props.setCustomAmount - The function to set the custom amount.
 * @param {boolean} props.isPending - Indicates whether the operation is pending.
 * @returns {JSX.Element} The custom modal component.
 */
type CustomModalProps = {
  modalState: Record<string, boolean>
  closeModal: (modalKey: string) => void
  openModal: (modalKey: string) => void
  isPending: boolean
  isOpen: boolean // El tipo correcto para un valor booleano
}
export default function CustomModal({ modalState, isOpen, closeModal, openModal, isPending }: CustomModalProps) {
  const [customAmount, setCustomAmount] = useState(0)

  const handleAmountChange = e => {
    const amountInCents = e.target.value * 100
    setCustomAmount(amountInCents)
  }

  const handleOpenCheckout = () => {
    openModal('custom.checkout')
  }

  const handleClose = () => {
    closeModal('payment_methods.split_bill.custom')
  }

  return (
    <Modal
      isOpen={isOpen}
      closeModal={handleClose}
      title="Pagar monto personalizado"
      footer={
        <Flex direction="col">
          <Flex direction="row" justify="between" align="center" className="mb-4">
            <span className="text-[21px] leading-6">Total seleccionado</span>
            <span className="text-[21px] leading-6"> {Currency(customAmount)}</span>
          </Flex>
          <Button onClick={handleOpenCheckout} disabled={isPending || customAmount / 100 < 10} text={'Confirmar'} size="md" />
        </Flex>
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
          onChange={handleAmountChange} // Handle input changes
          className={clsx(
            ` flex h-20 w-full bg-transparent text-6xl placeholder:p-2 placeholder:text-6xl focus:outline-none focus:ring-0`,
            {
              // 'animate-pulse placeholder:text-warning': actionData?.amountToPay,
            },
          )}
          placeholder="10.00"
        />
        <span className="text-[14px] w-32  flex justify-center text-center rounded-3xl shrink-0 px-2 text-texts-disabled">Min. $10.00</span>
      </div>
      <Modal isOpen={!!modalState['custom.checkout']} closeModal={() => closeModal('custom.checkout')} title="Método de pago">
        {' '}
        <Checkout amount={customAmount} />
      </Modal>
    </Modal>
  )
}
