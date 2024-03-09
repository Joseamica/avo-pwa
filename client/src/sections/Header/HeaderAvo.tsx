import useHotKeysDialog from '@/store/hotkeys'
import useNotifications from '@/store/notifications'
import useSidebar from '@/store/sidebar'
import useTheme from '@/store/theme'

import Person from '@mui/icons-material/Person'
import { FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { getRandomJoke } from './utils'

function HeaderAvo({ iconColor, venueInfo }: { iconColor: string; venueInfo: any }) {
  const [, sidebarActions] = useSidebar()
  const [, themeActions] = useTheme()
  const [, notificationsActions] = useNotifications()
  const [, hotKeysDialogActions] = useHotKeysDialog()

  const showNotification = () => {
    notificationsActions.push({
      options: { variant: 'customNotification' },
      message: getRandomJoke(),
    })
  }

  return (
    <div className="relative">
      <img
        src={
          venueInfo.image ??
          'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/1.%20Madre%20Cafecito%2FPortada.png?alt=media&token=2960aaef-6a8a-4e2d-a197-f8eb1c167b3c'
        }
        alt="Header Background"
        loading="lazy"
        className="object-cover w-full max-h-56 rounded-b-3xl bg-day-bg_principal brightness-50"
      />
      <div className="absolute flex flex-row right-7 top-7">
        <Link to={venueInfo?.instagram ?? 'https://www.instagram.com/madre_cafecito/'} target="_blank">
          <FaInstagram className="w-10 h-10 fill-white" />
        </Link>
        {/* <UserProfileLink iconColor={iconColor} /> */}
        {/* <IconButton color="info" edge="end" size="large" onClick={themeActions.toggle}>
          <ThemeIcon />
        </IconButton> */}
      </div>
      <div className="absolute flex flex-row items-center justify-center w-full space-x-4 -bottom-5">
        <div className="flex items-center justify-center w-24 h-24 bg-white border-4 rounded-full shadow-sm">
          {/* <span>
              <FaThumbsDown className="w-4 h-4" />
            </span> */}
          <img className="object-cover max-w-full max-h-full rounded-full" src={venueInfo.logo} alt="src" />
        </div>
      </div>
    </div>
  )
}

const UserProfileLink = ({ iconColor }: { iconColor: string }) => (
  <Link to="/me" className="flex flex-col text-center">
    <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-white rounded-full">
      <Person style={{ color: iconColor }} />
    </div>
  </Link>
)

export default HeaderAvo
