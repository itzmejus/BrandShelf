import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { ROUTES } from '../utils/constants'
import { BLOG_POSTS, BLOG_CATEGORIES } from '../content/blog'
import { MarketingNav, MarketingFooter } from '../features/marketing/MarketingChrome'
import './LandingPage.css'
import './BlogPage.css'

export function BlogIndexPage() {
  usePageMeta({
    title: 'The SiteSelo Blog — Local Business & Website Guides',
    description:
      'Practical guides on websites, local SEO, and getting more customers online, written for restaurants, salons, clinics, and service businesses in the UAE.',
    canonicalUrl: `${window.location.origin}${ROUTES.BLOG}`,
  })

  const [activeCategory, setActiveCategory] = useState('All')

  const visiblePosts =
    activeCategory === 'All' ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === activeCategory)

  return (
    <div className="ls">
      <MarketingNav />

      <header className="blog-header">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Resources</span>
            <h1>The SiteSelo Blog</h1>
            <p>
              Practical guides on getting your business online, ranking locally, and turning website visitors
              into customers, written for restaurants, salons, clinics, and service businesses in the UAE.
            </p>
          </div>
          <div className="blog-filters">
            {['All', ...BLOG_CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                className="blog-filter-chip"
                aria-pressed={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >
                {activeCategory === cat && <Check size={12} style={{ marginRight: '.35rem', verticalAlign: '-1px' }} />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="section" style={{ paddingBlock: 0 }}>
        <div className="wrap">
          <div className="blog-grid">
            {visiblePosts.map((post) => (
              <Link key={post.slug} to={`${ROUTES.BLOG}/${post.slug}`} className="blog-card">
                <div className="blog-card-meta">
                  <span>{post.category}</span>
                  <span className="dot" />
                  <span className="read-time">{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="blog-card-link">Read article →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
