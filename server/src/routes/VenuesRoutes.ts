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
  const gerOrder = await pool.request().query(getOrder(tableNumber))

  const order = gerOrder.recordset[0]

  if (order === undefined) {
    /*FIXME - El problema es que si en el dia no hay ordenes antiguas, no se podra acceder a la mesa ya que
     * no se podra crear una cuenta temporal. Se debe de crear una cuenta temporal si no existe una orden */
    console.log('❌ POS: No existen ordenes activas en POS')
    const tempBill = await prisma.bill.findFirst({
      where: {
        tableNumber: Number(tableNumber),
        status: 'PRECREATED',
      },
    })
    if (tempBill) {
      return res.json({ message: 'Acceso temporal al menú', url: `/venues/${venueId}/bills/${tempBill.id}`, redirect: true })
    } else {
      const createTempBill = await prisma.bill.create({
        data: {
          tableNumber: Number(tableNumber),
          status: 'PRECREATED', // Estado temporal
          // REVIEW - No se si sea necesario el campo posOrder, ya que no se ha creado la orden en el POS
        },
        // Incluye lo que necesites retornar
      })
      return res.json({
        message: 'Acceso temporal al menú',
        url: `/venues/${venueId}/bills/${createTempBill.id}`,
        redirect: true,
        bill_status: 'PRECREATED',
      })
    }
  } else {
    if (order.Status !== 4) {
      console.log(`❌ POS: orden ${order.Orden} se encuentra en ${order.Status}  = cerrada`)
      // TODO - No se si esto tengo que comprobar con la fecha de hoy, ya que findFirst puede agarrar cualquier valor, y si
      //ya existe una cuenta con el mismo numero de mesa, no deberia de crear otra.
      const tempBill = await prisma.bill.findFirst({
        where: {
          tableNumber: Number(tableNumber),
          status: 'PENDING',
        },
      })
      if (tempBill) {
        console.log(`✅ Bill temporal con orden ${order.Orden} existe, retornando url de la cuenta.`)
        return res.json({ message: 'Acceso temporal al menú', url: `/venues/${venueId}/bills/${tempBill.id}`, redirect: true })
      } else {
        const createTempBill = await prisma.bill.create({
          data: {
            tableNumber: Number(tableNumber),
            status: 'PENDING', // Estado temporal
            // REVIEW - No se si sea necesario el campo posOrder, ya que no se ha creado la orden en el POS
            posOrder: order.Orden,
          },
          // Incluye lo que necesites retornar
        })
        return res.json({
          message: 'Acceso temporal al menú',
          url: `/venues/${venueId}/bills/${createTempBill.id}`,
          redirect: true,
          status: 'PENDING',
        })
      }
    } else {
      console.log(`✅ POS: orden ${order.Orden} se encuentra en ${order.Status} = abierta`)
      const bill = await prisma.bill.findFirst({
        where: {
          tableNumber: Number(tableNumber),
          posOrder: order.Orden,
        },
      })

      if (!bill) {
        console.log(
          `❌ Bill con orden ${order.Orden} no existe, 🔨 creando bill con los datos del POS y retornando url de la cuenta. (linea 270)`,
        )
        const queryGetProducts = await pool.request().query(getProducts(order.Orden))
        const platillos = queryGetProducts.recordset.map(platillo => {
          return {
            key: String(platillo.Id_Consecutivo),
            quantity: platillo.Cantidad,
            name: platillo.Descripcion.replace('.,', ''),
            punitario: platillo.Punitario * 100,
            tax: platillo.IVACobrado * 100,
            price: platillo.SubTotal * 100,
          }
        })
        const createBill = await prisma.bill.create({
          data: {
            key: `${order.Orden}-${tableNumber}`,
            tableNumber: Number(tableNumber),
            posOrder: order.Orden,
            status: order.Status === 4 ? 'OPEN' : 'CLOSED',
            total: order.Total * 100,
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
  console.log('🔍 Obteniendo información de la cuenta')
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

    const amount_left = Number(bill.total) - bill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)

    // switch (bill.status) {
    //   case 'PRECREATED':
    //     console.log('🟡 La cuenta está precreada, se agregaran productos una ves que el mesero los ingrese al POS')
    //     return res.status(200).json({ ...bill, amount_left })
    //   case 'PENDING':
    //     console.log('🟡 La cuenta está pendiente, se agregaran productos una ves que el mesero los ingrese al POS')
    //     return res.status(200).json({ ...bill, amount_left })
    //   case 'CLOSED':
    //     console.log('🔒 La cuenta está cerrada y no se reactivará.')
    //     return res.status(200).json({ ...bill, amount_left })
    // }

    if (bill.status === 'CLOSED') {
      console.log('🔒 La cuenta está cerrada y no se reactivará.')

      return res.status(200).json({ ...bill, amount_left })
    }

    const pool = await sql.connect(dbConfig)

    // NOTE - EXPERIMENTAL
    // const queryExperimental = await pool.request().query(
    //   `SELECT
    //   OP.Mesa,
    //   OP.Status,
    //   OP.Orden,
    //   OP.Total,
    //   CASE
    //     WHEN V.HoraCierre IS NOT NULL THEN 'Pagada'
    //     ELSE 'No Pagada'
    //   END as EstadoPago
    // FROM
    //   NetSilver.dbo.OrdenPendiente OP
    // LEFT JOIN
    //   NetSilver.dbo.Ventas V ON OP.HoraAbrir = V.HoraAbrir AND OP.Orden = V.Orden AND CONVERT(DATE, V.Fecha) = CONVERT(DATE, GETDATE())
    // WHERE
    //   OP.MESA = ${bill.tableNumber} AND
    //   OP.Orden = ${bill.posOrder} AND
    //   CONVERT(DATE, OP.HoraAbrir) = CONVERT(DATE, GETDATE())
    // ORDER BY
    //   OP.HoraAbrir DESC;
    //   `,
    // )
    // console.log('queryExperimental.recordset', queryExperimental.recordset)

    if (bill.status === 'PRECREATED') {
      const queryGetOrder = await pool.request().query(getOrder(bill.tableNumber))
      const pos_order = queryGetOrder.recordset[0]
      if (pos_order !== undefined) {
        const queryGetProducts = await pool.request().query(getProducts(pos_order.Orden))
        const platillos_pos = queryGetProducts.recordset
        const platillos = platillos_pos.map(platillo => {
          return {
            key: String(platillo.Id_Consecutivo),
            quantity: platillo.Cantidad,
            name: platillo.Descripcion.replace('.,', ''),
            punitario: platillo.Punitario * 100,
            tax: platillo.IVACobrado * 100,
            price: platillo.SubTotal * 100,
          }
        })
        if (pos_order.Status === 4) {
          console.log('🟢 La cuenta se actualizara a abierta, se agregaran productos una ves que el mesero los ingrese al POS')
          const updatedBill = await prisma.bill.update({
            where: {
              id: billId,
            },
            data: {
              status: 'OPEN',
              total: platillos.reduce((acc, platillo) => acc + platillo.price, 0),
              products: {
                create: platillos,
              },
              posOrder: pos_order.Orden,
              key: `O${pos_order.Orden}-T${bill.tableNumber}`,
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
          const roomId = `venue_${venueId}_bill_${billId}`
          req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order })
          return res.json({ ...updatedBill, amount_left, pos_order })
        }
      } else {
        return res.status(200).json(bill)
      }
    }
    // NOTE - Si la Bill es Pendiente
    if (bill.status === 'PENDING') {
      console.log('🟡 La cuenta está pendiente, se agregaran productos una ves que el mesero los ingrese al POS')
      const queryGetOrder = await pool.request().query(getOrder(bill.tableNumber))
      const pos_order = queryGetOrder.recordset[0]
      const queryGetProducts = await pool.request().query(getProducts(pos_order.Orden))
      const platillos_pos = queryGetProducts.recordset
      const platillos = platillos_pos.map(platillo => {
        return {
          key: String(platillo.Id_Consecutivo),
          quantity: platillo.Cantidad,
          name: platillo.Descripcion.replace('.,', ''),
          punitario: platillo.Punitario * 100,
          tax: platillo.IVACobrado * 100,
          price: platillo.SubTotal * 100,
        }
      })
      if (pos_order.Status === 4) {
        console.log('🟢 La cuenta se actualizara a abierta, se agregaran productos una ves que el mesero los ingrese al POS')
        const updatedBill = await prisma.bill.update({
          where: {
            id: billId,
          },
          data: {
            status: 'OPEN',
            total: platillos.reduce((acc, platillo) => acc + platillo.price, 0),
            products: {
              create: platillos,
            },
            posOrder: pos_order.Orden,
            key: `O${pos_order.Orden}-T${bill.tableNumber}`,
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
        const roomId = `venue_${venueId}_bill_${billId}`
        req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order })
        return res.json({ ...updatedBill, amount_left, pos_order })
      }

      return res.status(200).json({ ...bill, amount_left, pos_order })
    }

    // const today = new Date()
    // const createdAtDate = new Date(bill.createdAt)

    // NOTE - PARA COMPARAR FECHAS LOCALES HORA MEXICO
    // const offset = 6 * 60 * 60 * 1000; // 6 horas convertidas a milisegundos
    // const localNow = new Date(today.setUTCHours(0, 0, 0, 0) - offset);
    // const localCreatedAtDate = new Date(createdAtDate.setUTCHours(0, 0, 0, 0) - offset);
    // console.log('createdAtDate, today', createdAtDate, today)
    // console.log('createdAtDate < today', createdAtDate < today)
    // if (createdAtDate < today) {
    //   console.log('La hora de la cuenta es menor a la de hoy, se cerrará la cuenta.')
    //   const updatedBill = await prisma.bill.update({
    //     where: { id: billId, posOrder: bill.posOrder },
    //     data: {
    //       status: 'CLOSED',
    //     },
    //     include: {
    //       payments: {
    //         select: {
    //           amount: true,
    //         },
    //       },
    //       table: {
    //         select: {
    //           tableNumber: true,
    //         },
    //       },
    //       products: {
    //         select: {
    //           key: true,
    //           name: true,
    //           quantity: true,
    //           price: true,
    //         },
    //       },
    //     },
    //   })
    //   return res.json({ ...updatedBill, amount_left })
    // }

    const queryGetProducts = await pool.request().query(getProducts(bill.posOrder))

    const queryGetOrder = await pool.request().query(getOrder(bill.tableNumber))

    const pos_order = queryGetOrder.recordset[0]

    //NOTE - NUEVO PLATILLO AGREGADO?
    if (queryGetProducts.recordset.length !== bill.products.length) {
      // const platillosInexistentes = queryGetProducts.recordset
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

      const platillos = queryGetProducts.recordset.map(platillo => {
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
          status: pos_order.Status === 4 ? 'OPEN' : 'CLOSED',
          total: platillos.reduce((acc, platillo) => acc + platillo.price, 0),
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
      const roomId = `venue_${venueId}_bill_${billId}`
      req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order })
      return res.json({ ...updatedBill, amount_left, pos_order })
    }

    if (pos_order.Status !== 4) {
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
      const roomId = `venue_${venueId}_bill_${billId}`
      req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order })
      return res.json({ ...updatedBill, amount_left, pos_order })
    }

    return res.json({ ...bill, amount_left, pos_order })
  } catch (error) {
    console.error('Error al obtener información de la cuenta:', error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  } finally {
    pool.close()
  }
})

export default venueRouter
