import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { publicService } from '../services/public.service'
import type { Business, Category, CatalogueItem, AboutContent, Testimonial, GalleryImage } from '../types'
import { usePageMeta } from '../hooks/usePageMeta'
import { getCatalogueLabel } from '../utils/businessType'
import { analyticsEventService } from '../services/analyticsEvent.service'

import { PublicNavbar } from '../features/public/PublicNavbar'
import { HeroSection } from '../features/public/HeroSection'
import { QuickActions } from '../features/public/QuickActions'
import { AboutSection } from '../features/public/AboutSection'
import { CategoryTabs } from '../features/public/CategoryTabs'
import { FeaturedSection } from '../features/public/FeaturedSection'
import { CatalogueSection } from '../features/public/CatalogueSection'
import { GallerySection } from '../features/public/GallerySection'
import { TestimonialsSection } from '../features/public/TestimonialsSection'
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
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
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

        if (biz.published) analyticsEventService.logEvent(biz.id, 'page_view')

        // Core data — required for the page to render at all
        const [cats, itms] = await Promise.all([
          publicService.getCategoriesByBusinessId(biz.id),
          publicService.getItemsByBusinessId(biz.id),
        ])

        // Optional storefront content — fetched best-effort so a missing table/migration
        // or a single failed query never takes down the whole public page
        const [aboutResult, testimonialsResult, galleryResult] = await Promise.allSettled([
          publicService.getAboutContentByBusinessId(biz.id),
          publicService.getTestimonialsByBusinessId(biz.id),
          publicService.getGalleryImagesByBusinessId(biz.id),
        ])

        if (!cancelled) {
          setBusiness(biz)
          setCategories(cats)
          setItems(itms)
          setAbout(aboutResult.status === 'fulfilled' ? aboutResult.value : null)
          setTestimonials(testimonialsResult.status === 'fulfilled' ? testimonialsResult.value : [])
          setGalleryImages(galleryResult.status === 'fulfilled' ? galleryResult.value : [])
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

  const seoDescription =
    about?.body ??
    business?.description ??
    (business ? `${business.name} — ${business.type}. Everything your customers need.` : undefined)
  const seoImage = about?.image_url ?? business?.cover_url ?? business?.logo_url
  const canonicalUrl = business ? `${window.location.origin}/${business.slug}` : undefined

  const jsonLd = useMemo(() => {
    if (!business) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: business.name,
      description: seoDescription,
      image: seoImage ?? undefined,
      url: canonicalUrl,
      telephone: business.phone ?? undefined,
      address: business.address ? { '@type': 'PostalAddress', streetAddress: business.address } : undefined,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business, seoDescription, seoImage, canonicalUrl])

  usePageMeta({
    title: business ? `${business.name} | SiteSelo` : 'SiteSelo',
    description: seoDescription,
    image: seoImage,
    canonicalUrl,
    jsonLd,
  })

  if (loading) return <PublicPageSkeleton />
  if (notFound || !business || !business.published) return <NotFoundBusiness slug={slug ?? ''} />

  // Prefer curated gallery images; fall back to catalogue item photos
  const displayGalleryImages = galleryImages.length > 0
    ? galleryImages.map((g) => g.image_url)
    : items.filter((i) => i.image_url).map((i) => i.image_url!).slice(0, 8)

  const catalogueLabel = getCatalogueLabel(business.type)

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar businessName={business.name} catalogueLabel={catalogueLabel} />

      <HeroSection business={business} />

      <QuickActions business={business} />

      <AboutSection business={business} about={about} />

      {/* Category sticky nav + catalogue — only if items exist */}
      {items.length > 0 && (
        <>
          <CategoryTabs
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />

          <FeaturedSection items={items} catalogueLabel={catalogueLabel} />

          <CatalogueSection
            categories={categories}
            items={items}
            catalogueLabel={catalogueLabel}
            onCategoryVisible={setActiveCategoryId}
          />
        </>
      )}

      {displayGalleryImages.length > 0 && (
        <GallerySection images={displayGalleryImages} businessName={business.name} />
      )}

      <ContactSection business={business} />

      {testimonials.length > 0 ? (
        <TestimonialsSection testimonials={testimonials} />
      ) : (
        <PlaceholderSection
          title="Customer Reviews"
          description="Reviews and ratings are coming soon. Be the first to share your experience."
        />
      )}

      <PlaceholderSection
        title="Online Booking"
        description="Book appointments online — this feature is coming soon."
      />

      <FooterSection business={business} catalogueLabel={catalogueLabel} />
    </div>
  )
}
