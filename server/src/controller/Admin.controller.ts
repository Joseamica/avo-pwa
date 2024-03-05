import prisma from '../utils/prisma'

export const createTable = async (req, res) => {
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
    console.log(`✅ Table ${tableNumber} created`)
    res.json(table)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
