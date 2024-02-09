import { config } from '../config'

const stripe = require('stripe')(config.stripeSecretKey)

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
  const { amount, customerId, currency, paymentMethodId } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: amount,
      currency: currency,
      payment_method: paymentMethodId,
      setup_future_usage: 'off_session',
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

    // const paymentMethod = await stripe.customers.retrievePaymentMethod(customer.id, paymentMethods.data[0].id)
    // console.log('paymentMethod', paymentMethod)
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

export { getPublishableKey, getPaymentMethods, createPaymentIntent, getPaymentIntent, updatePaymentIntent, createIncognitoCustomer }
