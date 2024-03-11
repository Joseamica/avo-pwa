import Modal from '@/components/Modal'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import api from '@/axiosConfig'
import { Flex } from '@/components'
import { Button } from '@/components/Button'
import { Spacer } from '@/components/Util/Spacer'
import { H4 } from '@/components/Util/Typography'
import useNotifications from '@/store/notifications'
import { getRandomReviewMsg } from '@/utils/get-msgs'
import { motion } from 'framer-motion'
import { FaRegAngry, FaRegMeh, FaRegSmile, FaStar } from 'react-icons/fa'

const iconStyles = {
  base: 'w-8 h-8',
  sad: 'fill-red-500',
  neutral: 'fill-[#E0821E]',
  happy: 'fill-green-500',
  default: 'fill-gray-400',
}

const modalVariants = {
  hidden: {
    scale: 0.95, // Un poco más pequeño cuando no hay estrellas
    opacity: 0,
  },
  visible: {
    scale: 1, // Tamaño normal
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
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

  const [, notificationsActions] = useNotifications()

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
      notificationsActions.push({
        options: {
          variant: 'reviewNotification',
        },
        message: getRandomReviewMsg(),
      })
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
    <Modal isOpen={isOpen} closeModal={closeModal} title="Califícanos">
      <motion.div className={`p-4 bg-white ${stars > 0 && 'h-full'}`}>
        <div className="flex flex-row items-center justify-center bg-white py-7">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} onClick={() => setStars(i + 1)}>
              <FaStar className={`${stars > 0 ? 'h-12 w-12' : 'h-10 w-10'} ${i + 1 <= stars ? 'fill-yellow-300' : 'fill-zinc-300'}`} />
            </div>
          ))}
        </div>
        <motion.div
          initial="hidden" // Estado inicial antes de montar el modal
          animate={stars > 0 ? 'visible' : 'hidden'} // Estado final del modal
          variants={modalVariants} // Las variantes definidas previamente
          className="flex flex-col items-center h-full space-y-4 "
        >
          {stars > 0 && (
            <div className="space-y-3">
              <h3 className="text-xl text-center">Comparta su experiencia con Madre Cafecito</h3>
              <div className="p-3 text-center border rounded-2xl bg-background-primary">
                <H4 variant="secondary">Evalúa nuestros servicios.</H4>
                <Spacer spaceY="2" />
                <div className="space-y-2">
                  {Object.keys(multipleStars).map(category => (
                    <Flex key={category} align="center" className="px-4 bg-white border rounded-full">
                      <H4 className="w-32 text-start">{categoryNames[category]}</H4>
                      <div className="flex flex-row items-center justify-center py-3 ">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} onClick={() => handleStarClick(category, index + 1)}>
                            {getIconConfig(index, multipleStars[category])}
                          </div>
                        ))}
                      </div>
                    </Flex>
                  ))}
                </div>
              </div>
              <Spacer size="xs" />
              <Button onClick={() => mutate()} text="Enviar" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </Modal>
  )
}
