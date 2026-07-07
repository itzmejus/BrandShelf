import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { enforceDomainRouting } from './utils/domainRouting'

// If this URL belongs on the other domain (main site vs. dashboard
// subdomain), bounce there before mounting anything.
if (!enforceDomainRouting()) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
