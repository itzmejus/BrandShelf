import { AppProviders } from './app/AppProviders'
import { AuthListener } from './app/AuthListener'
import { AppRouter } from './routes/AppRouter'
import { ToastContainer } from './components'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AuthListener />
        <AppRouter />
        <ToastContainer />
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
