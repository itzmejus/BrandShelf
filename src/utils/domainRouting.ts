/**
 * Splits the app across two domains: auth + dashboard live at the bare paths
 * (e.g. /catalogue) on dashboard.<domain>, everything else (marketing site,
 * public business pages) lives on the main domain at the same bare paths
 * (e.g. /:slug). AppRouter picks which route tree to mount based on
 * `isDashboardHost` — that's what actually keeps `/contact` or `/about`
 * from colliding with a business's public slug, not path-prefix guessing.
 *
 * The subdomain only exists once DNS + hosting are configured outside this
 * codebase. Until then (localhost without a "dashboard." prefix, Vercel
 * preview URLs, IP hosts) this is a no-op and the main route tree is used.
 */

export function isDashboardHost(hostname: string): boolean {
  return hostname.startsWith('dashboard.')
}

/** Hosts where we can't reliably build a "dashboard.<host>" counterpart. */
function isUnsplittableHost(hostname: string): boolean {
  return /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.endsWith('.vercel.app')
}

function withDashboardHost(hostname: string): string {
  return hostname.startsWith('www.') ? hostname.replace(/^www\./, 'dashboard.') : `dashboard.${hostname}`
}

function crossHostUrl(path: string, targetHostname: string): string {
  const { protocol, port } = window.location
  const portSuffix = port ? `:${port}` : ''
  return `${protocol}//${targetHostname}${portSuffix}${path}`
}

/** Absolute URL to `path` on the dashboard subdomain — for links rendered
 * on the marketing site (a plain `<a>`, not a react-router `<Link>`, since
 * this always crosses origins). Falls back to a same-origin relative path
 * when there's no real subdomain to cross to (local dev, previews). */
export function dashboardUrl(path: string): string {
  if (typeof window === 'undefined') return path
  const { hostname } = window.location
  if (isDashboardHost(hostname) || isUnsplittableHost(hostname)) return path
  return crossHostUrl(path, withDashboardHost(hostname))
}

/** Same idea in reverse — absolute URL to `path` on the main domain, for
 * links rendered inside the dashboard. */
export function mainSiteUrl(path: string): string {
  if (typeof window === 'undefined') return path
  const { hostname } = window.location
  if (!isDashboardHost(hostname) || isUnsplittableHost(hostname)) return path
  return crossHostUrl(path, hostname.replace(/^dashboard\./, ''))
}

// Old bookmarks/links to the previous `/dashboard`-prefixed structure, or to
// the (always-unprefixed) auth pages, hit on the main domain — bounce them
// to the dashboard subdomain instead of 404ing against the `/:slug` catch-all.
const LEGACY_REDIRECT_PATHS = ['/dashboard', '/login', '/register', '/forgot-password']

/** Returns true if it triggered a redirect (caller should skip rendering). */
export function enforceLegacyDashboardRedirect(): boolean {
  if (typeof window === 'undefined') return false

  const { hostname, pathname, search, hash } = window.location
  if (isDashboardHost(hostname) || isUnsplittableHost(hostname)) return false

  const matchesLegacy = LEGACY_REDIRECT_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (!matchesLegacy) return false

  const newPath = pathname.startsWith('/dashboard') ? pathname.slice('/dashboard'.length) || '/' : pathname
  window.location.replace(crossHostUrl(`${newPath}${search}${hash}`, withDashboardHost(hostname)))
  return true
}
