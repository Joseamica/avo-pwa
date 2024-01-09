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
import { PersonPinCircleOutlined } from '@mui/icons-material'

function HeaderAvo() {
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
        className="max-h-44 w-full rounded-b-3xl bg-day-bg_principal object-cover brightness-50"
      />
      <div className="absolute right-7 top-7 flex flex-row">
        <UserProfileLink />
        <IconButton color="info" edge="end" size="large" onClick={themeActions.toggle}>
          <ThemeIcon />
        </IconButton>
      </div>
      <div className="absolute -bottom-5 w-full justify-center flex flex-row space-x-4 items-center">
        <div className="flex items-center justify-center h-24 w-24 rounded-full shadow-sm bg-white border-4">
          {/* <span>
              <FaThumbsDown className="h-4 w-4" />
            </span> */}
          <img
            className="object-cover max-w-full"
            src={'https://fastly.picsum.photos/id/474/200/300.jpg?hmac=ujW-ONkfEKNYQaIt8c6e2WaF1LWjpave8A5pHryyQs0'}
            alt="src"
          />
        </div>
      </div>
    </div>
  )
}

const UserProfileLink = () => (
  <Link to="user/" className="flex flex-col text-center">
    <div className="bg-white h-10 w-10 rounded-full flex justify-center items-center border-2 border-white">
      <PersonPinCircleOutlined />
    </div>
    <h6 className="text-white">"jose"</h6>
  </Link>
)

export default HeaderAvo
