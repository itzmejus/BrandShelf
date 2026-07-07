import { Link } from 'react-router-dom'
import { Button } from '../components'
import { isDashboardHost } from '../utils/domainRouting'

export function NotFoundPage() {
  // Shared 404 for both route trees — "back" means the dashboard home on
  // the dashboard subdomain, or the marketing homepage everywhere else.
  const onDashboard = isDashboardHost(window.location.hostname)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-sm space-y-5">
        <p className="text-8xl font-bold text-outline-variant select-none" aria-hidden="true">
          404
        </p>
        <div>
          <h1 className="text-2xl font-bold text-primary">Page not found.</h1>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>
        <Link to="/">
          <Button size="lg">{onDashboard ? 'Back to Dashboard' : 'Back to Home'}</Button>
        </Link>
      </div>
    </div>
  )
}
