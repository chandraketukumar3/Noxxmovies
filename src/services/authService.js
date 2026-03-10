import { supabase } from './supabaseClient'

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data.user
}

export const register = async ({ email, password, name }) => {
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

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const updateProfile = async (userData) => {
  const { data, error } = await supabase.auth.updateUser({
    data: userData
  })
  if (error) throw error
  return data.user
}

export const updatePassword = async (password) => {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}
