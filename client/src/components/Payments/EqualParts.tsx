import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flex } from '../Util/Flex'
import { Currency } from '@/utils/currency'
import { CounterButton } from '../Button'
import { Spacer } from '../Util/Spacer'
import { H2, H4 } from '../Util/Typography'

export default function EqualParts({ amountLeft, payingFor, setPayingFor, partySize, setPartySize, totalAmount, setTotalAmount }) {
  // Cálculos para la animación del círculo
  let circlePathLength = 100
  let gapSize = 2
  let percentForOne = circlePathLength / partySize
  let greenedPercent = percentForOne * payingFor - gapSize
  let notGreenedPercent = circlePathLength - greenedPercent - gapSize

  // Funciones para incrementar o decrementar el valor, asegurándose de que no sean menores a 1
  const incrementPayingFor = () => setPayingFor(prev => (prev < partySize ? prev + 1 : prev))
  const decrementPayingFor = () => setPayingFor(prev => (prev > 1 ? prev - 1 : prev))
  const incrementPartySize = () => setPartySize(prev => prev + 1)
  const decrementPartySize = () => {
    setPartySize(prev => {
      const newPartySize = prev > 1 ? prev - 1 : prev
      if (payingFor > newPartySize) {
        setPayingFor(newPartySize) // Ajusta payingFor a newPartySize si es necesario
      }
      return newPartySize
    })
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="z-0 flex flex-row justify-center p-4 space-x-2 ">
        {/* Add more circles with decreasing radius and increasing stroke width */}

        <AnimatePresence>
          <div className="relative w-56 h-56 md:h-32 md:w-32 xs:h-16 xs:w-16 ">
            <svg className="-rotate-90 fill-none" viewBox="0 0 36 36">
              <motion.circle
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={{
                  strokeDasharray: `${percentForOne - gapSize} ,${gapSize}`,
                  opacity: 1,
                }}
                cx="18"
                cy="18"
                r="15.9155"
                strokeWidth="2"
                pathLength="100"
                className=" stroke-black"
              />

              <motion.circle
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={{
                  strokeDasharray: `${greenedPercent},${notGreenedPercent}`,
                  opacity: 1,
                }}
                strokeLinecap="round" // aquí es donde se aplica
                cx="18"
                cy="18"
                r="15.9155"
                id="myPath"
                pathLength="100"
                strokeWidth="2"
                stroke="#10b981"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center md:text-xs xs:hidden ">
              <Flex direction="col" align="center">
                <span className="text-[21px]">
                  {/* Pagando por {payingFor} {payingFor > 1 ? 'personas' : 'persona'} */}
                  {Currency(amountLeft)}
                </span>
                <span className="text-xs">Cantidad a dividir</span>
              </Flex>
            </div>
          </div>
        </AnimatePresence>
      </div>

      <Flex space="sm" align="center" className="p-2 bg-white border-2 rounded-full" justify="between">
        <H4 className="pl-2">Personas en la mesa</H4>
        <Flex direction="row" align="center" space="xs">
          <CounterButton onClick={decrementPartySize} disabled={partySize >= payingFor && partySize > 2 ? false : true} text="-" />
          <p>{partySize}</p>
          <CounterButton onClick={incrementPartySize} text="+" />
        </Flex>
      </Flex>
      <Spacer size="md" />
      <Flex space="sm" align="center" className="p-2 bg-white border-2 rounded-full " justify="between">
        <H4 className="pl-2">Pagando por</H4>
        <Flex direction="row" align="center" space="xs">
          <CounterButton onClick={decrementPayingFor} disabled={payingFor <= 1} text="-" />
          <p>{payingFor}</p>
          <CounterButton onClick={incrementPayingFor} disabled={payingFor >= partySize} text="+" />
        </Flex>
      </Flex>
    </div>
  )
}
