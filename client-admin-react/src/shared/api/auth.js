import { authApi } from './api'

export const authAPI = {
  register: ({ name, surname, username, email, password, phone, profilePicture }) => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('surname', surname)
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('phone', phone)
    if (profilePicture) formData.append('profilePicture', profilePicture)
    return authApi.post('/auth/register', formData)
  },

  login: ({ emailOrUsername, password }) =>
    authApi.post('/auth/login', { emailOrUsername, password }),

  verifyEmail: (token) =>
    authApi.post('/auth/verify-email', { token }),

  resendVerification: (email) =>
    authApi.post('/auth/resend-verification', { email }),

  forgotPassword: (email) =>
    authApi.post('/auth/forgot-password', { email }),

  resetPassword: ({ token, newPassword }) =>
    authApi.post('/auth/reset-password', { token, newPassword }),

  getUsersList: () =>
    authApi.get('/auth/users-list'),
}