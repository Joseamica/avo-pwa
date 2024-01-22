import { Fragment, lazy, Suspense } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline'

import { withErrorHandler } from '@/error-handling'
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App'
import HotKeys from '@/sections/HotKeys'
import Notifications from '@/sections/Notifications'
import SW from '@/sections/SW'
import NotFound from './pages/NotFound'
import Page2 from './pages/Page2'
import Venues from './pages/Venues'
import Bills from './pages/Venues/Bills'
import Tables, { tableIdLoader } from './pages/Venues/Tables'

import Layout, { action as layoutAction, loader as layoutLoader } from './Layout'
import './index.css'
import Auth from './pages/Auth'
import Login, { action as loginAction } from './pages/Auth/Login'
import Me, { action as meAction } from './pages/Auth/Me'
import Register, { action as registerAction } from './pages/Auth/Register'
import { loader as authLoader } from './pages/Auth/loader'
import Error from './pages/Error'
import Page3, { page3Loader, page3action } from './pages/Page3'
import Sockets from './pages/Socket/Socket'
import Checkout from './pages/Stripe/Checkout'
import Success from './pages/Stripe/Success'
import Menus, { loader as menusLoader } from './pages/Venues/Menus/Menus'

// const Menus = lazy(() => import('./pages/Venues/Menus/Menus'))

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Fragment>
        {/* <Suspense fallback={<div>Cargando...</div>}> */}
        <Route path="/" element={<Layout />} action={layoutAction} loader={layoutLoader} errorElement={<Error />}>
          <Route path="venues" element={<Venues.Venues />}>
            <Route path=":venueId" element={<Venues.VenueId />} />
            <Route path=":venueId/menus" element={<Menus />} loader={menusLoader} />
          </Route>
          <Route path="venues/:venueId/tables" element={<Tables.Tables />}>
            <Route path=":tableId" element={<Tables.TableId />} loader={tableIdLoader} />
          </Route>
          <Route path="venues/:venueId/bills" element={<Bills.Bills />}>
            <Route path=":billId" element={<Bills.BillId />} />
          </Route>
          {/* <Route path="page-3" loader={page3Loader} action={page3action} element={<Page3 />} /> */}
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="sockets" element={<Sockets />} />
        <Route path="chat" element={<Page2 />} />
        <Route path="auth" index element={<Auth />} />
        <Route path="auth/login" element={<Login />} loader={authLoader} action={loginAction} />
        <Route path="auth/register" element={<Register />} loader={authLoader} action={registerAction} />
        <Route path="me" element={<Me />} action={meAction} />
        <Route path="success" element={<Success />} />
        <Route path="checkout" element={<Checkout />} />
        {/* </Suspense> */}
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
