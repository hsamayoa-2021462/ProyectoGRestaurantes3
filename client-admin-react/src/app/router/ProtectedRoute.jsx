// src/app/router/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore'

export default function ProtectedRoute({ allowedRoles }) {
  const { token, user } = useAuthStore()

  // Sin token → login
  if (!token) return <Navigate to="/auth" replace />

  // Sin usuario aún (raro pero seguro)
  if (!user) return <Navigate to="/auth" replace />

  // Rol no permitido → redirige a su vista
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to={user.rol === 'admin' ? '/admin' : '/cliente/inicio'} replace />
  }

  return <Outlet />
}