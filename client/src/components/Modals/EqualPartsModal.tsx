import React, { useState } from 'react'
import Modal from '../Modal'
import Checkout from '@/pages/Stripe/Checkout'
import { Currency } from '@/utils/currency'

import EqualParts from '../Payments/EqualParts'
import { Flex } from '../Util/Flex'
import { Button } from '../Button'

/**
 * Renders a modal component for equal parts payment.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isInnerModalOpen - Indicates whether the inner modal is open.
 * @param {Function} props.closeInnerModal - The function to close the inner modal.
 * @param {Function} props.openInnerModal - The function to open the inner modal.
 * @param {any} props.data - The data for the modal.
 * @param {any} props.payingFor - The item being paid for.
 * @param {Function} props.setPayingFor - The function to set the item being paid for.
 * @param {any} props.partySize - The size of the party.
 * @param {Function} props.setPartySize - The function to set the size of the party.
 * @param {any} props.totalEqualParts - The total amount for equal parts payment.
 * @param {any} props.isPending - Indicates whether the payment is pending.
 * @returns {JSX.Element} The rendered modal component.
 */
type EqualPartsModalProps = {
  isInnerModalOpen: any
  closeInnerModal: any
  openInnerModal: any
  amountLeft: number
  isPending: any
}

export default function EqualPartsModal({
  isInnerModalOpen,
  closeInnerModal,
  openInnerModal,
  amountLeft,
  isPending,
}: EqualPartsModalProps) {
  const [payingFor, setPayingFor] = useState(1) // Total de personas que pagan
  const [partySize, setPartySize] = useState(2) // Total de personas en la mesa

  const amountEach = amountLeft / partySize
  const totalEqualParts = amountEach * payingFor

  return (
    <Modal
      isOpen={isInnerModalOpen.equal_parts}
      closeModal={() => closeInnerModal('equal_parts')}
      title="Pagar partes iguales"
      footer={
        <Flex direction="col">
          <Flex direction="row" justify="between" align="center" className="mb-4">
            <span className="text-[21px] leading-6">Estás pagando</span>
            <span className="text-[21px] leading-6"> {Currency(totalEqualParts)}</span>
          </Flex>
          <Button onClick={() => openInnerModal('checkout')} disabled={isPending} text={'Confirmar'} />
        </Flex>
      }
    >
      <EqualParts
        amountLeft={amountLeft}
        payingFor={payingFor}
        setPayingFor={setPayingFor}
        partySize={partySize}
        setPartySize={setPartySize}
      />
      <Modal isOpen={isInnerModalOpen.checkout} closeModal={() => closeInnerModal('checkout')} title="Checkout">
        <Checkout amount={totalEqualParts} />
      </Modal>
    </Modal>
  )
}
