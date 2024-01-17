import GitHubIcon from '@mui/icons-material/GitHub'
import ThemeIcon from '@mui/icons-material/InvertColors'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import { CenteredFlexBox, FlexBox } from '@/components/styled'
import { repository, title } from '@/config'
import useHotKeysDialog from '@/store/hotkeys'
import useNotifications from '@/store/notifications'
import useSidebar from '@/store/sidebar'
import useTheme from '@/store/theme'

import { HotKeysButton } from './styled'
import { getRandomJoke } from './utils'
import { Link } from 'react-router-dom'
import { Person, PersonPinCircleOutlined } from '@mui/icons-material'

function HeaderAvo({ iconColor }) {
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
        src="https://fastly.picsum.photos/id/591/200/300.jpg?hmac=GBnqheK8f8NgGoZ-JQIGl0uYMejcmT4gvw4PsBmUWPY"
        alt="Header Background"
        loading="lazy"
        className="object-cover w-full max-h-44 rounded-b-3xl bg-day-bg_principal brightness-50"
      />
      <div className="absolute flex flex-row right-7 top-7">
        <UserProfileLink iconColor={iconColor} />
        <IconButton color="info" edge="end" size="large" onClick={themeActions.toggle}>
          <ThemeIcon />
        </IconButton>
      </div>
      <div className="absolute flex flex-row items-center justify-center w-full space-x-4 -bottom-5">
        <div className="flex items-center justify-center w-24 h-24 bg-white border-4 rounded-full shadow-sm">
          {/* <span>
              <FaThumbsDown className="w-4 h-4" />
            </span> */}
          <img
            className="object-cover max-w-full max-h-full rounded-full"
            src={'https://fastly.picsum.photos/id/474/200/300.jpg?hmac=ujW-ONkfEKNYQaIt8c6e2WaF1LWjpave8A5pHryyQs0'}
            alt="src"
          />
        </div>
      </div>
    </div>
  )
}

const UserProfileLink = ({ iconColor }) => (
  <Link to="/me" className="flex flex-col text-center">
    <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-white rounded-full">
      <Person style={{ color: iconColor }} />
    </div>
  </Link>
)

export default HeaderAvo
