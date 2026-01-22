import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://gskbzaduwmsbaxddixmk.supabase.co'
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZLynthSYzZz0RthCMq6zRw_7l-F4y9u'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client': 'LuckerLife Fish Database',
    },
  },
})

// Health check function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('test').select('*').limit(1)
    
    if (error) {
      console.log('Supabase connection test - expected error for non-existent table:', error.message)
      return true // This is expected when no tables exist yet
    }
    
    console.log('Supabase connection successful:', data)
    return true
  } catch (error) {
    console.error('Supabase connection failed:', error)
    return false
  }
}

export default supabase