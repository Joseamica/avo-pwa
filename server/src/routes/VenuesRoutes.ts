import express from 'express'
import { ConnectionPool } from 'mssql'
import dbConfig from '../config/DbConfig'
import prisma from '../utils/prisma'
import invariant from 'tiny-invariant'

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
  try {
    const table = await prisma.table.findUnique({
      where: {
        tableId: {
          venueId: venueId,
          tableNumber: Number(tableNumber),
        },
      },
    })

    if (!table) {
      return res.status(404).json({ message: 'No existe la mesa' })
    }
    if (table.status === 'ACTIVE') {
      return res.json({ message: 'Mesa activa', url: `/venues/${venueId}/bills/${table.billId}`, redirect: true })
    } else {
      console.log('✅1')
      const bill = await prisma.bill.findFirst({
        where: {
          tableNumber: Number(tableNumber),
          status: 'OPEN',
        },
      })
      if (!bill) {
        console.log('✅2')
        const createdBill = await prisma.bill.create({
          data: {
            tableNumber: Number(tableNumber),
            key: `${venueId}-${tableNumber}`,
            status: 'OPEN',
          },
        })
        return res.json({ message: 'Mesa inactiva', url: `/venues/${venueId}/bills/${createdBill.id}`, redirect: true })
      }
    }
  } catch (error) {
    console.error('Error al obtener información de la mesa:', error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
})
export default venueRouter
