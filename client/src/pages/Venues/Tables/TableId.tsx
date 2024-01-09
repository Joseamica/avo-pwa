import { Typography } from '@mui/material'
import { redirect, useLoaderData } from 'react-router-dom'

export async function loader({ request, params }) {
  const { venueId, tableId } = params
  // const searchParams = await request.
  const searchParams = new URL(request.url).searchParams
  // TODO get tableID
  // Check if table exists
  // check ?scanId=url-shortener_BgHF0msltf7o&utm_campaign=url-shortener_BgHF0msltf7o
  if (tableId) {
    return redirect('/venues/2/bills/2')
  }
  return { params }
}

function TableId() {
  const data = useLoaderData()

  return <Typography variant="h3">TableId</Typography>
}

export default TableId
