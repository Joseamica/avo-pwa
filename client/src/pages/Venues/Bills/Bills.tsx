import { Link, Outlet } from 'react-router-dom'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Meta from '@/components/Meta'
import { FullSizeCenteredFlexBox } from '@/components/styled'
import { useAuth } from '@/auth/AuthProvider'

function Bills() {
  const { user } = useAuth()
  if (!user) {
    console.log('PENE')
  }

  return (
    <>
      <h1>bills</h1>
      {/* <Meta title="Bills" />
      <FullSizeCenteredFlexBox flexDirection="column">
        <Typography variant="h3">Bills</Typography>
        <p>Layout</p>
        <h2>TODO</h2>
        <ol>
          <li>cargar todos los tables existentes y mostrarlos con un boton</li>
        </ol> */}
      <Outlet />
      {/* </FullSizeCenteredFlexBox> */}
    </>
  )
}

export default Bills
