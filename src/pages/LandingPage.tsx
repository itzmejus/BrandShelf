import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Zap, Code2, Smartphone, Globe, LayoutGrid, MessageCircle, Mail,
  Check, ChevronDown, FileText, TrendingUp, ArrowUp,
} from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { ROUTES } from '../utils/constants'
import { WhatsAppIcon } from '../features/public/WhatsAppIcon'
import bannerImage from '../assets/Banner.png'
import './LandingPage.css'

const TRUST_ITEMS = [
  { icon: Zap, title: 'Live in under 2 minutes', desc: 'From sign-up to a working website, start to finish.' },
  { icon: Code2, title: 'Zero code required', desc: "Answer questions about your business — that's it." },
  { icon: Smartphone, title: 'Mobile-optimized', desc: 'Every layout works perfectly on any screen size.' },
  { icon: Globe, title: 'Hosted, always on', desc: '24/7 hosting included, with nothing to configure.' },
]

interface IncludedGroup {
  key: string
  icon: typeof LayoutGrid
  title: string
  items: string[]
}

const INCLUDED_GROUPS: IncludedGroup[] = [
  {
    key: 'website', icon: LayoutGrid, title: 'Website',
    items: ['Mobile-ready website', 'Fast hosting', 'SEO-ready pages', 'Custom business URL'],
  },
  {
    key: 'actions', icon: MessageCircle, title: 'Customer Actions',
    items: ['Call button', 'WhatsApp button', 'Directions button', 'Contact form'],
  },
  {
    key: 'content', icon: FileText, title: 'Business Content',
    items: ['Services or menu', 'Gallery', 'Testimonials', 'Working hours'],
  },
  {
    key: 'growth', icon: TrendingUp, title: 'Growth',
    items: ['Analytics', 'QR code', 'Booking requests', 'Website status'],
  },
]

interface FlowStep {
  key: string
  step: string
  icon: typeof Zap
  title: string
  desc: string
}

const FLOW_STEPS: FlowStep[] = [
  { key: 'create', step: 'Step 01', icon: Code2, title: 'Create your business', desc: 'Tell us the basics — the same details a customer would ask you for: name, category, phone, address, services.' },
  { key: 'build', step: 'Step 02', icon: Zap, title: 'SiteSelo builds everything', desc: 'Homepage, About, Services, Gallery, Contact and SEO — every page a real business website needs, generated instantly.' },
  { key: 'publish', step: 'Step 03', icon: Globe, title: 'Publish', desc: 'Your website goes live instantly, on a link you can share today: siteselo.com/your-business.' },
]

interface GalleryItem { name: string; category: string }

const CATEGORIES = ['All', 'Food & Drink', 'Health & Beauty', 'Home Services', 'Creative']

const GALLERY_ITEMS: GalleryItem[] = [
  { name: 'Restaurant', category: 'Food & Drink' },
  { name: 'Cafe', category: 'Food & Drink' },
  { name: 'Dental Clinic', category: 'Health & Beauty' },
  { name: 'Medical Clinic', category: 'Health & Beauty' },
  { name: 'Salon', category: 'Health & Beauty' },
  { name: 'Gym', category: 'Health & Beauty' },
  { name: 'Moving Company', category: 'Home Services' },
  { name: 'Electrician', category: 'Home Services' },
  { name: 'HVAC', category: 'Home Services' },
  { name: 'Cleaning', category: 'Home Services' },
  { name: 'Landscaping', category: 'Home Services' },
  { name: 'Photography', category: 'Creative' },
]

interface CompareRow { label: string; starter: boolean; business: boolean; professional: boolean }

const COMPARE_ROWS: CompareRow[] = [
  { label: 'Website pages (About, Services, Gallery, Contact)', starter: true, business: true, professional: true },
  { label: 'WhatsApp button & contact form', starter: true, business: true, professional: true },
  { label: 'Custom domain', starter: false, business: true, professional: true },
  { label: 'Bookings & testimonials pages', starter: false, business: true, professional: true },
  { label: 'Visitor analytics', starter: false, business: true, professional: true },
  { label: 'Priority support', starter: false, business: true, professional: true },
  { label: 'Multiple locations, one dashboard', starter: false, business: false, professional: true },
  { label: 'No SiteSelo branding', starter: false, business: false, professional: true },
]

const STATS_2 = [
  { num: '2,400+', label: 'businesses launched' },
  { num: '4.9★', label: 'average owner rating' },
  { num: '12', label: 'business categories supported' },
  { num: '6', label: 'countries live in' },
]

const FAQ_ITEMS: { q: string; a: string }[] = [
  { q: 'Do I need any technical or design skills?', a: "No. If you can fill out a form, you can build your website. There's nothing to install and nothing to design — you answer questions about your business, and SiteSelo handles layout, structure, and copy." },
  { q: 'How long does it actually take to go live?', a: 'Most businesses are live in under two minutes with just the essentials filled in. You can always come back and add photos, services, or hours later — nothing has to be perfect before you publish.' },
  { q: 'Can I use my own domain name?', a: "Yes, on the Business and Professional plans. Every website also comes with a free siteselo.com address you can use right away, so you're never blocked waiting on domain setup." },
  { q: 'What if I need to change something later?', a: 'Everything is editable from your dashboard — text, photos, hours, services — and changes go live immediately. There’s no rebuild or waiting on a developer.' },
  { q: 'Is it really mobile-friendly?', a: 'Every layout is built mobile-first, since most of your customers will land on your site from a phone search or a shared link. Nothing extra to configure.' },
  { q: 'What happens if I cancel?', a: "Your website stays live through the end of your billing period. You can export your business details at any time, and there's no lock-in contract." },
]

export function LandingPage() {
  usePageMeta({
    title: 'SiteSelo — Launch your business website in minutes',
    description: 'SiteSelo turns a few business details into a complete, professional website — live in minutes. Built for restaurants, clinics, salons, and every local business.',
  })

  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [galleryExpanded, setGalleryExpanded] = useState(false)
  const [ctaEmail, setCtaEmail] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    const previous = root.style.scrollBehavior
    root.style.scrollBehavior = reduceMotion ? 'auto' : 'smooth'
    return () => {
      root.style.scrollBehavior = previous
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const visibleGallery = activeCategory === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === activeCategory)

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`${ROUTES.REGISTER}${ctaEmail ? `?email=${encodeURIComponent(ctaEmail)}` : ''}`)
  }

  return (
    <div className={`ls${menuOpen ? ' menu-open' : ''}`}>
      {/* ============ NAV ============ */}
      <nav className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="brand"><span className="brand-mark"><span /></span>SiteSelo</a>
          <div className="nav-links">
            <a href="#included">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#gallery">Examples</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-cta">
            <Link to={ROUTES.LOGIN} className="btn btn-ghost" style={{ padding: '.6rem 1rem' }}>Log in</Link>
            <Link to={ROUTES.REGISTER} className="btn btn-primary">Start Free</Link>
            <button
              className="nav-burger"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="landing-nav-drawer"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div className={`nav-drawer${menuOpen ? ' open' : ''}`} id="landing-nav-drawer">
          <div className="nav-drawer-inner">
            <a href="#included" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#gallery" onClick={() => setMenuOpen(false)}>Examples</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <div className="drawer-cta">
              <Link to={ROUTES.LOGIN} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Log in</Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Start Free</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <header className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">For every local business</span>
            <h1>Launch your business website in minutes.</h1>
            <p className="hero-sub">
              No designers. No developers. No complicated setup. Just answer a few questions —
              SiteSelo builds a complete, professional website for your business while you watch.
            </p>
            <div className="hero-ctas">
              <Link to={ROUTES.REGISTER} className="btn btn-primary">Start Free <span className="btn-arrow">→</span></Link>
              <a href="#gallery" className="btn btn-ghost">See live examples</a>
            </div>
          </div>

          <div className="hero-art">
            <img src={bannerImage} alt="SiteSelo website editor preview" className="hero-art-image" />
            <div className="float-card f1"><span className="dot" />Every page included</div>
            <div className="float-card f2"><span className="dot" />Live in under 2 minutes</div>
          </div>
        </div>
      </header>

      {/* ============ TRUST STRIP ============ */}
      <section className="trust">
        <div className="wrap trust-grid">
          {TRUST_ITEMS.map((item) => (
            <div className="trust-item" key={item.title}>
              <div className="trust-icon"><item.icon size={17} /></div>
              <div className="trust-title">{item.title}</div>
              <div className="trust-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ EVERYTHING INCLUDED (dark) ============ */}
      <section className="section dark-section" id="included">
        <div className="wrap included-layout">
          <div className="included-intro">
            <h2>Everything your business website needs.</h2>
            <p>SiteSelo gives every business a complete online presence from day one. No plugins, no setup, no developer needed.</p>
            <span className="included-tag">Included from your first plan</span>
          </div>
          <div className="included-grid">
            {INCLUDED_GROUPS.map((group) => (
              <div className="included-card" key={group.key}>
                <div className="included-mock"><group.icon size={18} /></div>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">How it works</span>
            <h2>Watch it build itself.</h2>
            <p>Three steps between you and a live website — no waiting on a developer.</p>
          </div>
          <div className="steps-grid">
            {FLOW_STEPS.map((s, i) => (
              <div className="step-card" key={s.key}>
                <div className="step-top">
                  <span className="step-icon"><s.icon size={18} /></span>
                  <span className="step-num">{s.step}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < FLOW_STEPS.length - 1 && <span className="step-arrow">→</span>}
              </div>
            ))}
          </div>
          <div className="steps-cta">
            <Link to={ROUTES.REGISTER} className="btn btn-primary">Start Free <span className="btn-arrow">→</span></Link>
          </div>
        </div>
      </section>

      {/* ============ FILTERABLE GALLERY (dark) ============ */}
      <section className="section dark-section" id="gallery">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Built for your industry</span>
            <h2>Whatever you run, SiteSelo already knows the shape of your website.</h2>
            <p>Every category ships with layouts and structure suited to that business — filter by the kind of business you run.</p>
          </div>
          <div className="gallery-layout">
            <div>
              <div className="filter-group">
                <h5>Category</h5>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className="filter-chip"
                    aria-pressed={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span className="box">{activeCategory === cat ? <Check size={10} /> : null}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className={`gallery-grid${galleryExpanded ? '' : ' collapsed'}`}>
                {visibleGallery.map((item) => (
                  <div className="gallery-card" key={item.name}>
                    <div className="gallery-thumb photo"><span className="photo-cap">{item.name}</span></div>
                    <div className="gallery-info">
                      <div>
                        <h4>{item.name}</h4>
                        <span>{item.category}</span>
                      </div>
                      <span className="gallery-tag">View</span>
                    </div>
                  </div>
                ))}
              </div>
              {visibleGallery.length > 2 && (
                <button
                  type="button"
                  className="gallery-expand"
                  aria-expanded={galleryExpanded}
                  onClick={() => setGalleryExpanded((v) => !v)}
                >
                  {galleryExpanded ? 'Show less' : `Show all ${visibleGallery.length}`}
                  <ChevronDown size={16} className="chev" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ COMPARISON TABLE ============ */}
      <section className="section band-sunk">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Compare plans</span>
            <h2>Every plan gets a real website. Some get more.</h2>
          </div>
          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="plan">Starter</th>
                  <th className="plan popular">Business</th>
                  <th className="plan">Pro</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.starter ? <span className="yes">✓</span> : <span className="no">—</span>}</td>
                    <td className="popular">{row.business ? <span className="yes">✓</span> : <span className="no">—</span>}</td>
                    <td>{row.professional ? <span className="yes">✓</span> : <span className="no">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS (dark) ============ */}
      <section className="section dark-section">
        <div className="wrap">
          <div className="section-head"><h2>Built for people running a business, not a website.</h2></div>
          <div className="testi-grid">
            <div className="testi-card">
              <p className="testi-quote">"I filled in our menu and opening hours on a Tuesday evening. By Wednesday morning we had our first WhatsApp order from someone who found us on Google."</p>
              <div className="testi-who">
                <div className="avatar">MK</div>
                <div><div className="testi-name">Mario Khalil</div><div className="testi-biz">Owner, Mario's Trattoria — Dubai</div></div>
              </div>
            </div>
            <div className="testi-card">
              <p className="testi-quote">"We'd been meaning to get a website for two years. It took less time than choosing which photos to use for the gallery."</p>
              <div className="testi-who">
                <div className="avatar">RS</div>
                <div><div className="testi-name">Dr. Reem Saleh</div><div className="testi-biz">Bright Smile Dental — Abu Dhabi</div></div>
              </div>
            </div>
            <div className="testi-card">
              <p className="testi-quote">"Clients kept asking if we had a website before they'd book. Now they book straight from it — no more back-and-forth on Instagram DMs."</p>
              <div className="testi-who">
                <div className="avatar">LA</div>
                <div><div className="testi-name">Lina Al-Farsi</div><div className="testi-biz">Lumen Hair Studio — Sharjah</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="section band-sunk">
        <div className="wrap stats-grid">
          {STATS_2.map((s) => (
            <div key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PRICING (dark) ============ */}
      <section className="section dark-section" id="pricing">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2>Priced for a business, not a developer's budget.</h2>
          </div>
          <div className="price-grid">
            <div className="price-card">
              <div className="price-top"><span className="price-name">Starter</span></div>
              <div className="price-amount"><b>AED 99</b> <span>/ month</span></div>
              <p className="price-desc">For a business ready to be found online for the first time.</p>
              <ul className="price-list">
                <li><span className="yes">✓</span>1 website on a siteselo.com address</li>
                <li><span className="yes">✓</span>Homepage, About, Contact & Gallery</li>
                <li><span className="yes">✓</span>WhatsApp button & contact form</li>
                <li><span className="yes">✓</span>Mobile-optimized & SEO ready</li>
              </ul>
              <Link to={ROUTES.REGISTER} className="btn btn-ghost" style={{ justifyContent: 'center' }}>Start Free</Link>
            </div>
            <div className="price-card featured">
              <div className="price-top"><span className="price-name">Business</span><span className="price-chip">Most popular</span></div>
              <div className="price-amount"><b>AED 199</b> <span>/ month</span></div>
              <p className="price-desc">For a business that takes bookings and wants to be found.</p>
              <ul className="price-list">
                <li><span className="yes">✓</span>Everything in Starter</li>
                <li><span className="yes">✓</span>Your own custom domain</li>
                <li><span className="yes">✓</span>Bookings & testimonials pages</li>
                <li><span className="yes">✓</span>Visitor analytics</li>
                <li><span className="yes">✓</span>Priority support</li>
              </ul>
              <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{ justifyContent: 'center' }}>Start Free</Link>
            </div>
            <div className="price-card">
              <div className="price-top"><span className="price-name">Professional</span></div>
              <div className="price-amount"><b>AED 349</b> <span>/ month</span></div>
              <p className="price-desc">For multi-location businesses and growing brands.</p>
              <ul className="price-list">
                <li><span className="yes">✓</span>Everything in Business</li>
                <li><span className="yes">✓</span>Multiple locations, one dashboard</li>
                <li><span className="yes">✓</span>Advanced SEO tools</li>
                <li><span className="yes">✓</span>No SiteSelo branding</li>
                <li><span className="yes">✓</span>Dedicated onboarding call</li>
              </ul>
              <a href="#faq" className="btn btn-ghost" style={{ justifyContent: 'center' }}>Talk to us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section" id="faq">
        <div className="wrap">
          <div className="section-head center"><h2>Before you start.</h2></div>
          <div className="faq">
            {FAQ_ITEMS.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>{item.q}<ChevronDown size={18} className="chev" /></summary>
                <p className="faq-a">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EMAIL CTA CARD (dark) ============ */}
      <section className="section dark-section">
        <div className="wrap">
          <div className="cta-card">
            <div className="cta-card-icon"><Mail size={22} /></div>
            <h2>Get your free storefront checklist.</h2>
            <p>Drop your email and we'll send the exact checklist SiteSelo uses to get a business live in under two minutes.</p>
            <form className="cta-form" onSubmit={handleCtaSubmit}>
              <input
                type="email"
                required
                className="cta-input"
                placeholder="you@business.com"
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-primary">Start Building</button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FINAL DARK CTA ============ */}
      <section className="section">
        <div className="final-cta wrap">
          <div className="final-diamond" />
          <div className="final-inner">
            <h2>Ready to launch your business online?</h2>
            <p>Join the local businesses already taking bookings, enquiries, and orders through a website they built in minutes.</p>
            <div className="final-ctas">
              <Link to={ROUTES.REGISTER} className="btn btn-primary">Start Free <span className="btn-arrow">→</span></Link>
              <a href="#gallery" className="btn btn-ghost">View demo</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="brand"><span className="brand-mark"><span /></span>SiteSelo</a>
              <p>A complete business website, built from a few details and live in minutes.</p>
            </div>
            <nav className="footer-links" aria-label="Footer">
              <a href="#included">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#gallery">Templates</a>
              <a href="#faq">Help</a>
              <a href="#">Contact</a>
              <Link to={ROUTES.PRIVACY}>Privacy</Link>
              <Link to={ROUTES.TERMS}>Terms</Link>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© 2026 SiteSelo. All rights reserved.</span>
            <span>Dubai, UAE</span>
          </div>
        </div>
      </footer>

      {/* ============ FLOATING ACTIONS ============ */}
      <div className="floating-actions">
        <button
          type="button"
          className={`float-btn float-btn-top${showScrollTop ? ' visible' : ''}`}
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label="Scroll to top"
          tabIndex={showScrollTop ? 0 : -1}
        >
          <ArrowUp size={20} />
        </button>
        <a href="#included" className="float-btn float-btn-whatsapp" aria-label="Chat with us on WhatsApp">
          <WhatsAppIcon size={26} />
        </a>
      </div>
    </div>
  )
}
