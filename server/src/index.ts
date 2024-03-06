import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'

declare global {
  namespace Express {
    interface Request {
      io: Server
    }
  }
}

// ANCHOR ROUTERS

import stripeRouter from './routes/Stripe.routes'
import venueRouter from './routes/Venues.routes'
import authRouter from './routes/Auth.routes'
import adminRouter from './routes/Admin.routes'

const app = express()

app.use(cookieParser())
app.use(
  cors({
    // origin: '*',
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:5000',
      'https://localhost',
      'http://192.168.100.7:5173',
      'https://avo-pwa.pages.dev', // Corregido
    ],

    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
)

if (process.env.NODE_ENV === 'production') {
  console.log('Estamos en producción!')
} else {
  console.log('Estamos en desarrollo!')
}

app.use(
  '/.well-known',
  express.static(path.join(__dirname, '.well-known'), {
    dotfiles: 'allow', // Permite servir archivos que comienzan con un punto
  }),
)
app.use(express.static(path.join(__dirname, 'public')))

// NOTE - This is a middleware that allows us to parse the body of a request
app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (req.originalUrl.includes('/v1/stripe/webhooks/')) {
    next()
  } else {
    express.json()(req, res, next)
  }
})
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', socket => {
  console.log('Cliente conectado', socket.id)

  socket.on('joinRoom', ({ venueId, table }) => {
    const roomId = `venue_${venueId}_table_${table}`
    socket.join(roomId)
    console.log(`Cliente ${socket.id} se unió al room ${roomId}`)
  })

  socket.on('leaveRoom', ({ venueId, table }) => {
    const roomId = `venue_${venueId}_table_${table}`
    socket.leave(roomId)
    console.log(`Cliente ${socket.id} dejó el room ${roomId}`)
  })

  // Más manejadores...
})

// Middleware para adjuntar io a req
app.use((req, res, next) => {
  req.io = io
  next()
})

// ANCHOR ROUTES

app.use('/v1/admin', adminRouter)
app.use('/v1/auth', authRouter)
app.use('/v1/venues', venueRouter)
app.use('/v1/stripe', stripeRouter)

// LISTEN
const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
