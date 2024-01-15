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

// const config = {
//   clientId: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
//   tokenUrl: 'https://oauth2.googleapis.com/token',
//   redirectUrl: process.env.REDIRECT_URL,
//   clientUrl: process.env.CLIENT_URL,
//   tokenSecret: process.env.TOKEN_SECRET,
//   tokenExpiration: 36000,
//   postUrl: 'https://jsonplaceholder.typicode.com/posts',
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

let refreshTokens = [] as any[]

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

router.get('/api/venues/:venueId/bills/:billId', async (req, res) => {
  const bill = [
    {
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
    },
  ]

  res.json(bill)
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

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
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

    res.status(200).json(user)
  } catch (error) {
    console.log(error)
  }
})

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '60m' })
}

module.exports = router
