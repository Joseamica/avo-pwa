import { Link, Outlet, useParams } from 'react-router-dom'

import Typography from '@mui/material/Typography'

import Meta from '@/components/Meta'
import { FullSizeCenteredFlexBox } from '@/components/styled'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/Loading'
import { H3 } from '@/components/Util/Typography'
import axios from 'axios'
import clsx from 'clsx'

function Tables() {
  const params = useParams<{ venueId: string; tableId: string }>()
  const { isPending, error, data, isError, isLoading } = useQuery<any>({
    queryKey: ['table_data'],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/v1/venues/${params.venueId}/tables`)

        return response.data
      } catch (error) {
        throw new Error('error', error.message)
      }
    },
  })

  if (isPending) return <Loading message="Buscando tu mesa" />
  if (isLoading) return <Loading message="Buscando tu mesa" />
  if (isError) return <H3 variant="error">Error: {error?.message}</H3>

  return (
    <>
      <Meta title="Tables" />
      <FullSizeCenteredFlexBox flexDirection="column">
        <Typography variant="h3">Tables</Typography>
        <p>Layout</p>
        <h2>TODO</h2>
        <ol className="space-y-2">
          {data?.map((table: any) => {
            return (
              <li key={table.tableNumber}>
                <Link
                  className={clsx(
                    'flex items-center justify-center h-10 border rounded-full w-20',
                    table.status === 'ACTIVE' && 'bg-background-success text-texts-success ',
                    table.status === 'INACTIVE' && 'bg-background-warning text-white border-2',
                  )}
                  to={`${table.tableNumber}`}
                >
                  {table.tableNumber}
                </Link>
              </li>
            )
          })}
        </ol>
        <Outlet />
      </FullSizeCenteredFlexBox>
    </>
  )
}

export default Tables
