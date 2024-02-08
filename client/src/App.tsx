import { Fragment } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

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
import Tables from './pages/Venues/Tables'

import { registerSW } from 'virtual:pwa-register'
import './index.css'
import Layout, { action as layoutAction, loader as layoutLoader } from './Layout'
import Auth from './pages/Auth'
import { loader as authLoader } from './pages/Auth/loader'
import Login, { action as loginAction } from './pages/Auth/Login'
import Me, { action as meAction } from './pages/Auth/Me'
import Register, { action as registerAction } from './pages/Auth/Register'
import Error from './pages/Error'
import Sockets from './pages/Socket/Socket'
import Checkout from './pages/Stripe/Checkout'
import Success from './pages/Stripe/Success'
import Menus, { loader as menusLoader } from './pages/Venues/Menus/Menus'
import Page4 from './pages/Page4'

// const Menus = lazy(() => import('./pages/Venues/Menus/Menus'))

function App() {
  if ('serviceWorker' in navigator) {
    // && !/localhost/.test(window.location)) {
    console.log('registering service worker')

    registerSW()
  }
  // React.useEffect(() => {
  //   Notification.requestPermission().then(permission => {
  //     if (permission === 'granted') {
  //       getToken(messaging, { vapidKey: 'BIAgTUPuvSK0qso2fxF58_ZrjThR7LTZfqjJPf_wT809n5d_yiSZLRjW_k72Pu5KII8aRAtZzG86rg7FWsYRFiQ        ' })
  //         .then(currentToken => {
  //           if (currentToken) {
  //             console.log('Token:', currentToken)
  //             // Send this token to your server for push notifications
  //           } else {
  //             console.log('No registration token available. Request permission to generate one.')
  //           }
  //         })
  //         .catch(err => {
  //           console.log('An error occurred while retrieving token. ', err)
  //         })
  //     }
  //   })
  // }, [])
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
            <Route path=":tableId" element={<Tables.TableId />} />
          </Route>
          <Route path="venues/:venueId/bills" element={<Bills.Bills />} errorElement={<Error />}>
            <Route path=":billId" element={<Bills.BillId />} />
          </Route>
          <Route path="success" element={<Success />} />
          <Route path="*" element={<NotFound />} />

          {/* <Route path="page-3" loader={page3Loader} action={page3action} element={<Page3 />} /> */}
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="sockets" element={<Sockets />} />
        <Route path="chat" element={<Page2 />} />
        <Route path="auth" index element={<Auth />} />
        <Route path="auth/login" element={<Login />} loader={authLoader} action={loginAction} />
        <Route path="auth/register" element={<Register />} loader={authLoader} action={registerAction} />
        <Route path="me" element={<Me />} action={meAction} />
        <Route path="page-4" element={<Page4 />} />

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
