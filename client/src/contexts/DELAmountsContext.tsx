// PaymentContext.js
import React, { type ReactNode, createContext, useContext, useState } from 'react'

const AmountsContext = createContext(null)

interface AmountsProviderProps {
  children: ReactNode
}

export const AmountsProvider = ({ children }: AmountsProviderProps) => {
  const [amounts, setAmount] = useState(0)
  const [tipPercentage, setTipPercentage] = useState(0.15) // Default tip percentage

  const tip = amounts * tipPercentage
  const userFee = Math.round((amounts * 0.025) / (1 - 0.025))
  const total = Math.round(amounts + tip + userFee)

  return <AmountsContext.Provider value={{ amounts, setAmount, tip, userFee, total, setTipPercentage }}>{children}</AmountsContext.Provider>
}

export const usePayment = () => useContext(AmountsContext)
