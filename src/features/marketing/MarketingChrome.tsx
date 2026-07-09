import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import { dashboardUrl } from '../../utils/domainRouting'

const NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Pricing', to: `${ROUTES.HOME}#pricing` },
  { label: 'Blog', to: ROUTES.BLOG },
]

export function MarketingNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link to={ROUTES.HOME} className="brand"><img src="/Logo.png" alt="" className="brand-mark" />SiteSelo</Link>
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to}>{link.label}</Link>
          ))}
        </div>
        <div className="nav-cta">
          <a href={dashboardUrl(ROUTES.LOGIN)} className="btn btn-ghost" style={{ padding: '.6rem 1rem' }}>Log in</a>
          <a href={dashboardUrl(ROUTES.REGISTER)} className="btn btn-primary">Start Free</a>
          <button
            className="nav-burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="marketing-nav-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`} id="marketing-nav-drawer">
        <div className="nav-drawer-inner">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
          <div className="drawer-cta">
            <a href={dashboardUrl(ROUTES.LOGIN)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Log in</a>
            <a href={dashboardUrl(ROUTES.REGISTER)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Start Free</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function MarketingFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to={ROUTES.HOME} className="brand"><img src="/Logo.png" alt="" className="brand-mark" />SiteSelo</Link>
            <p>Professional websites for local businesses. Ready in minutes.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <Link to={`${ROUTES.HOME}#included`}>Features</Link>
            <Link to={`${ROUTES.HOME}#pricing`}>Pricing</Link>
            <Link to={`${ROUTES.HOME}#gallery`}>Examples</Link>
            <Link to={ROUTES.BLOG}>Blog</Link>
            <Link to={ROUTES.PRIVACY}>Privacy Policy</Link>
            <Link to={ROUTES.TERMS}>Terms of Service</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SiteSelo. All rights reserved.</span>
          <span>Dubai, UAE</span>
        </div>
      </div>
    </footer>
  )
}
