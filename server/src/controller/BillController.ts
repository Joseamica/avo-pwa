import dbConfig from '../config/DbConfig'
import { getOrderWithTableNumber } from '../utils/sqlQueries'
import prisma from '../utils/prisma'
import sql from 'mssql'
import { ConnectionPool } from 'mssql'
const pool = new ConnectionPool(dbConfig)

pool.on('error', err => {
  console.error('Error al conectar a MSSQL', err)
})

const getTest = async (req, res) => {
  console.log('ACCESS')
  res.json({ message: 'BillController works' })
}

const getBillInfo = async (req, res) => {
  const { billId } = req.params
  const { venueId } = req.query

  try {
    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
      },
      include: {
        payments: {
          select: {
            amount: true,
          },
        },
        table: {
          select: {
            tableNumber: true,
          },
        },
        products: {
          select: {
            name: true,
            quantity: true,
            price: true,
          },
        },
      },
    })

    if (!bill) {
      return res.status(404).json({ message: 'No existe una cuenta con este Id' })
    }
    if (bill.status === 'CLOSED') {
      console.log('🔒 La cuenta está cerrada y no se reactivará.')

      const data = {
        ...bill,
      }
      return res.status(200).json(data)
    }
    const amount_paid = bill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)

    // Asegúrate de manejar la conexión a la base de datos de forma adecuada
    const pool = await sql.connect(dbConfig)
    const query = getOrderWithTableNumber(bill.tableNumber)
    const r = await pool.request().query(query)
    const result = r.recordset[0]

    if (result === undefined) {
      return res.status(404).json({ message: 'No hay ordenes activas en esta mesa' })
    }

    if (result.products === null) {
      return res.status(404).json({ message: 'No hay productos en esta mesa' })
    }

    result.products = JSON.parse(result.products)
    result.amount_left = result.total - amount_paid

    /**NOTE -
     * Result = 0, significa que la cuenta esta cerrada
     * Result = 4, significa que la cuenta esta abierta
     **/
    if (bill.table.length === 0) {
      await prisma.table.update({
        where: {
          tableId: {
            venueId: venueId,
            tableNumber: parseInt(result.tableNumber),
          },
        },
        data: {
          billId: bill.id,
        },
      })
    }

    if (result.status === 4) {
      console.log('bill.total es igual a total de POS?', Number(bill.total) === Number(result.total))
      if (Number(bill.total) === Number(result.total)) {
        return res.json(result)
      }
      console.log('✅ Cambiando status de cuenta a OPEN y actualizando total')

      await prisma.table.update({
        where: {
          tableId: {
            venueId: venueId,
            tableNumber: parseInt(result.tableNumber),
          },
        },
        data: {
          bill: {
            update: {
              total: result.total,
            },
          },
          status: 'ACTIVE',
        },
      })
    } else {
      console.log('🔌❌ Desconectando mesa, cambiando status de cuenta a CLOSED y agregando platillos')
      await prisma.table.update({
        where: {
          tableId: {
            venueId: venueId,
            tableNumber: parseInt(result.tableNumber),
          },
        },
        data: {
          status: 'INACTIVE',
          bill: {
            update: {
              total: result.total,
              products: {
                create: result.products.map(({ id, createdAt, iva, name, ...rest }) => ({
                  ...rest, // Esto copia todas las propiedades del producto excepto el id
                  tax: iva,
                  name: name.replace('.,', ''),
                })),
              },
              status: 'CLOSED',
            },
            disconnect: true,
          },
        },
      })
    }

    res.json(result)
  } catch (error) {
    console.error('Error al obtener información de la cuenta:', error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  } finally {
    await pool.close() // Considera manejar la conexión de forma más global si es posible
  }
}

export { getTest, getBillInfo }
