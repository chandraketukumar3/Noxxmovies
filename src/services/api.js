import axios from "axios"
import { supabase } from "./supabaseClient"

// Backend URL
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "https://noxxmoviesbackend.vercel.app/api");

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add Supabase token
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch (err) {
      console.error('Error getting session for interceptor:', err)
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api