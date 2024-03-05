import { LinkButton } from '@/components/Button'
import { Spacer } from '@/components/Util/Spacer'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import { type IncognitoUser } from '@/utils/types/user'
import { MdMenuBook } from 'react-icons/md'
import { Outlet, useParams } from 'react-router-dom'

function VenueId() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()
  const user = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }

  return (
    <div className="max-w-lg mx-auto">
      {/* TODO- poner aqui headerAVO link button etc, y quitarlo de bills */}
      <HeaderAvo iconColor={user.user.color} />
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
