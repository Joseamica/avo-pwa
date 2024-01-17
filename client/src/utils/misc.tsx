import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getRandomRGBNumber() {
  return Math.floor(Math.random() * 256)
}

export function getRandomColor() {
  const r = getRandomRGBNumber()
  const g = getRandomRGBNumber()
  const b = getRandomRGBNumber()

  return [`rgb(${r}, ${g}, ${b})`, `rgb(${255 - r}, ${255 - g}, ${255 - b})`]
}

export function getRandomPastelHex() {
  const baseRed = 255
  const baseGreen = 255
  const baseBlue = 255

  // Generar números aleatorios más bajos para mezclar con el blanco
  const mixRed = Math.floor(Math.random() * 256)
  const mixGreen = Math.floor(Math.random() * 256)
  const mixBlue = Math.floor(Math.random() * 256)

  // Mezclar con blanco para obtener tonos pastel
  const red = Math.floor((mixRed + baseRed) / 2)
  const green = Math.floor((mixGreen + baseGreen) / 2)
  const blue = Math.floor((mixBlue + baseBlue) / 2)

  // Convertir a hexadecimal
  const toHex = c => ('0' + c.toString(16)).slice(-2)
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}
