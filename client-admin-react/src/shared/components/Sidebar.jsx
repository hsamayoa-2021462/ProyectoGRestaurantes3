// src/shared/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore'

export default function Sidebar({ role }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/auth', { replace: true })
  }

  // Menú para admin
  const adminMenu = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/menu', icon: '🍽️', label: 'Menú' },
    { path: '/admin/pedidos', icon: '🛵', label: 'Pedidos' },
    { path: '/admin/reservaciones', icon: '📅', label: 'Reservaciones' },
    { path: '/admin/restaurantes', icon: '🏢', label: 'Restaurantes' },
    { path: '/admin/reportes', icon: '📈', label: 'Reportes' },
  ]

  // Menú para cliente
  const clienteMenu = [
    { path: '/cliente/inicio', icon: '🏠', label: 'Inicio' },
    { path: '/cliente/menu', icon: '🍽️', label: 'Menú' },
    { path: '/cliente/mis-pedidos', icon: '📦', label: 'Mis Pedidos' },
    { path: '/cliente/reservar', icon: '📅', label: 'Reservar Mesa' },
  ]

  const menuItems = role === 'admin' ? adminMenu : clienteMenu

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor"/>
          </svg>
        </div>
        <div>
          <span className="sidebar-brand-name">Restaurante</span>
          <span className="sidebar-brand-role">{role === 'admin' ? 'Admin Panel' : 'Cliente'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'sidebar-link sidebar-link--active' : 'sidebar-link'
            }
            end={item.path === '/admin' || item.path === '/cliente/inicio'}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} className="sidebar-logout">
        <span className="sidebar-link-icon">🚪</span>
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  )
}