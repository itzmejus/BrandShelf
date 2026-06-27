import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production this would go to an observability service (e.g. Sentry)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback onReset={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}

function DefaultErrorFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl" role="img" aria-label="Error">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Something went wrong</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onReset}
            className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="border border-outline-variant text-on-surface px-5 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}
