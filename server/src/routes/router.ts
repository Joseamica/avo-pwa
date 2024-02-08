// const tables = require('../mocks/tables')
const express = require('express')
const router = express.Router()
require('dotenv').config()
const bcrypt = require('bcrypt')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const jwt = require('jsonwebtoken')

// function verifyToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (!token) {
//     return res.status(403).send('A token is required for authentication')
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
//     req.user = decoded
//   } catch (err) {
//     return res.status(401).send('Invalid Token')
//   }
//   return next()
// }

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(403).send('Se requiere un token para la autenticación')
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send('Token inválido')
    }
    req.user = user
    next()
  })
}

let refreshTokens = []

router.post('/token', async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

// router.get('/secret', async (req, res) => {
//   const intent = "pi_3ObDsFBHBjfFQF5Y0bf6u2C5"
//   res.json({client_secret: intent.client_secret});
// });

router.get('/auth/status', async (req, res) => {
  const cookie = req.headers.cookie

  if (!cookie) {
    // Si no hay cookie, envía una respuesta de error.
    return res.status(401).send('No hay cookie')
  } else {
    // Si hay cookie, puedes realizar alguna otra acción o simplemente enviar una respuesta de éxito.

    return res.status(200).send('Cookie presente')
  }
})

router.get('/do-something', verifyToken, (req, res) => {
  console.log(req.user)
  res.send('Estas autenticado')
})

router.get('/venues/:venueId/tables/:tableId', async (req, res) => {
  const { venueId, tableId } = req.params
  //TODO - Hacer algo con esta query como verificar algo
  const query = req.query
  console.log('query', query)

  const table = await prisma.table.findUnique({
    where: {
      tableId: {
        venueId: venueId,
        tableNumber: parseInt(tableId),
      },
    },
  })

  // const table = tables.find(table => table.id === parseInt(tableId))
  console.log('table', table)
  if (!table) return res.status(404).json({ error: 'Table not found' })
  if (!table.billId) {
    //TODO - Hacer alguna acción si la mesa no está activa
    return res.status(200).json({ redirect: false, message: 'La mesa no está activa' })
  } else {
    return res.json({ tableNumber: table.tableNumber, redirect: true, url: `/venues/${venueId}/bills/${table.billId}` })
  }
})

router.get('/api/venues/:venueId/bills/:billId', async (req, res) => {
  const bill = {
    id: 1,
    venueId: 1,
    tableId: 1,
    status: 'pending',
    orderedProducts: [
      {
        id: 1,
        name: 'Coca Cola',
        price: 10000,
        comments: 'Sin hielo',
        quantity: 1,
        description: 'Bebida de 80oz',
        visible: true,
        status: 'delivered', // 'pending' | 'delivered' | 'cancelled
        userId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 2,
        name: 'Papas Fritas',
        price: 10000,
        comments: 'Sin sal',
        quantity: 1,
        description: 'Unas papitas ricas',
        visible: true,
        status: 'pending',
        userId: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 3,
        name: 'Hamburguesa',
        price: 50000,
        comments: 'Sin cebolla',
        quantity: 2,
        description: 'Una hamburguesa rica',
        visible: true,
        status: 'pending',
        userId: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
    payments: [
      {
        id: 1,
        method: 'Efectivo',
        amount: 10000,
        userId: 1,

        tips: [
          {
            id: 1,
            amount: 100,
          },
          {
            id: 2,
            amount: 200,
          },
        ],
      },
      {
        id: 2,
        method: 'Tarjeta',
        amount: 1000,
        userId: 1,
        tips: [
          {
            id: 4,
            amount: 241,
          },
        ],
      },
    ],
    users: [
      {
        id: 1,
        name: 'Juan',
        color: '#FF0000',
      },
      {
        id: 2,
        name: 'Pedro',
        color: '#00FF00',
      },
    ],
  }
  const total = bill.orderedProducts.reduce((acc, product) => {
    return acc + product.price * product.quantity
  }, 0)
  const amount_paid = bill.payments.reduce((acc, payment) => {
    return acc + payment.amount
  }, 0)

  const amount_left = total - amount_paid
  res.json({ ...bill, total, amount_left })
})

router.get('/api/menus', async (req, res) => {
  const menus = [
    {
      id: 1,
      name: 'Botanas',
      url: 'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/Screenshot%202023-08-01%20at%2014.48.41.png?alt=media&token=d608bbc9-0834-4077-89b9-d42df017c6ee',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 2,
      name: 'Ensaladas',
      url: 'https://firebasestorage.googleapis.com/v0/b/avoqado-d0a24.appspot.com/o/Screenshot%202023-08-01%20at%2015.59.06.png?alt=media&token=af094c58-6371-4d38-aac0-ad79bf75434b',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ]
  res.set('Cache-Control', 'public, max-age=86400')

  res.json(menus)
})

router.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

// router.get('/auth/logged_in', (req, res) => {
//   try {
//     // Get token from cookie
//     const token = req.cookies.token
//     if (!token) return res.json({ loggedIn: false })
//     const { user } = jwt.verify(token, process.env.TOKEN_SECRET)
//     const newToken = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: config.tokenExpiration })
//     // Reset token in cookie
//     res.cookie('token', newToken, { maxAge: config.tokenExpiration, httpOnly: true })
//     res.json({ loggedIn: true, user })
//   } catch (err) {
//     res.json({ loggedIn: false })
//   }
// })

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  console.log('username,password', username, password)
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (!user) return res.status(400).json({ error: 'Username not found' })
    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: 'Password is wrong' })
    const userForToken = {
      id: user.id,
      username: user.username,
    }
    const refreshToken = jwt.sign(userForToken, process.env.REFRESH_TOKEN_SECRET)

    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          token: refreshToken,
        },
      })
    } catch (error) {
      console.log('Error al actualizar el token')
    }

    res.cookie(
      'refreshToken',
      refreshToken,

      { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 * 24 * 7 },
    )
    res
      .cookie(
        `auth:${user.id}`,
        true,
        { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 * 24 * 7 * 3 },
        //
      )
      .send('Auth cookie set')
    const token = generateAccessToken(userForToken)
    res.json({ token: token, refreshToken: refreshToken })
  } catch (error) {
    console.log(error)
  }
})

router.post('/auth/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  Object.keys(req.cookies).forEach(cookie => {
    res.clearCookie(cookie)
  })
  res.sendStatus(204)
})

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  const usernameExists = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })
  if (usernameExists) return res.status(400).json({ error: 'Username already exists' })

  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await prisma.user.create({
      data: {
        username: username,
        password: passwordHash,
      },
    })
    res.cookie(`auth:${user.id}`, true, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 * 24 * 7 * 3 })

    res.status(200)
  } catch (error) {
    console.log(error)
  }
})

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '60m' })
}

module.exports = router
