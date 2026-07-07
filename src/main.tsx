import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { enforceLegacyDashboardRedirect } from './utils/domainRouting'

// Old /dashboard-prefixed or auth-page links hit on the main domain —
// bounce to the dashboard subdomain before mounting anything.
if (!enforceLegacyDashboardRedirect()) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
