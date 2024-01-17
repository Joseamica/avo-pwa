import { json, useLoaderData } from 'react-router-dom'

interface Menu {
  id: number
  name: string
  url: string
}

interface LoaderData {
  menus: Menu[]
}

export async function loader({ request, params }) {
  const res = await fetch('http://localhost:5000/api/menus')
  const menus = await res.json()
  return json({ menus })
}

export default function Menus() {
  const data = useLoaderData() as LoaderData

  return (
    <div>
      {data.menus.map((menu: Menu) => {
        return (
          <div key={menu.id}>
            <h1>{menu.name}</h1>
            <img loading="lazy" src={menu.url} alt={menu.name} width="500" height="500" />
          </div>
        )
      })}
    </div>
  )
}
