import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key are missing. Client will fail on first access.')
}

let _supabase = null

export const supabase = new Proxy({}, {
  get(target, prop) {
    if (!_supabase) {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key are required to initialize the client.')
      }
      _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return _supabase[prop]
  }
})
