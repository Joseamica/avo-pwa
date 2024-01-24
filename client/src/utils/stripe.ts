import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

export const initStripe = async url => {
  const res = await axios.get(url)
  const publishableKey = await res.data.publishable_key

  return loadStripe(publishableKey)
}
