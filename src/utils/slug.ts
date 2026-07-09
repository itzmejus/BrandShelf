import { RESERVED_SLUGS } from './constants'

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// A business's public site lives at siteselo.com/:slug, alongside static
// routes like /blog — a business named "Blog" would otherwise generate a
// slug that collides with and is permanently shadowed by that route.
export function resolveSlug(name: string): string {
  const slug = generateSlug(name)
  return RESERVED_SLUGS.has(slug) ? `${slug}-site` : slug
}
