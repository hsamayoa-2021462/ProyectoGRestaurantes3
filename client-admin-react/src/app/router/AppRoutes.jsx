// src/app/router/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import AuthPage from '../../features/auth/pages/AuthPage'
import VerifyEmailPage from '../../features/auth/pages/VerifyEmailPage'
import ResetPasswordPage from '../../features/auth/pages/ResetPasswordPage'
import ProtectedRoute from './ProtectedRoute'
import { useAuthStore } from '../../features/auth/store/authStore'
  
// Admin pages
import AdminDashboard from '../../features/admin/pages/AdminDashboard'
import AdminMenu from '../../features/admin/pages/AdminMenu'
import AdminPedidos from '../../features/admin/pages/AdminPedidos'
import AdminReservaciones from '../../features/admin/pages/AdminReservaciones'
import AdminRestaurantes from '../../features/admin/pages/AdminRestaurantes'
import AdminReportes from '../../features/admin/pages/AdminReportes'
import AdminPerfil from '../../features/admin/pages/AdminPerfil'
import AdminClientes from '../../features/admin/pages/AdminClientes'
import AdminResenas from '../../features/admin/pages/AdminResenas'

// Cliente pages
import ClienteInicio from '../../features/cliente/pages/ClienteInicio'
import ClienteMenu from '../../features/cliente/pages/ClienteMenu'
import ClienteMisPedidos from '../../features/cliente/pages/ClienteMisPedidos'
import ClientePedido from '../../features/cliente/pages/ClientePedido'
import ClienteReservar from '../../features/cliente/pages/ClienteReservar'
import ClienteMisReservaciones from '../../features/cliente/pages/ClienteMisReservaciones'
import ClienteResenas from '../../features/cliente/pages/ClienteResenas'
import ClientePerfil from '../../features/cliente/pages/ClientePerfil'

export default function AppRoutes() {
  const { initAuth, user, token } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/reservaciones" element={<AdminReservaciones />} />
        <Route path="/admin/restaurantes" element={<AdminRestaurantes />} />
        <Route path="/admin/reportes" element={<AdminReportes />} />
        <Route path="/admin/perfil" element={<AdminPerfil />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/admin/resenas" element={<AdminResenas />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
        <Route path="/cliente/inicio" element={<ClienteInicio />} />
        <Route path="/cliente/menu" element={<ClienteMenu />} />
        <Route path="/cliente/mis-pedidos" element={<ClienteMisPedidos />} />
        <Route path="/cliente/pedido/:id" element={<ClientePedido />} />
        <Route path="/cliente/reservar" element={<ClienteReservar />} />
        <Route path="/cliente/mis-reservaciones" element={<ClienteMisReservaciones />} />
        <Route path="/cliente/resenas" element={<ClienteResenas />} />
        <Route path="/cliente/perfil" element={<ClientePerfil />} />
      </Route>

      <Route
        path="/"
        element={
          !token
            ? <Navigate to="/auth" replace />
            : user?.rol === 'admin'
              ? <Navigate to="/admin" replace />
              : <Navigate to="/cliente/inicio" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}