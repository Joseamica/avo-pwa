import { ComponentType, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'

import ThemeProvider from '@/theme/Provider'
import { AuthProvider } from './auth/AuthProvider'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

function render(App: ComponentType) {
  root.render(
    <StrictMode>
      {/* <AuthProvider> */}
      <RecoilRoot>
        <HelmetProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </HelmetProvider>
      </RecoilRoot>
      {/* </AuthProvider> */}
    </StrictMode>,
  )
}

export default render
