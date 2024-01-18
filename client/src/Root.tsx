import { ComponentType, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'

import ThemeProvider from '@/theme/Provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { AuthProvider } from './auth/AuthProvider'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
const queryClient = new QueryClient()

function render(App: ComponentType) {
  root.render(
    <StrictMode>
      {/* <AuthProvider> */}
      <RecoilRoot>
        <HelmetProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </ThemeProvider>
        </HelmetProvider>
      </RecoilRoot>
      {/* </AuthProvider> */}
    </StrictMode>,
  )
}

export default render
