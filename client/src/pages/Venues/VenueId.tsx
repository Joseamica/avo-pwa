import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function VenueId() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()
  const { isPending, error, isError } = useQuery({
    queryKey: ['bill_data'],

    queryFn: async () => {
      try {
        const response = await axios.get(`/api/v1/venues/${params.venueId}`)

        console.log('response', response)
        return response.data
      } catch (error) {
        throw new Error('No existe la mesa o la cuenta no está disponible en este momento.')
      }
    },
  })

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error: {error?.message}</div>

  return <div>VenueId</div>
}

export default VenueId
