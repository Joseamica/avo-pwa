import { Fragment, Suspense } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// import CssBaseline from '@mui/material/CssBaseline'

import { withErrorHandler } from '@/error-handling'
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App'
// import HotKeys from '@/sections/HotKeys'
import Notifications from '@/sections/Notifications'
import SW from '@/sections/SW'
import NotFound from './pages/NotFound'

import Venues from './pages/Venues'
import Bills from './pages/Venues/Bills'

import { registerSW } from 'virtual:pwa-register'
import Layout, { action as layoutAction, loader as layoutLoader } from './Layout'
import './index.css'

import Error from './pages/Error'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PrivateRoute } from './PrivateRoute'
import Template from './Template'

import Me from './pages/Auth/Me'
import Register from './pages/Auth/Register'
import ProtectedRoutes from './pages/ProtectedRoutes'
import Success from './pages/Stripe/Success'

import { PublicRoute } from './PublicRoute'

import asyncComponentLoader from '@/utils/loader'

const Login = asyncComponentLoader(() => import('./pages/Auth/Login'))
const Admin = asyncComponentLoader(() => import('./pages/Venues/Bills/Admin'))
const Menus = asyncComponentLoader(() => import('./pages/Venues/Menus/Menus'))
const Dashboard = asyncComponentLoader(() => import('./pages/Dashboard/Dashboard'))
const VenueDetails = asyncComponentLoader(() => import('./pages/Dashboard/Venues/VenueDetails.dashboard'))
const TableListDashboard = asyncComponentLoader(() => import('./pages/Dashboard/Venues/Tables/TableList.dashboard'))
const TableDetailsDashboard = asyncComponentLoader(() => import('./pages/Dashboard/Venues/Tables/TableDetails.dashboard'))
const MenusListDashboard = asyncComponentLoader(() => import('./pages/Dashboard/Venues/Menus/FIXMenusList.dashboard'))
const DashboardVenues = asyncComponentLoader(() => import('./pages/Dashboard/Venues/VenueList.dashboard'))
const BillListDashboard = asyncComponentLoader(() => import('./pages/Dashboard/Venues/Bills/BillList.dashboard'))
const BillDetailsDashboard = asyncComponentLoader(() => import('./pages/Dashboard/Venues/Bills/BillDetails.dashboard'))
const TableNumber = asyncComponentLoader(() => import('./pages/Venues/Tables/TableNumber'))

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
            path="venues/:venueId/tables/:tableNumber"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <TableNumber />
              </Suspense>
            }
          >
            {/* <Route path=":tableNumber" element={<Tables.TableNumber />} /> */}
          </Route>
          <Route
            path="venues/:venueId/bills/:billId/menus"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <Menus />
              </Suspense>
            }
          />

          <Route path="venues/:venueId" element={<Venues.VenueId />}>
            <Route path="bills/:billId" element={<Bills.Bills />} errorElement={<Error />} />
          </Route>

          {/* ANCHOR DASHBOARD */}
          <Route element={<ProtectedRoutes />}>
            <Route
              path="dashboard"
              element={
                <PrivateRoute>
                  <Suspense fallback={<div>Cargando...</div>}>
                    <Dashboard />
                  </Suspense>
                </PrivateRoute>
              }
            >
              <Route
                path="venues"
                element={
                  <Suspense fallback={<div>Cargando...</div>}>
                    <DashboardVenues />
                  </Suspense>
                }
              />
              <Route
                path="venues/:venueId"
                element={
                  <Suspense fallback={<div>Cargando...</div>}>
                    <VenueDetails />
                  </Suspense>
                }
              >
                <Route
                  path="tables"
                  element={
                    <Suspense fallback={<div>Cargando...</div>}>
                      <TableListDashboard />
                    </Suspense>
                  }
                />

                <Route
                  path="tables/:tableNumber"
                  element={
                    <Suspense fallback={<div>Cargando...</div>}>
                      <TableDetailsDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="bills"
                  element={
                    <Suspense fallback={<div>Cargando...</div>}>
                      <BillListDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="bills/:billId"
                  element={
                    <Suspense fallback={<div>Cargando...</div>}>
                      <BillDetailsDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="menus"
                  element={
                    <Suspense fallback={<div>Cargando...</div>}>
                      <MenusListDashboard />
                    </Suspense>
                  }
                />
              </Route>
            </Route>

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
      {/* <BrowserRouter>
        <Pages />
      </BrowserRouter> */}
      <RouterProvider router={router} />

      <ReactQueryDevtools initialIsOpen position="bottom" />
    </Fragment>
  )
}

export default withErrorHandler(App, AppErrorBoundaryFallback)
