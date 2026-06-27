import { Phone, MessageCircle, Mail, MapPin, Clock, ExternalLink } from 'lucide-react'
import type { Business } from '../../types'
import { formatPhone } from '../../utils/business.utils'
import { Leaf } from './LeafDecor'

interface ContactSectionProps {
  business: Business
}

export function ContactSection({ business }: ContactSectionProps) {
  const hasAnyContact =
    business.phone || business.whatsapp || business.email || business.address
  if (!hasAnyContact && !business.opening_hours) return null

  return (
    <section id="contact" className="bg-white py-16 md:py-20 px-4 md:px-10 relative overflow-hidden">
      {/* Leaf accents */}
      <div className="absolute right-0 bottom-0 pointer-events-none select-none">
        <Leaf size={70} rotate={150} color="#8ab04b" opacity={0.1} />
      </div>
      <div className="absolute left-8 top-8 pointer-events-none select-none">
        <Leaf size={44} rotate={-20} color="#1d5c3a" opacity={0.08} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-[#8ab04b]" />
            <span className="text-xs font-bold text-[#8ab04b] uppercase tracking-widest">Find Us</span>
            <span className="w-8 h-px bg-[#8ab04b]" />
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-[#1a1f2e]">
            Contact & Hours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact info card */}
          {hasAnyContact && (
            <div className="bg-[#f7f5ef] rounded-3xl p-7 md:p-8 border border-[#e8e3d8]">
              <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#1a1f2e] mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#1d5c3a] rounded-full" />
                Get In Touch
              </h3>

              <div className="space-y-4">
                {business.phone && (
                  <a href={`tel:${formatPhone(business.phone)}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#1d5c3a]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1d5c3a] transition-colors">
                      <Phone size={18} className="text-[#1d5c3a] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#999] font-bold uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-semibold text-[#1a1f2e] group-hover:text-[#1d5c3a] transition-colors">
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
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 transition-colors">
                      <MessageCircle size={18} className="text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#999] font-bold uppercase tracking-wider">WhatsApp</p>
                      <p className="text-sm font-semibold text-[#1a1f2e] group-hover:text-emerald-600 transition-colors">
                        {business.whatsapp}
                      </p>
                    </div>
                  </a>
                )}

                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#1d5c3a]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1d5c3a] transition-colors">
                      <Mail size={18} className="text-[#1d5c3a] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#999] font-bold uppercase tracking-wider">Email</p>
                      <p className="text-sm font-semibold text-[#1a1f2e] group-hover:text-[#1d5c3a] transition-colors">
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
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#1d5c3a]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1d5c3a] transition-colors">
                      <MapPin size={18} className="text-[#1d5c3a] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#999] font-bold uppercase tracking-wider">Address</p>
                      <p className="text-sm font-semibold text-[#1a1f2e] group-hover:text-[#1d5c3a] transition-colors">
                        {business.address}
                      </p>
                    </div>
                    <ExternalLink size={14} className="text-[#ccc] group-hover:text-[#1d5c3a] transition-colors flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Opening hours card */}
          {business.opening_hours && business.opening_hours.length > 0 && (
            <div className="bg-[#1d5c3a] rounded-3xl p-7 md:p-8 relative overflow-hidden">
              {/* Leaf decor inside card */}
              <div className="absolute right-0 bottom-0 pointer-events-none select-none opacity-10">
                <Leaf size={80} rotate={160} color="white" opacity={1} />
              </div>

              <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Clock size={18} className="text-white" />
                </div>
                Opening Hours
              </h3>

              <div className="space-y-2 relative z-10">
                {business.opening_hours.map((h) => {
                  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
                  const isToday = h.day === todayName
                  return (
                    <div
                      key={h.day}
                      className={`flex justify-between items-center py-2 px-3 rounded-xl transition-colors ${
                        isToday ? 'bg-white/15' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8ab04b]" />
                        )}
                        <span className={`text-sm font-medium ${isToday ? 'text-white font-bold' : 'text-white/70'}`}>
                          {h.day}
                        </span>
                        {isToday && (
                          <span className="text-[10px] bg-[#8ab04b] text-white px-2 py-0.5 rounded-full font-bold">
                            Today
                          </span>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${h.closed ? 'text-white/40' : isToday ? 'text-white font-semibold' : 'text-white/70'}`}>
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
