import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Spinner } from '../components'
import { ErrorBoundary } from '../components/ErrorBoundary'

// Auth pages — small, load eagerly (user lands here first)
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'

// Layouts
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'

// Lazy-load all dashboard pages — reduces initial bundle
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const CataloguePage = lazy(() =>
  import('../pages/CataloguePage').then((m) => ({ default: m.CataloguePage })),
)
const CategoriesPage = lazy(() =>
  import('../pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
)
const SettingsPage = lazy(() =>
  import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const ComingSoonPage = lazy(() =>
  import('../pages/ComingSoonPage').then((m) => ({ default: m.ComingSoonPage })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
// Public business page — entirely separate UI, definitely lazy
const BusinessPage = lazy(() =>
  import('../pages/BusinessPage').then((m) => ({ default: m.BusinessPage })),
)

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={32} />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'catalogue',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CataloguePage />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CategoriesPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      ...[
        'gallery',
        'bookings',
        'analytics',
        'marketing',
        'qr',
        'themes',
      ].map((path) => ({
        path,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ComingSoonPage title={path.charAt(0).toUpperCase() + path.slice(1)} />
          </Suspense>
        ),
      })),
    ],
  },
  {
    path: '/:slug',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <BusinessPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
