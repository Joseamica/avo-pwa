import express from 'express'
import sql, { ConnectionPool } from 'mssql'
import dbConfig from '../config/DbConfig'
import prisma from '../utils/prisma'

import xml2js from 'xml2js'

const venueRouter = express.Router()
const pool = new ConnectionPool(dbConfig)

//ANCHOR ENDPOINTS
//NOTE ESTE ENDPOINT SOLO SE EJECUTARA UNA VES Y SOLO CUANDO EN EL POS SE ABRA UNA MESA
venueRouter.post('/order', async (req, res) => {
  const { venueId, orden, mesa, total, status } = req.body

  const date = new Date()
  const fiveHoursAgo = new Date(date.setUTCHours(date.getUTCHours() - 24))

  const isBillFromToday = await prisma.bill.findFirst({
    where: {
      tableNumber: parseInt(mesa),
      // updatedAt: {
      //   gte: fiveHoursAgo,
      // },
    },
  })

  if (!isBillFromToday) {
    console.log('🧾❌ bill no existe')
    const bill = await prisma.bill.create({
      data: {
        key: `O${orden}-T${mesa}`,
        tableNumber: parseInt(mesa),
        posOrder: parseInt(orden),
        status: status === '4' ? 'OPEN' : 'CLOSED',
        total: total * 100,
        table: {
          connect: {
            tableId: {
              venueId: venueId,
              tableNumber: parseInt(mesa),
            },
          },
        },
      },
    })
    console.log('✅ Bill nueva creada:', bill)
    return res.status(200).send('Bill nueva creada')
  } else {
    const updatedBill = await prisma.bill.update({
      where: {
        id: isBillFromToday.id,
      },
      data: {
        posOrder: parseInt(orden),
        total: total * 100,
        status: status === '4' ? 'OPEN' : 'PENDING',
      },
      include: {
        payments: true,
      },
    })
    const amount_left = Number(updatedBill.total) - updatedBill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)

    const roomId = `venue_${venueId}_table_${mesa}`
    req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order: orden })
    return res.status(200).send('Bill actualizada con exito')
  }
})

//ANCHOR ENDPOINTS
venueRouter.post('/comanda', async (req, res) => {
  const { venueId, orden, key, cantidad, nombre, precio } = req.body

  if (!venueId) {
    return res.status(400).json({ message: 'No se recibieron datos' })
  }
  const cantidadNumerica = parseInt(cantidad, 10)
  const precioNumerico = parseFloat(precio)
  if (isNaN(cantidadNumerica) || cantidadNumerica <= 0 || isNaN(precioNumerico) || precioNumerico <= 0) {
    return res.status(400).json({ message: 'Cantidad o precio inválidos.' })
  }
  try {
    const bill = await prisma.bill.findFirst({
      where: {
        posOrder: parseInt(orden),
        status: 'OPEN',
        table: {
          some: {
            venueId: venueId,
          },
        },
      },
      include: {
        products: true,
        table: true,
      },
    })
    if (!bill) {
      return res.status(404).json({ message: 'La cuenta no existe' })
    }
    const totalActualizado =
      bill.products.reduce((acc, producto) => acc + Number(producto.price) * producto.quantity, 0) + precioNumerico * 100 * cantidadNumerica

    const updatedBill = await prisma.bill.update({
      where: {
        id: bill.id,
      },
      data: {
        total: totalActualizado,
        products: {
          create: {
            key,
            name: nombre.replace('.,', ''),
            price: precio * 100,
            quantity: cantidad,
            // modifier: modificador,
          },
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
    const amount_left = Number(updatedBill.total) - updatedBill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)
    console.log('updatedBill', updatedBill)
    const roomId = `venue_${venueId}_table_${updatedBill.tableNumber}`
    req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order: updatedBill.posOrder })
    console.log('✅🍖 producto agregado')
    return res.status(200).json(updatedBill)
  } catch (error) {
    console.error('Error al agregar producto:', error)
    res.status(500).json({ error: 'Error interno en /comanda' })
  }
})

venueRouter.get('/:venueId/tables/:tableNumber', async (req, res) => {
  const { venueId, tableNumber } = req.params
  try {
    const table = await prisma.table.findUnique({
      where: {
        tableId: {
          venueId: venueId,
          tableNumber: parseInt(tableNumber),
        },
      },
      select: {
        bill: true,
      },
    })
    if (!table) {
      return res.status(404).json({ message: 'La mesa no esta en la base de datos de este restaurante' })
    }
    const bill = table?.bill

    if (bill) {
      return res.json({ message: 'Acceso temporal al menú', url: `/venues/${venueId}/bills/${bill.id}`, redirect: true })
    } else {
      const createdBill = await prisma.bill.create({
        data: {
          tableNumber: parseInt(tableNumber),
          total: 0,
          status: 'EARLYACCESS',
          table: {
            connect: {
              tableId: {
                venueId: venueId,
                tableNumber: parseInt(tableNumber),
              },
            },
          },
        },
      })

      //         return res.json({ ...updatedBill, amount_left: updated_amount_left, pos_order })
      return res.json({ message: 'Acceso temporal al menú', url: `/venues/${venueId}/bills/${createdBill.id}`, redirect: true })
    }
  } catch (error) {
    console.error('Error al obtener mesa:', error)
    res.status(500).json({ error: 'Error interno al obtener mesa' })
  }
})

async function updateTableStatusesAndGetTables(venueId, mesasArray) {
  // Primero, actualiza los estados de las mesas
  await prisma.$transaction([
    prisma.table.updateMany({
      where: {
        venueId: venueId,
        tableNumber: {
          in: mesasArray,
        },
      },
      data: {
        status: 'ACTIVE',
      },
    }),
    prisma.table.updateMany({
      where: {
        venueId: venueId,
        tableNumber: {
          notIn: mesasArray,
        },
      },
      data: {
        status: 'INACTIVE',
      },
    }),
  ])

  // Luego, recupera todas las mesas para el venueId dado
  const tables = await prisma.table.findMany({
    where: {
      venueId: venueId,
    },
  })

  return tables // Devuelve las mesas
}

//ANCHOR - TABLES
// venueRouter.get('/:venueId/tables', async (req, res) => {
//   console.log('🔍 Obteniendo todas las mesas 🍴')
//   const { venueId } = req.params
//   try {
//     const pool = await sql.connect(dbConfig)
//     const queryExperimental = await pool.request()
//       .query(`DECLARE @Movimiento INT, @NoCuentasAbiertas BIGINT, @TotalCuentasAbiertas DECIMAL(18,2)

//     SELECT @NoCuentasAbiertas = COUNT(*),
//            @TotalCuentasAbiertas = CONVERT(DECIMAL(18,2), ISNULL(SUM(total), 0))
//     FROM ordenPendiente WITH (NOLOCK)
//     WHERE status = 4 AND IdTipoOrden <> 4
//     AND fechaoperacion > DATEADD(dd, -2, GETDATE())

//     SELECT TOP 1 @Movimiento = Movimiento
//     FROM Ventas v
//     WHERE IsNull(controlEnvio, 0) = 0
//     AND v.HoraCierre < DATEADD(s, -15, GETDATE())
//     ORDER BY Movimiento

//     DECLARE @OrdenPendiente_XML AS XML
//     SET @OrdenPendiente_XML = (select IdTipoOrden as 'Orden/@IdTipoOrden', CAST(Orden AS INT) as 'Orden/@Orden', fechaoperacion as 'Orden/@fechaoperacion', Mesa as 'Orden/@Mesa', personas as 'Orden/@personas', CAST( total AS DECIMAL(16,2)) as 'Orden/@total'
//     from OrdenPendiente with(nolock)
//     where Status = 4 and IdTipoOrden <> 4
//     and fechaoperacion > DATEADD(dd,-2,GETDATE())
//     for xml path(''), root('OrdenesPendientes'))

//     -- Ahora, selecciona las variables para ver sus valores.
//     SELECT @Movimiento AS Movimiento,
//            @NoCuentasAbiertas AS NoCuentasAbiertas,
//            @TotalCuentasAbiertas AS TotalCuentasAbiertas,
//          @OrdenPendiente_XML AS OrdenPendiente
//     `)
//     const ordenes = queryExperimental.recordset[0].OrdenPendiente
//     if (!ordenes) {
//       const tables = await prisma.table.findMany({
//         where: {
//           venueId: venueId,
//         },
//       })
//       return res.status(200).json(tables)
//     }
//     const parser = new xml2js.Parser()
//     parser.parseString(ordenes, async function (err, result) {
//       if (err) {
//         console.error('Error al parsear XML:', err)
//         return
//       }

//       // Extrae las mesas y las coloca en un array
//       const mesasArray = result.OrdenesPendientes.Orden.map(orden => parseInt(orden.$.Mesa))
//       try {
//         // Actualiza los estados de las mesas y recupera las mesas actualizadas
//         const tables = await updateTableStatusesAndGetTables(venueId, mesasArray)
//         // Envía las mesas actualizadas como respuesta
//         res.status(200).json(tables)
//       } catch (error) {
//         console.error('Error al actualizar y recuperar mesas:', error)
//         res.status(500).json({ error: 'Error interno al actualizar/recuperar mesas' })
//       }
//     })
//   } catch (error) {
//     console.error('Error al obtener mesas:', error)
//     res.status(500).json({ error: 'Error interno al obtener mesas' })
//   }
// })

venueRouter.get('/:venueId/tables', async (req, res) => {
  console.log('🔍 ')
  const { venueId } = req.params
  try {
    const tables = await prisma.table.findMany({
      where: {
        venueId: venueId,
        billId: {
          not: null,
        },
      },
    })
    return res.status(200).json(tables)
  } catch (error) {
    console.error('Error al obtener mesas:', error)
    res.status(500).json({ error: 'Error interno al obtener mesas' })
  }
})

venueRouter.get('/:venueId/bills/:billId', async (req, res) => {
  const { billId } = req.params
  try {
    if (!billId) {
      return res.status(400).json({ message: 'No se recibieron datos' })
    }
    console.log('🔍 Obteniendo información de la cuenta')
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
            key: true,
            name: true,
            quantity: true,
            price: true,
          },
        },
      },
    })

    const amount_left = Number(bill.total) - bill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)

    return res.json({ ...bill, amount_left, pos_order: bill.posOrder })
  } catch (error) {
    console.error('Error al obtener información de la cuenta:', error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

venueRouter.post('/:venueId/review', (req, res) => {
  console.log('stars', req.body)
  res.json({ message: 'VenueId Works!' })
})

venueRouter.get('/listVenues', async (req, res) => {
  const venues = await prisma.venue.findMany({ include: { tables: true } })
  console.log('stars', req.body)
  res.json(venues)
})

// //ANCHOR - TABLE NUMBER
// venueRouter.get('/:venueId/tables/:tableNumber', async (req, res) => {
//   const { venueId, tableNumber } = req.params

//   const pool = await sql.connect(dbConfig)
//   const gerOrder = await pool.request().query(getOrder(tableNumber))

//   const order = gerOrder.recordset[0]

//   if (order === undefined) {
//     /*FIXME - El problema es que si en el dia no hay ordenes antiguas, no se podra acceder a la mesa ya que
//      * no se podra crear una cuenta temporal. Se debe de crear una cuenta temporal si no existe una orden */
//     console.log('❌ POS: No existen ordenes activas en POS')
//     const tempBill = await prisma.bill.findFirst({
//       where: {
//         tableNumber: Number(tableNumber),
//         status: 'PRECREATED',
//       },
//     })
//     if (tempBill) {
//       return res.json({ message: 'Acceso temporal al menú', url: `/venues/${venueId}/bills/${tempBill.id}`, redirect: true })
//     } else {
//       const createTempBill = await prisma.bill.create({
//         data: {
//           tableNumber: Number(tableNumber),
//           status: 'PRECREATED', // Estado temporal
//           // REVIEW - No se si sea necesario el campo posOrder, ya que no se ha creado la orden en el POS
//         },
//         // Incluye lo que necesites retornar
//       })
//       return res.json({
//         message: 'Acceso temporal al menú',
//         url: `/venues/${venueId}/bills/${createTempBill.id}`,
//         redirect: true,
//         bill_status: 'PRECREATED',
//       })
//     }
//   } else {
//     if (order.Status !== 4) {
//       console.log(`❌ POS: orden ${order.Orden} se encuentra en ${order.Status}  = cerrada`)
//       // TODO - No se si esto tengo que comprobar con la fecha de hoy, ya que findFirst puede agarrar cualquier valor, y si
//       //ya existe una cuenta con el mismo numero de mesa, no deberia de crear otra.
//       const tempBill = await prisma.bill.findFirst({
//         where: {
//           tableNumber: Number(tableNumber),
//           status: 'PENDING',
//         },
//       })
//       if (tempBill) {
//         console.log(`✅ Bill temporal con orden ${order.Orden} existe, retornando url de la cuenta.`)
//         return res.json({ message: 'Acceso temporal al menú', url: `/venues/${venueId}/bills/${tempBill.id}`, redirect: true })
//       } else {
//         const createTempBill = await prisma.bill.create({
//           data: {
//             tableNumber: Number(tableNumber),
//             status: 'PENDING', // Estado temporal
//             // REVIEW - No se si sea necesario el campo posOrder, ya que no se ha creado la orden en el POS
//             posOrder: order.Orden,
//           },
//           // Incluye lo que necesites retornar
//         })
//         return res.json({
//           message: 'Acceso temporal al menú',
//           url: `/venues/${venueId}/bills/${createTempBill.id}`,
//           redirect: true,
//           status: 'PENDING',
//         })
//       }
//     } else {
//       console.log(`✅ POS: orden ${order.Orden} se encuentra en ${order.Status} = abierta`)
//       console.log('🕵🏻‍♂️ Verificando cuenta si es del dia de hoy')
//       const bill = await prisma.bill.findFirst({
//         where: {
//           tableNumber: Number(tableNumber),
//           posOrder: order.Orden,
//           AND: [
//             {
//               createdAt: {
//                 gte: new Date(order.FechaOperacion.setHours(0, 0, 0, 0)), // start of the day
//               },
//             },
//             {
//               createdAt: {
//                 lt: new Date(order.FechaOperacion.setHours(24, 0, 0, 0)), // start of the next day
//               },
//             },
//           ],
//         },
//       })

//       if (!bill) {
//         console.log(
//           `❌ Bill con orden ${order.Orden} no existe, ➕ creando bill con los datos del POS y retornando url de la cuenta. (linea 270)`,
//         )
//         const queryGetProducts = await pool.request().query(getProducts(order.Orden))
//         const platillos = queryGetProducts.recordset.map(platillo => {
//           return {
//             key: String(platillo.Id_Consecutivo),
//             quantity: platillo.Cantidad,
//             name: platillo.Descripcion.replace('.,', ''),
//             punitario: platillo.Punitario * 100,
//             tax: platillo.IVACobrado * 100,
//             price: platillo.SubTotal * 100,
//           }
//         })
//         const createBill = await prisma.bill.create({
//           data: {
//             key: `${order.Orden}-${tableNumber}`,
//             tableNumber: Number(tableNumber),
//             posOrder: order.Orden,
//             status: order.Status === 4 ? 'OPEN' : 'CLOSED',
//             total: order.Total * 100,
//             products: {
//               create: platillos,
//             },
//           },
//           include: {
//             payments: {
//               select: {
//                 amount: true,
//               },
//             },
//             table: {
//               select: {
//                 tableNumber: true,
//               },
//             },
//             products: {
//               select: {
//                 name: true,
//                 quantity: true,
//                 price: true,
//               },
//             },
//           },
//         })
//         // TODO -ACTIVAR
//         return res.json({
//           message: 'Mesa activa',
//           url: `/venues/${venueId}/bills/${createBill.id}`,
//           redirect: true,
//         })
//       } else {
//         // TODO -ACTIVAR
//         console.log(`✅ Bill con order de ${bill.posOrder} existe, retornando url de la cuenta.`)
//         return res.json({ message: 'Mesa activa', url: `/venues/${venueId}/bills/${bill.id}`, redirect: true })
//       }
//     }
//   }
// })

// //ANCHOR - BILLID
// venueRouter.post('/:venueId/bills/:billId', async (req, res) => {
//   console.log('🔍 Obteniendo información de la cuenta')
//   const { billId, venueId } = req.params

//   try {
//     const bill = await prisma.bill.findUnique({
//       where: {
//         id: billId,
//       },
//       include: {
//         payments: {
//           select: {
//             amount: true,
//           },
//         },
//         table: {
//           select: {
//             tableNumber: true,
//           },
//         },
//         products: {
//           select: {
//             key: true,
//             name: true,
//             quantity: true,
//             price: true,
//           },
//         },
//       },
//     })

//     const amount_left = Number(bill.total) - bill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)

//     // switch (bill.status) {
//     //   case 'PRECREATED':
//     //     console.log('🟡 La cuenta está precreada, se agregaran productos una ves que el mesero los ingrese al POS')
//     //     return res.status(200).json({ ...bill, amount_left })
//     //   case 'PENDING':
//     //     console.log('🟡 La cuenta está pendiente, se agregaran productos una ves que el mesero los ingrese al POS')
//     //     return res.status(200).json({ ...bill, amount_left })
//     //   case 'CLOSED':
//     //     console.log('🔒 La cuenta está cerrada y no se reactivará.')
//     //     return res.status(200).json({ ...bill, amount_left })
//     // }

//     // function startOfDayUTC(date) {
//     //   const newDate = new Date(date)
//     //   newDate.setUTCHours(0, 0, 0, 0) // Ajusta la hora a medianoche UTC
//     //   return newDate
//     // }
//     // if (bill.status === 'OPEN') {
//     //   if (startOfDayUTC(bill.createdAt) < startOfDayUTC(new Date())) {
//     //     console.log('PENE')
//     //     const pool = await sql.connect(dbConfig)
//     //     const queryGetOrder = await pool.request().query(getOrder(bill.tableNumber))
//     //     const pos_order = queryGetOrder.recordset[0]
//     //     if (pos_order === undefined) {
//     //       return res.status(200).json(bill)
//     //     }
//     //   }
//     // }

//     if (bill.status === 'CLOSED') {
//       console.log('🔒 La cuenta está cerrada y no se reactivará.')

//       return res.status(200).json({ ...bill, amount_left })
//     }
//     const pool = await sql.connect(dbConfig)

//     // NOTE - EXPERIMENTAL
//     // const queryExperimental = await pool.request().query(
//     //   `SELECT
//     //   OP.Mesa,
//     //   OP.Status,
//     //   OP.Orden,
//     //   OP.Total,
//     //   CASE
//     //     WHEN V.HoraCierre IS NOT NULL THEN 'Pagada'
//     //     ELSE 'No Pagada'
//     //   END as EstadoPago
//     // FROM
//     //   NetSilver.dbo.OrdenPendiente OP
//     // LEFT JOIN
//     //   NetSilver.dbo.Ventas V ON OP.HoraAbrir = V.HoraAbrir AND OP.Orden = V.Orden AND CONVERT(DATE, V.Fecha) = CONVERT(DATE, GETDATE())
//     // WHERE
//     //   OP.MESA = ${bill.tableNumber} AND
//     //   OP.Orden = ${bill.posOrder} AND
//     //   CONVERT(DATE, OP.HoraAbrir) = CONVERT(DATE, GETDATE())
//     // ORDER BY
//     //   OP.HoraAbrir DESC;
//     //   `,
//     // )
//     // console.log('queryExperimental.recordset', queryExperimental.recordset)

//     if (bill.status === 'PRECREATED') {
//       const queryGetOrder = await pool.request().query(getOrder(bill.tableNumber))
//       const pos_order = queryGetOrder.recordset[0]
//       if (pos_order !== undefined) {
//         const queryGetProducts = await pool.request().query(getProducts(pos_order.Orden))
//         const platillos_pos = queryGetProducts.recordset
//         const platillos = platillos_pos.map(platillo => {
//           return {
//             key: String(platillo.Id_Consecutivo),
//             quantity: platillo.Cantidad,
//             name: platillo.Descripcion.replace('.,', ''),
//             punitario: platillo.Punitario * 100,
//             tax: platillo.IVACobrado * 100,
//             price: platillo.SubTotal * 100,
//           }
//         })
//         if (pos_order.Status === 4) {
//           console.log('🟢 La cuenta se actualizara a abierta, se agregaran productos una ves que el mesero los ingrese al POS')
//           const updatedBill = await prisma.bill.update({
//             where: {
//               id: billId,
//             },
//             data: {
//               status: 'OPEN',
//               total: platillos.reduce((acc, platillo) => acc + platillo.price, 0),
//               products: {
//                 create: platillos,
//               },
//               posOrder: pos_order.Orden,
//               key: `O${pos_order.Orden}-T${bill.tableNumber}`,
//             },
//             include: {
//               payments: {
//                 select: {
//                   amount: true,
//                 },
//               },
//               table: {
//                 select: {
//                   tableNumber: true,
//                 },
//               },
//               products: {
//                 select: {
//                   key: true,
//                   name: true,
//                   quantity: true,
//                   price: true,
//                 },
//               },
//             },
//           })
//           const roomId = `venue_${venueId}_bill_${billId}`
//           req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order })
//           return res.json({ ...updatedBill, amount_left, pos_order })
//         }
//       } else {
//         return res.status(200).json(bill)
//       }
//     }
//     // NOTE - Si la Bill es Pendiente
//     if (bill.status === 'PENDING') {
//       console.log('🟡 La cuenta está pendiente, se agregaran productos una ves que el mesero los ingrese al POS')
//       const queryGetOrder = await pool.request().query(getOrder(bill.tableNumber))
//       const pos_order = queryGetOrder.recordset[0]

//       const queryGetProducts = await pool.request().query(getProducts(pos_order.Orden))
//       const platillos_pos = queryGetProducts.recordset
//       const platillos = platillos_pos.map(platillo => {
//         return {
//           key: String(platillo.Id_Consecutivo),
//           quantity: platillo.Cantidad,
//           name: platillo.Descripcion.replace('.,', ''),
//           punitario: platillo.Punitario * 100,
//           tax: platillo.IVACobrado * 100,
//           price: platillo.SubTotal * 100,
//         }
//       })
//       if (pos_order.Status === 4) {
//         console.log('🟢 La cuenta se actualizara a abierta, se agregaran productos una ves que el mesero los ingrese al POS')
//         const updatedBill = await prisma.bill.update({
//           where: {
//             id: billId,
//           },
//           data: {
//             status: 'OPEN',
//             total: platillos.reduce((acc, platillo) => acc + platillo.price, 0),
//             products: {
//               create: platillos,
//             },
//             posOrder: pos_order.Orden,
//             key: `O${pos_order.Orden}-T${bill.tableNumber}`,
//           },
//           include: {
//             payments: {
//               select: {
//                 amount: true,
//               },
//             },
//             table: {
//               select: {
//                 tableNumber: true,
//               },
//             },
//             products: {
//               select: {
//                 key: true,
//                 name: true,
//                 quantity: true,
//                 price: true,
//               },
//             },
//           },
//         })
//         const updated_amount_left =
//           Number(updatedBill.total) - updatedBill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)

//         const roomId = `venue_${venueId}_bill_${billId}`
//         req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order })
//         return res.json({ ...updatedBill, amount_left: updated_amount_left, pos_order })
//       }

//       return res.status(200).json({ ...bill, amount_left, pos_order })
//     }

//     // const today = new Date()
//     // const createdAtDate = new Date(bill.createdAt)

//     // NOTE - PARA COMPARAR FECHAS LOCALES HORA MEXICO
//     // const offset = 6 * 60 * 60 * 1000; // 6 horas convertidas a milisegundos
//     // const localNow = new Date(today.setUTCHours(0, 0, 0, 0) - offset);
//     // const localCreatedAtDate = new Date(createdAtDate.setUTCHours(0, 0, 0, 0) - offset);
//     // console.log('createdAtDate, today', createdAtDate, today)
//     // console.log('createdAtDate < today', createdAtDate < today)
//     // if (createdAtDate < today) {
//     //   console.log('La hora de la cuenta es menor a la de hoy, se cerrará la cuenta.')
//     //   const updatedBill = await prisma.bill.update({
//     //     where: { id: billId, posOrder: bill.posOrder },
//     //     data: {
//     //       status: 'CLOSED',
//     //     },
//     //     include: {
//     //       payments: {
//     //         select: {
//     //           amount: true,
//     //         },
//     //       },
//     //       table: {
//     //         select: {
//     //           tableNumber: true,
//     //         },
//     //       },
//     //       products: {
//     //         select: {
//     //           key: true,
//     //           name: true,
//     //           quantity: true,
//     //           price: true,
//     //         },
//     //       },
//     //     },
//     //   })
//     //   return res.json({ ...updatedBill, amount_left })
//     // }

//     const queryGetProducts = await pool.request().query(getProducts(bill.posOrder))

//     const queryGetOrder = await pool.request().query(getOrder(bill.tableNumber))

//     const pos_order = queryGetOrder.recordset[0]
//     if (pos_order === undefined) {
//       console.log('❌ POS: No existen ordenes activas en POS')
//       const updatedBill = await prisma.bill.update({
//         where: { id: billId },
//         data: {
//           status: 'CLOSED',
//         },
//         include: {
//           payments: {
//             select: {
//               amount: true,
//             },
//           },
//           table: {
//             select: {
//               tableNumber: true,
//             },
//           },
//           products: {
//             select: {
//               key: true,
//               name: true,
//               quantity: true,
//               price: true,
//             },
//           },
//         },
//       })
//       return res.status(200).json(updatedBill)
//     }

//     //NOTE - NUEVO PLATILLO AGREGADO?
//     if (queryGetProducts.recordset.length !== bill.products.length) {
//       console.log('🟢🍖 Nuevos platillos seran agregados a la cuenta')
//       // const platillosInexistentes = queryGetProducts.recordset
//       //   .filter(product => {
//       //     return bill.products.some(platillo => {
//       //       console.log('platillo', platillo.key)
//       //       console.log('product', parseInt(product.Id_Consecutivo))
//       //       console.log(product.Id_Consecutivo !== parseInt(platillo.key))
//       //       return product.Id_Consecutivo !== parseInt(platillo.key)
//       //     })
//       //   })
//       //   .map(platillo => {
//       //     return {
//       //       quantity: platillo.Cantidad,
//       //       name: platillo.Descripcion.replace('.,', ''),
//       //       punitario: platillo.Punitario * 100,
//       //       tax: platillo.IVACobrado * 100,
//       //       price: platillo.SubTotal * 100,
//       //     }
//       //   })

//       const platillos = queryGetProducts.recordset.map(platillo => {
//         return {
//           key: String(platillo.Id_Consecutivo),
//           quantity: platillo.Cantidad,
//           name: platillo.Descripcion.replace('.,', ''),
//           punitario: platillo.Punitario * 100,
//           tax: platillo.IVACobrado * 100,
//           price: platillo.SubTotal * 100,
//         }
//       })

//       await prisma.bill.update({
//         where: { id: billId },
//         data: {
//           products: {
//             set: [],
//           },
//         },
//       })
//       const updatedBill = await prisma.bill.update({
//         where: {
//           id: billId,
//           posOrder: bill.posOrder,
//         },
//         data: {
//           status: pos_order.Status === 4 ? 'OPEN' : 'CLOSED',
//           total: platillos.reduce((acc, platillo) => acc + platillo.price, 0),
//           products: {
//             create: platillos,
//           },
//         },
//         include: {
//           payments: {
//             select: {
//               amount: true,
//             },
//           },
//           table: {
//             select: {
//               tableNumber: true,
//             },
//           },
//           products: {
//             select: {
//               key: true,
//               name: true,
//               quantity: true,
//               price: true,
//             },
//           },
//         },
//       })
//       const roomId = `venue_${venueId}_bill_${billId}`
//       req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order })
//       return res.json({ ...updatedBill, amount_left, pos_order })
//     }

//     if (pos_order.Status !== 4) {
//       const updatedBill = await prisma.bill.update({
//         where: {
//           id: billId,
//           posOrder: bill.posOrder,
//         },
//         data: {
//           status: 'CLOSED',
//         },
//         include: {
//           payments: {
//             select: {
//               amount: true,
//             },
//           },
//           table: {
//             select: {
//               tableNumber: true,
//             },
//           },
//           products: {
//             select: {
//               key: true,
//               name: true,
//               quantity: true,
//               price: true,
//             },
//           },
//         },
//       })
//       const roomId = `venue_${venueId}_bill_${billId}`
//       req.io.to(roomId).emit('updateOrder', { ...updatedBill, amount_left, pos_order })
//       return res.json({ ...updatedBill, amount_left, pos_order })
//     }

//     return res.json({ ...bill, amount_left, pos_order })
//   } catch (error) {
//     console.error('Error al obtener información de la cuenta:', error)
//     res.status(500).json({ message: 'Error interno del servidor.' })
//   } finally {
//     pool.close()
//   }
// })

// venueRouter.put('/:venueId/orders/:orderNumber', async (req, res) => {
//   const { key, orden, nombre, cantidad, precio } = req.body
//   const { venueId } = req.params
//   const bill = await prisma.bill.findFirst({
//     where: {
//       posOrder: parseInt(orden),
//       status: 'OPEN',
//     },
//     include: {
//       products: true,
//     },
//   })
//   const total = bill.products.reduce((acc, platillo) => acc + Number(platillo.price), 0)

//   const updatedBill = await prisma.bill.update({
//     where: {
//       id: bill.id,
//     },
//     data: {
//       total: total + Number(precio) * Number(cantidad) * 100,
//       products: {
//         create: {
//           key,
//           name: nombre.replace('.,', ''),
//           price: precio * 100,
//           quantity: cantidad,
//           // modifier: modificador,
//         },
//       },
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
//   console.log('updatedBill', updatedBill)
//   const updated_amount_left = Number(updatedBill.total) - updatedBill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)
//   const roomId = `venue_${venueId}_bill_${bill.id}`
//   req.io.to(roomId).emit('updateOrder', { ...updatedBill, updated_amount_left, orden })
//   return res.json({ orden })
// })

export default venueRouter
