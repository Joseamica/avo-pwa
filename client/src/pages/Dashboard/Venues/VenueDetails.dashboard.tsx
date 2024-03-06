import api from '@/axiosConfig'
import { Flex } from '@/components'
import { H1, H2 } from '@/components/Util/Typography'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

export default function VenueDetails() {
  const { venueId } = useParams()
  const {
    data: venue,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['venue_details', venueId],
    queryFn: async () => {
      const response = await api.post(`/v1/admin/${venueId}/get-venue`)
      return response.data
    },
  })
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <Fragment>
      <Flex dir="row" align="center" space="sm">
        <H1>{venue.name}</H1>
        <H2>{venue.city}</H2>
      </Flex>
      <hr />
      <Flex dir="row" align="center" className="">
        <div className="flex flex-col self-start w-1/4 divide-y divide-black bg-violet-700">
          <Link to={`tables`} className="py-4 pl-4 font-semibold text-violet-100">
            • Tables
          </Link>

          <Link to={`bills`} className="py-4 pl-4 font-semibold text-violet-100">
            • Bills
          </Link>

          <Link to={`menus`} className="py-4 pl-4 font-semibold text-violet-100">
            • Menus
          </Link>
        </div>
        <div className="w-3/4">
          <Outlet />
        </div>
      </Flex>
    </Fragment>
  )
}
