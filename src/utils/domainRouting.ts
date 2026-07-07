/**
 * Splits the app across two domains without changing any internal route
 * paths: auth + dashboard live on dashboard.<domain>, everything else
 * (marketing site, public business pages) lives on the main domain.
 *
 * This only activates once a real `dashboard.` subdomain is pointed at this
 * deployment (DNS + hosting config, done outside this codebase) — on
 * localhost or any host without a dashboard/main pair it's a no-op.
 */

const DASHBOARD_PATH_PREFIXES = ['/dashboard', '/login', '/register', '/forgot-password']

function isDashboardHost(hostname: string) {
  return hostname.startsWith('dashboard.')
}

function isDashboardPath(pathname: string) {
  return DASHBOARD_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function shouldSkip(hostname: string) {
  // No subdomain split on localhost, IP hosts, or Vercel preview URLs
  return hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.endsWith('.vercel.app')
}

/**
 * Checks the current URL against the current hostname and bounces the
 * browser to the correct domain if they don't match. Returns true if a
 * redirect was triggered (caller should avoid rendering in that case).
 */
export function enforceDomainRouting(): boolean {
  if (typeof window === 'undefined') return false

  const { hostname, pathname, search, hash, protocol } = window.location
  if (shouldSkip(hostname)) return false

  const onDashboardHost = isDashboardHost(hostname)
  const wantsDashboard = isDashboardPath(pathname)

  if (onDashboardHost && !wantsDashboard) {
    const mainHost = hostname.replace(/^dashboard\./, '')
    window.location.replace(`${protocol}//${mainHost}${pathname}${search}${hash}`)
    return true
  }

  if (!onDashboardHost && wantsDashboard) {
    const dashboardHost = hostname.startsWith('www.') ? hostname.replace(/^www\./, 'dashboard.') : `dashboard.${hostname}`
    window.location.replace(`${protocol}//${dashboardHost}${pathname}${search}${hash}`)
    return true
  }

  return false
}
