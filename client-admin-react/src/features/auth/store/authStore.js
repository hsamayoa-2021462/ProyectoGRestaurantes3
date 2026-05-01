// src/features/auth/store/authStore.js
import { create } from 'zustand'
import { authAPI } from '../../../shared/api/auth'

const extractError = (err, fallback) => {
  const data = err.response?.data
  if (!data) return fallback
  if (Array.isArray(data.errors)) return data.errors.map(e => e.msg).join(' · ')
  if (data.message) return data.message
  if (typeof data === 'string') return data
  return fallback
}

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
    return null
  }
  try {
    return JSON.parse(storedUser)
  } catch (e) {
    console.error('Error parsing user:', e)
    localStorage.removeItem('user')
    return null
  }
}

const transformUserData = (userDetails) => {
  let rol = 'cliente'
  if (userDetails.role === 'ADMIN_ROLE') {
    rol = 'admin'
  } else if (userDetails.role === 'USER_ROLE') {
    rol = 'cliente'
  }
  
  return {
    id: userDetails.id,
    username: userDetails.username,
    name: userDetails.name || userDetails.username?.split('@')[0] || 'Usuario',
    surname: userDetails.surname || '',
    email: userDetails.email || '',
    phone: userDetails.phone || '',
    profilePicture: userDetails.profilePicture,
    rol: rol,
    role: userDetails.role
  }
}

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  initAuth: () => {
    const token = localStorage.getItem('token')
    const user = getStoredUser()
    if (token && user) {
      set({ token, user })
      console.log('Auth inicializado:', user)
    }
  },

  login: async ({ emailOrUsername, password }) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authAPI.login({ emailOrUsername, password })
      const { data } = response
      
      console.log('Respuesta del servidor:', data)
      
      if (!data.userDetails) {
        throw new Error('El servidor no devolvió datos de usuario')
      }
      
      const userData = data.userDetails
      const transformedUser = transformUserData(userData)
      
      console.log('Usuario transformado:', transformedUser)
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(transformedUser))
      
      set({ 
        user: transformedUser, 
        token: data.token, 
        isLoading: false,
        error: null
      })
      
      return { success: true, user: transformedUser }
    } catch (err) {
      const msg = extractError(err, 'Error al iniciar sesión')
      console.error('Error en login:', err)
      set({ error: msg, isLoading: false })
      return { success: false, message: msg }
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authAPI.register(userData)
      set({ isLoading: false })
      return { success: true, message: data.message }
    } catch (err) {
      const msg = extractError(err, 'Error al registrarse')
      set({ error: msg, isLoading: false })
      return { success: false, message: msg }
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authAPI.verifyEmail(token)
      set({ isLoading: false })
      return { success: true, message: data.message }
    } catch (err) {
      const msg = extractError(err, 'Token inválido o expirado')
      set({ error: msg, isLoading: false })
      return { success: false, message: msg }
    }
  },

  resendVerification: async (email) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authAPI.resendVerification(email)
      set({ isLoading: false })
      return { success: true, message: data.message }
    } catch (err) {
      const msg = extractError(err, 'Error al reenviar verificación')
      set({ error: msg, isLoading: false })
      return { success: false, message: msg }
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authAPI.forgotPassword(email)
      set({ isLoading: false })
      return { success: true, message: data.message }
    } catch (err) {
      const msg = extractError(err, 'Error al enviar correo')
      set({ error: msg, isLoading: false })
      return { success: false, message: msg }
    }
  },

  resetPassword: async ({ token, newPassword }) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authAPI.resetPassword({ token, newPassword })
      set({ isLoading: false })
      return { success: true, message: data.message }
    } catch (err) {
      const msg = extractError(err, 'Error al restablecer contraseña')
      set({ error: msg, isLoading: false })
      return { success: false, message: msg }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, error: null })
    window.location.href = '/auth'
  },

  clearError: () => set({ error: null }),
}))