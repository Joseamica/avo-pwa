import express from 'express'
import bodyParser from 'body-parser'

const stripeRouter = express.Router()
import {
  getPaymentIntent,
  getPublishableKey,
  createPaymentIntent,
  getPaymentMethods,
  createIncognitoCustomer,
  updatePaymentIntent,
  confirmPayment,
  webhookConfirmPayment,
} from '../controller/StripeController'

stripeRouter.get('/payment-intent/:id', getPaymentIntent)
stripeRouter.get('/publishable-key', getPublishableKey)
stripeRouter.post('/create-payment-intent', createPaymentIntent)
stripeRouter.post('/payment-methods', getPaymentMethods)
stripeRouter.post('/create-incognito-customer', createIncognitoCustomer)
stripeRouter.post('/update-payment-intent', updatePaymentIntent)
stripeRouter.post('/confirm-payment', confirmPayment)
stripeRouter.post('/webhooks/confirm-payment', bodyParser.raw({ type: 'application/json' }), webhookConfirmPayment)

export default stripeRouter
