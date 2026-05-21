import axios from 'axios'

// Cliente para ms-restaurante (puerto 3006)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3006/api/v1',
})

// Cliente para ms-auth (puerto 3005)
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || 'http://localhost:3005/api/v1',
})

// Interceptor para ms-restaurante
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor para ms-auth
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Manejo de 401 en ms-restaurante
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// Manejo de 401 en ms-auth
authApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api