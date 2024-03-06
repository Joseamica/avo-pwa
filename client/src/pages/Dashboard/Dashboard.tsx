import { Flex } from '@/components'
import { Link, Outlet } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="flex flex-col justify-between h-full bg-green-400">
      <Flex dir="row" justify="between" align="center" className="p-4 bg-gray-100">
        Dashboard
        <Link to="venues">Venues</Link>
      </Flex>
      <Outlet />
    </div>
  )
}
