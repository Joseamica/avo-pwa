import express from 'express'

import {
  createTable,
  deleteBill,
  deleteTable,
  getBill,
  getBills,
  getMenus,
  getTable,
  getTables,
  getVenue,
  getVenues,
} from '../controller/Admin.controller'

const adminRouter = express.Router()

adminRouter.get('/get-venues', getVenues)
adminRouter.post('/:venueId/get-venue', getVenue)
// TABLES
adminRouter.post('/create-table', createTable)
adminRouter.get('/:venueId/get-tables', getTables)
adminRouter.post('/:venueId/get-table', getTable)
adminRouter.delete('/:venueId/delete-table', deleteTable)
// MENUS
adminRouter.get('/:venueId/get-menus', getMenus)
//BILLS
adminRouter.get('/:venueId/get-bills', getBills)
adminRouter.get('/:venueId/:billId', getBill)
adminRouter.delete('/:venueId/delete-bill', deleteBill)

export default adminRouter
