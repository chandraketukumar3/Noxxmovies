import { supabase } from './supabaseClient'

// Register user
export const register = async (userData) => {
  const { email, password, name } = userData
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })
  
  if (error) throw error
  return data.user
}

// Login user
export const login = async (userData) => {
  const { email, password } = userData
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data.user
}

// Logout user
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Get current user
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}
