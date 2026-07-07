import { useEffect } from 'react'

interface PageMeta {
  title: string
  description?: string
  image?: string | null
  type?: string
  canonicalUrl?: string
  jsonLd?: Record<string, unknown>
}

const DEFAULT_TITLE = 'SiteSelo — Everything Your Customers Need. One Link.'
const DEFAULT_DESCRIPTION =
  'SiteSelo gives every business a beautiful digital storefront. Manage your catalogue, gallery, and contact details — then share one link with your customers.'

function setMeta(name: string, content: string, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(name: string, attr = 'name') {
  const el = document.querySelector(`meta[${attr}="${name}"]`)
  el?.remove()
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

function removeCanonical() {
  document.querySelector('link[rel="canonical"]')?.remove()
}

function setJsonLd(data: Record<string, unknown>) {
  let el = document.querySelector('script[data-page-jsonld]')
  if (!el) {
    el = document.createElement('script')
    el.setAttribute('type', 'application/ld+json')
    el.setAttribute('data-page-jsonld', 'true')
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

function removeJsonLd() {
  document.querySelector('script[data-page-jsonld]')?.remove()
}

export function usePageMeta({ title, description, image, type = 'website', canonicalUrl, jsonLd }: PageMeta) {
  useEffect(() => {
    document.title = title

    const desc = description ?? DEFAULT_DESCRIPTION
    setMeta('description', desc)
    setMeta('og:description', desc, 'property')
    setMeta('twitter:description', desc, 'property')

    setMeta('og:title', title, 'property')
    setMeta('og:type', type, 'property')
    setMeta('twitter:title', title, 'property')

    if (image) {
      setMeta('og:image', image, 'property')
      setMeta('twitter:image', image, 'property')
      setMeta('twitter:card', 'summary_large_image', 'property')
    }

    if (canonicalUrl) {
      setCanonical(canonicalUrl)
      setMeta('og:url', canonicalUrl, 'property')
    }

    if (jsonLd) setJsonLd(jsonLd)

    return () => {
      document.title = DEFAULT_TITLE
      removeMeta('og:image', 'property')
      removeMeta('twitter:image', 'property')
      removeCanonical()
      removeMeta('og:url', 'property')
      removeJsonLd()
    }
  }, [title, description, image, type, canonicalUrl, jsonLd])
}
