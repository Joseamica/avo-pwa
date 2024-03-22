import express from 'express'

import { createChain, getChain, getChains, createAdmin } from '../controller/Admin.controller'

const adminRouter = express.Router()

adminRouter.get('/get-chains', getChains)
adminRouter.get('/:chainId/get-chain', getChain)
adminRouter.post('/create-chain', createChain)
adminRouter.post('/:chainId/create-admin', createAdmin)

export default adminRouter
