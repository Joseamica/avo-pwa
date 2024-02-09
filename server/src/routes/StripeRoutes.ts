import express from 'express'
const stripeRouter = express.Router()
import {
  getPaymentIntent,
  getPublishableKey,
  createPaymentIntent,
  getPaymentMethods,
  createIncognitoCustomer,
  updatePaymentIntent,
} from '../controller/StripeController'

stripeRouter.get('/payment-intent/:id', getPaymentIntent)
stripeRouter.get('/publishable-key', getPublishableKey)
stripeRouter.post('/create-payment-intent', createPaymentIntent)
stripeRouter.post('/payment-methods', getPaymentMethods)
stripeRouter.post('/create-incognito-customer', createIncognitoCustomer)
stripeRouter.post('/update-payment-intent', updatePaymentIntent)

export default stripeRouter
