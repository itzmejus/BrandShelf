import { supabase } from '../lib/supabase'

export const checklistLeadService = {
  async submitEmail(email: string): Promise<void> {
    const { error } = await supabase.from('checklist_leads').insert({ email })
    if (error) throw error
  },
}
