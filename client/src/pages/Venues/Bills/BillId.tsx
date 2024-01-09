import { Spacer } from '@/components/Util/Spacer'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { Typography } from '@mui/material'
import { createSearchParams, useLoaderData } from 'react-router-dom'

export async function loader({ request, params }) {
  const { venueId, tableId } = params
  // const searchParams = await request.
  const searchParams = new URL(request.url).searchParams

  return { params }
}

function BillId() {
  const data = useLoaderData()
  const tableNumber = 2

  return (
    <div className="h-screen bg-blue-200">
      <HeaderAvo />
      <Spacer size="xl" />
      <h3 className="flex w-full justify-center">{`Mesa ${tableNumber}`}</h3>
    </div>
  )
}

export default BillId
