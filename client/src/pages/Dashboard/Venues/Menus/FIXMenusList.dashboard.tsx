import api from '@/axiosConfig'
import { Flex } from '@/components'
import { useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function MenusListDashboard() {
  const { venueId } = useParams()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const {
    data: menus,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['menus_list'],
    queryFn: async () => {
      const response = await api.get(`/v1/admin/${venueId}/get-menus`)
      return response.data
    },
  })
  if (isLoading) return <div>Loading...</div>
  const handleSubmit = event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const tableNumber = formData.get('tableNumber')
    // tableMutation.mutate(tableNumber)
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto ">
        <input type="number" name="tableNumber" className="border-2 rounded-full" />
        <button className="w-20 px-2 py-1 border rounded-full">Add</button>
        {error && <p className="text-texts-error">{error}</p>}
        {success && <p>{success}</p>}
      </form>
      <div>
        {menus.map(menu => {
          return (
            // ANCHOR MENU NUMBERS
            <Flex dir="row" space="sm" key={menu.id}>
              <Link to={`${menu.id}`} className="w-20 px-2 py-2 text-sm text-white bg-black rounded-full">
                {menu.name}
              </Link>
              <div>
                {!showVerification ? (
                  <button className="w-6 h-6 border rounded-full bg-background-warning" onClick={() => setShowVerification(true)}>
                    X
                  </button>
                ) : (
                  <Fragment>
                    <Flex dir="col">
                      <span className="text-xs">Erase?</span>
                    </Flex>
                    <Flex dir="row" space="sm">
                      {/* <button onClick={() => deleteMenuMutation.mutate(menu.tableNumber)}>
                        <span className="px-2 text-xs text-white border rounded-full bg-background-warning">Yes</span>
                      </button> */}
                      <button onClick={() => setShowVerification(false)}>
                        <span className="px-2 text-xs border rounded-full">No</span>
                      </button>
                    </Flex>
                  </Fragment>
                )}
              </div>
            </Flex>
          )
        })}
      </div>
    </div>
  )
}
