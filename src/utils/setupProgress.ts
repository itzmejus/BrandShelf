import type { Business } from '../types'
import { ROUTES } from './constants'
import { getCatalogueLabel } from './businessType'

export interface SetupStep {
  step: number
  label: string
  done: boolean
  route: string
}

export interface SetupProgress {
  completedSteps: number
  totalSteps: number
  percent: number
  nextIncompleteStep: SetupStep | null
  steps: SetupStep[]
}

export function computeSetupProgress(params: {
  business: Business | null
  itemCount: number
  galleryCount: number
}): SetupProgress {
  const { business, itemCount, galleryCount } = params

  const steps: SetupStep[] = [
    { step: 1, label: 'Business Details', done: !!business?.name, route: ROUTES.BUSINESS_INFO },
    { step: 2, label: 'Business Type', done: !!business?.type, route: ROUTES.BUSINESS_INFO },
    {
      step: 3,
      label: 'Logo & Cover Image',
      done: !!(business?.logo_url || business?.cover_url),
      route: ROUTES.BUSINESS_INFO,
    },
    {
      step: 4,
      label: 'Contact Details',
      done: !!(business?.phone || business?.whatsapp || business?.email || business?.address),
      route: ROUTES.CONTACT,
    },
    {
      step: 5,
      label: business ? getCatalogueLabel(business.type) : 'Services',
      done: itemCount > 0,
      route: ROUTES.CATALOGUE,
    },
    { step: 6, label: 'Gallery', done: galleryCount > 0, route: ROUTES.GALLERY },
    {
      step: 7,
      label: 'Working Hours',
      done: !!business?.opening_hours && business.opening_hours.length > 0,
      route: ROUTES.WORKING_HOURS,
    },
    { step: 8, label: 'Publish', done: !!business?.published, route: ROUTES.SETUP },
  ]

  const completedSteps = steps.filter((s) => s.done).length
  const totalSteps = steps.length
  const percent = Math.round((completedSteps / totalSteps) * 100)
  const nextIncompleteStep = steps.find((s) => !s.done) ?? null

  return { completedSteps, totalSteps, percent, nextIncompleteStep, steps }
}
