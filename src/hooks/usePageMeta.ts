import { useEffect } from 'react'

interface PageMeta {
  title: string
  description?: string
  image?: string | null
  type?: string
}

const DEFAULT_TITLE = 'BrandShelf — Everything Your Customers Need. One Link.'
const DEFAULT_DESCRIPTION =
  'BrandShelf gives every business a beautiful digital storefront. Manage your catalogue, gallery, and contact details — then share one link with your customers.'

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

export function usePageMeta({ title, description, image, type = 'website' }: PageMeta) {
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

    return () => {
      document.title = DEFAULT_TITLE
      removeMeta('og:image', 'property')
      removeMeta('twitter:image', 'property')
    }
  }, [title, description, image, type])
}
