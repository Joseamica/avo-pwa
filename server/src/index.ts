import express, { Request } from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'

declare global {
  namespace Express {
    interface Request {
      io: Server
    }
  }
}

// ANCHOR ROUTERS
import router from './routes/router'
import stripeRouter from './routes/StripeRoutes'
import venueRouter from './routes/VenuesRoutes'

const app = express()
// const socketUtils = require('./utils/socketUtils')

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:5000', 'https://localhost', 'http://192.168.100.7:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
)

// NOTE - This is a middleware that allows us to parse the body of a request
app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (req.originalUrl.includes('/v1/stripe/webhooks/')) {
    next()
  } else {
    express.json()(req, res, next)
  }
})
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', socket => {
  console.log('Cliente conectado', socket.id)

  socket.on('joinRoom', ({ venueId, billId }) => {
    const roomId = `venue_${venueId}_bill_${billId}`
    socket.join(roomId)
    console.log(`Cliente ${socket.id} se unió al room ${roomId}`)
  })

  socket.on('leaveRoom', ({ venueId, billId }) => {
    const roomId = `venue_${venueId}_bill_${billId}`
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
app.use('/', router)
app.use('/v1/venues', venueRouter)
app.use('/v1/stripe', stripeRouter)
// app.use('/v1/bills', billRouter)

// LISTEN
const port = process.env.PORT || 5000
server.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
