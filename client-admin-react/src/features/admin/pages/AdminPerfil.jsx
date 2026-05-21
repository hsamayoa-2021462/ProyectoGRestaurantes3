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
const IconCamera = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
const IconShield = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const IconUser = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const IconCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
const IconArrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>

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
    const { user, logout, setUser } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const fileInputRef = useRef(null)

    const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || ''
    const [activeNav, setActiveNav] = useState(getActiveKey())
    useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])
    const handleNavClick = (path, key) => { setActiveNav(key); navigate(path) }

    const [profileData, setProfileData] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(true)

    // ── Cargar perfil desde ms-auth ──
    useEffect(() => {
        const fetchProfile = async () => {
            setLoadingProfile(true)
            try {
                const res = await authApi.get('/auth/profile')
                const data = res.data?.data || res.data
                setProfileData(data)
            } catch {
                // Si falla, usa los datos del store
                setProfileData(user)
            } finally {
                setLoadingProfile(false)
            }
        }
        fetchProfile()
    }, [])

    // ── Subir foto de perfil ──
    const handleFileSelect = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Preview inmediato
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

    // Formatear fecha
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
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}
        .layout{display:flex;min-height:100vh}

        /* SIDEBAR */
        .sidebar{width:var(--sidebar-w);background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:width .3s var(--ease-out-expo);overflow:hidden}
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
        .ni-icon{flex-shrink:0;display:flex}
        .ni-text{overflow:hidden;transition:opacity .2s,width .3s}
        .sidebar.col .ni-text{opacity:0;width:0}
        .sb-footer{padding:16px 10px;border-top:1px solid var(--glass-bd)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:var(--glass-bg);border:1px solid rgba(201,168,76,.25);margin-bottom:8px;overflow:hidden}
        .sb-av{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold-lt);flex-shrink:0;font-family:'Cormorant Garamond',serif;overflow:hidden}
        .sb-av img{width:100%;height:100%;object-fit:cover;border-radius:7px}
        .sb-uinfo{overflow:hidden}
        .sb-uname{font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-urole{font-size:10px;color:var(--gold);letter-spacing:.5px;text-transform:uppercase}
        .sidebar.col .sb-uinfo{display:none}
        .sb-out{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;width:100%;transition:all .2s;white-space:nowrap}
        .sb-out:hover{background:rgba(224,90,90,.08);color:var(--error)}
        .sidebar.col .sb-out span{display:none}
        .sb-toggle{position:absolute;top:50%;right:-12px;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:var(--deep);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s;z-index:101}
        .sb-toggle:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}
        .sb-toggle svg{transition:transform .3s}
        .sidebar.col .sb-toggle svg{transform:rotate(180deg)}

        /* MAIN */
        .main{flex:1;margin-left:var(--sidebar-w);transition:margin-left .3s var(--ease-out-expo);min-height:100vh;display:flex;flex-direction:column}
        .main.col{margin-left:64px}
        .topbar{height:64px;background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:50}
        .topbar-left{display:flex;align-items:center;gap:12px}
        .back-btn{width:32px;height:32px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .back-btn:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}
        .topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.5px}
        .topbar-sub{font-size:11px;color:var(--text-muted)}
        .topbar-r{display:flex;align-items:center;gap:10px}
        .topbar-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .topbar-btn:hover{color:var(--gold)}
        .content{padding:32px;flex:1;max-width:900px}

        /* AVATAR SECTION */
        .profile-hero{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:32px;display:flex;align-items:center;gap:32px;margin-bottom:24px;position:relative;overflow:hidden}
        .profile-hero::before{content:'';position:absolute;top:0;left:0;width:200px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .profile-hero::after{content:'';position:absolute;top:0;left:0;width:1px;height:200px;background:linear-gradient(180deg,var(--gold),transparent)}
        .avatar-wrap{position:relative;flex-shrink:0}
        .avatar{width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:2px solid rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:500;color:var(--gold-lt);overflow:hidden}
        .avatar img{width:100%;height:100%;object-fit:cover}
        .camera-btn{position:absolute;bottom:-6px;right:-6px;width:30px;height:30px;border-radius:50%;background:var(--gold);border:2px solid var(--deep);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--black);transition:transform .2s}
        .camera-btn:hover{transform:scale(1.1)}
        .hero-info{flex:1}
        .hero-name{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--text);margin-bottom:4px}
        .hero-username{font-size:13px;color:var(--text-muted);margin-bottom:12px}
        .hero-badges{display:flex;gap:8px;flex-wrap:wrap}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:11px;border:1px solid}
        .badge-admin{background:var(--gold-dim);border-color:rgba(201,168,76,.3);color:var(--gold-lt)}
        .badge-verified{background:rgba(76,175,130,.1);border-color:rgba(76,175,130,.25);color:var(--success)}
        .badge-unverified{background:rgba(224,90,90,.1);border-color:rgba(224,90,90,.25);color:var(--error)}
        .badge-active{background:rgba(76,175,130,.1);border-color:rgba(76,175,130,.25);color:var(--success)}

        /* UPLOAD MSG */
        .upload-msg{padding:10px 14px;border-radius:10px;font-size:13px;display:flex;align-items:center;gap:8px;margin-top:12px;border:1px solid}
        .upload-msg.success{background:rgba(76,175,130,.1);border-color:rgba(76,175,130,.25);color:var(--success)}
        .upload-msg.error{background:rgba(224,90,90,.1);border-color:rgba(224,90,90,.25);color:var(--error)}

        /* INFO CARDS */
        .cards-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .info-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .info-card-header{padding:18px 22px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:10px}
        .info-card-icon{width:32px;height:32px;border-radius:8px;background:var(--gold-dim);border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;color:var(--gold)}
        .info-card-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500}
        .info-card-body{padding:18px 22px}
        .info-row{display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .info-row:last-child{border-bottom:none}
        .info-key{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px}
        .info-val{font-size:13px;color:var(--text);text-align:right;max-width:200px;word-break:break-word}
        .info-val.gold{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt)}

        /* FOTO BTN */
        .foto-section{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:22px;margin-top:24px}
        .foto-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500;margin-bottom:6px}
        .foto-sub{font-size:12px;color:var(--text-muted);margin-bottom:16px}
        .foto-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .btn-foto{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.08));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s}
        .btn-foto:hover{border-color:rgba(201,168,76,.6);transform:translateY(-1px)}
        .btn-foto:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .foto-hint{font-size:11px;color:var(--text-muted)}

        /* LOADING */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        @media(max-width:900px){.cards-grid{grid-template-columns:1fr}.profile-hero{flex-direction:column;text-align:center}.hero-badges{justify-content:center}.content{padding:20px}}
      `}</style>

            <div className="layout">
                {/* SIDEBAR */}
                <aside className={`sidebar ${sidebarOpen ? '' : 'col'}`}>
                    <button className="sb-toggle" onClick={() => setSidebarOpen(p => !p)}><IconChevron /></button>
                    <div className="sb-brand">
                        <div className="sb-icon"><IconRest /></div>
                        <div className="sb-text">
                            <span className="sb-name">Gastro</span>
                            <span className="sb-role">Admin Panel</span>
                        </div>
                    </div>
                    <nav className="sb-nav">
                        <div className="nav-lbl">Navegación</div>
                        {NAV_ITEMS.map(item => (
                            <div key={item.key} className={`ni ${activeNav === item.key ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.path, item.key)}>
                                <span className="ni-icon">{item.icon}</span>
                                <span className="ni-text">{item.label}</span>
                            </div>
                        ))}
                    </nav>
                    <div className="sb-footer">
                        <div className="sb-user">
                            <div className="sb-av">
                                {avatarSrc
                                    ? <img src={avatarSrc} alt="avatar" />
                                    : initials}
                            </div>
                            <div className="sb-uinfo">
                                <div className="sb-uname">{currentUser?.name || 'Admin'}</div>
                                <div className="sb-urole">Mi perfil</div>
                            </div>
                        </div>
                        <button className="sb-out" onClick={logout}><IconLogout /><span>Cerrar sesión</span></button>
                    </div>
                </aside>

                {/* MAIN */}
                <main className={`main ${sidebarOpen ? '' : 'col'}`}>
                    <header className="topbar">
                        <div className="topbar-left">
                            <button className="back-btn" onClick={() => navigate('/admin')}><IconArrow /></button>
                            <div>
                                <div className="topbar-title">Mi Perfil</div>
                                <div className="topbar-sub">Información de tu cuenta</div>
                            </div>
                        </div>
                        <div className="topbar-r">
                            <button className="topbar-btn"><IconBell /></button>
                        </div>
                    </header>

                    <div className="content">
                        {/* HERO */}
                        {loadingProfile ? (
                            <div className="profile-hero">
                                <div className="skel" style={{ width: 100, height: 100, borderRadius: 20, flexShrink: 0 }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div className="skel" style={{ height: 28, width: '50%' }} />
                                    <div className="skel" style={{ height: 16, width: '30%' }} />
                                    <div className="skel" style={{ height: 24, width: '40%' }} />
                                </div>
                            </div>
                        ) : (
                            <div className="profile-hero">
                                <div className="avatar-wrap">
                                    <div className="avatar">
                                        {avatarSrc
                                            ? <img src={avatarSrc} alt="avatar" />
                                            : initials}
                                    </div>
                                    <div className="camera-btn" onClick={() => fileInputRef.current?.click()}
                                        title="Cambiar foto">
                                        <IconCamera />
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                                        style={{ display: 'none' }} onChange={handleFileSelect} />
                                </div>

                                <div className="hero-info">
                                    <div className="hero-name">
                                        {currentUser?.name || '—'} {currentUser?.surname || ''}
                                    </div>
                                    <div className="hero-username">@{currentUser?.username || '—'}</div>
                                    <div className="hero-badges">
                                        <span className="badge badge-admin">
                                            <IconShield /> {currentUser?.role || 'ADMIN'}
                                        </span>
                                        {currentUser?.isEmailVerified
                                            ? <span className="badge badge-verified"><IconCheck /> Email verificado</span>
                                            : <span className="badge badge-unverified">Email no verificado</span>
                                        }
                                        {currentUser?.status !== false && (
                                            <span className="badge badge-active"><IconCheck /> Cuenta activa</span>
                                        )}
                                    </div>

                                    {uploadMsg && (
                                        <div className={`upload-msg ${uploadMsg.type}`}>
                                            {uploadMsg.type === 'success' ? <IconCheck /> : '⚠'}
                                            {uploadMsg.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* INFO CARDS */}
                        {!loadingProfile && (
                            <div className="cards-grid">
                                {/* Información personal */}
                                <div className="info-card">
                                    <div className="info-card-header">
                                        <div className="info-card-icon"><IconUser /></div>
                                        <div className="info-card-title">Información personal</div>
                                    </div>
                                    <div className="info-card-body">
                                        <div className="info-row">
                                            <span className="info-key">Nombre completo</span>
                                            <span className="info-val gold">
                                                {currentUser?.name || '—'} {currentUser?.surname || ''}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-key">Usuario</span>
                                            <span className="info-val">@{currentUser?.username || '—'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-key"><IconMail /> Email</span>
                                            <span className="info-val">{currentUser?.email || '—'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-key"><IconPhone /> Teléfono</span>
                                            <span className="info-val">{currentUser?.phone || '—'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Información de cuenta */}
                                <div className="info-card">
                                    <div className="info-card-header">
                                        <div className="info-card-icon"><IconShield /></div>
                                        <div className="info-card-title">Información de cuenta</div>
                                    </div>
                                    <div className="info-card-body">
                                        <div className="info-row">
                                            <span className="info-key">ID de usuario</span>
                                            <span className="info-val" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                {currentUser?.id || '—'}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-key">Rol</span>
                                            <span className="info-val gold">{currentUser?.role || '—'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-key">Estado</span>
                                            <span className="info-val" style={{ color: currentUser?.status ? 'var(--success)' : 'var(--error)' }}>
                                                {currentUser?.status ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-key">Email verificado</span>
                                            <span className="info-val" style={{ color: currentUser?.isEmailVerified ? 'var(--success)' : 'var(--error)' }}>
                                                {currentUser?.isEmailVerified ? 'Sí' : 'No'}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-key">Miembro desde</span>
                                            <span className="info-val">{fmtDate(currentUser?.createdAt)}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-key">Última actualización</span>
                                            <span className="info-val">{fmtDate(currentUser?.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CAMBIAR FOTO */}
                        {!loadingProfile && (
                            <div className="foto-section">
                                <div className="foto-title">Foto de perfil</div>
                                <div className="foto-sub">
                                    JPG, PNG o WEBP · Máximo 5MB · Se sube a Cloudinary automáticamente
                                </div>
                                <div className="foto-actions">
                                    <button className="btn-foto" disabled={uploading}
                                        onClick={() => fileInputRef.current?.click()}>
                                        <IconCamera />
                                        {uploading ? 'Subiendo...' : 'Cambiar foto'}
                                    </button>
                                    <span className="foto-hint">
                                        También puedes hacer click en el ícono de cámara sobre tu foto
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}