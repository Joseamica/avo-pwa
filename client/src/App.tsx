import { Fragment, Suspense, lazy } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// import CssBaseline from '@mui/material/CssBaseline'

import { withErrorHandler } from '@/error-handling'
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App'
// import HotKeys from '@/sections/HotKeys'
import Notifications from '@/sections/Notifications'
import SW from '@/sections/SW'
import NotFound from './pages/NotFound'
// import Page2 from './pages/Page2'
import Venues from './pages/Venues'
import Bills from './pages/Venues/Bills'
import Tables from './pages/Venues/Tables'

import { registerSW } from 'virtual:pwa-register'
import Layout, { action as layoutAction, loader as layoutLoader } from './Layout'
import './index.css'
// import Auth from './pages/Auth'
// import { loader as authLoader } from './pages/Auth/loader'
// import Login, { action as loginAction } from './pages/Auth/Login'
// import Me, { action as meAction } from './pages/Auth/Me'
// import Register, { action as registerAction } from './pages/Auth/Register'
import Error from './pages/Error'
// import Sockets from './pages/Socket/Socket'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PrivateRoute } from './PrivateRoute'
import Template from './Template'
// import Login from './pages/Auth/Login'
import Me from './pages/Auth/Me'
import Register from './pages/Auth/Register'
import ProtectedRoutes from './pages/ProtectedRoutes'
import Success from './pages/Stripe/Success'
// import Admin from './pages/Venues/Bills/Admin'
import { loader as menusLoader } from './pages/Venues/Menus/Menus'
import { PublicRoute } from './PublicRoute'
// import Page4 from './pages/Page4'

const Login = lazy(() => import('./pages/Auth/Login'))
const Admin = lazy(() => import('./pages/Venues/Bills/Admin'))
const Menus = lazy(() => import('./pages/Venues/Menus/Menus'))

function App() {
  if ('serviceWorker' in navigator) {
    // && !/localhost/.test(window.location)) {

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

  // lazy(() => import('./pages/Venues/Bills/BillId'))
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Fragment>
        {/* <Suspense fallback={<div>Cargando...</div>}> */}
        <Route path="/" element={<Template />} action={layoutAction} loader={layoutLoader} errorElement={<Error />}>
          <Route path="/" index element={<Layout />} />

          <Route
            path="venues/:venueId/bills/:billId/menus"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <Menus />
              </Suspense>
            }
            loader={menusLoader}
          />

          <Route path="venues/:venueId" element={<Venues.VenueId />}>
            <Route path="bills/:billId" element={<Bills.Bills />} errorElement={<Error />} />
          </Route>
          <Route path="venues/:venueId/tables" element={<Tables.Tables />}>
            <Route path=":tableNumber" element={<Tables.TableNumber />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route
              path="venues/:venueId/admin"
              element={
                <PrivateRoute>
                  <Suspense fallback={<div>Cargando...</div>}>
                    <Admin />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="auth/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="auth/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="me"
              element={
                <PrivateRoute>
                  <Me />
                </PrivateRoute>
              }
            />
          </Route>

          <Route path="success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Fragment>,
    ),
  )

  return (
    <Fragment>
      {/* <CssBaseline /> */}
      <Notifications />
      {/* <HotKeys /> */}
      <SW />

      {/* <Sidebar /> */}

      <RouterProvider router={router} />

      <ReactQueryDevtools initialIsOpen position="bottom" />
    </Fragment>
  )
}

export default withErrorHandler(App, AppErrorBoundaryFallback)
