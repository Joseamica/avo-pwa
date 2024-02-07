import { CustomContentProps, SnackbarProvider } from 'notistack'

import { notifications } from '@/config'

import Notifier from './Notifier'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { Ref, forwardRef } from 'react'

// here how you can define your own notification component

const CustomNotification = forwardRef(function CustomNotification({ message }: CustomContentProps, ref: Ref<HTMLDivElement>) {
  return (
    <Alert ref={ref} severity="info">
      <AlertTitle>Notification demo (random IT jokes :))</AlertTitle>
      {message}
    </Alert>
  )
})

const PaymentNotification = forwardRef(function PaymentNotification({ message }: CustomContentProps, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} className="p-2 text-white rounded-lg bg-buttons-main">
      <AlertTitle>¡Pago Exitoso!</AlertTitle>
      {message}
    </div>
  )
})

function Notifications() {
  return (
    <SnackbarProvider
      maxSnack={notifications.maxSnack}
      Components={{
        customNotification: CustomNotification,
        paymentNotification: PaymentNotification,
      }}
    >
      <Notifier />
    </SnackbarProvider>
  )
}

export default Notifications
