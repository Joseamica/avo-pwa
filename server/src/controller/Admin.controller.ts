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

export const getVenues = async (req, res) => {
  const venues = await prisma.venue.findMany()
  res.json(venues)
}

export const getVenue = async (req, res) => {
  const { venueId } = req.params
  try {
    console.log('venueId', venueId)
    const venue = await prisma.venue.findUnique({
      where: {
        id: venueId,
      },
    })
    res.json(venue)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getTables = async (req, res) => {
  const { venueId } = req.params
  const tables = await prisma.table.findMany({
    where: {
      venueId,
    },
    orderBy: {
      tableNumber: 'asc',
    },
  })
  res.json(tables)
}

export const getTable = async (req, res) => {
  const { venueId } = req.params
  const { tableNumber } = req.body
  const table = await prisma.table.findUnique({
    where: {
      tableId: {
        tableNumber: parseInt(tableNumber),
        venueId: venueId,
      },
    },
  })
  res.json(table)
}

export const deleteTable = async (req, res) => {
  const { venueId } = req.params
  const { tableNumber } = req.body
  const table = await prisma.table.delete({
    where: {
      tableId: {
        tableNumber: parseInt(tableNumber),
        venueId: venueId,
      },
    },
  })
  res.json(table)
}

export const getMenus = async (req, res) => {
  const { venueId } = req.params
  const tables = await prisma.menu.findMany({
    where: {
      venueId,
    },
    orderBy: {
      name: 'asc',
    },
  })
  res.json(tables)
}

//FIXME - tiene que estar filtrado por VENUE, pero para eso tiene que tener primero una mesa, y para eso tiene que tener un venue
export const getBills = async (req, res) => {
  const { venueId } = req.params

  const bills = await prisma.bill.findMany({
    where: {
      table: {
        some: {
          venueId: venueId,
        },
      },
    },
  })
  res.json(bills)
}

export const getBill = async (req, res) => {
  const { venueId, billId } = req.params

  try {
    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
        table: {
          some: {
            venueId: venueId,
          },
        },
      },
      include: {
        payments: true,
        products: true,
        table: true,
      },
    })
    res.json(bill)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteBill = async (req, res) => {
  const { billId } = req.body
  const table = await prisma.bill.delete({
    where: {
      id: billId,
    },
  })
  res.json(table)
}
