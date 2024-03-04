import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  console.log('🌱 Seeding...')
  console.time(`🌱 Database has been seeded`)
  const venue = await prisma.venue.create({
    data: {
      name: 'Madre Cafecito',
      address: '-',
      city: 'CDMX',
      email: 'test@gmail.com',
      image:
        'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/1.%20Madre%20Cafecito%2FPortada.png?alt=media&token=2960aaef-6a8a-4e2d-a197-f8eb1c167b3c',
      cuisine: 'Café',
      tipPercentage1: '0.1',
      tipPercentage2: '0.15',
      tipPercentage3: '0.2',
    },
  })
  const tableNumbers = await createTables(venue.id, 10)
  console.timeEnd(`🌱 Database has been seeded`)

  console.log({ venue, tableNumbers })
}
export async function createTables(branchId: string, numberOfTables: number) {
  const tableNumbers = []
  for (let i = 1; i <= numberOfTables; i++) {
    const table = await prisma.table.create({
      data: {
        tableNumber: i,
        venue: { connect: { id: branchId } },
      },
    })
    tableNumbers.push(table.tableNumber)
  }
  console.log('🪑 Created the tables...')
  return tableNumbers
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
