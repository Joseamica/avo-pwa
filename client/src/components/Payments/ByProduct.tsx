import React, { useState } from 'react'
import { Flex } from '../Util/Flex'
import { Currency } from '@/utils/currency'
import clsx from 'clsx'

export default function ByProduct({ orderedProducts }) {
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleSelect = (id, price) => {
    const isSelected = selectedProducts.some(product => product.id === id)
    setSelectedProducts(isSelected ? selectedProducts.filter(product => product.id !== id) : [...selectedProducts, { id, price }])
  }

  return (
    <Flex direction="col" space="xs">
      {orderedProducts.map(product => {
        return (
          <article key={product.id} className="block p-4 bg-white border rounded-xl">
            <span>
              <div className="flex items-center justify-between">
                <h3 className="flex flex-grow leading-5 text-base`">
                  <div className="flex flex-row justify-start">{product.name}</div>
                </h3>
                <div className="flex items-center flex-shrink-0 ml-3">
                  <span className="relative">{Currency(product.price)}</span>
                  <button
                    onClick={() => handleSelect(product.id, product.price)}
                    className={clsx(
                      'box-border relative flex items-center justify-center flex-shrink-0 w-8 h-8 ml-3 border rounded-full cursor-pointer',
                      selectedProducts.some(p => p.id === product.id)
                        ? 'bg-buttons-main border-borders-button border-4 text-white'
                        : 'bg-white border-gray-300 text-black',
                    )}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-current">
                      <path d="M10.45 13.435V22l3 .004v-8.57h8.554l-.004-3h-8.55v-8.43l-3-.004v8.435H2l.004 3h8.446Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </span>
          </article>
        )
      })}
    </Flex>
  )
}
