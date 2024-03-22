import api from '@/axiosConfig'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export default function TableDetailsDashboard() {
  const { venueId, tableNumber } = useParams()
  const {
    data: tableDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['table_details'],
    queryFn: async () => {
      const response = await api.post(`/v1/dashboard/${venueId}/get-table`, { tableNumber })
      return response.data
    },
  })

  if (isLoading) return <div>Cargando...</div>
  if (isError) return <div>Error al cargar los detalles de la mesa</div>
  if (!tableDetails) return <div>No se encontraron detalles para la mesa {tableNumber}</div>

  return <div>{tableDetails.tableNumber}</div>
}
