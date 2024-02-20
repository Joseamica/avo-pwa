import type { IncognitoUser } from '@/utils/types/user'

import { useParams } from 'react-router-dom'

import { LinkButton } from '@/components/Button'
import { Spacer } from '@/components/Util/Spacer'
import HeaderAvo from '@/sections/Header/HeaderAvo'
import BillId from './BillId'
// import { useAuth } from '@/auth/AuthProvider'

function Bills() {
  const params = useParams<{ venueId: string; billId: string; tableId: string }>()
  const user = JSON.parse(localStorage.getItem('persist:user')) as { user: IncognitoUser }

  return (
    <>
      <HeaderAvo iconColor={user.user.color} />
      <Spacer size="xl" />

      <div className="flex justify-center w-full px-2">
        <LinkButton
          size="md"
          variant="secondary"
          to={`/venues/${params.venueId}/menus`}
          state={{
            tableId: params.tableId,
            billId: params.billId,
            venueId: params.venueId,
          }}
          text="Menu"
        />
        {/* <Link
          to={`/venues/${params.venueId}/menus`}
          className={clsx(
            'flex items-center  disabled:border-4 justify-center w-full  text-black bg-buttons-main border-4 border-borders-button  rounded-2xl border-gray text-xl',
          )}
        >
          Menu
        </Link> */}
      </div>
      <BillId />
      {/* <BillId data={data} isPending={isPending} /> */}
    </>
  )
}

export default Bills
