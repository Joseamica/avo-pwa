import express from 'express'

import {
  createTable,
  createVenue,
  deleteBill,
  deleteTable,
  getBill,
  getBills,
  getChain,
  getMenus,
  getTable,
  getTables,
  getVenue,
  getVenues,
} from '../controller/Dashboard.controller'

const dashboardRouter = express.Router()

dashboardRouter.get('/get-chain', getChain)

dashboardRouter.post('/:chainId/create-venue', createVenue)

dashboardRouter.get('/get-venues', getVenues)
dashboardRouter.post('/:venueId/get-venue', getVenue)
// TABLES
dashboardRouter.post('/create-table', createTable)
dashboardRouter.get('/:venueId/get-tables', getTables)
dashboardRouter.post('/:venueId/get-table', getTable)
dashboardRouter.delete('/:venueId/delete-table', deleteTable)
// MENUS
dashboardRouter.get('/:venueId/get-menus', getMenus)
//BILLS
dashboardRouter.get('/:venueId/get-bills', getBills)
dashboardRouter.get('/:venueId/:billId', getBill)
dashboardRouter.delete('/:venueId/delete-bill', deleteBill)

export default dashboardRouter
