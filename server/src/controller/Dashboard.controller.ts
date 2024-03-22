import prisma from '../utils/prisma'

export const getChain = async (req, res) => {
  const { userId } = req.query

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user.chainId) {
      return res.status(400).json({ error: 'User does not have a chain' })
    }
    const chain = await prisma.chain.findUnique({
      where: {
        id: user.chainId,
      },
      include: {
        venues: true,
      },
    })

    res.status(200).json({ chain, user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createVenue = async (req, res) => {
  const { name, image, logo, tip_one, tip_two, tip_three, pos, stripe } = req.body
  try {
    const venue = await prisma.venue.create({
      data: {
        name,
        image,
        logo,
        tipPercentage1: tip_one,
        tipPercentage2: tip_two,
        tipPercentage3: tip_three,
        posName: pos,
        stripeAccountId: stripe,
        chainId: req.params.chainId,
      },
    })
    console.log(`✅ Venue ${name} created`)
    res.json(venue)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

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
  //FIXME - se tiene que agarrar solamente las venues que estan asociadas al "chain", en el que sera otorgado o guardado en el usuario "admin" para que pueda acceder a las venues
  const venues = await prisma.venue.findMany()
  res.json(venues)
}

export const getVenue = async (req, res) => {
  const { venueId } = req.params
  try {
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
