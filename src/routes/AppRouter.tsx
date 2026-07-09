import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { Spinner } from '../components'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { isDashboardHost } from '../utils/domainRouting'
import { ROUTES } from '../utils/constants'

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
const BlogIndexPage = lazy(() =>
  import('../pages/BlogIndexPage').then((m) => ({ default: m.BlogIndexPage })),
)
const BlogPostPage = lazy(() =>
  import('../pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
)

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={32} />
    </div>
  )
}

// Resets scroll position to the top on every navigation (react-router does not
// do this by default — without it, pushing a new route keeps whatever scroll
// offset the previous page was left at).
function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

// Auth pages — always unprefixed, identical on either tree
const authRoute: RouteObject = {
  element: (
    <ErrorBoundary>
      <AuthLayout />
    </ErrorBoundary>
  ),
  children: [
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
  ],
}

// Dashboard — mounted at "/" (the dashboard.<domain> subdomain itself is
// what scopes these paths; no /dashboard prefix needed underneath it)
const dashboardRoute: RouteObject = {
  path: '/',
  element: (
    <ErrorBoundary>
      <DashboardLayout />
    </ErrorBoundary>
  ),
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
}

const notFoundRoute: RouteObject = {
  path: '*',
  element: (
    <Suspense fallback={<PageLoader />}>
      <NotFoundPage />
    </Suspense>
  ),
}

// Marketing site + public business pages — served on the main domain only.
// No dashboard routes here, so a business slugged "contact" or "about"
// can never collide with a dashboard page.
const mainSiteRoutes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
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
    path: ROUTES.BLOG,
    element: (
      <Suspense fallback={<PageLoader />}>
        <BlogIndexPage />
      </Suspense>
    ),
  },
  {
    path: '/blog/:postSlug',
    element: (
      <Suspense fallback={<PageLoader />}>
        <BlogPostPage />
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
  notFoundRoute,
]

// Auth + dashboard — served on the dashboard.<domain> subdomain only.
const dashboardSiteRoutes: RouteObject[] = [authRoute, dashboardRoute, notFoundRoute]

// Pathless root wrapping whichever tree is active, purely so ScrollRestoration
// (which needs to live inside the router) applies across every route.
const rootRoutes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: isDashboardHost(window.location.hostname) ? dashboardSiteRoutes : mainSiteRoutes,
  },
]

const router = createBrowserRouter(rootRoutes)

export function AppRouter() {
  return <RouterProvider router={router} />
}
