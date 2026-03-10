import axios from "axios"

// Backend URL
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "https://noxxmoviesbackend.vercel.app/api");

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 60000, // 60 seconds to avoid Render cold-start timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout — backend may be waking up (Render cold start)")
    }

    if (error.response) {
      console.error("API Response Error:", error.response.data)
    } else {
      console.error("API Network Error:", error.message)
    }

    return Promise.reject(error)
  }
)

export default api