import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import { authApi } from '../../../shared/api/api'

/* ─── ICONS ─── */
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconRest = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const IconDash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
const IconCamera = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2 2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
const IconShield = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const IconUser = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const IconBurger = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: <IconDash />, path: '/admin' },
    { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/admin/menu' },
    { key: 'pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/admin/pedidos' },
    { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />, path: '/admin/reservaciones' },
    { key: 'restaurantes', label: 'Restaurantes', icon: <IconRest />, path: '/admin/restaurantes' },
    { key: 'clientes', label: 'Clientes', icon: <IconUsers />, path: '/admin/clientes' },
    { key: 'reportes', label: 'Reportes', icon: <IconReport />, path: '/admin/reportes' },
    { key: 'resenas',       label: 'Reseñas',        icon: <IconStar />,    path: '/admin/resenas' },
]

export default function AdminPerfil() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileOpen, setMobileOpen] = useState(false) // Mismo estado móvil que Dashboard
    const { user, logout, setUser } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const fileInputRef = useRef(null)

    const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || ''
    const [activeNav, setActiveNav] = useState(getActiveKey())
    useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])
    
    const handleNavClick = (path, key) => { 
        setActiveNav(key)
        setMobileOpen(false) // Cierra el menú al navegar
        navigate(path) 
    }

    const [profileData, setProfileData] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            setLoadingProfile(true)
            try {
                const res = await authApi.get('/auth/profile')
                const data = res.data?.data || res.data
                setProfileData(data)
            } catch {
                setProfileData(user)
            } finally {
                setLoadingProfile(false)
            }
        }
        fetchProfile()
    }, [])

    const handleFileSelect = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = ev => setPreviewUrl(ev.target.result)
        reader.readAsDataURL(file)

        setUploading(true)
        setUploadMsg(null)

        try {
            const formData = new FormData()
            formData.append('profilePicture', file)

            const res = await authApi.put('/auth/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const newUrl = res.data?.data?.profilePicture || res.data?.profilePicture
            if (newUrl) {
                if (setUser) setUser({ ...user, profilePicture: newUrl })
                setProfileData(prev => ({ ...prev, profilePicture: newUrl }))
                setPreviewUrl(newUrl)
            }
            setUploadMsg({ type: 'success', text: 'Foto actualizada exitosamente' })
        } catch (err) {
            const msg = err.response?.data?.message || 'No se pudo subir la imagen'
            setUploadMsg({ type: 'error', text: msg })
            setPreviewUrl(null)
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
            setTimeout(() => setUploadMsg(null), 4000)
        }
    }

    const currentUser = profileData || user
    const avatarSrc = previewUrl || currentUser?.profilePicture
    const initials = (currentUser?.name?.[0] || 'A').toUpperCase()

    const fmtDate = (iso) => {
        if (!iso) return '—'
        return new Date(iso).toLocaleDateString('es-GT', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --black:#07080a;--deep:#0d0f12;--surface:#12151a;
          --glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);--glass-hi:rgba(255,255,255,.13);
          --gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;
          --success:#4caf82;--error:#e05a5a;
          --radius-card:20px;--radius-inp:11px;
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
          --sidebar-w:240px;
        }
        html{overflow-x:hidden;width:100%}
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;width:100%;overflow-x:hidden}
        .layout{display:flex;min-height:100vh;width:100%;max-width:100vw;overflow-x:hidden;position:relative}

        /* SIDEBAR COMPLETO CON RESPONSIVIDAD */
        .sidebar{width:var(--sidebar-w);background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:width .3s var(--ease-out-expo), transform .3s var(--ease-out-expo);overflow:hidden}
        .sidebar.col{width:64px}
        .sb-brand{padding:24px 20px 20px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:80px;position:relative}
        .sb-brand::after{content:'';position:absolute;bottom:-1px;left:0;width:80px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .sb-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--gold)}
        .sb-text{overflow:hidden;white-space:nowrap}
        .sb-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text);display:block;line-height:1}
        .sb-role{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);opacity:.7;display:block;margin-top:3px}
        .sb-nav{flex:1;padding:16px 10px;overflow-y:auto;overflow-x:hidden}
        .nav-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);padding:0 10px;margin:16px 0 8px;white-space:nowrap;transition:opacity .2s}
        .sidebar.col .nav-lbl{opacity:0}
        .ni{display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13.5px;transition:all .2s;position:relative;white-space:nowrap;margin-bottom:2px}
        .ni:hover{background:var(--glass-bg);color:var(--text)}
        .ni.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.15)}
        .ni.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;border-radius:2px;background:var(--gold)}
        .ni-text{overflow:hidden;transition:opacity .2s, width .3s}
        .sidebar.col .ni-text{opacity:0;width:0}
        
        .sb-foot{padding:16px 10px;border-top:1px solid var(--glass-bd)}
        .u-card{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);margin-bottom:8px;overflow:hidden}
        .u-avatar{width:32px;height:32px;border-radius:8px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--gold-lt);flex-shrink:0;overflow:hidden}
        .u-avatar img{width:100%;height:100%;object-fit:cover}
        .u-info{overflow:hidden}
        .u-name{font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .u-role{font-size:10px;color:var(--gold)}
        .sidebar.col .u-info{display:none}
        
        .lg-btn{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-family:inherit;font-size:13px;width:100%;transition:all .2s}
        .lg-btn:hover{background:rgba(224,90,90,.08);color:#e08080}
        .sidebar.col .lg-text{opacity:0;width:0;overflow:hidden}

        /* BOTÓN FLOTANTE TRIGGER MÓVIL */
        .sidebar-toggle{position:absolute;right:-12px;top:28px;width:24px;height:24px;border-radius:5px;background:var(--deep);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:110;transition:transform .3s}
        .sidebar.col .sidebar-toggle{transform:rotate(180deg)}

        /* CONTENIDO PRINCIPAL */
        .main-wrapper{flex:1;min-width:0;max-width:100%;padding-left:var(--sidebar-w);transition:padding-left .3s var(--ease-out-expo)}
        .sidebar.col + .main-wrapper{padding-left:64px}
        
        .top-bar{height:80px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 40px;position:sticky;top:0;background:rgba(7,8,10,.7);backdrop-filter:var(--blur);z-index:90}
        .top-left{display:flex;align-items:center;gap:16px;min-width:0;overflow:hidden}
        
        /* HAMBURGUESA MÓVIL DISPLAY */
        .mobile-burger{display:none;background:none;border:none;color:var(--text-mid);cursor:pointer;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;border:1px solid var(--glass-bd);flex-shrink:0}
        .mobile-burger:hover{color:var(--text);background:var(--glass-bg)}

        .view-title{font-size:20px;font-weight:500;letter-spacing:.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .content-area{padding:40px;max-width:1200px;margin:0 auto;min-width:0;max-width:100%;overflow-x:hidden}

        /* RESPONSIVIDAD MEDIA QUERIES (Mapeado exacto de AdminDashboard) */
        @media(max-width:1024px){
          .sidebar{transform:translateX(-100%)}
          .sidebar.mobile-active{transform:translateX(0);width:var(--sidebar-w)!important}
          .sidebar.mobile-active .ni-text, .sidebar.mobile-active .u-info, .sidebar.mobile-active .lg-text{opacity:1!important;width:auto!important}
          .sidebar.mobile-active .nav-lbl{opacity:1!important}
          .main-wrapper, .sidebar.col + .main-wrapper{padding-left:0}
          .sidebar-toggle{display:none}
          .mobile-burger{display:flex}
          .top-bar{padding:0 24px}
          .content-area{padding:24px}
        }
        @media(max-width:768px) {
          .profile-grid{grid-template-columns:1fr!important}
          .top-bar{height:70px}
          .card-main{padding:28px}
          .info-grid{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}
        }
        @media(max-width:576px){
          .top-bar{padding:0 16px;height:64px}
          .view-title{font-size:17px}
          .content-area{padding:16px}
          .card-profile{padding:24px}
          .card-main{padding:20px}
          .section-title{font-size:18px;margin-bottom:24px}
          .info-grid{grid-template-columns:1fr;gap:16px;margin-bottom:28px}
          .avatar-container{width:96px;height:96px;font-size:34px}
          .foto-section{padding:18px}
        }

        .sidebar-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:95;display:none}
        @media(max-width:1024px){
          .sidebar-overlay.visible{display:block}
        }

        /* DETALLES DE VISTA */
        .profile-grid{display:grid;grid-template-columns:280px 1fr;gap:32px;align-items:start;min-width:0}
        .card-profile{background:var(--surface);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:32px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;min-width:0}
        .avatar-container{width:120px;height:120px;border-radius:30px;background:linear-gradient(135deg,rgba(201,168,76,.2),transparent);border:1px solid rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;font-size:44px;font-family:'Cormorant Garamond',serif;color:var(--gold-lt);margin-bottom:20px;position:relative;cursor:pointer;overflow:hidden;flex-shrink:0}
        .avatar-container img{width:100%;height:100%;object-fit:cover}
        .avatar-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;color:#fff}
        .avatar-container:hover .avatar-overlay{opacity:1}
        .p-name{font-size:18px;font-weight:500;color:var(--text);margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
        .p-role{font-size:11px;color:var(--gold);letter-spacing:1px;text-transform:uppercase;margin-bottom:24px}
        .p-meta{width:100%;border-top:1px solid var(--glass-bd);padding-top:20px;display:flex;flex-direction:column;gap:12px;text-align:left;min-width:0}
        .meta-item{display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--text-mid);min-width:0}
        .meta-item svg{color:var(--gold);flex-shrink:0}
        .meta-item span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
        .card-main{background:var(--surface);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:40px;min-width:0}
        .section-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;letter-spacing:1px;color:var(--gold-lt);margin-bottom:32px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--glass-bd);padding-bottom:12px}
        .info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;margin-bottom:40px;min-width:0}
        .info-box{display:flex;flex-direction:column;gap:6px;min-width:0}
        .info-lbl{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted)}
        .info-val{font-size:14px;color:var(--text);background:rgba(255,255,255,.02);padding:12px 16px;border-radius:var(--radius-inp);border:1px solid rgba(255,255,255,.04);min-height:45px;display:flex;align-items:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .foto-section{background:rgba(201,168,76,.03);border:1px dashed rgba(201,168,76,.2);border-radius:16px;padding:24px;display:flex;flex-direction:column;align-items:center;text-align:center}
        .foto-title{font-size:14px;font-weight:500;color:var(--gold-lt);margin-bottom:4px}
        .foto-sub{font-size:12px;color:var(--text-mid);margin-bottom:16px}
        .btn-foto{display:flex;align-items:center;gap:8px;background:var(--gold);color:var(--black);border:none;padding:10px 20px;border-radius:10px;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s}
        .btn-foto:hover:not(:disabled){background:var(--gold-lt);transform:translateY(-1px)}
        .btn-foto:disabled{opacity:.5;cursor:not-allowed}
        .foto-hint{font-size:11px;color:var(--text-muted);margin-top:8px}
        .msg-toast{padding:12px 16px;border-radius:10px;font-size:13px;margin-bottom:24px;width:100%;text-align:left;display:flex;align-items:center;gap:10px}
        .msg-toast.success{background:rgba(76,175,130,.1);border:1px solid rgba(76,175,130,.2);color:#7dd9ae}
        .msg-toast.error{background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.2);color:#e08080}
      `}</style>

            <div className="layout">
                {/* BACKDROP OVERLAY MÓVIL */}
                <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} 
                     onClick={() => setMobileOpen(false)} />

                {/* SIDEBAR */}
                <aside className={`sidebar ${!sidebarOpen ? 'col' : ''} ${mobileOpen ? 'mobile-active' : ''}`}>
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <IconChevron />
                    </button>

                    <div className="sb-brand">
                        <div className="sb-icon">R</div>
                        <div className="sb-text">
                            <span className="sb-name">Restaurante</span>
                            <span className="sb-role">Panel Admin</span>
                        </div>
                    </div>

                    <nav className="sb-nav">
                        <div className="nav-lbl">Navegación</div>
                        {NAV_ITEMS.map(item => (
                            <div key={item.key} 
                                 className={`ni ${activeNav === item.key ? 'active' : ''}`}
                                 onClick={() => handleNavClick(item.path, item.key)}>
                                <span className="ni-icon">{item.icon}</span>
                                <span className="ni-text">{item.label}</span>
                            </div>
                        ))}
                    </nav>

                    <div className="sb-foot">
                        <div className="u-card">
                            <div className="u-avatar">
                                {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : initials}
                            </div>
                            <div className="u-info">
                                <div className="u-name">{currentUser?.name || 'Administrador'}</div>
                                <div className="u-role">Admin</div>
                            </div>
                        </div>
                        <button className="lg-btn" onClick={() => { setMobileOpen(false); logout(); navigate('/login'); }}>
                            <IconLogout />
                            <span className="lg-text">Cerrar Sesión</span>
                        </button>
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <div className="main-wrapper">
                    <header className="top-bar">
                        <div className="top-left">
                            {/* BOTÓN HAMBURGUESA MÓVIL */}
                            <button className="mobile-burger" onClick={() => setMobileOpen(!mobileOpen)}>
                                <IconBurger />
                            </button>
                            <h1 className="view-title">Mi Perfil</h1>
                        </div>
                    </header>

                    <main className="content-area">
                        {uploadMsg && (
                            <div className={`msg-toast ${uploadMsg.type}`}>
                                {uploadMsg.type === 'success' ? <IconCheck /> : '⚠️'}
                                {uploadMsg.text}
                            </div>
                        )}

                        <div className="profile-grid">
                            {/* CARD DE AVATAR */}
                            <div className="card-profile">
                                <div className="avatar-container" onClick={() => fileInputRef.current?.click()}>
                                    {avatarSrc ? <img src={avatarSrc} alt="profile" /> : initials}
                                    <div className="avatar-overlay">
                                        <IconCamera />
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }}
                                    accept="image/png, image/jpeg, image/webp" onChange={handleFileSelect} />

                                <h2 className="p-name">{currentUser?.name || '—'}</h2>
                                <p className="p-role">Administrador del Sistema</p>

                                <div className="p-meta">
                                    <div className="meta-item">
                                        <IconMail /> <span>{currentUser?.email || '—'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <IconShield /> <span>ID: {(currentUser?.uid || currentUser?._id || '—').substring(0, 10)}...</span>
                                    </div>
                                </div>
                            </div>

                            {/* INFORMACIÓN DEL PERFIL */}
                            <div className="card-main">
                                <h3 className="section-title">
                                    <IconUser /> Datos Generales
                                </h3>

                                <div className="info-grid">
                                    <div className="info-box">
                                        <span className="info-lbl">Nombre Completo</span>
                                        <div className="info-val">{currentUser?.name || '—'}</div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-lbl">Correo Electrónico</span>
                                        <div className="info-val">{currentUser?.email || '—'}</div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-lbl">Rol asignado</span>
                                        <div className="info-val">ADMIN_ROLE</div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-lbl">Cuenta Creada</span>
                                        <div className="info-val">{fmtDate(currentUser?.createdAt)}</div>
                                    </div>
                                </div>

                                {/* CAMBIAR FOTO SECCIÓN */}
                                {!loadingProfile && (
                                    <div className="foto-section">
                                        <div className="foto-title">Foto de perfil</div>
                                        <div className="foto-sub">
                                            JPG, PNG o WEBP · Máximo 5MB · Se sube automáticamente
                                        </div>
                                        <div className="foto-actions">
                                            <button className="btn-foto" disabled={uploading}
                                                onClick={() => fileInputRef.current?.click()}>
                                                <IconCamera />
                                                {uploading ? 'Subiendo...' : 'Cambiar foto'}
                                            </button>
                                        </div>
                                        <span className="foto-hint">
                                            También puedes hacer click sobre tu foto para actualizarla
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}