import { Fragment, Suspense } from 'react'
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline'

import { withErrorHandler } from '@/error-handling'
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App'
import Pages from '@/routes/Pages'
import Header from '@/sections/Header'
import HotKeys from '@/sections/HotKeys'
import Notifications from '@/sections/Notifications'
import SW from '@/sections/SW'
import Sidebar from '@/sections/Sidebar'
import Welcome from './pages/Welcome'
import Page2 from './pages/Page2'
import Loading from './components/Loading'
import configuredAsyncComponentLoader from './utils/loader'
import asyncComponentLoader from './utils/loader/loader'
import routes from './routes'
import NotFound from './pages/NotFound'
import Chat from './pages/Page2/Page2'
import Venues from './pages/Venues'
import Tables, { tableIdLoader } from './pages/Venues/Tables'
import Bills from './pages/Venues/Bills'

import './index.css'
import HeaderAvo from './sections/Header/HeaderAvo'
import Page3, { page3Loader, page3action } from './pages/Page3'
import Layout, { action as layoutAction, loader as layoutLoader } from './Layout'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Fragment>
        <Route path="/" element={<Layout />} errorElement={<NotFound />} action={layoutAction} loader={layoutLoader}>
          <Route path="venues" element={<Venues.Venues />}>
            <Route path=":venueId" element={<Venues.VenueId />} />
          </Route>
          <Route path="venues/:venueId/tables" element={<Tables.Tables />}>
            <Route path=":tableId" element={<Tables.TableId />} loader={tableIdLoader} />
          </Route>
          <Route path="venues/:venueId/bills" element={<Bills.Bills />}>
            <Route path=":billId" element={<Bills.BillId />} loader={tableIdLoader} />
          </Route>
          <Route path="page-3" loader={page3Loader} action={page3action} element={<Page3 />} />
        </Route>
      </Fragment>,

      // <>
      //   {Object.values(routes).map(({ path, component: Component, children }) => {
      //     return <Route key={path} path={path} element={<Component />} />
      //   })}
      // </>,
    ),
  )
  return (
    <Fragment>
      <CssBaseline />
      <Notifications />
      <HotKeys />
      <SW />

      {/* <Sidebar /> */}
      <RouterProvider router={router} />
    </Fragment>
  )
}

export default withErrorHandler(App, AppErrorBoundaryFallback)
