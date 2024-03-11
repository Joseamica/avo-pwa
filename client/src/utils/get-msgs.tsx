import paymentMsgs from '@/config/payment-msgs'
import reviewMsgs from '@/config/review-msgs'

function getRandomPaymentMsg() {
  const randomIndex = Math.round(Math.random() * (paymentMsgs.length - 1))
  const randomJoke = paymentMsgs[randomIndex]

  return randomJoke
}

function getRandomReviewMsg() {
  const randomIndex = Math.round(Math.random() * (reviewMsgs.length - 1))
  const randomMsg = reviewMsgs[randomIndex]

  return randomMsg
}

export { getRandomPaymentMsg, getRandomReviewMsg }
