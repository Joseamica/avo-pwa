import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const imageUrls = [
  'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/1.%20Madre%20Cafecito%2FMenu%201.png?alt=media&token=3801c756-3f0e-4d42-beaa-bff72812ca18',
  'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/1.%20Madre%20Cafecito%2FMenu%202.png?alt=media&token=74a8da94-ad7b-4d7d-8c4a-f2df3bc9ad9e',
  'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/1.%20Madre%20Cafecito%2FMenu%203.png?alt=media&token=4732531a-8b2c-4e3f-bd37-19d4710fde8d',
]

async function main() {
  console.log('🌱 Seeding...')
  console.time(`🌱 Database has been seeded`)
  const venueExist = await prisma.venue.findFirst()
  // if (venueExist) {
  //   console.log('🌱 Database has been seeded')
  //   return
  // }
  await prisma.menu.deleteMany()
  await prisma.table.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.user.deleteMany()
  const venue = await prisma.venue.create({
    data: {
      name: 'Madre Cafecito',
      address: '-',
      city: 'CDMX',
      email: 'test@gmail.com',
      logo: 'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/1.%20Madre%20Cafecito%2FAZUL%20SIN%20FONDO%20(4)%201.png?alt=media&token=d8dfb7de-58d5-4706-bd3f-3f20ffbe7f9b',
      image:
        'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/1.%20Madre%20Cafecito%2FPortada.png?alt=media&token=2960aaef-6a8a-4e2d-a197-f8eb1c167b3c',
      cuisine: 'Café',
      instagram: 'https://www.instagram.com/madre_cafecito/',
      tipPercentage1: '0.1',
      tipPercentage2: '0.15',
      tipPercentage3: '0.2',
      stripeAccountId: 'acct_1NuRFGBAuNoVK1pM',
    },
  })
  const tableNumbers = await createTables(venue.id, 10)
  for (let i = 1; i <= 3; i++) {
    await prisma.menu.create({
      data: {
        name: `Menu ${i}`,
        venue: { connect: { id: venue.id } },
        imageUrl: imageUrls[i - 1],
      },
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash('admin', saltRounds)
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  })
  const superAdminPasswordHash = await bcrypt.hash('superadmin', saltRounds)

  const superadmin = await prisma.user.create({
    data: {
      username: 'superadmin',
      password: superAdminPasswordHash,
      role: 'SUPERADMIN',
    },
  })
  const avoqadoMenu = await prisma.avoqadoMenu.create({
    data: {
      name: 'Menu 1',
      venue: { connect: { id: venue.id } },
    },
  })
  const category = await prisma.category.create({
    data: {
      name: 'Dulce',
      avoqadoMenuId: avoqadoMenu.id,
    },
  })

  const waffle = await prisma.avoqadoProduct.create({
    data: {
      name: 'Waffles con compota de duraznos',
      description: 'Acompañado de helado de la casa y frutos rojos.',
      price: 120,
      orderByNumber: 1,
      available: true,
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/1.%20Madre%20Cafecito%2F3.%20DULCE%2FWAFFLES%20DURAZNOS.jpg?alt=media&token=7a9d99cb-f3f8-42da-ba56-af27bdb90dfd',
      calories: 300,
      categoryId: category.id,
    },
  })

  console.timeEnd(`🌱 Database has been seeded`)

  console.log({ venue, tableNumbers, user, superadmin })
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
