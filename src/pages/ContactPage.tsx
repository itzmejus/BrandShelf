import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { saveBusiness } from '../store/slices/businessSlice'
import { addToast } from '../store/slices/uiSlice'
import { Button, Input, PageHeader } from '../components'

const phoneRegex = /^[+\d\s\-().]{7,20}$/

const schema = z.object({
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number').optional().or(z.literal('')),
  whatsapp: z.string().regex(phoneRegex, 'Enter a valid WhatsApp number').optional().or(z.literal('')),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().max(300, 'Address is too long').optional(),
})

type FormValues = z.infer<typeof schema>

export function ContactPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const { business, saving } = useAppSelector((s) => s.business)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '', whatsapp: '', email: '', address: '' },
  })

  useEffect(() => {
    if (business) {
      reset({
        phone: business.phone ?? '',
        whatsapp: business.whatsapp ?? '',
        email: business.email ?? '',
        address: business.address ?? '',
      })
    }
  }, [business, reset])

  const onSubmit = async (values: FormValues) => {
    if (!user || !business) return

    const { id, user_id, created_at, updated_at, ...rest } = business
    const formData = {
      ...rest,
      phone: values.phone || null,
      whatsapp: values.whatsapp || null,
      email: values.email || null,
      address: values.address || null,
    }

    const result = await dispatch(saveBusiness({ businessId: business.id, userId: user.id, formData }))

    if (saveBusiness.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Contact details saved', type: 'success' }))
    } else {
      dispatch(addToast({ message: 'Failed to save contact details', type: 'error' }))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6 pb-8">
        <PageHeader
          title="Contact"
          subtitle="How customers reach you — shown on your public website and in the hero call-to-action."
          action={
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          }
        />

        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-sm font-semibold text-primary">Contact Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+971 50 000 0000"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="WhatsApp Number"
              type="tel"
              placeholder="+971 50 000 0000"
              error={errors.whatsapp?.message}
              {...register('whatsapp')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="hello@yourbusiness.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Address"
              placeholder="123 Main St, Dubai"
              error={errors.address?.message}
              {...register('address')}
            />
          </div>
          <p className="px-6 pb-6 text-xs text-on-surface-variant -mt-2">
            A map showing this address will be shown automatically on your Contact section.
          </p>
        </section>

        <div className="flex justify-end sm:hidden">
          <Button type="submit" loading={saving} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
