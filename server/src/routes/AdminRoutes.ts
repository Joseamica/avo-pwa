import express from 'express'
import prisma from '../utils/prisma'
import bcrypt from 'bcrypt'

import jwt, { SignOptions } from 'jsonwebtoken'

const adminRouter = express.Router()

adminRouter.post('/addTable', async (req, res) => {
  const { name, seats, venueId, tableNumber } = req.body
  try {
    const isTableExist = await prisma.table.findUnique({
      where: {
        tableId: {
          tableNumber: parseInt(tableNumber),
          venueId: venueId,
        },
      },
    })
    if (isTableExist) {
      return res.status(400).json({ error: 'Table already exist' })
    }
    const table = await prisma.table.create({
      data: {
        tableNumber: parseInt(tableNumber),
        venueId: venueId,
      },
    })
    res.json(table)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default adminRouter
