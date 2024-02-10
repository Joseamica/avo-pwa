import { CustomContentProps, SnackbarProvider } from 'notistack'

import { notifications } from '@/config'

import Notifier from './Notifier'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { Ref, forwardRef } from 'react'
import { H1, H3, H4, H5 } from '@/components/Util/Typography'

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
    <div ref={ref} className="w-full p-3 rounded-lg bg-background-success ">
      <H4 variant="success" bold="semibold">
        ¡Pago Exitoso!
      </H4>

      <H5 variant="success">{message}</H5>
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
      dense
    >
      <Notifier />
    </SnackbarProvider>
  )
}

export default Notifications
