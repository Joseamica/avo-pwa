import { Amex, MasterCard, Visa } from '@/components/Icons'
import React from 'react'

export default function getIcon(type) {
  switch (type) {
    case 'visa':
      return <Visa />
    case 'amex':
      return <Amex />
    case 'mastercard':
      return <MasterCard />
  }
}
