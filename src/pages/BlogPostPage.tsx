import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { ROUTES } from '../utils/constants'
import { dashboardUrl } from '../utils/domainRouting'
import { getPostBySlug, getRelatedPosts } from '../content/blog'
import type { BlogBlock } from '../content/blog'
import { MarketingNav, MarketingFooter } from '../features/marketing/MarketingChrome'
import './LandingPage.css'
import './BlogPage.css'

function ctaHref(target: 'register' | 'pricing'): string {
  return target === 'register' ? dashboardUrl(ROUTES.REGISTER) : `${ROUTES.HOME}#pricing`
}

function BlockRenderer({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>
    case 'h2':
      return <h2>{block.text}</h2>
    case 'h3':
      return <h3>{block.text}</h3>
    case 'ul':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote>
          {block.text}
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      )
    case 'cta':
      return (
        <div className="post-cta">
          <p>{block.text}</p>
          <a href={ctaHref(block.href)} className="btn btn-primary">
            {block.label}
          </a>
        </div>
      )
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function BlogPostPage() {
  const { postSlug } = useParams<{ postSlug: string }>()
  const post = postSlug ? getPostBySlug(postSlug) : undefined
  const related = useMemo(() => (post ? getRelatedPosts(post) : []), [post])

  const canonicalUrl = post ? `${window.location.origin}${ROUTES.BLOG}/${post.slug}` : undefined
  const jsonLd = useMemo(() => {
    if (!post) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.publishedAt,
      author: { '@type': 'Organization', name: 'SiteSelo' },
      publisher: { '@type': 'Organization', name: 'SiteSelo' },
      mainEntityOfPage: canonicalUrl,
      keywords: post.keywords.join(', '),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, canonicalUrl])

  usePageMeta({
    title: post ? `${post.title} | SiteSelo Blog` : 'Post Not Found | SiteSelo Blog',
    description: post?.metaDescription,
    canonicalUrl,
    jsonLd,
  })

  if (!post) {
    return (
      <div className="ls">
        <MarketingNav />
        <div className="wrap post-not-found">
          <h1>We couldn't find that article.</h1>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
            It may have been moved or the link is incorrect.
          </p>
          <Link to={ROUTES.BLOG} className="btn btn-primary">Back to the Blog</Link>
        </div>
        <MarketingFooter />
      </div>
    )
  }

  return (
    <div className="ls">
      <MarketingNav />

      <div className="wrap">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME}>Home</Link>
          <span>/</span>
          <Link to={ROUTES.BLOG}>Blog</Link>
          <span>/</span>
          <span className="current">{post.title}</span>
        </nav>

        <div className="post-head">
          <span className="eyebrow">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="dot" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <article className="post-body">
          {post.body.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </article>
      </div>

      {related.length > 0 && (
        <section className="related-posts">
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">Keep Reading</span>
              <h2>Related articles</h2>
            </div>
            <div className="related-grid">
              {related.map((r) => (
                <Link key={r.slug} to={`${ROUTES.BLOG}/${r.slug}`} className="blog-card">
                  <div className="blog-card-meta">
                    <span>{r.category}</span>
                    <span className="dot" />
                    <span className="read-time">{r.readTime}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.excerpt}</p>
                  <span className="blog-card-link">Read article →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <MarketingFooter />
    </div>
  )
}
