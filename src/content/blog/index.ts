import { INDUSTRY_POSTS } from './industry-posts'
import { LOCAL_SEO_POSTS } from './local-seo-posts'
import { HOW_TO_POSTS } from './how-to-posts'
import { COMPARISON_POSTS } from './comparison-posts'
import type { BlogPost, BlogCategory } from './types'

export type { BlogPost, BlogBlock, BlogCategory } from './types'

export const BLOG_POSTS: BlogPost[] = [
  ...INDUSTRY_POSTS,
  ...LOCAL_SEO_POSTS,
  ...HOW_TO_POSTS,
  ...COMPARISON_POSTS,
]

export const BLOG_CATEGORIES: BlogCategory[] = ['Industry Guides', 'Local SEO', 'How-To', 'Comparisons']

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.related
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p))
}
