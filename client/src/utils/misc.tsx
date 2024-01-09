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
