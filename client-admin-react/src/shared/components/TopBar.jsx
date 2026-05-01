// src/shared/components/TopBar.jsx
import { useAuthStore } from '../../features/auth/store/authStore'

export default function TopBar({ title, subtitle }) {
  const { user } = useAuthStore()

  // Obtener iniciales del nombre
  const getInitials = () => {
    if (!user?.name) return 'U'
    return user.name.charAt(0).toUpperCase()
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <span>🔍</span>
          <input type="text" placeholder="Buscar..." />
        </div>

        <div className="topbar-user">
          <div className="topbar-avatar">
            {getInitials()}
          </div>
          <div>
            <span className="topbar-user-name">
              {user?.name} {user?.surname}
            </span>
            <span className="topbar-user-email">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}