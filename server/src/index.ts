const express = require('express')
const cors = require('cors')
const http = require('http')
const path = require('path')
const cookieParser = require('cookie-parser')

// ANCHOR ROUTERS
const router = require('./routes/router')
const stripeRouter = require('./routes/StripeRoutes')
const billRouter = require('./routes/BillRoutes')

// ANCHOR CONFIG
const dbConfig = require('./config/DbConfig')

const app = express()
const socketUtils = require('./utils/socketUtils')

// sql.connect(dbConfig).then(pool => {
//   pool.query`SELECT TOP 1 * FROM NetSilver.dbo.OrdenPendiente WHERE MESA = 20 ORDER BY HoraAbrir DESC
// `.then(result => {
//     const r = result.recordset[0]

//     console.dir(r)
//     sql.close()
//   })
// })
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:5000', 'https://localhost', 'http://192.168.100.7:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
)

const server = http.createServer(app)
const io = socketUtils.sio(server)
socketUtils.connection(io)

// const socketIOMiddleware = (req, res, next) => {
//   req.io = io
//   next()
// }

// ROUTES
// TODO: change '/' to '/stripe'
// app.use('/stripe', stripeRouter)

app.use('/', router)
app.use('/', stripeRouter)
app.use('/v1/bills', billRouter)

// app.use('/api', socketIOMiddleware, (req, res) => {
//   req.io.emit('message', `Hello, ${req.originalUrl}`)
//   res.send('hello world!')
// })

// LISTEN
const port = process.env.PORT || 5000
server.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
