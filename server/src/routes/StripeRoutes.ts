const express = require('express')
const stripeRouter = express.Router()
const stripeController = require('../controller/StripeController')

stripeRouter.get('/payment-intent/:id', stripeController.getPaymentIntent)
stripeRouter.get('/publishable-key', stripeController.getPublishableKey)
stripeRouter.post('/create-payment-intent', stripeController.createPaymentIntent)
stripeRouter.post('/payment-methods', stripeController.getPaymentMethods)
stripeRouter.post('/create-incognito-customer', stripeController.createIncognitoCustomer)
stripeRouter.post('/update-payment-intent', stripeController.updatePaymentIntent)

module.exports = stripeRouter
