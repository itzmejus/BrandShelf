import { Link } from 'react-router-dom'
import { Button } from '../components'

export function NotFoundPage() {
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
        <Link to="/dashboard">
          <Button size="lg">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
