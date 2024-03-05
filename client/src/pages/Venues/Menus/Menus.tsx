import api from '@/axiosConfig'
import { Flex } from '@/components'
import { Spacer } from '@/components/Util/Spacer'
import { H2 } from '@/components/Util/Typography'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { Link, json, useLoaderData, useParams } from 'react-router-dom'

interface Menu {
  id: number
  name: string
  imageUrl: string
}

interface LoaderData {
  menus: Menu[]
}

export async function loader({ params }) {
  const { venueId } = params
  const res = await api.get(`/v1/venues/${venueId}/menus`)

  const menus = res.data
  return json({ menus })
}

export default function Menus() {
  const data = useLoaderData() as LoaderData

  const params = useParams()

  return (
    <div className="w-full max-w-lg pb-3 mx-auto">
      <Flex className="sticky top-0 p-4 bg-white shadow rounded-b-3xl" align="center" justify="between">
        <Link
          to={`/venues/${params.venueId}/bills/${params.billId}`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background-primary "
        >
          <ChevronLeft />
        </Link>
        <H2>Carta</H2>
        <div />
      </Flex>
      <Spacer size="sm" />
      {data.menus.map((menu: Menu) => {
        return (
          <div key={menu.id}>
            {/* <h1>{menu.name}</h1> */}
            <img loading="lazy" src={menu.imageUrl} alt={menu.name} width="500" height="500" className="rounded-xl" />
          </div>
        )
      })}
    </div>
  )
}
