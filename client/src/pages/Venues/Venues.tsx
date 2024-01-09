import { Link, Outlet } from 'react-router-dom'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Meta from '@/components/Meta'
import { FullSizeCenteredFlexBox } from '@/components/styled'

function Venues() {
  return (
    <>
      <Meta title="Venues" />
      <FullSizeCenteredFlexBox flexDirection="column">
        <Typography variant="h3">Venues</Typography>
        <p>Layout</p>
        <h2>TODO</h2>
        <ol>
          <li>cargar todos los venues existentes y mostrarlos con un boton</li>
        </ol>
        <Outlet />
      </FullSizeCenteredFlexBox>
    </>
  )
}

export default Venues
