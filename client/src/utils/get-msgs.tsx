import paymentMsgs from '@/config/payment-msgs'

function getRandomPaymentMsg() {
  const randomIndex = Math.round(Math.random() * (paymentMsgs.length - 1))
  const randomJoke = paymentMsgs[randomIndex]

  return randomJoke
}

export { getRandomPaymentMsg }
