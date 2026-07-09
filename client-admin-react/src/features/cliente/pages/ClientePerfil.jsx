import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import { authApi } from '../../../shared/api/api'
import NotificacionesPanel from '../../../shared/components/NotificacionesPanel'

/* ─── ICONS ─── */
const IconHome    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IconMenu    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/></svg>
const IconOrders  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const IconTable   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
const IconStar    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconUser    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLogout  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
const IconCamera  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
const IconMail    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IconPhone   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const IconShield  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IconCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconRest    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
const IconBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>

const NAV_ITEMS = [
  { key: 'inicio',            label: 'Inicio',        icon: <IconHome />,   path: '/cliente/inicio' },
  { key: 'menu',              label: 'Menú',           icon: <IconMenu />,   path: '/cliente/menu' },
  { key: 'mis-pedidos',       label: 'Pedidos',   icon: <IconOrders />, path: '/cliente/mis-pedidos' },
  { key: 'reservar',          label: 'Reservar',       icon: <IconTable />,  path: '/cliente/reservar' },
  { key: 'mis-reservaciones', label: 'Reservas',  icon: <IconTable />,  path: '/cliente/mis-reservaciones' },
  { key: 'resenas',           label: 'Reseñas',        icon: <IconStar />,   path: '/cliente/resenas' },
  { key: 'perfil',            label: 'Perfil',      icon: <IconUser />,   path: '/cliente/perfil' },
]

export default function ClientePerfil() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'perfil'
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

  const [profileData, setProfileData]   = useState(null)
  const [previewUrl, setPreviewUrl]     = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [uploadMsg, setUploadMsg]       = useState(null)
  const [loading, setLoading]           = useState(true)
  const [menuOpen, setMenuOpen]         = useState(false)

  // ── Cargar perfil desde ms-auth ──
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await authApi.get('/auth/profile')
        setProfileData(res.data?.data || res.data)
      } catch {
        setProfileData(user)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // ── Subir foto ──
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
        setProfileData(prev => ({ ...prev, profilePicture: newUrl }))
        setPreviewUrl(newUrl)
      }
      setUploadMsg({ type: 'success', text: 'Foto actualizada exitosamente' })
    } catch (err) {
      setUploadMsg({ type: 'error', text: err.response?.data?.message || 'No se pudo subir la imagen' })
      setPreviewUrl(null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setUploadMsg(null), 4000)
    }
  }

  const currentUser = profileData || user
  const avatarSrc   = previewUrl || currentUser?.profilePicture
  const initials    = (currentUser?.name?.[0] || 'U').toUpperCase()

  const fmtDate = iso => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --black:#07080a;--deep:#0d0f12;--surface:#12151a;
          --glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);
          --gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;
          --success:#4caf82;--error:#e05a5a;
          --radius-card:20px;--radius-inp:11px;
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
          --nav-h:64px;
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}

        /* ── NAVBAR SUPERIOR ── */
        .navbar{position:fixed;top:0;left:0;right:0;height:var(--nav-h);background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:100}
        .navbar::after{content:'';position:absolute;bottom:-1px;left:0;width:200px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .nav-brand{display:flex;align-items:center;gap:10px;text-decoration:none;cursor:pointer}
        .nav-brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;color:var(--gold)}
        .nav-brand-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text)}
        .nav-links{display:flex;align-items:center;gap:4px}
        .nav-link{display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s;white-space:nowrap;text-decoration:none;border:none;background:none;font-family:'Outfit',sans-serif}
        .nav-link:hover{background:var(--glass-bg);color:var(--text)}
        .nav-link.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.15)}
        .nav-right{display:flex;align-items:center;gap:10px}
        .nav-avatar-wrap{position:relative}
        .nav-avatar{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--gold-lt);cursor:pointer;overflow:hidden;transition:border-color .2s}
        .nav-avatar:hover{border-color:rgba(201,168,76,.5)}
        .nav-avatar img{width:100%;height:100%;object-fit:cover}
        .nav-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:var(--deep);border:1px solid var(--glass-bd);border-radius:14px;padding:8px;min-width:180px;z-index:200;animation:fadeIn .15s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .nd-user{padding:10px 12px;border-bottom:1px solid var(--glass-bd);margin-bottom:6px}
        .nd-name{font-size:13px;font-weight:500;color:var(--text)}
        .nd-email{font-size:11px;color:var(--text-muted)}
        .nd-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s}
        .nd-item:hover{background:var(--glass-bg);color:var(--text)}
        .nd-item.danger:hover{background:rgba(224,90,90,.08);color:var(--error)}
        .nav-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .nav-btn:hover{color:var(--gold)}

        /* ── PAGE ── */
        .page{padding-top:var(--nav-h);min-height:100vh}
        .content{max-width:860px;margin:0 auto;padding:40px 24px}

        /* ── HERO ── */
        .hero{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:36px;display:flex;align-items:center;gap:32px;margin-bottom:28px;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;top:0;left:0;width:200px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .hero::after{content:'';position:absolute;top:0;left:0;width:1px;height:200px;background:linear-gradient(180deg,var(--gold),transparent)}
        .av-wrap{position:relative;flex-shrink:0}
        .avatar{width:100px;height:100px;border-radius:20px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:2px solid rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:500;color:var(--gold-lt);overflow:hidden}
        .avatar img{width:100%;height:100%;object-fit:cover}
        .cam-btn{position:absolute;bottom:-6px;right:-6px;width:30px;height:30px;border-radius:50%;background:var(--gold);border:2px solid var(--deep);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--black);transition:transform .2s}
        .cam-btn:hover{transform:scale(1.1)}
        .hero-info{flex:1}
        .hero-name{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--text);margin-bottom:4px}
        .hero-username{font-size:13px;color:var(--text-muted);margin-bottom:14px}
        .hero-badges{display:flex;gap:8px;flex-wrap:wrap}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:11px;border:1px solid}
        .badge-gold{background:var(--gold-dim);border-color:rgba(201,168,76,.3);color:var(--gold-lt)}
        .badge-green{background:rgba(76,175,130,.1);border-color:rgba(76,175,130,.25);color:var(--success)}
        .badge-red{background:rgba(224,90,90,.1);border-color:rgba(224,90,90,.25);color:var(--error)}
        .upload-msg{padding:10px 14px;border-radius:10px;font-size:13px;display:flex;align-items:center;gap:8px;margin-top:14px;border:1px solid}
        .upload-msg.success{background:rgba(76,175,130,.1);border-color:rgba(76,175,130,.25);color:var(--success)}
        .upload-msg.error{background:rgba(224,90,90,.1);border-color:rgba(224,90,90,.25);color:var(--error)}

        /* ── INFO CARDS ── */
        .cards-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
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

        /* ── FOTO SECTION ── */
        .foto-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:24px}
        .foto-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500;margin-bottom:6px}
        .foto-sub{font-size:12px;color:var(--text-muted);margin-bottom:16px}
        .foto-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .btn-foto{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.08));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s}
        .btn-foto:hover{border-color:rgba(201,168,76,.6);transform:translateY(-1px)}
        .btn-foto:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .foto-hint{font-size:11px;color:var(--text-muted)}

        /* ── SKELETON ── */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        @media(max-width:900px){.cards-grid{grid-template-columns:1fr}.hero{flex-direction:column;text-align:center}.hero-badges{justify-content:center}.content{padding:24px 16px}.nav-links{display:none}}
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/cliente/inicio')}>
          <div className="nav-brand-icon"><IconRest /></div>
          <span className="nav-brand-name">Gastro</span>
        </div>

        <div className="nav-links">
          {NAV_ITEMS.map(item => (
            <div key={item.key}
              className={`nav-link ${activeNav === item.key ? 'active' : ''}`}
              onClick={() => { setActiveNav(item.key); navigate(item.path) }}>
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>

        <div className="nav-right">
          <NotificacionesPanel isAdmin={false} />
          <div className="nav-avatar-wrap">
            <div className="nav-avatar" onClick={() => setMenuOpen(p => !p)}>
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" onError={e => e.target.style.display = 'none'} />
                : initials
              }
            </div>
            {menuOpen && (
              <div className="nav-dropdown">
                <div className="nd-user">
                  <div className="nd-name">{currentUser?.name || 'Usuario'}</div>
                  <div className="nd-email">{currentUser?.email || ''}</div>
                </div>
                <div className="nd-item" onClick={() => { setMenuOpen(false); navigate('/cliente/perfil') }}>
                  <IconUser /> Mi perfil
                </div>
                <div className="nd-item danger" onClick={() => { setMenuOpen(false); logout() }}>
                  <IconLogout /> Cerrar sesión
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="page">
        <div className="content">

          {/* HERO */}
          {loading ? (
            <div className="hero">
              <div className="skel" style={{ width: 100, height: 100, borderRadius: 20, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skel" style={{ height: 28, width: '50%' }} />
                <div className="skel" style={{ height: 16, width: '30%' }} />
                <div className="skel" style={{ height: 24, width: '40%' }} />
              </div>
            </div>
          ) : (
            <div className="hero">
              <div className="av-wrap">
                <div className="avatar">
                  {avatarSrc
                    ? <img src={avatarSrc} alt="avatar" />
                    : initials
                  }
                </div>
                <div className="cam-btn" onClick={() => fileInputRef.current?.click()} title="Cambiar foto">
                  <IconCamera />
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }} onChange={handleFileSelect} />
              </div>
              <div className="hero-info">
                <div className="hero-name">{currentUser?.name || '—'} {currentUser?.surname || ''}</div>
                <div className="hero-username">@{currentUser?.username || '—'}</div>
                <div className="hero-badges">
                  <span className="badge badge-gold"><IconShield /> Cliente</span>
                  {currentUser?.isEmailVerified
                    ? <span className="badge badge-green"><IconCheck /> Email verificado</span>
                    : <span className="badge badge-red">Email no verificado</span>
                  }
                  {currentUser?.status !== false && (
                    <span className="badge badge-green"><IconCheck /> Cuenta activa</span>
                  )}
                </div>
                {uploadMsg && (
                  <div className={`upload-msg ${uploadMsg.type}`}>
                    {uploadMsg.type === 'success' ? <IconCheck /> : '⚠'} {uploadMsg.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INFO CARDS */}
          {!loading && (
            <>
              <div className="cards-grid">
                <div className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-icon"><IconUser /></div>
                    <div className="info-card-title">Información personal</div>
                  </div>
                  <div className="info-card-body">
                    <div className="info-row">
                      <span className="info-key">Nombre completo</span>
                      <span className="info-val gold">{currentUser?.name || '—'} {currentUser?.surname || ''}</span>
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

                <div className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-icon"><IconShield /></div>
                    <div className="info-card-title">Información de cuenta</div>
                  </div>
                  <div className="info-card-body">
                    <div className="info-row">
                      <span className="info-key">ID</span>
                      <span className="info-val" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentUser?.id || '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Rol</span>
                      <span className="info-val gold">{currentUser?.role || 'USER_ROLE'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Estado</span>
                      <span className="info-val" style={{ color: currentUser?.status !== false ? 'var(--success)' : 'var(--error)' }}>
                        {currentUser?.status !== false ? 'Activo' : 'Inactivo'}
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
                  </div>
                </div>
              </div>

              {/* CAMBIAR FOTO */}
              <div className="foto-card">
                <div className="foto-title">Foto de perfil</div>
                <div className="foto-sub">JPG, PNG o WEBP · Máximo 5MB · Se sube automáticamente</div>
                <div className="foto-actions">
                  <button className="btn-foto" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                    <IconCamera /> {uploading ? 'Subiendo...' : 'Cambiar foto'}
                  </button>
                  <span className="foto-hint">También puedes hacer clic en el ícono de cámara sobre tu foto</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cerrar dropdown al hacer click fuera */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}