import { Flex } from '@/components'
import { Spacer } from '@/components/Util/Spacer'
import { H2 } from '@/components/Util/Typography'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { Link, json, useLoaderData, useLocation } from 'react-router-dom'

interface Menu {
  id: number
  name: string
  url: string
}

interface LoaderData {
  menus: Menu[]
}

export async function loader() {
  const res = await fetch('/api/menus')
  const menus = await res.json()
  return json({ menus })
}

export default function Menus() {
  const data = useLoaderData() as LoaderData
  const location = useLocation()

  return (
    <div className="w-full max-w-md py-3 mx-auto">
      <Flex className="" align="center" justify="between">
        <Link
          to={`/venues/${location.state.venueId}/bills/${location.state.billId}`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background-primary "
        >
          <ChevronLeft />
        </Link>
        <H2>Carta</H2>
        <div />
      </Flex>
      <Spacer size="xl" />
      {data.menus.map((menu: Menu) => {
        return (
          <div key={menu.id}>
            <h1>{menu.name}</h1>
            <img loading="lazy" src={menu.url} alt={menu.name} width="500" height="500" className="rounded-xl" />
          </div>
        )
      })}
    </div>
  )
}
