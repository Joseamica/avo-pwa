import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Modal from '@/components/Modal'

import { FaRegAngry, FaRegMeh, FaRegSmile, FaStar } from 'react-icons/fa'
import { motion } from 'framer-motion'
import api from '@/axiosConfig'
import { Flex } from '@/components'
import { Spacer } from '@/components/Util/Spacer'
import { H2, H3, H4 } from '@/components/Util/Typography'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/Button'

const iconStyles = {
  base: 'w-8 h-8',
  sad: 'fill-red-500',
  neutral: 'fill-[#E0821E]',
  happy: 'fill-green-500',
  default: 'fill-gray-400',
}

const getIconConfig = (index, type) => {
  const isSelected = index < type
  if (type === 0) return <FaRegSmile className={`${iconStyles.base} ${isSelected ? iconStyles.happy : iconStyles.default}`} />
  if (type <= 2) return <FaRegAngry className={`${iconStyles.base} ${isSelected ? iconStyles.sad : iconStyles.default}`} />
  if (type === 3) return <FaRegMeh className={`${iconStyles.base} ${isSelected ? iconStyles.neutral : iconStyles.default}`} />
  return <FaRegSmile className={`${iconStyles.base} ${isSelected ? iconStyles.happy : iconStyles.default}`} />
}

export default function Review({ isOpen, closeModal, venueId }: { isOpen: boolean; closeModal: () => void; venueId: any }) {
  const [stars, setStars] = useState(0)
  const [multipleStars, setMultipleStars] = useState({
    food: 0,
    service: 0,
    atmosphere: 0,
    price_quality: 0,
  })

  const categoryNames = {
    food: 'Comida',
    service: 'Servicio',
    atmosphere: 'Ambiente',
    price_quality: 'Precio/Calidad', // Aquí cambias "price_quality" por un nombre más amigable
  }

  const { status, error, mutate } = useMutation({
    mutationFn: async () => {
      return api.post(`/v1/venues/${venueId}/review`, {
        stars,
        multipleStars,
      })
    },
    onSuccess: () => {
      // Aquí puedes manejar lo que sucede después de una mutación exitosa, como cerrar el modal
      closeModal()
    },
    onError: error => {
      // Aquí puedes manejar el error, por ejemplo, mostrando una notificación
      console.error('Error:', error)
    },
  })

  if (status === 'error') {
    return <div className="error">{`Error: ${error?.message}`}</div>
  }

  const handleStarClick = (category, value) => {
    setMultipleStars(prev => ({ ...prev, [category]: value }))
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Evalúa">
      <motion.div className={`flex flex-col items-center space-y-4 bg-white p-4 ${stars > 0 && 'h-full'}`}>
        <div className="flex flex-row items-center justify-center py-10 bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} onClick={() => setStars(i + 1)}>
              <FaStar className={`${stars > 0 ? 'h-12 w-12' : 'h-8 w-8'} ${i + 1 <= stars ? 'fill-buttons-main' : 'fill-gray-400'}`} />
            </div>
          ))}
        </div>
        {stars > 0 && (
          <>
            <H2 className="text-center">Comparta su experiencia con Madre Cafecito</H2>
            <div className="text-center">
              <H3>Evalúa nuestros servicios.</H3>
              <Spacer spaceY="2" />
              {Object.keys(multipleStars).map(category => (
                <Flex key={category} align="center">
                  <H4 className="w-32 text-start">{categoryNames[category]}</H4>
                  <div className="flex flex-row items-center justify-center p-4 bg-white">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} onClick={() => handleStarClick(category, index + 1)}>
                        {getIconConfig(index, multipleStars[category])}
                      </div>
                    ))}
                  </div>
                </Flex>
              ))}
            </div>
          </>
        )}
        <Button onClick={() => mutate()} text="Enviar" />
      </motion.div>
    </Modal>
  )
}
