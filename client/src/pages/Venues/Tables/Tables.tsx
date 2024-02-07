import { Outlet } from 'react-router-dom'

import Typography from '@mui/material/Typography'

import Meta from '@/components/Meta'
import { FullSizeCenteredFlexBox } from '@/components/styled'

function Tables() {
  return (
    <>
      <Meta title="Tables" />
      <FullSizeCenteredFlexBox flexDirection="column">
        <Typography variant="h3">Tables</Typography>
        <p>Layout</p>
        <h2>TODO</h2>
        <ol>
          <li>cargar todos los tables existentes y mostrarlos con un boton</li>
        </ol>
        <Outlet />
      </FullSizeCenteredFlexBox>
    </>
  )
}

export default Tables
