import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { enforceLegacyDashboardRedirect } from './utils/domainRouting'

// A tab left open across a deploy can still try to lazy-load a route chunk
// whose hashed filename no longer exists — the new build removed it. Vercel's
// SPA rewrite then serves index.html for that request, which surfaces here as
// a preload error instead of a normal network failure. Reload once to pick up
// the new build's asset manifest; the 10s window stops a reload loop if the
// deployment is genuinely broken rather than just stale.
window.addEventListener('vite:preloadError', () => {
  const key = 'preload-error-reload-at'
  const last = Number(sessionStorage.getItem(key) ?? 0)
  if (Date.now() - last > 10_000) {
    sessionStorage.setItem(key, String(Date.now()))
    window.location.reload()
  }
})

// Old /dashboard-prefixed or auth-page links hit on the main domain —
// bounce to the dashboard subdomain before mounting anything.
if (!enforceLegacyDashboardRedirect()) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
