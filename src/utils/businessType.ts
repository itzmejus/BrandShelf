export type BusinessCategory = 'food' | 'beauty' | 'medical' | 'fitness' | 'service' | 'other'

export type HeroCta = 'menu' | 'booking' | 'quote' | 'contact'

const CATEGORY_BY_TYPE: Record<string, BusinessCategory> = {
  Restaurant: 'food',
  Cafe: 'food',
  'Beauty Salon': 'beauty',
  Spa: 'beauty',
  'Dental Clinic': 'medical',
  'Medical Clinic': 'medical',
  Gym: 'fitness',
  'Moving Company': 'service',
  'Cleaning Company': 'service',
  'HVAC Company': 'service',
  Electrician: 'service',
  'Landscaping Company': 'service',
  'Real Estate': 'service',
  Photographer: 'service',
  // Legacy labels — keep mapping so businesses created before the rename
  // (stored with the old type string) still get the right category.
  Salon: 'beauty',
  'Electrical Company': 'service',
  Photography: 'service',
}

export function getBusinessCategory(type: string): BusinessCategory {
  return CATEGORY_BY_TYPE[type] ?? 'other'
}

const CATALOGUE_LABEL_BY_CATEGORY: Record<BusinessCategory, string> = {
  food: 'Menu',
  beauty: 'Services',
  medical: 'Treatments',
  fitness: 'Services',
  service: 'Services',
  other: 'Services',
}

export function getCatalogueLabel(type: string): string {
  return CATALOGUE_LABEL_BY_CATEGORY[getBusinessCategory(type)]
}

const CATALOGUE_ITEM_NOUN_BY_CATEGORY: Record<BusinessCategory, string> = {
  food: 'Menu Item',
  beauty: 'Service',
  medical: 'Treatment',
  fitness: 'Service',
  service: 'Service',
  other: 'Service',
}

export function getCatalogueItemNoun(type: string): string {
  return CATALOGUE_ITEM_NOUN_BY_CATEGORY[getBusinessCategory(type)]
}

const HERO_CTA_BY_CATEGORY: Record<BusinessCategory, HeroCta> = {
  food: 'menu',
  beauty: 'booking',
  medical: 'booking',
  fitness: 'booking',
  service: 'quote',
  other: 'contact',
}

export function getHeroCta(type: string): HeroCta {
  return HERO_CTA_BY_CATEGORY[getBusinessCategory(type)]
}

export const DEFAULT_TRUST_BADGES: Record<BusinessCategory, string[]> = {
  food: ['Fresh Daily', '5+ Years Experience', '1000+ Customers'],
  beauty: ['Certified Professionals', '5+ Years Experience', '1000+ Customers'],
  medical: ['Licensed', 'Certified Professionals', 'Insurance Accepted'],
  fitness: ['Certified Trainers', 'Flexible Hours', '1000+ Members'],
  service: ['Licensed', 'Free Estimate', 'Same Day Service'],
  other: ['Licensed', '5+ Years Experience', '1000+ Customers'],
}

export function getDefaultTrustBadges(type: string): string[] {
  return DEFAULT_TRUST_BADGES[getBusinessCategory(type)]
}
