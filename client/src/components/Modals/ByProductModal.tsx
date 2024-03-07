import React, { useState } from 'react'
import Modal from '../Modal'
import { Flex } from '../Util/Flex'
import { Currency } from '@/utils/currency'
import ByProduct from '../Payments/ByProduct'
import Checkout from '@/pages/Stripe/Checkout'
import { Button } from '../Button'
import ModalPadding from '../Util/ModalPadding'

type ByProductModalProps = {
  isOpen: boolean
  modalState: Record<string, boolean>
  openModal: any
  closeModal: any
  orderedProducts: {
    id: number
    key: string
    name: string
    price: number
    comments: string
    quantity: number
    description: string
    visible: boolean
    status: 'pending' | 'delivered' | 'cancelled'
    userId: number
    createdAt: number
    updatedAt: number
  }[]
  isPending: boolean
}

/**
 * Renders a modal for paying by product.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open or not.
 * @param {Object} props.modalState - The state of the modal.
 * @param {Function} props.openModal - The function to open the modal.
 * @param {Function} props.closeModal - The function to close the modal.
 * @param {Array} props.orderedProducts - The array of ordered products.
 * @param {boolean} props.isPending - Indicates whether the payment is pending or not.
 * @returns {JSX.Element} The rendered component.
 */
export default function ByProductModal({ isOpen, modalState, openModal, closeModal, orderedProducts, isPending }: ByProductModalProps) {
  // NOTE - Per product
  const [selectedProducts, setSelectedProducts] = useState([])
  const totalSelectedProducts = selectedProducts.reduce((acc, curr) => acc + parseInt(curr.price), 0)
  const handleSelectProducts = (key, price) => {
    const isSelected = selectedProducts.some(product => product.key === key)
    setSelectedProducts(isSelected ? selectedProducts.filter(product => product.key !== key) : [...selectedProducts, { key, price }])
  }

  const handleClose = () => {
    closeModal('payment_methods.split_bill.by_product')
  }

  const handleOpenCheckout = () => {
    openModal('payment_methods.split_bill.by_product.checkout')
  }

  return (
    <Modal
      isFullScreen={true}
      isOpen={isOpen}
      closeModal={closeModal}
      title="Pagar por producto"
      footer={
        <Flex direction="col">
          <Flex direction="row" justify="between" align="center" className="mb-4">
            <span className="text-[21px] leading-6">Total seleccionado</span>
            <span className="text-[21px] leading-6"> {Currency(totalSelectedProducts)}</span>
          </Flex>
          <Button onClick={handleOpenCheckout} disabled={isPending || selectedProducts.length <= 0} text={'Confirmar'} />
        </Flex>
      }
    >
      <ModalPadding>
        <ByProduct orderedProducts={orderedProducts} handleSelectProducts={handleSelectProducts} selectedProducts={selectedProducts} />
        <Modal isOpen={!!modalState['payment_methods.split_bill.by_product.checkout']} closeModal={handleClose} title="Método de pago">
          <Checkout amount={totalSelectedProducts} />
        </Modal>
      </ModalPadding>
    </Modal>
  )
}
