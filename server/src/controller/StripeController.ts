import { config } from '../config'
import prisma from '../utils/prisma'
import express from 'express'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
// const endpointSecret = 'whsec_Wyx0GnA52YempS1EFMKokQOUnGh2YaZI'

const getPublishableKey = async (req, res) => {
  // res.json({ publishable_key: config.stripePublishableKey })
  res.json({ publishable_key: config.stripePublishableKey })
}

const getPaymentMethods = async (req, res) => {
  const { customerId } = req.body

  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(customerId, {
      limit: 3,
    })

    res.send({ paymentMethods: paymentMethods.data })
  } catch (err) {
    console.log(err)
    res.status(500).json('Error getting payment methods')
  }
}

const createPaymentIntent = async (req, res) => {
  const { amounts, customerId, currency, paymentMethodId, params, isInternationalCard, saveCard } = req.body
  // console.log('isInternationalCard', isInternationalCard)
  const rest_fee_percentage = isInternationalCard ? 0.04 : 0.03
  const rest_fee = Math.round(amounts.total * rest_fee_percentage) + 400
  const avoFee = amounts.userFee + rest_fee
  // console.log('avoFee', avoFee)

  try {
    const { stripeAccountId } = await prisma.venue.findUnique({
      where: {
        id: params.venueId,
      },
      select: {
        stripeAccountId: true,
      },
    })

    const setupFutureUsage = saveCard ? 'off_session' : undefined

    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: amounts.total,
      currency: currency,
      payment_method: paymentMethodId,
      setup_future_usage: setupFutureUsage,

      application_fee_amount: avoFee,
      transfer_data: {
        destination: stripeAccountId,
      },
      metadata: {
        venueId: params.venueId,
        billId: params.billId,
        tipPercentage: amounts.tipPercentage,
        avoFee: avoFee,
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
  } else if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge
    console.log('charge', charge)
    const { billId, venueId, avoFee, tipPercentage, amount } = charge.metadata

    try {
      const card = charge.payment_method_details.card
      const card_brand = card.brand
      const receipt_url = charge.receipt_url
      // console.log('tipPercentage', tipPercentage)
      // console.log('parseInt(tipPercentage)', parseInt(amount), parseFloat(tipPercentage))
      // console.log('amount', parseInt(amount) * parseInt(tipPercentage))
      const updatedBill = await prisma.bill.update({
        where: { id: billId },
        data: {
          payments: {
            create: {
              amount: Number(amount),
              method: 'STRIPE',
              status: 'ACCEPTED',
              venueId,
              avoFee,
              cardBrand: card_brand,
              cardCountry: card.country,
              receiptUrl: receipt_url,
              customerId: String(charge.customer),
              tips: {
                create: {
                  amount: parseInt(amount) * parseFloat(tipPercentage),
                  percentage: tipPercentage,
                  bill: {
                    connect: {
                      id: billId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          payments: {
            select: {
              amount: true,
            },
          },
          table: {
            select: {
              tableNumber: true,
            },
          },
          products: {
            select: {
              key: true,
              name: true,
              quantity: true,
              price: true,
            },
          },
        },
      })
      const amount_left = Number(updatedBill.total) - updatedBill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)

      const roomId = `venue_${venueId}_table_${updatedBill.tableNumber}`
      req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left })
      console.log(`💵 Charge id: ${charge.id}`)
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }
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
  // confirmPayment,
  webhookConfirmPayment,
}
