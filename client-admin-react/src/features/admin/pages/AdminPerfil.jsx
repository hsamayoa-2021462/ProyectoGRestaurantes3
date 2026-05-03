// src/features/admin/pages/AdminPerfil.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api from '../../../shared/api/api'

/* ─── ICONS ─── */
const IconMenu = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" />
    </svg>
)
const IconOrders = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
)
const IconTable = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
)
const IconRestaurant = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" />
    </svg>
)
const IconReport = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
)
const IconLogout = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
)
const IconDashboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
)
const IconUsers = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
)
const IconChevron = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
)
const IconCamera = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
)
const IconUser = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
)
const IconShield = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)
const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)
const IconBell = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
)

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: <IconDashboard />, path: '/admin' },
    { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/admin/menu' },
    { key: 'pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/admin/pedidos' },
    { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />, path: '/admin/reservaciones' },
    { key: 'restaurantes', label: 'Restaurantes', icon: <IconRestaurant />, path: '/admin/restaurantes' },
    { key: 'clientes', label: 'Clientes', icon: <IconUsers />, path: '/admin/clientes' },
    { key: 'reportes', label: 'Reportes', icon: <IconReport />, path: '/admin/reportes' },
]

export default function AdminPerfil() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { user, logout, setUser } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const fileInputRef = useRef(null)

    const [profileData, setProfileData] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState(null) // { type: 'success'|'error', text }
    const [previewUrl, setPreviewUrl] = useState(null)

    const getActiveKey = () => {
        const item = NAV_ITEMS.find(i => i.path === location.pathname)
        return item ? item.key : 'dashboard'
    }
    const [activeNav, setActiveNav] = useState(getActiveKey())

    useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

    const handleNavClick = (path, key) => {
        setActiveNav(key)
        navigate(path)
    }

    // Cargar perfil fresco del backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile')
                const userData = response.data?.data || response.data
                setProfileData(userData && userData.id ? userData : user)
                setPreviewUrl(null)
            } catch {
                setProfileData(user)
            }
        }
        fetchProfile()
    }, [])

    // Manejar selección de imagen
    const handleFileSelect = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Preview inmediato
        const reader = new FileReader()
        reader.onload = (ev) => setPreviewUrl(ev.target.result)
        reader.readAsDataURL(file)

        // Subir al backend
        setUploading(true)
        setUploadMsg(null)

        try {
            const formData = new FormData()
            formData.append('profilePicture', file)

            const response = await api.put('/auth/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const newUrl = response.data?.data?.profilePicture
            if (newUrl) {
                // Actualizar el store global para que el avatar del sidebar se actualice también
                if (setUser) setUser({ ...user, profilePicture: newUrl })
                setProfileData(prev => ({ ...prev, profilePicture: newUrl }))
                setPreviewUrl(newUrl)
            }
            setUploadMsg({ type: 'success', text: 'Foto actualizada exitosamente' })
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'No se pudo subir la imagen'
            setUploadMsg({ type: 'error', text: msg })
            setPreviewUrl(null) // Revertir preview
        } finally {
            setUploading(false)
            // Limpiar el input para permitir seleccionar el mismo archivo
            if (fileInputRef.current) fileInputRef.current.value = ''
            // Limpiar mensaje después de 4s
            setTimeout(() => setUploadMsg(null), 4000)
        }
    }

    const currentUser = profileData || user
    const avatarSrc = previewUrl || currentUser?.profilePicture
    const initials = currentUser?.name?.[0]?.toUpperCase() || 'A'

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:      #07080a;
          --deep:       #0d0f12;
          --surface:    #12151a;
          --glass-bg:   rgba(255,255,255,0.045);
          --glass-bd:   rgba(255,255,255,0.09);
          --glass-hi:   rgba(255,255,255,0.13);
          --gold:       #c9a84c;
          --gold-lt:    #e8c96a;
          --gold-glow:  rgba(201,168,76,.22);
          --gold-dim:   rgba(201,168,76,.08);
          --text:       #f0ead8;
          --text-mid:   #9a9385;
          --text-muted: #5a554d;
          --success:    #4caf82;
          --error:      #e05a5a;
          --radius-card: 20px;
          --radius-inp:  11px;
          --blur:        blur(24px) saturate(180%);
          --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
          --sidebar-w: 240px;
        }

        body { font-family: 'Outfit', sans-serif; background: var(--black); color: var(--text); min-height: 100vh; overflow-x: hidden; }

        .admin-layout { display: flex; min-height: 100vh; }

        .admin-sidebar {
          width: var(--sidebar-w);
          background: var(--deep);
          border-right: 1px solid var(--glass-bd);
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 100;
          transition: width .3s var(--ease-out-expo);
          overflow: hidden;
        }
        .admin-sidebar.collapsed { width: 64px; }

        .sidebar-brand {
          padding: 24px 20px 20px;
          border-bottom: 1px solid var(--glass-bd);
          display: flex; align-items: center; gap: 12px;
          flex-shrink: 0; min-height: 80px; position: relative;
        }
        .sidebar-brand::after {
          content: ''; position: absolute; bottom: -1px; left: 0;
          width: 80px; height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .brand-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(201,168,76,.2), rgba(201,168,76,.05));
          border: 1px solid rgba(201,168,76,.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--gold);
          box-shadow: 0 0 16px rgba(201,168,76,.1);
        }
        .brand-text { overflow: hidden; white-space: nowrap; }
        .brand-text-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 500;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--text); display: block; line-height: 1;
        }
        .brand-text-role {
          font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--gold); opacity: .7; display: block; margin-top: 3px;
        }

        .sidebar-nav { flex: 1; padding: 16px 10px; overflow-y: auto; overflow-x: hidden; }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: var(--glass-bd); border-radius: 2px; }

        .nav-label {
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--text-muted); padding: 0 10px; margin: 16px 0 8px;
          white-space: nowrap; overflow: hidden; transition: opacity .2s;
        }
        .admin-sidebar.collapsed .nav-label { opacity: 0; }

        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 10px; border-radius: 10px; cursor: pointer;
          color: var(--text-mid); font-size: 13.5px; font-weight: 400;
          letter-spacing: .3px; transition: all .2s; position: relative;
          white-space: nowrap; margin-bottom: 2px;
        }
        .nav-item:hover { background: var(--glass-bg); color: var(--text); }
        .nav-item.active {
          background: var(--gold-dim); color: var(--gold-lt);
          border: 1px solid rgba(201,168,76,.15);
        }
        .nav-item.active::before {
          content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 2px; border-radius: 2px; background: var(--gold);
        }
        .nav-icon { flex-shrink: 0; display: flex; }
        .nav-text { overflow: hidden; transition: opacity .2s, width .3s; }
        .admin-sidebar.collapsed .nav-text { opacity: 0; width: 0; }

        .sidebar-footer { padding: 16px 10px; border-top: 1px solid var(--glass-bd); }

        .user-card {
          display: flex; align-items: center; gap: 10px; padding: 10px;
          border-radius: 10px; background: var(--glass-bg);
          border: 1px solid var(--glass-bd); margin-bottom: 8px;
          overflow: hidden; cursor: pointer; transition: all .2s;
        }
        .user-card:hover {
          background: var(--gold-dim);
          border-color: rgba(201,168,76,.25);
        }
        .user-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, rgba(201,168,76,.3), rgba(201,168,76,.1));
          border: 1px solid rgba(201,168,76,.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: var(--gold-lt);
          flex-shrink: 0; font-family: 'Cormorant Garamond', serif;
          overflow: hidden;
        }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .user-info { overflow: hidden; }
        .user-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 10px; color: var(--gold); letter-spacing: .5px; text-transform: uppercase; }
        .admin-sidebar.collapsed .user-info { display: none; }

        .logout-btn {
          display: flex; align-items: center; gap: 10px; padding: 9px 10px;
          border-radius: 10px; background: none; border: none;
          color: var(--text-muted); cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 13px; width: 100%;
          transition: all .2s; white-space: nowrap;
        }
        .logout-btn:hover { background: rgba(224,90,90,.08); color: var(--error); }
        .admin-sidebar.collapsed .logout-btn span { display: none; }

        .sidebar-toggle {
          position: absolute; top: 50%; right: -12px;
          transform: translateY(-50%);
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--deep); border: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-muted); transition: all .2s;
          z-index: 101; flex-shrink: 0;
        }
        .sidebar-toggle:hover { color: var(--gold); border-color: rgba(201,168,76,.3); }
        .sidebar-toggle svg { transition: transform .3s; }
        .admin-sidebar.collapsed .sidebar-toggle svg { transform: rotate(180deg); }

        .admin-main {
          flex: 1; margin-left: var(--sidebar-w);
          transition: margin-left .3s var(--ease-out-expo);
          min-height: 100vh; display: flex; flex-direction: column;
        }
        .admin-main.collapsed { margin-left: 64px; }

        .admin-topbar {
          height: 64px; background: var(--deep);
          border-bottom: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; position: sticky; top: 0; z-index: 50;
        }
        .topbar-left { display: flex; flex-direction: column; }
        .topbar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 500;
          letter-spacing: .5px; color: var(--text);
        }
        .topbar-breadcrumb { font-size: 11px; color: var(--text-muted); letter-spacing: .3px; }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .topbar-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); cursor: pointer; transition: all .2s;
        }
        .topbar-btn:hover { color: var(--gold); border-color: rgba(201,168,76,.2); }
        .topbar-date {
          font-size: 12px; color: var(--text-muted);
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          border-radius: 8px; padding: 6px 12px;
        }

        .admin-content { padding: 32px; flex: 1; }

        /* ── PERFIL CONTENT ── */
        .perfil-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 24px;
          max-width: 1000px;
        }

        .perfil-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-bd);
          border-radius: var(--radius-card);
          overflow: hidden;
          position: relative;
        }
        .perfil-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 60px; height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .perfil-card::after {
          content: ''; position: absolute; top: 0; left: 0;
          width: 1px; height: 60px;
          background: linear-gradient(180deg, var(--gold), transparent);
        }

        .card-header {
          display: flex; align-items: center; gap: 10px;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--glass-bd);
        }
        .card-header-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--gold-dim);
          border: 1px solid rgba(201,168,76,.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
        }
        .card-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 500; color: var(--text);
          letter-spacing: .3px;
        }
        .card-body { padding: 24px; }

        /* AVATAR SECTION */
        .avatar-section {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; padding: 32px 24px;
          border-bottom: 1px solid var(--glass-bd);
        }
        .avatar-wrap {
          position: relative; width: 110px; height: 110px;
        }
        .avatar-img {
          width: 110px; height: 110px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(201,168,76,.3), rgba(201,168,76,.1));
          border: 2px solid rgba(201,168,76,.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px; font-weight: 500; color: var(--gold-lt);
          overflow: hidden; position: relative;
          box-shadow: 0 0 30px rgba(201,168,76,.12);
        }
        .avatar-img img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-camera-btn {
          position: absolute; bottom: 4px; right: 4px;
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--gold);
          border: 2px solid var(--deep);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--black);
          transition: all .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,.4);
        }
        .avatar-camera-btn:hover { background: var(--gold-lt); transform: scale(1.1); }
        .avatar-camera-btn.loading {
          background: rgba(201,168,76,.4);
          cursor: not-allowed;
          animation: pulse 1s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }

        .avatar-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 500;
          color: var(--text); letter-spacing: .5px;
          text-align: center;
        }
        .avatar-username {
          font-size: 13px; color: var(--text-mid);
          letter-spacing: .3px;
        }
        .avatar-role-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 20px;
          background: var(--gold-dim);
          border: 1px solid rgba(201,168,76,.2);
          font-size: 11px; letter-spacing: 1px;
          text-transform: uppercase; color: var(--gold);
        }

        /* UPLOAD MESSAGE */
        .upload-msg {
          margin: 0 24px 12px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          display: flex; align-items: center; gap: 8px;
          animation: slideIn .3s ease;
        }
        @keyframes slideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .upload-msg.success {
          background: rgba(76,175,130,.1);
          border: 1px solid rgba(76,175,130,.25);
          color: var(--success);
        }
        .upload-msg.error {
          background: rgba(224,90,90,.1);
          border: 1px solid rgba(224,90,90,.25);
          color: var(--error);
        }

        /* FIELDS */
        .field-group { display: flex; flex-direction: column; gap: 16px; }
        .field-item { display: flex; flex-direction: column; gap: 5px; }
        .field-label {
          font-size: 10px; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--text-muted);
          font-weight: 500;
        }
        .field-value {
          font-size: 14px; color: var(--text);
          background: rgba(255,255,255,.03);
          border: 1px solid var(--glass-bd);
          border-radius: var(--radius-inp);
          padding: 10px 14px;
          letter-spacing: .2px;
        }
        .field-value.empty { color: var(--text-muted); font-style: italic; }

        /* SECURITY */
        .security-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,.04);
        }
        .security-item:last-child { border-bottom: none; }
        .security-label { font-size: 13px; color: var(--text-mid); }
        .security-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 400;
        }
        .security-badge.verified {
          background: rgba(76,175,130,.1);
          border: 1px solid rgba(76,175,130,.25);
          color: var(--success);
        }
        .security-badge.unverified {
          background: rgba(224,90,90,.1);
          border: 1px solid rgba(224,90,90,.25);
          color: var(--error);
        }
        .security-badge.role {
          background: var(--gold-dim);
          border: 1px solid rgba(201,168,76,.2);
          color: var(--gold);
          text-transform: uppercase; letter-spacing: .5px;
        }

        /* RIGHT COLUMN */
        .right-col { display: flex; flex-direction: column; gap: 20px; }
      `}</style>

            <div className="admin-layout">
                {/* ── SIDEBAR ── */}
                <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <IconChevron />
                    </button>
                    <div className="sidebar-brand">
                        <div className="brand-icon"><IconMenu /></div>
                        <div className="brand-text">
                            <span className="brand-text-name">Restaurante</span>
                            <span className="brand-text-role">Admin Panel</span>
                        </div>
                    </div>
                    <nav className="sidebar-nav">
                        <div className="nav-label">Principal</div>
                        {NAV_ITEMS.map(item => (
                            <div
                                key={item.key}
                                className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.path, item.key)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.label}</span>
                            </div>
                        ))}
                    </nav>
                    <div className="sidebar-footer">
                        <div className="user-card" onClick={() => navigate('/admin/perfil')}>
                            <div className="user-avatar">
                                {avatarSrc
                                    ? <img src={avatarSrc} alt="avatar" />
                                    : initials}
                            </div>
                            <div className="user-info">
                                <div className="user-name">{currentUser?.name || 'Admin'}</div>
                                <div className="user-role">Administrador</div>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={logout}>
                            <IconLogout />
                            <span>Cerrar sesión</span>
                        </button>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <main className={`admin-main ${sidebarOpen ? '' : 'collapsed'}`}>
                    <header className="admin-topbar">
                        <div className="topbar-left">
                            <span className="topbar-title">Mi Perfil</span>
                            <span className="topbar-breadcrumb">Panel de control · Perfil del administrador</span>
                        </div>
                        <div className="topbar-right">
                            <div className="topbar-date">
                                {new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                            <button className="topbar-btn"><IconBell /></button>
                        </div>
                    </header>

                    <div className="admin-content">
                        {/* Input oculto para subir imagen */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />

                        <div className="perfil-grid">
                            {/* ── COLUMNA IZQUIERDA: Avatar + Seguridad ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                                {/* AVATAR CARD */}
                                <div className="perfil-card">
                                    <div className="avatar-section">
                                        <div className="avatar-wrap">
                                            <div className="avatar-img">
                                                {avatarSrc
                                                    ? <img src={avatarSrc} alt="Foto de perfil" />
                                                    : initials}
                                            </div>
                                            <button
                                                className={`avatar-camera-btn ${uploading ? 'loading' : ''}`}
                                                onClick={() => !uploading && fileInputRef.current?.click()}
                                                title="Cambiar foto de perfil"
                                            >
                                                {uploading
                                                    ? <span style={{ fontSize: 10 }}>...</span>
                                                    : <IconCamera />}
                                            </button>
                                        </div>
                                        <div className="avatar-name">
                                            {currentUser?.name || '—'} {currentUser?.surname || ''}
                                        </div>
                                        <div className="avatar-username">@{currentUser?.username || '—'}</div>
                                        <div className="avatar-role-badge">
                                            ⚡ Administrador
                                        </div>
                                    </div>

                                    {/* Mensaje de upload */}
                                    {uploadMsg && (
                                        <div className={`upload-msg ${uploadMsg.type}`}>
                                            {uploadMsg.type === 'success' ? <IconCheck /> : '✕'}
                                            {uploadMsg.text}
                                        </div>
                                    )}
                                </div>

                                {/* SEGURIDAD CARD */}
                                <div className="perfil-card">
                                    <div className="card-header">
                                        <div className="card-header-icon"><IconShield /></div>
                                        <span className="card-header-title">Seguridad</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="security-item">
                                            <span className="security-label">Email verificado</span>
                                            <span className={`security-badge ${currentUser?.isEmailVerified ? 'verified' : 'unverified'}`}>
                                                {currentUser?.isEmailVerified ? <><IconCheck /> Verificado</> : '✕ Sin verificar'}
                                            </span>
                                        </div>
                                        <div className="security-item">
                                            <span className="security-label">Rol de cuenta</span>
                                            <span className="security-badge role">
                                                {currentUser?.role === 'ADMIN_ROLE' ? 'Administrador' : currentUser?.role || '—'}
                                            </span>
                                        </div>
                                        <div className="security-item">
                                            <span className="security-label">Estado de cuenta</span>
                                            <span className={`security-badge ${currentUser?.status === 'active' || currentUser?.status === 'ACTIVE' ? 'verified' : 'unverified'}`}>
                                                {currentUser?.status === 'active' || currentUser?.status === 'ACTIVE' ? <><IconCheck /> Activa</> : currentUser?.status || '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── COLUMNA DERECHA: Información personal ── */}
                            <div className="right-col">
                                <div className="perfil-card">
                                    <div className="card-header">
                                        <div className="card-header-icon"><IconUser /></div>
                                        <span className="card-header-title">Información Personal</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="field-group">
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div className="field-item">
                                                    <span className="field-label">Nombre</span>
                                                    <div className={`field-value ${!currentUser?.name ? 'empty' : ''}`}>
                                                        {currentUser?.name || 'Sin registrar'}
                                                    </div>
                                                </div>
                                                <div className="field-item">
                                                    <span className="field-label">Apellido</span>
                                                    <div className={`field-value ${!currentUser?.surname ? 'empty' : ''}`}>
                                                        {currentUser?.surname || 'Sin registrar'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="field-item">
                                                <span className="field-label">Nombre de usuario</span>
                                                <div className={`field-value ${!currentUser?.username ? 'empty' : ''}`}>
                                                    {currentUser?.username ? `@${currentUser.username}` : 'Sin registrar'}
                                                </div>
                                            </div>

                                            <div className="field-item">
                                                <span className="field-label">Correo electrónico</span>
                                                <div className={`field-value ${!currentUser?.email ? 'empty' : ''}`}>
                                                    {currentUser?.email || 'Sin registrar'}
                                                </div>
                                            </div>

                                            <div className="field-item">
                                                <span className="field-label">Teléfono</span>
                                                <div className={`field-value ${!currentUser?.phone ? 'empty' : ''}`}>
                                                    {currentUser?.phone || 'Sin registrar'}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div className="field-item">
                                                    <span className="field-label">Miembro desde</span>
                                                    <div className="field-value">
                                                        {currentUser?.createdAt
                                                            ? new Date(currentUser.createdAt).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })
                                                            : '—'}
                                                    </div>
                                                </div>
                                                <div className="field-item">
                                                    <span className="field-label">Última actualización</span>
                                                    <div className="field-value">
                                                        {currentUser?.updatedAt
                                                            ? new Date(currentUser.updatedAt).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })
                                                            : '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
