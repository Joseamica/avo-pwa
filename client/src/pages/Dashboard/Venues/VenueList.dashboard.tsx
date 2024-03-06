import api from '@/axiosConfig'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

export default function DashboardVenues() {
  const {
    data: venues,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['venues_list'],
    queryFn: async () => {
      const response = await api.get('/v1/admin/get-venues')
      return response.data
    },
  })
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div>
      <div>
        {venues.map(venue => {
          return (
            <Link to={venue.id} key={venue.id}>
              {venue.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
