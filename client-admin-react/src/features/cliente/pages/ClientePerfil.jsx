// src/features/cliente/pages/ClientePerfil.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api from '../../../shared/api/api'

const IconMenuFood = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" />
  </svg>
)
const IconTable = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>
)
const IconBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)
const IconHamburger = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)
const IconExperience = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconCamera = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)
const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const NAV_LINKS = [
  { key: 'inicio', label: 'Inicio', path: '/cliente' },
  { key: 'menu', label: 'Menú', path: '/cliente/menu' },
  { key: 'reservar', label: 'Reservar Mesa', path: '/cliente/reservar' },
  { key: 'pedidos', label: 'Mis Pedidos', path: '/cliente/pedidos' },
  { key: 'experiencia', label: 'Experiencia', path: '/cliente/experiencia' },
  { key: 'perfil', label: 'Mi Perfil', path: '/cliente/perfil' },
]

export default function ClientePerfil() {
  const { user, logout, setUser } = useAuthStore()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile')
        const userData = response.data?.data || response.data
        setProfileData(userData && userData.id ? userData : user)
      } catch {
        setProfileData(user)
      }
    }
    fetchProfile()
  }, [])

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target.result)
    reader.readAsDataURL(file)
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
        if (setUser) setUser({ ...user, profilePicture: newUrl })
        setProfileData(prev => ({ ...prev, profilePicture: newUrl }))
        setPreviewUrl(newUrl)
      }
      setUploadMsg({ type: 'success', text: 'Foto actualizada exitosamente' })
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'No se pudo subir la imagen'
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
  const initials = currentUser?.name?.[0]?.toUpperCase() || 'C'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --black:#07080a;--deep:#0d0f12;--glass-bg:rgba(255,255,255,0.045);
          --glass-bd:rgba(255,255,255,0.09);--gold:#c9a84c;--gold-lt:#e8c96a;
          --gold-dim:rgba(201,168,76,.08);--text:#f0ead8;--text-mid:#9a9385;
          --text-muted:#5a554d;--success:#4caf82;--error:#e05a5a;
          --radius-card:20px;--radius-inp:11px;--nav-h:68px;
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh}
        .cliente-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:var(--nav-h);
          background:rgba(13,15,18,.92);backdrop-filter:blur(20px) saturate(180%);
          border-bottom:1px solid var(--glass-bd);
          display:flex;align-items:center;justify-content:space-between;padding:0 40px}
        .nav-brand{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;
          letter-spacing:2px;text-transform:uppercase;color:var(--text)}
        .nav-brand span{color:var(--gold)}
        .nav-links{display:flex;align-items:center;gap:4px}
        .nav-link{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;
          font-size:13px;color:var(--text-mid);cursor:pointer;transition:all .2s;
          white-space:nowrap;border:none;background:none;font-family:'Outfit',sans-serif}
        .nav-link:hover{color:var(--text);background:var(--glass-bg)}
        .nav-link.active{color:var(--gold-lt);background:var(--gold-dim);border:1px solid rgba(201,168,76,.15)}
        .nav-actions{display:flex;align-items:center;gap:10px}
        .nav-avatar{width:36px;height:36px;border-radius:50%;
          background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));
          border:1.5px solid rgba(201,168,76,.3);
          display:flex;align-items:center;justify-content:center;
          font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:500;
          color:var(--gold-lt);cursor:pointer;transition:all .2s;overflow:hidden}
        .nav-avatar:hover{border-color:var(--gold);box-shadow:0 0 12px rgba(201,168,76,.2)}
        .nav-avatar img{width:100%;height:100%;object-fit:cover}
        .nav-logout{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;
          font-size:12px;color:var(--text-muted);background:none;border:none;cursor:pointer;
          font-family:'Outfit',sans-serif;transition:all .2s}
        .nav-logout:hover{color:var(--error);background:rgba(224,90,90,.08)}
        .nav-hamburger{display:none;background:none;border:none;color:var(--text-mid);cursor:pointer;padding:8px}
        .nav-mobile-menu{display:none;position:fixed;top:var(--nav-h);left:0;right:0;z-index:99;
          background:rgba(13,15,18,.97);backdrop-filter:blur(20px);
          border-bottom:1px solid var(--glass-bd);padding:12px 20px 16px;
          flex-direction:column;gap:4px}
        .nav-mobile-menu.open{display:flex}
        .cliente-page{padding-top:calc(var(--nav-h) + 32px);min-height:100vh;max-width:900px;
          margin:0 auto;padding-left:24px;padding-right:24px;padding-bottom:48px}
        .page-header{margin-bottom:32px}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:400;
          letter-spacing:1px;color:var(--text)}
        .page-subtitle{font-size:13px;color:var(--text-muted);margin-top:4px}
        .perfil-grid{display:grid;grid-template-columns:300px 1fr;gap:20px}
        .perfil-card{background:var(--glass-bg);border:1px solid var(--glass-bd);
          border-radius:var(--radius-card);overflow:hidden;position:relative}
        .perfil-card::before{content:'';position:absolute;top:0;left:0;width:60px;height:1px;
          background:linear-gradient(90deg,var(--gold),transparent)}
        .card-header{display:flex;align-items:center;gap:10px;padding:18px 22px 14px;
          border-bottom:1px solid var(--glass-bd)}
        .card-header-icon{width:30px;height:30px;border-radius:8px;background:var(--gold-dim);
          border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;
          justify-content:center;color:var(--gold)}
        .card-header-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500;color:var(--text)}
        .card-body{padding:22px}
        .avatar-section{display:flex;flex-direction:column;align-items:center;
          gap:14px;padding:28px 22px;border-bottom:1px solid var(--glass-bd)}
        .avatar-wrap{position:relative;width:100px;height:100px}
        .avatar-img{width:100px;height:100px;border-radius:50%;
          background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));
          border:2px solid rgba(201,168,76,.3);
          display:flex;align-items:center;justify-content:center;
          font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:500;
          color:var(--gold-lt);overflow:hidden;box-shadow:0 0 24px rgba(201,168,76,.12)}
        .avatar-img img{width:100%;height:100%;object-fit:cover}
        .avatar-camera-btn{position:absolute;bottom:2px;right:2px;width:28px;height:28px;
          border-radius:50%;background:var(--gold);border:2px solid var(--deep);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;color:var(--black);transition:all .2s}
        .avatar-camera-btn:hover{background:var(--gold-lt);transform:scale(1.1)}
        .avatar-camera-btn.loading{background:rgba(201,168,76,.4);cursor:not-allowed;animation:pulse 1s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .avatar-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;
          color:var(--text);text-align:center}
        .avatar-username{font-size:12.5px;color:var(--text-mid)}
        .avatar-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 14px;border-radius:20px;background:var(--gold-dim);border:1px solid rgba(201,168,76,.2);font-size:11px;color:var(--gold);letter-spacing:1px;text-transform:uppercase;white-space:nowrap;flex-shrink:0}
        .upload-msg{margin:0 22px 10px;padding:9px 13px;border-radius:10px;font-size:12.5px;
          display:flex;align-items:center;gap:7px;animation:slideIn .3s ease}
        @keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .upload-msg.success{background:rgba(76,175,130,.1);border:1px solid rgba(76,175,130,.25);color:var(--success)}
        .upload-msg.error{background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.25);color:var(--error)}
        .field-group{display:flex;flex-direction:column;gap:14px}
        .field-item{display:flex;flex-direction:column;gap:4px}
        .field-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);font-weight:500}
        .field-value{font-size:13.5px;color:var(--text);background:rgba(255,255,255,.03);
          border:1px solid var(--glass-bd);border-radius:var(--radius-inp);padding:9px 13px}
        .field-value.empty{color:var(--text-muted);font-style:italic}
        .security-item{display:flex;align-items:center;justify-content:space-between;
          padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .security-item:last-child{border-bottom:none}
        .security-label{font-size:13px;color:var(--text-mid)}
        .security-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px}
        .security-badge.verified{background:rgba(76,175,130,.1);border:1px solid rgba(76,175,130,.25);color:var(--success)}
        .security-badge.unverified{background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.25);color:var(--error)}
        .security-badge.role{background:var(--gold-dim);border:1px solid rgba(201,168,76,.2);color:var(--gold);text-transform:uppercase;letter-spacing:.5px}
        .right-col{display:flex;flex-direction:column;gap:18px}
        @media(max-width:700px){
          .cliente-nav{padding:0 20px}
          .nav-links{display:none}
          .nav-hamburger{display:block}
          .perfil-grid{grid-template-columns:1fr}
          .cliente-page{padding-left:16px;padding-right:16px}
        }
      `}</style>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
        style={{ display: 'none' }} onChange={handleFileSelect} />

      <nav className="cliente-nav">
        <div className="nav-brand">Restaur<span>ant</span>e</div>
        <div className="nav-links">
          {NAV_LINKS.map(link => (
            <button key={link.key} className={`nav-link ${link.key === 'perfil' ? 'active' : ''}`}
              onClick={() => navigate(link.path)}>{link.label}</button>
          ))}
        </div>
        <div className="nav-actions">
          <div className="nav-avatar" onClick={() => navigate('/cliente/perfil')}>
            {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : initials}
          </div>
          <button className="nav-logout" onClick={logout}><IconLogout /> Salir</button>
          <button className="nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)}><IconHamburger /></button>
        </div>
      </nav>

      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <button key={link.key} className={`nav-link ${link.key === 'perfil' ? 'active' : ''}`}
            onClick={() => { navigate(link.path); setMobileOpen(false) }}>{link.label}</button>
        ))}
      </div>

      <div className="cliente-page">
        <div className="page-header">
          <div className="page-title">Mi Perfil</div>
          <div className="page-subtitle">Información de tu cuenta</div>
        </div>

        <div className="perfil-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="perfil-card">
              <div className="avatar-section">
                <div className="avatar-wrap">
                  <div className="avatar-img">
                    {avatarSrc ? <img src={avatarSrc} alt="Foto de perfil" /> : initials}
                  </div>
                  <button className={`avatar-camera-btn ${uploading ? 'loading' : ''}`}
                    onClick={() => !uploading && fileInputRef.current?.click()}>
                    {uploading ? <span style={{ fontSize: 9 }}>...</span> : <IconCamera />}
                  </button>
                </div>
                <div className="avatar-name">{currentUser?.name || '—'} {currentUser?.surname || ''}</div>
                <div className="avatar-username">@{currentUser?.username || '—'}</div>
                <div className="avatar-badge">⚡ Cliente</div>
              </div>
              {uploadMsg && (
                <div className={`upload-msg ${uploadMsg.type}`}>
                  {uploadMsg.type === 'success' ? <IconCheck /> : '✕'} {uploadMsg.text}
                </div>
              )}
            </div>

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
                  <span className="security-label">Tipo de cuenta</span>
                  <span className="security-badge role">Cliente</span>
                </div>
                <div className="security-item">
                  <span className="security-label">Estado</span>
                  <span className={`security-badge ${currentUser?.status === 'active' || currentUser?.status === 'ACTIVE' ? 'verified' : 'unverified'}`}>
                    {currentUser?.status === 'active' || currentUser?.status === 'ACTIVE' ? <><IconCheck /> Activa</> : currentUser?.status || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="perfil-card">
              <div className="card-header">
                <div className="card-header-icon"><IconUser /></div>
                <span className="card-header-title">Información Personal</span>
              </div>
              <div className="card-body">
                <div className="field-group">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="field-item">
                      <span className="field-label">Nombre</span>
                      <div className={`field-value ${!currentUser?.name ? 'empty' : ''}`}>{currentUser?.name || 'Sin registrar'}</div>
                    </div>
                    <div className="field-item">
                      <span className="field-label">Apellido</span>
                      <div className={`field-value ${!currentUser?.surname ? 'empty' : ''}`}>{currentUser?.surname || 'Sin registrar'}</div>
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
                    <div className={`field-value ${!currentUser?.email ? 'empty' : ''}`}>{currentUser?.email || 'Sin registrar'}</div>
                  </div>
                  <div className="field-item">
                    <span className="field-label">Teléfono</span>
                    <div className={`field-value ${!currentUser?.phone ? 'empty' : ''}`}>{currentUser?.phone || 'Sin registrar'}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="field-item">
                      <span className="field-label">Miembro desde</span>
                      <div className="field-value">
                        {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                      </div>
                    </div>
                    <div className="field-item">
                      <span className="field-label">Última actualización</span>
                      <div className="field-value">
                        {currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
