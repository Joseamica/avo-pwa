import React, { useState } from 'react'
import Modal from '../Modal'
import Checkout from '@/pages/Stripe/Checkout'
import { Currency } from '@/utils/currency'
import EqualParts from '../Payments/EqualParts'
import { Flex } from '../Util/Flex'
import { Button } from '../Button'

// Asumiendo que useModal ya está implementado en el contexto de tu aplicación
// y que modalState y las funciones openModal y closeModal se obtienen desde ahí.

type EqualPartsModalProps = {
  modalState: Record<string, boolean>
  isOpen: boolean // El tipo correcto para un valor booleano
  closeModal: (modalKey: string) => void
  openModal: (modalKey: string) => void
  amountLeft: number
  isPending: boolean
}
export default function EqualPartsModal({ modalState, isOpen, closeModal, openModal, amountLeft, isPending }: EqualPartsModalProps) {
  const handleClose = () => {
    closeModal('payment_methods.split_bill.equal_parts')
  }

  const handleOpenCheckout = () => {
    openModal('payment_methods.split_bill.equal_parts.checkout')
  }

  const [payingFor, setPayingFor] = useState(1) // Total de personas que pagan
  const [partySize, setPartySize] = useState(2) // Total de personas en la mesa

  const amountEach = amountLeft / partySize
  const totalEqualParts = amountEach * payingFor

  return (
    <Modal
      isOpen={isOpen}
      closeModal={handleClose}
      title="Pagar partes iguales"
      footer={
        <Flex direction="col">
          <Flex direction="row" justify="between" align="center" className="mb-4">
            <span className="text-[21px] leading-6">Estás pagando</span>
            <span className="text-[21px] leading-6">{Currency(totalEqualParts)}</span>
          </Flex>
          <Button onClick={handleOpenCheckout} disabled={isPending} text={'Confirmar'} />
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
      <Modal
        isOpen={!!modalState['payment_methods.split_bill.equal_parts.checkout']}
        closeModal={() => closeModal('payment_methods.split_bill.equal_parts.checkout')}
        title="Método de pago"
      >
        <Checkout amount={totalEqualParts} />
      </Modal>
    </Modal>
  )
}
