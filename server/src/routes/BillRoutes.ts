const express = require('express')
const billRouter = express.Router()
const billController = require('../controller/BillController')

billRouter.get('/:billId', billController.getBillInfo)
billRouter.get('/test', billController.getTest)

// billRouter.get('/bills/:billId', billController.get)

// ANCHOR CONFIG

module.exports = billRouter
