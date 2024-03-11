import { SnackbarProvider, type CustomContentProps } from 'notistack'

import { notifications } from '@/config'

import { H5, H6 } from '@/components/Util/Typography'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { forwardRef, type Ref } from 'react'
import Notifier from './Notifier'

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
    <div ref={ref} className="flex flex-col w-full p-3 rounded-2xl bg-background-success">
      <H5 variant="success" bold="semibold">
        ¡Pago Exitoso!
      </H5>

      <H6 variant="success">{message}</H6>
    </div>
  )
})

const ReviewNotification = forwardRef(function ReviewNotification({ message }: CustomContentProps, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} className="flex flex-col w-full p-3 rounded-lg bg-background-success ">
      <H5 variant="success" bold="semibold">
        ¡Gracias por dejar una reseña!
      </H5>

      <H6 variant="success">{message}</H6>
    </div>
  )
})

const ErrorNotification = forwardRef(function ErrorNotification({ message }: CustomContentProps, ref: Ref<HTMLDivElement>) {
  return (
    <div ref={ref} className="flex flex-col w-full p-3 space-y-2 rounded-lg bg-background-error ">
      <H6 variant="error" bold="medium">
        ¡Se ha producido un error al pagar!
      </H6>

      <H5 variant="error" bold="semibold">
        {message}
      </H5>
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
        reviewNotification: ReviewNotification,
        errorNotification: ErrorNotification,
      }}
      dense
    >
      <Notifier />
    </SnackbarProvider>
  )
}

export default Notifications
