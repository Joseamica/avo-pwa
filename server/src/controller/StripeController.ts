import { config } from '../config'
import prisma from '../utils/prisma'
import express from 'express'

import Stripe from 'stripe'
const stripe = new Stripe(config.stripeSecretKey)
const endpointSecret = 'whsec_5c940eb81d083376576505abda0bcb3367d576096cfc2e3d96324208839c02d8'

const getPublishableKey = async (req, res) => {
  res.json({ publishable_key: config.stripePublishableKey })
}

const getPaymentMethods = async (req, res) => {
  const { customerId } = req.body

  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(customerId, {})

    res.send({ paymentMethods: paymentMethods.data })
  } catch (err) {
    console.log(err)
    res.status(500).json('Error getting payment methods')
  }
}

const createPaymentIntent = async (req, res) => {
  const { amounts, customerId, currency, paymentMethodId, params } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: amounts.total,
      currency: currency,
      payment_method: paymentMethodId,
      setup_future_usage: 'off_session',
      metadata: {
        venueId: params.venueId,
        billId: params.billId,
        tipPercentage: amounts.tipPercentage,
        avoFee: amounts.avoFee,
        total: amounts.total,
        amount: amounts.amount,
      },
    })

    res.json({ id: paymentIntent.id, client_secret: paymentIntent.client_secret })
  } catch (err) {
    console.log(err)
    res.status(500).json('Error creating payment intent')
  }
}

const getPaymentIntent = async (req, res) => {
  const { id } = req.params

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id)

    res.json(paymentIntent)
  } catch (err) {
    console.log(err)
    res.status(500).json('Error getting payment intent')
  }
}

const updatePaymentIntent = async (req, res) => {
  const { id, email } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.update(id, {
      receipt_email: email,
    })
    res.json(paymentIntent)
  } catch (err) {
    console.log(err)
    res.status(500).json('Error getting payment intent')
  }
}

const createIncognitoCustomer = async (req, res) => {
  const { name } = req.body
  try {
    const customer = await stripe.customers.create({
      name: name,
    })
    console.log('customer', customer)

    res.cookie(
      'stripe_customer_id',
      customer.id,

      { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 },
    )

    res.json({ id: customer.id })
  } catch (err) {
    console.log(err)
    res.status(500).json('Error creating customer')
  }
}

const confirmPayment = async (req, res) => {
  const { venueId, billId, amount, tipPercentage, avoFee } = req.body

  try {
    await prisma.payment.create({
      data: {
        billId,
        amount: amount,
        method: 'STRIPE',
        status: 'ACCEPTED',
        venueId,
        avoFee,
        tips: {
          create: {
            amount: amount * tipPercentage,
            percentage: tipPercentage,
            bill: {
              connect: {
                id: billId,
              },
            },
          },
        },
      },
    })
    res.status(200).json('Payment confirmed')
  } catch (err) {
    console.log(err)
    res.status(500).json('Error creating customer')
  }
}

const webhookConfirmPayment = async (req: express.Request, res: express.Response) => {
  const sig = req.headers['stripe-signature']

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  // Successfully constructed event
  console.log('✅ Success:', event.id)

  // Cast event data to Stripe object
  if (event.type === 'payment_intent.succeeded') {
    const stripeObject: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent

    const { billId, venueId, avoFee, tipPercentage, amount } = stripeObject.metadata
    await prisma.payment.create({
      data: {
        billId,
        amount: Number(amount),
        method: 'STRIPE',
        status: 'ACCEPTED',
        venueId,
        avoFee,
        tips: {
          create: {
            amount: parseInt(amount) * parseInt(tipPercentage),
            percentage: tipPercentage,
            bill: {
              connect: {
                id: billId,
              },
            },
          },
        },
      },
    })
  } else if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge
    console.log(`💵 Charge id: ${charge.id}`)
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true })
}

export {
  getPublishableKey,
  getPaymentMethods,
  createPaymentIntent,
  getPaymentIntent,
  updatePaymentIntent,
  createIncognitoCustomer,
  confirmPayment,
  webhookConfirmPayment,
}
