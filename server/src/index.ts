import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const express = require('express')
const cors = require('cors')
const http = require('http')
const router = require('./routes/router')
const path = require('path')
const cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')

const jwt = require('jsonwebtoken')

const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'public')))

//TODO OAuth2
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

// function ipFilter(req, res, next) {
//   const clientIp = req.ip
//   const allowedIps = ['localhost:5173', '98.76.54.32'] // Lista de IPs permitidas

//   if (allowedIps.includes(clientIp)) {
//     next()
//   } else {
//     res.status(403).send('Access denied')
//   }
// }

// app.use(ipFilter)

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
)

io.on('connection', socket => {
  console.log(socket.id + ' connected')
  socket.on('message', async data => {
    io.emit('message', data)
  })
  socket.on('disconnect', function () {
    console.log(socket.id + ' disconnected')
  })
})

// Middleware para hacer accesible io en las rutas
app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/', router)

const port = process.env.PORT || 5000

// app.get('/api/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.json(users)
// })

// app.post('/api/users', async (req, res) => {

//   const result = await prisma.user.create({
//     data: {
//       name: req.body.name,
//       email: "tests",

//     },
//   })
//   res.json(result)
// })

// app.get('/api/users', async (req, res) => {
//   const users = await prisma.user.findMany()

//   res.json(users)
// })

// app.post('/api/users', async (req, res) => {
//   try {
//     const { name, email } = req.body
//     const newUser = await prisma.user.create({
//       data: {
//         name: name,
//         email: `tests${Math.floor(Math.random() * 1000)}@gmail.com${email}`,
//       },
//     })

//     await res.status(200).json(newUser)
//     await io.emit('newUser', newUser)
//   } catch (error) {
//     res.status(500).json({ error: 'Error al guardar el mensaje' })
//   }
// })

// io.on('connection', socket => {
//   console.log(socket.id + ' connected')
//   socket.on('message', async data => {
//     console.log(data)

//     // await prisma.user.create({
//     //   data: {
//     //     name: data,
//     //     email: `tests${Math.floor(Math.random() * 1000)}@gmail.com`,
//     //   },
//     // })
//     socket.broadcast.emit('messageClient', {
//       body: data,
//       from: socket.id.slice(5),
//     })
//   })
//   socket.on('disconnect', function () {
//     console.log(socket.id + ' disconnected')
//   })
// })

server.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
