import React, { useState } from 'react'
import Modal from '../Modal'
import { Flex } from '../Util/Flex'
import { Currency } from '@/utils/currency'
import ByProduct from '../Payments/ByProduct'
import Checkout from '@/pages/Stripe/Checkout'
import { Button } from '../Button'

/**
 * Renders a modal component for selecting and paying for products.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isInnerModalOpen - Flag indicating if the inner modal is open.
 * @param {Function} props.closeInnerModal - Function to close the inner modal.
 * @param {Function} props.openInnerModal - Function to open the inner modal.
 * @param {Object} props.data - The data for the modal.
 * @param {Function} props.handleSelectProducts - Function to handle the selection of products.
 * @param {Array} props.selectedProducts - The selected products.
 * @param {number} props.totalSelectedProducts - The total amount of selected products.
 * @param {boolean} props.isPending - Flag indicating if the payment is pending.
 * @returns {JSX.Element} The rendered modal component.
 */
type ByProductModalProps = {
  isInnerModalOpen: any
  closeInnerModal: any
  openInnerModal: any
  orderedProducts: {
    id: number
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

export default function ByProductModal({
  isInnerModalOpen,
  closeInnerModal,
  openInnerModal,
  orderedProducts,
  isPending,
}: ByProductModalProps) {
  // NOTE - Per product
  const [selectedProducts, setSelectedProducts] = useState([])
  const totalSelectedProducts = selectedProducts.reduce((acc, curr) => acc + curr.price, 0)
  const handleSelectProducts = (id, price) => {
    const isSelected = selectedProducts.some(product => product.id === id)
    setSelectedProducts(isSelected ? selectedProducts.filter(product => product.id !== id) : [...selectedProducts, { id, price }])
  }

  return (
    <Modal
      isFullScreen={true}
      isOpen={isInnerModalOpen.by_product}
      closeModal={() => closeInnerModal('by_product')}
      title="Pagar por producto"
      footer={
        <Flex direction="col">
          <Flex direction="row" justify="between" align="center" className="mb-4">
            <span className="text-[21px] leading-6">Total seleccionado</span>
            <span className="text-[21px] leading-6"> {Currency(totalSelectedProducts)}</span>
          </Flex>
          <Button onClick={() => openInnerModal('checkout')} disabled={isPending || selectedProducts.length <= 0} text={'Confirmar'} />
        </Flex>
      }
    >
      <ByProduct orderedProducts={orderedProducts} handleSelectProducts={handleSelectProducts} selectedProducts={selectedProducts} />
      <Modal isOpen={isInnerModalOpen.checkout} closeModal={() => closeInnerModal('checkout')} title="Checkout">
        <Checkout amount={{ amount: totalSelectedProducts }} />
      </Modal>
    </Modal>
  )
}
