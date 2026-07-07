import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Spinner } from '../components'
import { ErrorBoundary } from '../components/ErrorBoundary'

// Landing + auth pages — small, load eagerly (user lands here first)
import { LandingPage } from '../pages/LandingPage'
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
const BusinessInfoPage = lazy(() =>
  import('../pages/BusinessInfoPage').then((m) => ({ default: m.BusinessInfoPage })),
)
const ContactPage = lazy(() =>
  import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const AccountPage = lazy(() =>
  import('../pages/AccountPage').then((m) => ({ default: m.AccountPage })),
)
const SetupWizardPage = lazy(() =>
  import('../pages/SetupWizardPage').then((m) => ({ default: m.SetupWizardPage })),
)
const AnalyticsPage = lazy(() =>
  import('../pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)
const AboutUsPage = lazy(() =>
  import('../pages/AboutUsPage').then((m) => ({ default: m.AboutUsPage })),
)
const TestimonialsPage = lazy(() =>
  import('../pages/TestimonialsPage').then((m) => ({ default: m.TestimonialsPage })),
)
const GalleryPage = lazy(() =>
  import('../pages/GalleryPage').then((m) => ({ default: m.GalleryPage })),
)
const WorkingHoursPage = lazy(() =>
  import('../pages/WorkingHoursPage').then((m) => ({ default: m.WorkingHoursPage })),
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
const PrivacyPolicyPage = lazy(() =>
  import('../pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const TermsPage = lazy(() =>
  import('../pages/TermsPage').then((m) => ({ default: m.TermsPage })),
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
    element: <LandingPage />,
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
        path: 'setup',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SetupWizardPage />
          </Suspense>
        ),
      },
      {
        path: 'business-info',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BusinessInfoPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'account',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AccountPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutUsPage />
          </Suspense>
        ),
      },
      {
        path: 'testimonials',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TestimonialsPage />
          </Suspense>
        ),
      },
      {
        path: 'gallery',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GalleryPage />
          </Suspense>
        ),
      },
      {
        path: 'working-hours',
        element: (
          <Suspense fallback={<PageLoader />}>
            <WorkingHoursPage />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AnalyticsPage />
          </Suspense>
        ),
      },
      ...[
        'bookings',
        'reviews',
        'messages',
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
    path: '/privacy',
    element: (
      <Suspense fallback={<PageLoader />}>
        <PrivacyPolicyPage />
      </Suspense>
    ),
  },
  {
    path: '/terms',
    element: (
      <Suspense fallback={<PageLoader />}>
        <TermsPage />
      </Suspense>
    ),
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
