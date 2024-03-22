import api from '@/axiosConfig'
import { Flex } from '@/components'
import { H3, H4, H5, H6 } from '@/components/Util/Typography'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export default function BillDetailsDashboard() {
  const { venueId, billId } = useParams()
  const {
    data: billDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['bill_details', venueId, billId],
    queryFn: async () => {
      const response = await api.get(`/v1/dashboard/${venueId}/${billId}`)
      return response.data
    },
  })

  if (isLoading) return <div>Cargando...</div>
  if (isError) return <div>Error al cargar los detalles de la mesa</div>
  if (!billDetails) return <div>No se encontraron detalles para la mesa {billId}</div>

  return (
    <Flex direction="row" className="p-4 border divide-x divide-black">
      <Flex direction="col">
        <Flex direction="row" align="center" space="sm">
          <H4>PosOrder</H4>
          <H3>{billDetails.posOrder}</H3>
        </Flex>
        <Flex direction="row" align="center" space="sm">
          <H4>UpdatedAt</H4>
          <H5>{billDetails.updatedAt}</H5>
        </Flex>
        <Flex direction="row" align="center" space="sm">
          <H4>CreatedAt</H4>
          <H5>{billDetails.createdAt}</H5>
        </Flex>

        <Flex direction="row" align="center" space="sm">
          <H4>Status</H4>
          <H3>{billDetails.status}</H3>
        </Flex>
        <Flex direction="row" align="center" space="sm">
          <H4>Mesa</H4>
          <H3>{billDetails.tableNumber}</H3>
        </Flex>
        <Flex direction="row" align="center" space="sm">
          <H4>Total</H4>
          <H3>{billDetails.total}</H3>
        </Flex>
        <Flex direction="row" align="center" space="sm">
          <H4>Pagos</H4>
          <div>
            {billDetails.payments?.map(payment => (
              <div key={payment.id}>
                <H5 variant="secondary">{payment.amount}</H5>
                <H5 variant="secondary">{payment.method}</H5>
                <H5 variant="secondary">{payment.receiptUrl}</H5>
              </div>
            ))}
            {!billDetails.payments?.length && <H5 variant="secondary">No hay pagos</H5>}
          </div>
        </Flex>
        <Flex direction="row" align="center" space="sm">
          <H4>Productos</H4>
          <div>
            {billDetails.products?.map(product => (
              <div key={product.id}>
                <H5 variant="secondary">{product.quantity}</H5>
                <H5 variant="secondary">{product.name}</H5>
                <H5 variant="secondary">{product.price}</H5>
              </div>
            ))}
            {!billDetails.products?.length && <H5 variant="secondary">No hay productos</H5>}
          </div>
        </Flex>
      </Flex>
    </Flex>
  )
}
