export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'cta'; text: string; label: string; href: 'register' | 'pricing' }

export type BlogCategory = 'Industry Guides' | 'Local SEO' | 'How-To' | 'Comparisons'

export interface BlogPost {
  slug: string
  title: string
  metaDescription: string
  category: BlogCategory
  keywords: string[]
  readTime: string
  publishedAt: string
  excerpt: string
  body: BlogBlock[]
  /** Slugs of 2-3 related posts, for internal linking */
  related: string[]
}
