import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowLeft, ArrowRight, Upload, Loader2, Plus } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { fetchItems } from '../store/slices/catalogueSlice'
import { fetchCategories } from '../store/slices/categorySlice'
import { fetchGalleryImages, createGalleryImage } from '../store/slices/gallerySlice'
import { saveBusiness } from '../store/slices/businessSlice'
import { addToast } from '../store/slices/uiSlice'
import { businessService } from '../services/business.service'
import { galleryImageService } from '../services/galleryImage.service'
import { STORAGE_BUCKETS, ROUTES } from '../utils/constants'
import { getCatalogueItemNoun } from '../utils/businessType'
import { computeSetupProgress } from '../utils/setupProgress'
import { OpeningHoursEditor, DEFAULT_HOURS } from '../features/settings/components/OpeningHoursEditor'
import { ItemFormModal } from '../features/catalogue/components/ItemFormModal'
import { Button, Input, ImageUpload, Switch, Badge } from '../components'
import type { OpeningHours } from '../types'

const STEP_LABELS = [
  'Business Details',
  'Business Type',
  'Logo & Cover Image',
  'Contact Details',
  'Services',
  'Gallery',
  'Working Hours',
  'Publish',
]

export function SetupWizardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const { business, saving: businessSaving } = useAppSelector((s) => s.business)
  const catalogue = useAppSelector((s) => s.catalogue)
  const galleryImages = useAppSelector((s) => s.gallery.images)

  const [currentStep, setCurrentStep] = useState(3)
  const hasAutoJumped = useRef(false)

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)

  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  const [itemModalOpen, setItemModalOpen] = useState(false)

  const [hours, setHours] = useState<OpeningHours[]>(DEFAULT_HOURS)

  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (business) {
      dispatch(fetchItems(business.id))
      dispatch(fetchCategories(business.id))
      dispatch(fetchGalleryImages(business.id))
    }
  }, [business, dispatch])

  useEffect(() => {
    if (business) {
      setLogoPreview(business.logo_url)
      setCoverPreview(business.cover_url)
      setPhone(business.phone ?? '')
      setWhatsapp(business.whatsapp ?? '')
      setEmail(business.email ?? '')
      setAddress(business.address ?? '')
      setHours((business.opening_hours as OpeningHours[]) ?? DEFAULT_HOURS)
    }
  }, [business])

  const progress = computeSetupProgress({
    business,
    itemCount: catalogue.items.length,
    galleryCount: galleryImages.length,
  })

  // Jump straight to the first incomplete step once real data has loaded, but only once
  useEffect(() => {
    if (!hasAutoJumped.current && business) {
      hasAutoJumped.current = true
      setCurrentStep(progress.nextIncompleteStep?.step ?? 8)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business])

  if (!business || !user) return null

  const itemNoun = getCatalogueItemNoun(business.type)
  const goTo = (step: number) => setCurrentStep(Math.min(8, Math.max(1, step)))
  const finish = () => navigate(ROUTES.DASHBOARD)

  const saveBusinessPatch = async (patch: Partial<typeof business>) => {
    const { id, user_id, created_at, updated_at, ...rest } = business
    return dispatch(
      saveBusiness({ businessId: business.id, userId: user.id, formData: { ...rest, ...patch } }),
    )
  }

  const handleSaveImages = async () => {
    setUploadingImages(true)
    let logoUrl = business.logo_url
    let coverUrl = business.cover_url
    try {
      if (logoFile) logoUrl = await businessService.uploadImage(STORAGE_BUCKETS.LOGOS, user.id, logoFile)
      if (coverFile) coverUrl = await businessService.uploadImage(STORAGE_BUCKETS.COVERS, user.id, coverFile)
    } catch {
      dispatch(addToast({ message: 'Image upload failed', type: 'error' }))
      setUploadingImages(false)
      return
    }
    setUploadingImages(false)
    const result = await saveBusinessPatch({ logo_url: logoUrl, cover_url: coverUrl })
    if (saveBusiness.fulfilled.match(result)) goTo(4)
  }

  const handleSaveContact = async () => {
    const result = await saveBusinessPatch({
      phone: phone || null,
      whatsapp: whatsapp || null,
      email: email || null,
      address: address || null,
    })
    if (saveBusiness.fulfilled.match(result)) goTo(5)
  }

  const handleSaveHours = async () => {
    const result = await saveBusinessPatch({ opening_hours: hours })
    if (saveBusiness.fulfilled.match(result)) goTo(8)
  }

  const handleGalleryUpload = async (file: File) => {
    setUploadingGalleryImage(true)
    try {
      const imageUrl = await galleryImageService.uploadImage(business.id, file)
      await dispatch(
        createGalleryImage({
          businessId: business.id,
          formData: { image_url: imageUrl, caption: '', sort_order: galleryImages.length },
        }),
      )
    } catch (err: unknown) {
      dispatch(addToast({ message: (err as Error).message || 'Image upload failed', type: 'error' }))
    } finally {
      setUploadingGalleryImage(false)
    }
  }

  const handleTogglePublished = async () => {
    await saveBusinessPatch({ published: !business.published })
  }

  const handleHourChange = (index: number, field: keyof OpeningHours, value: string | boolean) => {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      {/* Progress header */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Set Up Your Website</p>
            <h1 className="text-lg font-bold text-primary">
              Step {currentStep} of 8 · {STEP_LABELS[currentStep - 1]}
            </h1>
          </div>
          <Badge variant="secondary">{progress.percent}% complete</Badge>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6 space-y-5">
        {(currentStep === 1 || currentStep === 2) && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Business Details &amp; Type</h2>
            <p className="text-sm text-on-surface-variant">
              You already told us the basics when you created your website.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-surface-container-low">
                <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">Name</p>
                <p className="text-sm font-semibold text-on-surface">{business.name}</p>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-low">
                <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">Type</p>
                <p className="text-sm font-semibold text-on-surface">{business.type}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">
              Need to change these? Update them any time in Business Info.
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Logo &amp; Cover Image</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                value={logoPreview}
                onChange={(file) => { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)) }}
                onRemove={() => { setLogoFile(null); setLogoPreview(null) }}
                label="Business Logo"
                uploading={uploadingImages}
              />
              <ImageUpload
                value={coverPreview}
                onChange={(file) => { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)) }}
                onRemove={() => { setCoverFile(null); setCoverPreview(null) }}
                label="Cover Image"
                uploading={uploadingImages}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Phone Number" type="tel" placeholder="+971 50 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="WhatsApp Number" type="tel" placeholder="+971 50 000 0000" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              <Input label="Email" type="email" placeholder="hello@yourbusiness.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Address" placeholder="123 Main St, Dubai" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">{STEP_LABELS[4]}</h2>
            <p className="text-sm text-on-surface-variant">
              {catalogue.items.length > 0
                ? `You've added ${catalogue.items.length} ${catalogue.items.length === 1 ? itemNoun.toLowerCase() : itemNoun.toLowerCase() + 's'}.`
                : `Add your first ${itemNoun.toLowerCase()} so customers know what you offer.`}
            </p>
            <Button type="button" variant="secondary" onClick={() => setItemModalOpen(true)}>
              <Plus size={14} />
              Add {itemNoun}
            </Button>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Gallery</h2>
            <p className="text-sm text-on-surface-variant">
              {galleryImages.length > 0
                ? `${galleryImages.length} image${galleryImages.length !== 1 ? 's' : ''} in your gallery.`
                : 'Upload a few photos of your work, space, or products.'}
            </p>
            <div className="flex flex-wrap gap-3">
              {galleryImages.map((img) => (
                <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGalleryImage}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-outline-variant hover:border-secondary flex items-center justify-center text-outline hover:text-secondary transition-colors"
              >
                {uploadingGalleryImage ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleGalleryUpload(file)
                  e.target.value = ''
                }}
              />
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Working Hours</h2>
            <OpeningHoursEditor hours={hours} onChange={handleHourChange} />
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-primary">Publish Your Website</h2>
            <div className="space-y-2">
              {progress.steps.map((step) => (
                <div key={step.step} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.done ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-outline'
                    }`}
                  >
                    <Check size={12} />
                  </span>
                  <span className={step.done ? 'text-on-surface' : 'text-on-surface-variant'}>{step.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low">
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {business.published ? 'Your website is live' : 'Your website is a draft'}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {business.published ? 'Customers can view it at your link.' : 'Turn this on so customers can see it.'}
                </p>
              </div>
              <Switch checked={business.published} onChange={handleTogglePublished} disabled={businessSaving} />
            </div>
          </div>
        )}
      </div>

      {/* Nav footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => goTo(currentStep - 1)} disabled={currentStep === 1}>
            <ArrowLeft size={14} />
            Back
          </Button>
          <Button type="button" variant="ghost" onClick={() => (currentStep === 8 ? finish() : goTo(currentStep + 1))}>
            Skip for now
          </Button>
        </div>

        {currentStep === 3 && (
          <Button onClick={handleSaveImages} loading={uploadingImages || businessSaving}>
            Save &amp; Continue
            <ArrowRight size={14} />
          </Button>
        )}
        {currentStep === 4 && (
          <Button onClick={handleSaveContact} loading={businessSaving}>
            Save &amp; Continue
            <ArrowRight size={14} />
          </Button>
        )}
        {(currentStep === 1 || currentStep === 2 || currentStep === 5 || currentStep === 6) && (
          <Button onClick={() => goTo(currentStep + 1)}>
            Continue
            <ArrowRight size={14} />
          </Button>
        )}
        {currentStep === 7 && (
          <Button onClick={handleSaveHours} loading={businessSaving}>
            Save &amp; Continue
            <ArrowRight size={14} />
          </Button>
        )}
        {currentStep === 8 && (
          <Button onClick={finish}>
            Go to Dashboard
            <ArrowRight size={14} />
          </Button>
        )}
      </div>

      <ItemFormModal open={itemModalOpen} onClose={() => setItemModalOpen(false)} />
    </div>
  )
}
