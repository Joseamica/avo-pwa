import api from '@/axiosConfig'
import { Flex } from '@/components'
import Loading from '@/components/Loading'
import { H1, H2 } from '@/components/Util/Typography'
import ErrorMessage from '@/pages/Error/ErrorMessage'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

export default function VenueDetailsAdmin() {
  const { venueId } = useParams()
  const {
    data: venue,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['venue_details', venueId],
    queryFn: async () => {
      const response = await api.post(`/v1/dashboard/${venueId}/get-venue`)
      return response.data
    },
  })
  if (isLoading) return <Loading message="Cargando el restaurante..." />
  if (isError) return <ErrorMessage responseError={error.message} />

  return (
    <Fragment>
      <Flex dir="row" align="center" space="sm">
        <H1>{venue.name}</H1>
        <H2>{venue.city}</H2>
      </Flex>
      <hr />
    </Fragment>
  )
}
