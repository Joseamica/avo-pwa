const dbConfig = require('../config/DbConfig')
const sql = require('mssql')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
sql.on('error', err => {
  console.error('Error al conectar a MSSQL', err)
})

const getTest = async (req, res) => {
  console.log('ACCESS')
  res.json({ message: 'BillController works' })
}

const getBillInfo = async (req, res) => {
  const { billId } = req.params

  const bill = await prisma.bill.findUnique({
    where: {
      id: billId,
    },
    select: {
      tableNumber: true,
      payments: {
        select: {
          amount: true,
        },
      },
    },
  })

  if (!bill) {
    res.status(404).json({ message: 'No existe una cuenta con este Id' })
    return
  }
  const amount_paid = bill.payments.reduce((acc, payment) => acc + Number(payment.amount), 0)

  sql.connect(dbConfig).then(pool => {
    pool.query`SELECT TOP 1
        op.Orden AS bill,
        op.Mesa as tableNumber,
        op.Personas,
        op.HoraAbrir,
        (op.Total * 100) as total,  -- Multiplicamos por 100
        op.Impresa,
        op.status,
        -- Construcción manual de JSON para los platillos
        (
          SELECT 
            '[' + STUFF((
              SELECT 
                ',{"id":' + CAST(c.Id_Platillo AS NVARCHAR(10)) +
                ',"createdAt":"' + CONVERT(VARCHAR(8), c.Hora, 108) +
                '","name":"' + c.Descripcion +
                '","quantity":' + CAST(c.Cantidad AS NVARCHAR(10)) +
                ',"punitario":' + CAST(c.Punitario  * 100 AS NVARCHAR(20)) +
                ',"iva":' + CAST(c.IVACobrado * 100 AS NVARCHAR(20)) + -- Asumiendo un 16% de IVA
                ',"price":' + CAST((c.SubTotal * c.Cantidad * 100) AS NVARCHAR(20)) + '}' -- Total como Decimal
              FROM 
                NetSilver.dbo.Comanda AS c
              WHERE 
                c.Orden = op.Orden -- Solo platillos de la orden específica
                AND c.Modificador = 0 -- Solo platillos sin modificadores
                AND CONVERT(DATE, c.Hora) = CONVERT(DATE, GETDATE()) -- Solo platillos de hoy
              FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') + ']'
        ) AS orderedProducts
      FROM 
        NetSilver.dbo.OrdenPendiente AS op
      INNER JOIN 
        NetSilver.dbo.Comanda AS c ON c.Orden = op.Orden
      WHERE 
        op.Mesa = ${bill.tableNumber} -- Número de mesa deseado
        AND CONVERT(DATE, op.HoraAbrir) = CONVERT(DATE, GETDATE()) -- Filtra por la fecha de hoy
        AND c.Modificador = 0
      ORDER BY 
        op.HoraAbrir DESC`.then(r => {
      const result = r.recordset[0]
      if (result === undefined) {
        res.status(404).json({ message: 'No hay ordenes activas en esta mesa' })
        sql.close()
        return
      }
      if (result.orderedProducts === null) {
        res.status(404).json({ message: 'No hay productos en esta mesa' })
        sql.close()
        return
      }
      result.orderedProducts = JSON.parse(result.orderedProducts)
      result.amount_left = result.total - amount_paid
      console.dir(result)

      res.json(result)
      return sql.close()
    })
  })
}

module.exports = {
  getBillInfo,
  getTest,
}
