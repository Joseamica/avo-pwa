import { useState } from 'react'

// Definiendo los tipos para los nombres de los modales
type ModalName = 'payment_methods' | 'split_bill' | 'pay_full_bill' | 'assign_tip' | 'receipt' | 'review'
type InnerModalName = 'by_product' | 'equal_parts' | 'custom' | 'checkout'

function useModal() {
  const [isModalOpen, setIsModalOpen] = useState<Record<ModalName, boolean>>({
    payment_methods: false,
    split_bill: false,
    pay_full_bill: false,
    assign_tip: false,
    receipt: false,
    review: false,
  })
  const [isInnerModalOpen, setIsInnerModalOpen] = useState<Record<InnerModalName, boolean>>({
    by_product: false,
    equal_parts: false,
    custom: false,
    checkout: false,
  })

  const openModal = (modalName: ModalName) => {
    setIsModalOpen({ ...isModalOpen, [modalName]: true })
  }

  const closeModal = (modalName: ModalName) => {
    setIsModalOpen({ ...isModalOpen, [modalName]: false })
    // Opcionalmente, cerrar también los modales internos asociados
    setIsInnerModalOpen({
      by_product: false,
      equal_parts: false,
      custom: false,
      checkout: false,
    })
  }

  const openInnerModal = (innerModalName: InnerModalName) => {
    setIsInnerModalOpen({ ...isInnerModalOpen, [innerModalName]: true })
  }

  const closeInnerModal = (innerModalName: InnerModalName) => {
    setIsInnerModalOpen({ ...isInnerModalOpen, [innerModalName]: false })
  }

  return { isModalOpen, openModal, closeModal, isInnerModalOpen, openInnerModal, closeInnerModal }
}

export default useModal
