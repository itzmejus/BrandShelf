import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { publicService } from '../services/public.service'
import type { Business, Category, CatalogueItem } from '../types'
import { usePageMeta } from '../hooks/usePageMeta'

import { PublicNavbar } from '../features/public/PublicNavbar'
import { HeroSection } from '../features/public/HeroSection'
import { QuickActions } from '../features/public/QuickActions'
import { AboutSection } from '../features/public/AboutSection'
import { CategoryTabs } from '../features/public/CategoryTabs'
import { FeaturedSection } from '../features/public/FeaturedSection'
import { CatalogueSection } from '../features/public/CatalogueSection'
import { GallerySection } from '../features/public/GallerySection'
import { ContactSection } from '../features/public/ContactSection'
import { PlaceholderSection } from '../features/public/PlaceholderSection'
import { FooterSection } from '../features/public/FooterSection'
import { PublicPageSkeleton } from '../features/public/PublicPageSkeleton'
import { NotFoundBusiness } from '../features/public/NotFoundBusiness'

export function BusinessPage() {
  const { slug } = useParams<{ slug: string }>()

  const [business, setBusiness] = useState<Business | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<CatalogueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState('all')

  useEffect(() => {
    if (!slug) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const biz = await publicService.getBusinessBySlug(slug)
        if (!biz) {
          if (!cancelled) setNotFound(true)
          return
        }

        const [cats, itms] = await Promise.all([
          publicService.getCategoriesByBusinessId(biz.id),
          publicService.getItemsByBusinessId(biz.id),
        ])

        if (!cancelled) {
          setBusiness(biz)
          setCategories(cats)
          setItems(itms)
        }
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  usePageMeta({
    title: business ? `${business.name} | BrandShelf` : 'BrandShelf',
    description:
      business?.description ??
      (business ? `${business.name} — ${business.type}. Everything your customers need.` : undefined),
    image: business?.cover_url ?? business?.logo_url,
  })

  if (loading) return <PublicPageSkeleton />
  if (notFound || !business) return <NotFoundBusiness slug={slug ?? ''} />

  // Collect gallery images from items + cover
  const galleryImages = items
    .filter((i) => i.image_url)
    .map((i) => i.image_url!)
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar businessName={business.name} />

      <HeroSection business={business} />

      <QuickActions business={business} />

      <AboutSection business={business} />

      {/* Category sticky nav + catalogue — only if items exist */}
      {items.length > 0 && (
        <>
          <CategoryTabs
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />

          <FeaturedSection items={items} />

          <CatalogueSection
            categories={categories}
            items={items}
            onCategoryVisible={setActiveCategoryId}
          />
        </>
      )}

      {galleryImages.length > 0 && (
        <GallerySection images={galleryImages} businessName={business.name} />
      )}

      <ContactSection business={business} />

      <PlaceholderSection
        title="Customer Reviews"
        description="Reviews and ratings are coming soon. Be the first to share your experience."
      />

      <PlaceholderSection
        title="Online Booking"
        description="Book appointments online — this feature is coming soon."
      />

      <FooterSection business={business} />
    </div>
  )
}
