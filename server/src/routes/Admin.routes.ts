import express from 'express'

import { createTable } from '../controller/Admin.controller'

const adminRouter = express.Router()

adminRouter.post('/create-table', createTable)

export default adminRouter
