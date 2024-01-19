import { Link, Outlet, useLocation } from 'react-router-dom'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Meta from '@/components/Meta'
import { FullSizeCenteredFlexBox } from '@/components/styled'
import { ChevronLeft } from '@mui/icons-material'

function Venues() {
  let { state } = useLocation()

  return (
    <>
      <Meta title="Venues" />
      <FullSizeCenteredFlexBox flexDirection="column">
        {/* <Typography variant="h3">Venues</Typography>
        <p>Layout</p>
        <h2>TODO</h2>
        <ol>
          <li>cargar todos los venues existentes y mostrarlos con un boton</li>
        </ol> */}
        <nav className="">
          <Link to={`/venues/${state?.venueId}/bills/${state?.billId}`} className="flex flex-row h-8 px-2 border">
            <ChevronLeft />
            <p>Atras</p>
          </Link>
        </nav>
        <Outlet />
      </FullSizeCenteredFlexBox>
    </>
  )
}

export default Venues
