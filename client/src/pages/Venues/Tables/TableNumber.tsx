import instance from '@/axiosConfig'
import Loading from '@/components/Loading'
import { H3 } from '@/components/Util/Typography'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

function TableNumber() {
  const params = useParams()
  const navigate = useNavigate()

  const { isPending, error, data, isError } = useQuery<any>({
    queryKey: ['table_data'],
    queryFn: async () => {
      try {
        // const response = await axios.get(`/api/v1/venues/${params.venueId}/tables/${params.tableNumber}?todo=yes`)
        const response = await instance.get(`/v1/venues/${params.venueId}/tables/${params.tableNumber}?todo=yes`)
        response.data.redirect &&
          navigate(response.data.url, {
            replace: true,
          })
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Error desconocido, verifica backend para ver que mensaje se envia.')
      }
    },
    retry: false,
  })

  if (isPending) return <Loading message="Buscando tu mesa" />
  if (isError) return <H3 variant="error">Error: {error.message}</H3>

  return (
    <h3 className="border">
      TableId <p>{data.message}</p>
    </h3>
  )
}

export default TableNumber
