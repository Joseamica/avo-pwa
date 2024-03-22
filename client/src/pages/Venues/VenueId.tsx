import api from '@/axiosConfig'
import { LinkButton } from '@/components/Button'
import Loading from '@/components/Loading'
import { Spacer } from '@/components/Util/Spacer'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { type IncognitoUser } from '@/utils/types/user'
import { useQuery } from '@tanstack/react-query'
import { MdMenuBook } from 'react-icons/md'
import { Outlet, useParams } from 'react-router-dom'
import ErrorMessage from '../Error/ErrorMessage'

function VenueId() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()
  const user = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['venue'],
    queryFn: async () => {
      const response = await api.get(`/v1/venues/${params.venueId}/get-info`)

      return response.data
    },

    // staleTime: 1000 * 60 * 60, // 1 hour in ms
    // gcTime: 1000 * 60 * 60 * 24, // 24 hours in ms
    refetchOnWindowFocus: false, // Disables automatic refetching when browser window is focused.
  })
  if (isLoading) return <Loading message="Cargando el menu..." />
  if (isError) return <ErrorMessage responseError={error.message} />
  return (
    <div className="max-w-lg mx-auto">
      {/* TODO- poner aqui headerAVO link button etc, y quitarlo de bills */}
      <HeaderAvo iconColor={user.user.color} venueInfo={data} />
      <Spacer size="xl" />

      <div className="flex justify-center w-full px-2 ">
        <LinkButton
          size="md"
          variant="secondary"
          to={`/venues/${params.venueId}/bills/${params.billId}/menus`}
          state={{
            tableId: params.tableId,
            billId: params.billId,
            venueId: params.venueId,
          }}
          text="Carta"
          // className="bg-background-primary"
          icon={<MdMenuBook />}
        />
      </div>

      <Outlet />
    </div>
  )
}

export default VenueId
