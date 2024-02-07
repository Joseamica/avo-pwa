import { Field } from '@/components'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import useModal from '@/hooks/useModal'
import useNotifications from '@/store/notifications'
import { getRandomPaymentMsg } from '@/utils/get-msgs'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

export default function Receipt({ isOpen, closeModal, paymentIntentId }) {
  const [email, setEmail] = useState('' as string)

  const onSubmitEmail = async e => {
    e.preventDefault()
    await axios.post(`http://localhost:5000/update-payment-intent`, {
      id: paymentIntentId,
      email: email,
    })
  }
  const [, notificationsActions] = useNotifications()

  function showNotification() {
    notificationsActions.push({
      options: {
        // Show fully customized notification
        // Usually, to show a notification, you'll use something like this:
        // notificationsActions.push({ message: ... })
        // `message` accepts string as well as ReactNode
        // If you want to show a fully customized notification, you can define
        // your own `variant`s, see @/sections/Notifications/Notifications.tsx
        variant: 'paymentNotification',
      },
      message: 'Revise su correo electrónico, el recibo ha sido enviado',
    })
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Obtener mi recibo">
      <form method="post" onSubmit={onSubmitEmail}>
        <Field
          labelProps={{ children: 'Email' }}
          inputProps={{
            type: 'email',
            value: email,
            onChange: e => setEmail(e.target.value),
          }}
        />
        <Button
          type="submit"
          text="Obtener recibo"
          onClick={() => {
            showNotification()
            //Close modal after 2 seconds
            setTimeout(() => {
              closeModal()
            }, 2000)
          }}
          disabled={email === '' || email.includes('@') === false || email.includes('.') === false}
        />
      </form>
    </Modal>
  )
}
