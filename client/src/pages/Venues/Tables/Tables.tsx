import { Link, Outlet, useParams } from 'react-router-dom'

import Typography from '@mui/material/Typography'

import api from '@/axiosConfig'
import Loading from '@/components/Loading'
import Meta from '@/components/Meta'
import { H3 } from '@/components/Util/Typography'
import { FullSizeCenteredFlexBox } from '@/components/styled'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

function Tables() {
  const params = useParams()

  const {
    isPending,
    error,
    data: tables,
    isError,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery<any>({
    queryKey: ['tables_datas'], // Incluye params.venueId en queryKey
    queryFn: async () => {
      try {
        const response = await api.get(`/v1/venues/${params.venueId}/tables`)
        return response.data
      } catch (error) {
        throw new Error('error', error.message)
      }
    },
  })

  if (isPending) return <Loading message="Buscando tu mesa" />
  if (isLoading) return <Loading message="Buscando tu mesa" />
  if (isError) return <H3 variant="error">Error: {error?.message}</H3>
  if (isFetching) return <Loading message="Buscando tu mesa (Fetching)" />
  if (isRefetching) return <Loading message="Refetching" />
  if (!tables) return <H3 variant="error">No hay mesas</H3>

  return (
    <>
      <Meta title="Tables" />
      <FullSizeCenteredFlexBox flexDirection="column">
        <Typography variant="h3">Tables</Typography>

        <ol className="flex flex-wrap gap-2">
          {tables?.map((table: any) => {
            return (
              <li key={table.tableNumber}>
                <Link
                  className={clsx(
                    'flex items-center justify-center h-10 border rounded-full w-20',
                    table.status === 'ACTIVE' && 'bg-background-success text-texts-success ',
                    table.status === 'INACTIVE' && 'bg-background-warning text-white border-2',
                  )}
                  to={`${table.tableNumber}`}
                  // replace={true}
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
