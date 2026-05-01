import api from './api'

export const authAPI = {
  // POST /auth/register — form-data (multipart) con profilePicture opcional
  register: ({ name, surname, username, email, password, phone, profilePicture }) => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('surname', surname)
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('phone', phone)
    if (profilePicture) formData.append('profilePicture', profilePicture)
    // axios detecta FormData y pone multipart/form-data automáticamente
    return api.post('/auth/register', formData)
  },

  // POST /auth/login — acepta email o username en el campo emailOrUsername
  login: ({ emailOrUsername, password }) =>
    api.post('/auth/login', { emailOrUsername, password }),

  // POST /auth/verify-email
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),

  // POST /auth/resend-verification
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),

  // POST /auth/forgot-password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  // POST /auth/reset-password — campo es "newPassword" (no "password")
  resetPassword: ({ token, newPassword }) =>
    api.post('/auth/reset-password', { token, newPassword }),

  // GET /auth/users-list
  getUsersList: () => api.get('/auth/users-list'),
}