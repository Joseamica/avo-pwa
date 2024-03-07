import { H2 } from '@/components/Util/Typography'
import React from 'react'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const funnyErrorMessages = [
    '¡Oops! Algo salió mal. Pero no te preocupes, no eres tú, somos nosotros.',
    '¡Ay caramba! Algo no está bien aquí.',
    '¡Uy! Algo se rompió. Vamos a arreglarlo.',
    '¡Ups! Parece que hemos tropezado con un error inesperado.',
    '¡Oh no! Parece que los gremlins se han metido en nuestro código.',
    '¡Error 404: Mensaje de error no encontrado!',
    '¡Houston, tenemos un problema!',
    '¡Error: División por cero en el universo!',
    '¡Error: El sentido común no se encuentra!',
    '¡Error: El café se ha agotado!, ¿O seremos nosotros?',
  ]

  const randomErrorMessage = funnyErrorMessages[Math.floor(Math.random() * funnyErrorMessages.length)]

  return (
    <div className="my-4 bg-red-100 border rounded-3xl">
      <img
        className="object-cover mx-auto my-4 rounded-xl"
        src="https://media1.giphy.com/media/EFXGvbDPhLoWs/giphy.gif?cid=ecf05e47e4j9c0wtau2ep4e46x7dk654cz4c2370l34t9kwc&ep=v1_gifs_search&rid=giphy.gif&ct=g"
        alt="Error GIF"
      />
      <div className="p-4 m-4 text-red-200 bg-red-500 rounded-2xl">
        <H2 variant="error" className="text-red-200">
          ¡Error!
        </H2>
        <p className="text-red-200">{message}</p>
        <p className="text-red-200">{randomErrorMessage}</p>
      </div>
    </div>
  )
}

export default ErrorMessage
