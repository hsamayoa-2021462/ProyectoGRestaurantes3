import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'
import NotificacionesPanel from '../../../shared/components/NotificacionesPanel'

/* ─── ICONS ─── */
const IconHome = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconRest = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>

const NAV_ITEMS = [
    { key: 'inicio', label: 'Inicio', icon: <IconHome />, path: '/cliente/inicio' },
    { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/cliente/menu' },
    { key: 'mis-pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/cliente/mis-pedidos' },
    { key: 'reservar', label: 'Reservar', icon: <IconTable />, path: '/cliente/reservar' },
    { key: 'mis-reservaciones', label: 'Reservas', icon: <IconTable />, path: '/cliente/mis-reservaciones' },
    { key: 'resenas', label: 'Reseñas', icon: <IconStar />, path: '/cliente/resenas' },
    { key: 'perfil', label: 'Perfil', icon: <IconUser />, path: '/cliente/perfil' },
]

function StarSelector({ value, onChange, size = 28 }) {
    const [hover, setHover] = useState(0)
    return (
        <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n}
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    style={{ cursor: 'pointer', fontSize: size, color: n <= (hover || value) ? '#c9a84c' : 'rgba(255,255,255,.15)', transition: 'color .15s' }}>
                    ★
                </span>
            ))}
        </div>
    )
}

function StarDisplay({ value, size = 14 }) {
    return (
        <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ fontSize: size, color: n <= value ? '#c9a84c' : 'rgba(255,255,255,.12)' }}>★</span>
            ))}
        </div>
    )
}

function Toast({ msg, type, onDone }) {
    useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [])
    return (
        <div style={{
            position: 'fixed', bottom: 28, right: 28, padding: '12px 20px',
            borderRadius: 12, fontSize: 13, zIndex: 999,
            background: type === 'success' ? 'rgba(76,175,130,.15)' : 'rgba(224,90,90,.15)',
            border: `1px solid ${type === 'success' ? 'rgba(76,175,130,.3)' : 'rgba(224,90,90,.3)'}`,
            color: type === 'success' ? '#7dd9ae' : '#e08080',
        }}>{msg}</div>
    )
}

export default function ClienteResenas() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'resenas'
    const [activeNav, setActiveNav] = useState(getActiveKey())
    useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

    const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture || null)
    useEffect(() => {
        authApi.get('/auth/profile').then(r => {
            const url = r.data?.data?.profilePicture
            if (url) setAvatarSrc(url)
        }).catch(() => { })
    }, [])

    const [menuOpen, setMenuOpen] = useState(false)
    const [navOpen, setNavOpen] = useState(false)

    const [restaurantes, setRestaurantes] = useState([])
    const [misResenas, setMisResenas] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const loadedRef = useRef(false)

    const [restSelec, setRestSelec] = useState('')
    const [estrellas, setEstrellas] = useState(0)
    const [comentario, setComentario] = useState('')
    const [guardando, setGuardando] = useState(false)

    const showToast = (msg, type = 'success') => setToast({ msg, type })
    const initials = (user?.name?.[0] || 'U').toUpperCase()

    const load = async () => {
        setLoading(true)
        try {
            const [restRes, resenasRes] = await Promise.all([
                api.get('/restaurante/restaurantes'),
                api.get('/resenas/mis-resenas'),
            ])
            setRestaurantes(restRes.data?.data || [])
            setMisResenas(resenasRes.data?.data || [])
        } catch { showToast('Error al cargar datos', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        load()
    }, [])

    const handleEnviar = async () => {
        if (!restSelec) return showToast('Selecciona un restaurante', 'error')
        if (!estrellas) return showToast('Selecciona una calificación', 'error')
        setGuardando(true)
        try {
            await api.post('/resenas', {
                restaurante: restSelec,
                estrellas,
                comentario: comentario.trim(),
                nombreUsuario: user?.name || 'Cliente',
            })
            showToast('¡Reseña enviada! Gracias por tu opinión ⭐')
            setEstrellas(0)
            setComentario('')
            setRestSelec('')
            loadedRef.current = false
            load()
        } catch (err) {
            showToast(err.response?.data?.message || 'Error al enviar reseña', 'error')
        } finally { setGuardando(false) }
    }

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Eliminar esta reseña?')) return
        try {
            await api.delete(`/resenas/${id}`)
            setMisResenas(prev => prev.filter(r => r._id !== id))
            showToast('Reseña eliminada')
        } catch { showToast('Error al eliminar', 'error') }
    }

    const restConResena = new Set(misResenas.map(r =>
        typeof r.restaurante === 'object' ? r.restaurante?._id : r.restaurante
    ))

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --black:#07080a;--deep:#0d0f12;
          --glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);
          --gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;
          --success:#4caf82;--error:#e05a5a;
          --radius-card:20px;--nav-h:64px;
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}

        /* ── NAVBAR ── */
        .navbar{position:fixed;top:0;left:0;right:0;height:var(--nav-h);background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:100}
        .navbar::after{content:'';position:absolute;bottom:-1px;left:0;width:200px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .nav-brand{display:flex;align-items:center;gap:10px;cursor:pointer}
        .nav-brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;color:var(--gold)}
        .nav-brand-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase}
        .nav-links{display:flex;align-items:center;gap:4px}
        .nav-link{display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s;white-space:nowrap;background:none;border:none;font-family:'Outfit',sans-serif}
        .nav-link:hover{background:var(--glass-bg);color:var(--text)}
        .nav-link.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.15)}
        .nav-right{display:flex;align-items:center;gap:10px}
        .nav-avatar-wrap{position:relative}
        .nav-avatar{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--gold-lt);cursor:pointer;overflow:hidden}
        .nav-avatar img{width:100%;height:100%;object-fit:cover}
        .nav-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:var(--deep);border:1px solid var(--glass-bd);border-radius:14px;padding:8px;min-width:180px;z-index:200;animation:fadeIn .15s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .nd-user{padding:10px 12px;border-bottom:1px solid var(--glass-bd);margin-bottom:6px}
        .nd-name{font-size:13px;font-weight:500}
        .nd-email{font-size:11px;color:var(--text-muted)}
        .nd-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s}
        .nd-item:hover{background:var(--glass-bg);color:var(--text)}
        .nd-item.danger:hover{background:rgba(224,90,90,.08);color:var(--error)}

        /* ── HAMBURGUESA ── */
        .btn-hamb{display:none;background:none;border:none;color:var(--gold);font-size:22px;cursor:pointer;padding:4px 8px;border-radius:8px;line-height:1;transition:background .2s}
        .btn-hamb:hover{background:var(--gold-dim)}

        /* ── DRAWER NAV MÓVIL ── */
        .nav-drawer-ov{display:none;position:fixed;inset:0;z-index:150;background:rgba(7,8,10,.7);backdrop-filter:blur(6px)}
        .nav-drawer-ov.open{display:block}
        .nav-drawer{position:fixed;top:var(--nav-h);left:-260px;width:240px;height:calc(100vh - var(--nav-h));background:var(--deep);border-right:1px solid var(--glass-bd);z-index:160;display:flex;flex-direction:column;padding:16px 12px;gap:4px;transition:left .3s var(--ease-out-expo);overflow-y:auto}
        .nav-drawer.open{left:0}
        .drawer-link{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s;border:1px solid transparent}
        .drawer-link:hover{background:var(--glass-bg);color:var(--text)}
        .drawer-link.active{background:var(--gold-dim);color:var(--gold-lt);border-color:rgba(201,168,76,.2)}
        .drawer-sep{height:1px;background:var(--glass-bd);margin:8px 4px}

        /* ── PAGE ── */
        .page{padding-top:var(--nav-h);min-height:100vh}
        .content{max-width:860px;margin:0 auto;padding:40px 24px;display:flex;flex-direction:column;gap:24px}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500}
        .page-sub{font-size:13px;color:var(--text-muted);margin-top:4px}

        /* ── CARDS ── */
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .card-header{padding:20px 24px;border-bottom:1px solid var(--glass-bd)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500}
        .card-sub{font-size:12px;color:var(--text-muted);margin-top:3px}
        .card-body{padding:24px;display:flex;flex-direction:column;gap:16px}

        /* ── FORM ── */
        .form-group{display:flex;flex-direction:column;gap:6px}
        .form-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted)}
        .form-select{background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:11px;padding:10px 14px;color:var(--text);font-family:'Outfit',sans-serif;font-size:13.5px;outline:none;transition:border-color .2s;width:100%}
        .form-select:focus{border-color:rgba(201,168,76,.4)}
        .form-select option{background:var(--deep)}
        .form-textarea{background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:11px;padding:10px 14px;color:var(--text);font-family:'Outfit',sans-serif;font-size:13.5px;outline:none;transition:border-color .2s;width:100%;resize:vertical;min-height:90px}
        .form-textarea:focus{border-color:rgba(201,168,76,.4)}
        .form-textarea::placeholder{color:var(--text-muted)}
        .btn-enviar{padding:12px 28px;border-radius:12px;background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;transition:all .2s;align-self:flex-start}
        .btn-enviar:hover{border-color:rgba(201,168,76,.6);transform:translateY(-1px)}
        .btn-enviar:disabled{opacity:.4;cursor:not-allowed;transform:none}

        /* ── RESEÑA CARD (Modificado para orden, proximidad y ubicación del botón) ── */
        .resena-card{
          background:rgba(255,255,255,.03);
          border:1px solid var(--glass-bd);
          border-radius:16px;
          padding:16px 48px 16px 16px; /* Deja espacio a la derecha para que el botón no tape texto */
          display:flex;
          flex-direction:column;
          gap:4px; /* Elementos más juntos y ordenados */
          position:relative;
        }
        .resena-header-row {
          display:flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
        }
        .resena-rest{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--text);line-height:1.2}
        .resena-fecha{font-size:11px;color:var(--text-muted);line-height:1}
        .resena-comentario{font-size:13px;color:var(--text-mid);line-height:1.4;margin-top:4px}
        
        /* Botón de eliminar fijado exactamente en la esquina superior derecha */
        .btn-delete{
          position:absolute;
          top:12px;
          right:12px;
          width:28px;
          height:28px;
          border-radius:7px;
          background:rgba(224,90,90,.08);
          border:1px solid rgba(224,90,90,.2);
          display:flex;
          align-items:center;
          justify-content:center;
          color:var(--error);
          cursor:pointer;
          transition:all .2s;
        }
        .btn-delete:hover{background:rgba(224,90,90,.16)}

        /* ── EMPTY ── */
        .empty{text-align:center;padding:48px 24px;color:var(--text-muted)}
        .empty-icon{font-size:40px;margin-bottom:12px;opacity:.3}

        /* ── SKELETON ── */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* ── RESPONSIVE COMPLETO ── */
        @media(max-width:900px){
          .nav-links{display:none}
          .btn-hamb{display:block}
          .content{padding:24px 16px}
          .navbar{padding:0 16px}
        }
        @media(max-width:480px){
          .card-header{padding:16px}
          .card-body{padding:16px}
          .resena-header-row {
            flex-direction: column;
            gap: 4px;
          }
          .btn-enviar {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

            {/* ── DRAWER OVERLAY (móvil) ── */}
            <div
                className={`nav-drawer-ov ${navOpen ? 'open' : ''}`}
                onClick={() => setNavOpen(false)}
            />

            {/* ── DRAWER (móvil) ── */}
            <div className={`nav-drawer ${navOpen ? 'open' : ''}`}>
                {NAV_ITEMS.map(item => (
                    <div
                        key={item.key}
                        className={`drawer-link ${activeNav === item.key ? 'active' : ''}`}
                        onClick={() => { setNavOpen(false); setActiveNav(item.key); navigate(item.path) }}
                    >
                        {item.icon}{item.label}
                    </div>
                ))}
                <div className="drawer-sep" />
                <div className="drawer-link" onClick={() => { setNavOpen(false); navigate('/cliente/perfil') }}>
                    <IconUser /> Mi perfil
                </div>
                <div className="drawer-link" style={{ color: 'var(--error)' }} onClick={() => { setNavOpen(false); logout() }}>
                    <IconLogout /> Cerrar sesión
                </div>
            </div>

            {/* ── NAVBAR ── */}
            <nav className="navbar">
                <div className="nav-brand" onClick={() => navigate('/cliente/inicio')}>
                    <button
                        className="btn-hamb"
                        onClick={e => { e.stopPropagation(); setNavOpen(p => !p) }}
                        aria-label="Abrir menú"
                    >
                        {navOpen ? '✕' : '☰'}
                    </button>
                    <div className="nav-brand-icon"><IconRest /></div>
                    <span className="nav-brand-name">Gastro</span>
                </div>

                <div className="nav-links">
                    {NAV_ITEMS.map(item => (
                        <div
                            key={item.key}
                            className={`nav-link ${activeNav === item.key ? 'active' : ''}`}
                            onClick={() => { setActiveNav(item.key); navigate(item.path) }}
                        >
                            {item.icon}{item.label}
                        </div>
                    ))}
                </div>

                <div className="nav-right">
                    <NotificacionesPanel isAdmin={false} />
                    <div className="nav-avatar-wrap">
                        <div className="nav-avatar" onClick={() => setMenuOpen(p => !p)}>
                            {avatarSrc
                                ? <img src={avatarSrc} alt="av" onError={e => e.target.style.display = 'none'} />
                                : initials}
                        </div>
                        {menuOpen && (
                            <div className="nav-dropdown">
                                <div className="nd-user">
                                    <div className="nd-name">{user?.name}</div>
                                    <div className="nd-email">{user?.email}</div>
                                </div>
                                <div className="nd-item" onClick={() => { setMenuOpen(false); navigate('/cliente/perfil') }}><IconUser /> Mi perfil</div>
                                <div className="nd-item danger" onClick={() => { setMenuOpen(false); logout() }}><IconLogout /> Cerrar sesión</div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── PAGE ── */}
            <div className="page">
                <div className="content">

                    <div>
                        <div className="page-title">Mis Reseñas</div>
                        <div className="page-sub">Califica tu experiencia en nuestros restaurantes</div>
                    </div>

                    {/* FORMULARIO NUEVA RESEÑA */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Escribir una reseña</div>
                            <div className="card-sub">Puedes editar tu reseña si ya dejaste una en ese restaurante</div>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label className="form-label">Restaurante</label>
                                <select className="form-select" value={restSelec} onChange={e => setRestSelec(e.target.value)}>
                                    <option value="">Selecciona un restaurante...</option>
                                    {restaurantes.map(r => (
                                        <option key={r._id} value={r._id}>
                                            {r.nombre} {restConResena.has(r._id) ? '(ya reseñado — puedes actualizar)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Calificación</label>
                                <StarSelector value={estrellas} onChange={setEstrellas} />
                                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                    {estrellas === 1 ? 'Muy malo' : estrellas === 2 ? 'Malo' : estrellas === 3 ? 'Regular' : estrellas === 4 ? 'Bueno' : estrellas === 5 ? 'Excelente ⭐' : 'Selecciona'}
                                </span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Comentario (opcional)</label>
                                <textarea className="form-textarea"
                                    placeholder="Cuéntanos tu experiencia, qué te gustó o qué mejorarías..."
                                    value={comentario}
                                    onChange={e => setComentario(e.target.value)}
                                    maxLength={500}
                                />
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'flex-end' }}>
                                    {comentario.length}/500
                                </span>
                            </div>

                            <button className="btn-enviar" onClick={handleEnviar}
                                disabled={guardando || !restSelec || !estrellas}>
                                {guardando ? 'Enviando...' : '⭐ Enviar reseña'}
                            </button>
                        </div>
                    </div>

                    {/* MIS RESEÑAS */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">📋 Mis reseñas</div>
                            <div className="card-sub">{misResenas.length} reseñas enviadas</div>
                        </div>
                        <div className="card-body" style={{ gap: '12px' }}>
                            {loading ? (
                                [1, 2].map(i => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div className="skel" style={{ height: 18, width: '40%' }} />
                                        <div className="skel" style={{ height: 14, width: '60%' }} />
                                    </div>
                                ))
                            ) : misResenas.length === 0 ? (
                                <div className="empty">
                                    <div className="empty-icon">⭐</div>
                                    <div style={{ fontSize: 14, color: 'var(--text-mid)', marginBottom: 6 }}>Aún no has escrito ninguna reseña</div>
                                    <div style={{ fontSize: 12 }}>Completa un pedido y comparte tu experiencia</div>
                                </div>
                            ) : (
                                misResenas.map(r => (
                                    <div key={r._id} className="resena-card">
                                        <div className="resena-header-row">
                                            <div className="resena-rest">{r.restaurante?.nombre || 'Restaurante'}</div>
                                            <StarDisplay value={r.estrellas} size={14} />
                                        </div>
                                        <div className="resena-fecha">
                                            {new Date(r.createdAt).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        {r.comentario && (
                                            <div className="resena-comentario">"{r.comentario}"</div>
                                        )}
                                        <button className="btn-delete" onClick={() => handleEliminar(r._id)} title="Eliminar reseña">
                                            <IconTrash />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
            {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        </>
    )
}