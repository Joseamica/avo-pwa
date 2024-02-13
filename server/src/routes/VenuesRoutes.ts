import express from 'express'
import sql, { ConnectionPool } from 'mssql'
import dbConfig from '../config/DbConfig'
import prisma from '../utils/prisma'
import { getOrder, getProducts } from '../utils/sqlQueries'

const venueRouter = express.Router()
const pool = new ConnectionPool(dbConfig)

venueRouter.get('/:venueId', (req, res) => {
  res.json({ message: 'VenueId Works!' })
})

//ANCHOR - TABLES
venueRouter.get('/:venueId/tables', async (req, res) => {
  const { venueId } = req.params
  const tables = await prisma.table.findMany({
    where: {
      venueId: venueId,
    },
    orderBy: {
      tableNumber: 'asc',
    },
  })
  res.json(tables)
})

//ANCHOR - TABLE NUMBER
venueRouter.get('/:venueId/tables/:tableNumber', async (req, res) => {
  const { venueId, tableNumber } = req.params

  const pool = await sql.connect(dbConfig)
  const query = await pool.request().query(getOrder(tableNumber))
  const result = query.recordset[0]

  if (result === undefined) {
    console.log('❌ POS: No existen ordenes activas en POS')
    return res.status(404).json({ message: 'No hay ordenes activas en esta mesa' })
  } else {
    if (result.status === 0) {
      console.log(`❌ POS: orden ${result.Orden} se encuentra en ${result.Status}  = cerrada`)
      return res.status(404).json({ message: 'La cuenta está cerrada y no se reactivará.' })
    } else {
      console.log(`✅ POS: orden ${result.Orden} se encuentra en ${result.Status} = abierta`)
      const bill = await prisma.bill.findFirst({
        where: {
          tableNumber: Number(tableNumber),
          posOrder: result.Orden,
        },
      })

      if (!bill) {
        console.log(
          `❌ Bill con orden ${result.Orden} no existe, 🔨 creando bill con los datos del POS y retornando url de la cuenta. (linea 270)`,
        )
        const queryObtenPlatillos = await pool
          .request()
          .query(
            `SELECT * FROM NetSilver.dbo.Comanda WHERE ORDEN = ${result.Orden} AND CONVERT(DATE, Hora) = CONVERT(DATE, GETDATE()) AND Modificador = 0 ORDER BY Hora DESC`,
          )
        const platillos = queryObtenPlatillos.recordset.map(platillo => {
          return {
            quantity: platillo.Cantidad,
            name: platillo.Descripcion.replace('.,', ''),
            punitario: platillo.Punitario * 100,
            tax: platillo.IVACobrado * 100,
            price: platillo.SubTotal * 100,
          }
        })
        const createBill = await prisma.bill.create({
          data: {
            key: `${result.Orden}-${tableNumber}`,
            tableNumber: Number(tableNumber),
            posOrder: result.Orden,
            status: result.Status === 4 ? 'OPEN' : 'CLOSED',
            total: result.Total * 100,
            products: {
              create: platillos,
            },
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
        // TODO -ACTIVAR
        return res.json({
          message: 'Mesa activa',
          url: `/venues/${venueId}/bills/${createBill.id}`,
          redirect: true,
        })
      } else {
        // TODO -ACTIVAR
        console.log(`✅ Bill con order de ${bill.posOrder} existe, retornando url de la cuenta.`)
        return res.json({ message: 'Mesa activa', url: `/venues/${venueId}/bills/${bill.id}`, redirect: true })
      }
    }
  }
})

//ANCHOR - BILLID
venueRouter.post('/:venueId/bills/:billId', async (req, res) => {
  const { billId, venueId } = req.params

  try {
    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
        // NOTE - no se debe definir status, ya que admin puede revisar la orden aunque este cerrada
        // status: 'OPEN',
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
            key: true,
            name: true,
            quantity: true,
            price: true,
          },
        },
      },
    })

    if (bill.status === 'CLOSED') {
      console.log('🔒 La cuenta está cerrada y no se reactivará.')
      return res.status(200).json(bill)
    }

    const today = new Date()
    const createdAtDate = new Date(bill.createdAt)
    createdAtDate.setUTCHours(0, 0, 0, 0)
    today.setUTCHours(0, 0, 0, 0)

    if (createdAtDate < today) {
      const updatedBill = await prisma.bill.update({
        where: { id: billId, posOrder: bill.posOrder },
        data: {
          status: 'CLOSED',
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
              key: true,
              name: true,
              quantity: true,
              price: true,
            },
          },
        },
      })
      return res.json(updatedBill)
    }
    const pool = await sql.connect(dbConfig)

    const queryObtenPlatillos = await pool.request().query(getProducts(bill.posOrder))

    const queryObtenOrden = await pool.request().query(getOrder(bill.tableNumber))

    const orden_pos = queryObtenOrden.recordset[0]
    console.log('orden_pos', orden_pos)

    //NOTE - NUEVO PLATILLO AGREGADO?
    if (queryObtenPlatillos.recordset.length !== bill.products.length) {
      // const platillosInexistentes = queryObtenPlatillos.recordset
      //   .filter(product => {
      //     return bill.products.some(platillo => {
      //       console.log('platillo', platillo.key)
      //       console.log('product', parseInt(product.Id_Consecutivo))
      //       console.log(product.Id_Consecutivo !== parseInt(platillo.key))
      //       return product.Id_Consecutivo !== parseInt(platillo.key)
      //     })
      //   })
      //   .map(platillo => {
      //     return {
      //       quantity: platillo.Cantidad,
      //       name: platillo.Descripcion.replace('.,', ''),
      //       punitario: platillo.Punitario * 100,
      //       tax: platillo.IVACobrado * 100,
      //       price: platillo.SubTotal * 100,
      //     }
      //   })

      const platillos = queryObtenPlatillos.recordset.map(platillo => {
        return {
          key: String(platillo.Id_Consecutivo),
          quantity: platillo.Cantidad,
          name: platillo.Descripcion.replace('.,', ''),
          punitario: platillo.Punitario * 100,
          tax: platillo.IVACobrado * 100,
          price: platillo.SubTotal * 100,
        }
      })

      await prisma.bill.update({
        where: { id: billId },
        data: {
          products: {
            set: [],
          },
        },
      })
      const updatedBill = await prisma.bill.update({
        where: {
          id: billId,
          posOrder: bill.posOrder,
        },
        data: {
          status: orden_pos.Status === 4 ? 'OPEN' : 'CLOSED',
          total: queryObtenPlatillos.recordset.reduce((acc, platillo) => acc + platillo.SubTotal * 100, 0),
          products: {
            create: platillos,
          },
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
              key: true,
              name: true,
              quantity: true,
              price: true,
            },
          },
        },
      })

      return res.json(updatedBill)
    }
    if (orden_pos.Status !== 4) {
      const updatedBill = await prisma.bill.update({
        where: {
          id: billId,
          posOrder: bill.posOrder,
        },
        data: {
          status: 'CLOSED',
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
              key: true,
              name: true,
              quantity: true,
              price: true,
            },
          },
        },
      })
      return res.json(updatedBill)
    }

    return res.json(bill)
  } catch (error) {
    console.error('Error al obtener información de la cuenta:', error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  } finally {
    pool.close()
  }
})

export default venueRouter
