import Loading from '@/components/Loading'
import { H3 } from '@/components/Util/Typography'
import { IncognitoUser } from '@/utils/types/user'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

// export async function loader({ request, params }) {
//   const { venueId, tableId } = params
//   // const searchParams = await request.
//   const searchParams = new URL(request.url).searchParams
//   // TODO get tableID
//   // Check if table exists
//   // check ?scanId=url-shortener_BgHF0msltf7o&utm_campaign=url-shortener_BgHF0msltf7o
//   if (tableId) {
//     // return redirect('/venues/2/bills/2')
//   }
//   return { params }
// }

/**
 * NOTE
 * 1. se usa como middleware para verificar si el usuario tiene permisos para acceder a la mesa
 * 2. se usa para obtener la información de la mesa
 */

function TableId() {
  const params = useParams()
  const navigate = useNavigate()
  const { isPending, error, data, isError, isLoading } = useQuery<any>({
    queryKey: ['table_data'],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/venues/${params.venueId}/tables/${params.tableId}?todo=yes`)
        // const localStorageUser = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }
        // if (localStorageUser.user.tableNumber === undefined) {
        //   localStorageUser.user.tableNumber = response.data.tableNumber
        // }

        response.data.redirect && navigate(response.data.url, { replace: true })
        return response.data
      } catch (error) {
        throw new Error('No existe la mesa')
      }
    },
  })
  if (isPending) return <Loading message="Buscando tu mesa" />
  if (isError) return <H3 variant="error">Error: {error?.message}</H3>

  return (
    <h3 className="border">
      TableId <p>{data.message}</p>
    </h3>
  )
}

export default TableId
