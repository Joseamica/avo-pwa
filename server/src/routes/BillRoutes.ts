import express from 'express'
const billRouter = express.Router()
import { getBillInfo, getTest } from '../controller/BillController'

billRouter.get('/:billId', getBillInfo)
billRouter.get('/test', getTest)

// billRouter.get('/bills/:billId', billController.get)

// ANCHOR CONFIG

export default billRouter
