import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react'
import type { Business } from '../../types'
import { formatPhone } from '../../utils/business.utils'
import { analyticsEventService } from '../../services/analyticsEvent.service'
import { WhatsAppIcon } from './WhatsAppIcon'

interface ContactSectionProps {
  business: Business
}

export function ContactSection({ business }: ContactSectionProps) {
  const track = (eventType: 'phone_click' | 'whatsapp_click' | 'direction_click') =>
    analyticsEventService.logEvent(business.id, eventType)
  const hasAnyContact =
    business.phone || business.whatsapp || business.email || business.address
  if (!hasAnyContact && !business.opening_hours) return null

  return (
    <section id="contact" className="bg-white py-16 md:py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-(--color-on-surface-variant) uppercase tracking-widest mb-3 block">Find Us</span>
          <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-(--color-on-surface)">
            Contact & Hours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact info card */}
          {hasAnyContact && (
            <div className="bg-(--color-surface-container-low) rounded-2xl p-7 md:p-8 border border-(--color-outline-variant)">
              <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-(--color-on-surface) mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
                Get In Touch
              </h3>

              <div className="space-y-4">
                {business.phone && (
                  <a href={`tel:${formatPhone(business.phone)}`} onClick={() => track('phone_click')} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-(--color-brand)/10 flex items-center justify-center flex-shrink-0 group-hover:bg-(--color-brand) transition-colors">
                      <Phone size={18} className="text-(--color-brand) group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] text-(--color-outline) font-bold uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-semibold text-(--color-on-surface) group-hover:text-(--color-brand) transition-colors">
                        {business.phone}
                      </p>
                    </div>
                  </a>
                )}

                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${formatPhone(business.whatsapp)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('whatsapp_click')}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-(--color-brand)/10 flex items-center justify-center flex-shrink-0 group-hover:bg-(--color-brand) transition-colors">
                      <WhatsAppIcon size={18} className="text-(--color-brand) group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] text-(--color-outline) font-bold uppercase tracking-wider">WhatsApp</p>
                      <p className="text-sm font-semibold text-(--color-on-surface) group-hover:text-(--color-brand) transition-colors">
                        {business.whatsapp}
                      </p>
                    </div>
                  </a>
                )}

                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-(--color-brand)/10 flex items-center justify-center flex-shrink-0 group-hover:bg-(--color-brand) transition-colors">
                      <Mail size={18} className="text-(--color-brand) group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] text-(--color-outline) font-bold uppercase tracking-wider">Email</p>
                      <p className="text-sm font-semibold text-(--color-on-surface) group-hover:text-(--color-brand) transition-colors">
                        {business.email}
                      </p>
                    </div>
                  </a>
                )}

                {business.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('direction_click')}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-(--color-brand)/10 flex items-center justify-center flex-shrink-0 group-hover:bg-(--color-brand) transition-colors">
                      <MapPin size={18} className="text-(--color-brand) group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-(--color-outline) font-bold uppercase tracking-wider">Address</p>
                      <p className="text-sm font-semibold text-(--color-on-surface) group-hover:text-(--color-brand) transition-colors">
                        {business.address}
                      </p>
                    </div>
                    <ExternalLink size={14} className="text-(--color-outline-variant) group-hover:text-(--color-brand) transition-colors flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Map embed */}
          {business.address && (
            <div className="rounded-2xl overflow-hidden border border-(--color-outline-variant) min-h-[280px]">
              <iframe
                title="Location map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[280px] border-0"
              />
            </div>
          )}

          {/* Opening hours card */}
          {business.opening_hours && business.opening_hours.length > 0 && (
            <div className="bg-(--color-inverse-surface) rounded-2xl p-7 md:p-8">
              <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-(--color-inverse-on-surface) mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Clock size={18} className="text-(--color-inverse-on-surface)" />
                </div>
                Opening Hours
              </h3>

              <div className="space-y-2">
                {business.opening_hours.map((h) => {
                  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
                  const isToday = h.day === todayName
                  return (
                    <div
                      key={h.day}
                      className={`flex justify-between items-center py-2 px-3 rounded-xl transition-colors ${
                        isToday ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-(--color-brand)" />
                        )}
                        <span className={`text-sm font-medium ${isToday ? 'text-(--color-inverse-on-surface) font-bold' : 'text-(--color-inverse-on-surface)/60'}`}>
                          {h.day}
                        </span>
                        {isToday && (
                          <span className="text-[10px] bg-(--color-brand) text-white px-2 py-0.5 rounded-full font-bold">
                            Today
                          </span>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${h.closed ? 'text-(--color-inverse-on-surface)/40' : isToday ? 'text-(--color-inverse-on-surface) font-semibold' : 'text-(--color-inverse-on-surface)/60'}`}>
                        {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
