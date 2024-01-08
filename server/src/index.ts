import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const cors = require('cors')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(
  server,
  //   , {
  //   cors: {
  //     origin: 'http://localhost:5173',
  //     methods: ['GET', 'POST'],
  //   },
  // }
)

app.use(express.json())

app.use(cors())

// Middleware para hacer accesible io en las rutas
app.use((req, res, next) => {
  req.io = io
  next()
})

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

app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany()

  res.json(users)
})

app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: `tests${Math.floor(Math.random() * 1000)}@gmail.com${email}`,
      },
    })

    await res.status(200).json(newUser)
    await io.emit('newUser', newUser)
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el mensaje' })
  }
})

io.on('connection', socket => {
  console.log(socket.id + ' connected')
  socket.on('message', async data => {
    console.log(data)

    // await prisma.user.create({
    //   data: {
    //     name: data,
    //     email: `tests${Math.floor(Math.random() * 1000)}@gmail.com`,
    //   },
    // })
    socket.broadcast.emit('messageClient', {
      body: data,
      from: socket.id.slice(5),
    })
  })
  socket.on('disconnect', function () {
    console.log(socket.id + ' disconnected')
  })
})

server.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
