// src/features/cliente/pages/ClienteMisReservaciones.jsx
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
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconClose = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IconCalendar = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
const IconClock = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>

const NAV_ITEMS = [
    { key: 'inicio', label: 'Inicio', icon: <IconHome />, path: '/cliente/inicio' },
    { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/cliente/menu' },
    { key: 'mis-pedidos', label: 'Mis Pedidos', icon: <IconOrders />, path: '/cliente/mis-pedidos' },
    { key: 'reservar', label: 'Reservar', icon: <IconTable />, path: '/cliente/reservar' },
    { key: 'mis-reservaciones', label: 'Reservas', icon: <IconTable />, path: '/cliente/mis-reservaciones' },
    { key: 'resenas', label: 'Reseñas', icon: <IconStar />, path: '/cliente/resenas' },
    { key: 'perfil', label: 'Perfil', icon: <IconUser />, path: '/cliente/perfil' },
]

const ESTADO_STYLES = {
    PENDIENTE: { bg: 'rgba(201,168,76,.12)', bd: 'rgba(201,168,76,.35)', tx: '#e8c96a', label: 'Pendiente' },
    CONFIRMADA: { bg: 'rgba(76,175,130,.1)', bd: 'rgba(76,175,130,.3)', tx: '#7dd9ae', label: 'Confirmada' },
    CANCELADA: { bg: 'rgba(224,90,90,.1)', bd: 'rgba(224,90,90,.3)', tx: '#e08080', label: 'Cancelada' },
    COMPLETADA: { bg: 'rgba(91,155,213,.1)', bd: 'rgba(91,155,213,.3)', tx: '#90c0e8', label: 'Completada' },
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
        }}>
            {msg}
        </div>
    )
}

export default function ClienteMisReservaciones() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'mis-reservaciones'
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
    const [reservaciones, setReservaciones] = useState([])
    const [loading, setLoading] = useState(false)
    const [filtro, setFiltro] = useState('TODOS')
    const [detalle, setDetalle] = useState(null)
    const [cancelando, setCancelando] = useState(false)
    const [ocultas, setOcultas] = useState(() => {
        try { return JSON.parse(localStorage.getItem('reservaciones_ocultas') || '[]') } catch { return [] }
    })
    // Persistir ocultas en localStorage
    const ocultarReservacion = (id) => {
        const nuevas = [...ocultas, id]
        setOcultas(nuevas)
        try { localStorage.setItem('reservaciones_ocultas', JSON.stringify(nuevas)) } catch { }
    }
    const [toast, setToast] = useState(null)
    const loadedRef = useRef(false)

    const showToast = (msg, type = 'success') => setToast({ msg, type })
    const initials = (user?.name?.[0] || 'U').toUpperCase()

    const load = async () => {
        setLoading(true)
        try {
            const res = await api.get('/reservaciones/mis-reservaciones')
            setReservaciones(res.data?.data || [])
        } catch { showToast('Error al cargar reservaciones', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        load()
    }, [])

    const handleCancelar = async (id) => {
        if (!window.confirm('¿Cancelar esta reservación?')) return
        setCancelando(true)
        try {
            await api.put(`/reservaciones/${id}/cancelar`)
            setReservaciones(prev => prev.map(r =>
                r._id === id ? { ...r, estado: { ...r.estado, nombre: 'CANCELADA' } } : r
            ))
            if (detalle?._id === id) setDetalle(prev => ({ ...prev, estado: { ...prev.estado, nombre: 'CANCELADA' } }))
            showToast('Reservación cancelada')
        } catch (err) {
            showToast(err.response?.data?.message || 'Error al cancelar', 'error')
        } finally { setCancelando(false) }
    }

    const filtradas = reservaciones.filter(r => {
        const nombre = r.estado?.nombre || r.estado || ''
        const matchFiltro = filtro === 'TODOS' || nombre === filtro
        return matchFiltro && !ocultas.includes(r._id)
    })

    const proximas = reservaciones.filter(r => {
        const nombre = r.estado?.nombre || r.estado || ''
        return ['PENDIENTE', 'CONFIRMADA'].includes(nombre) && r.fecha >= new Date().toISOString().substring(0, 10)
    }).length

    const es = (estado) => {
        const nombre = estado?.nombre || estado || ''
        return ESTADO_STYLES[nombre] || { bg: 'rgba(255,255,255,.05)', bd: 'rgba(255,255,255,.1)', tx: '#aaa', label: nombre }
    }

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
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}
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
        .nav-dropdown{position:absolute;top:calc(100%+8px);right:0;background:var(--deep);border:1px solid var(--glass-bd);border-radius:14px;padding:8px;min-width:180px;z-index:200;animation:fadeIn .15s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .nd-user{padding:10px 12px;border-bottom:1px solid var(--glass-bd);margin-bottom:6px}
        .nd-name{font-size:13px;font-weight:500}
        .nd-email{font-size:11px;color:var(--text-muted)}
        .nd-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s}
        .nd-item:hover{background:var(--glass-bg);color:var(--text)}
        .nd-item.danger:hover{background:rgba(224,90,90,.08);color:var(--error)}
        .nav-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .nav-btn:hover{color:var(--gold)}
        .page{padding-top:var(--nav-h);min-height:100vh}
        .content{max-width:960px;margin:0 auto;padding:40px 24px}
        .page-header{margin-bottom:28px}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500}
        .page-sub{font-size:13px;color:var(--text-muted);margin-top:4px}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}
        .sc{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:20px;position:relative;overflow:hidden}
        .sc::before{content:'';position:absolute;top:0;left:0;width:60px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .sc-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;line-height:1;margin-bottom:3px}
        .sc-icon{font-size:20px;margin-bottom:8px}
        .sc-lbl{font-size:11px;color:var(--text-muted)}
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .card-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--glass-bd);gap:12px;flex-wrap:wrap}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500}
        .card-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .filtros{display:flex;gap:6px;flex-wrap:wrap}
        .fbtn{padding:6px 14px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s}
        .fbtn:hover{color:var(--text)}
        .fbtn.active{background:var(--gold-dim);border-color:rgba(201,168,76,.3);color:var(--gold-lt)}
        .refresh-btn{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:9px;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s}
        .refresh-btn:hover{color:var(--gold-lt)}
        .res-row{display:flex;align-items:center;gap:16px;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;transition:background .15s}
        .res-row:last-child{border-bottom:none}
        .res-row:hover{background:rgba(255,255,255,.02)}
        .res-icon{width:44px;height:44px;border-radius:12px;background:var(--gold-dim);border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
        .res-info{flex:1}
        .res-rest{font-size:14px;font-weight:500;color:var(--text);margin-bottom:4px}
        .res-meta{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .res-meta span{display:flex;align-items:center;gap:4px}
        .badge-estado{display:inline-flex;padding:4px 12px;border-radius:20px;font-size:11px;border:1px solid;white-space:nowrap}
        .empty{text-align:center;padding:64px 24px;color:var(--text-muted)}
        .empty-icon{font-size:48px;margin-bottom:16px;opacity:.3}
        .empty-title{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--text-mid);margin-bottom:8px}
        .btn-primary{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;border-radius:12px;background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s}
        .btn-primary:hover{border-color:rgba(201,168,76,.6);transform:translateY(-1px)}
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .panel-ov{position:fixed;inset:0;background:rgba(7,8,10,.82);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-start;justify-content:flex-end}
        .panel{width:100%;max-width:420px;height:100vh;background:var(--deep);border-left:1px solid var(--glass-bd);overflow-y:auto;display:flex;flex-direction:column;animation:slideIn .3s cubic-bezier(0.16,1,0.3,1)}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .panel-head{padding:22px 24px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--deep);z-index:1}
        .panel-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500}
        .panel-close{width:32px;height:32px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .panel-close:hover{color:var(--error)}
        .panel-body{padding:24px;flex:1;display:flex;flex-direction:column;gap:20px}
        .dsec-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);opacity:.7;border-bottom:1px solid rgba(201,168,76,.15);padding-bottom:4px;margin-bottom:8px}
        .drow{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .drow:last-child{border-bottom:none}
        .dk{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:5px}
        .dv{font-size:13px;color:var(--text);text-align:right}
        .dv.gold{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt)}
        .btn-cancelar{width:100%;padding:12px;border-radius:12px;background:rgba(224,90,90,.08);border:1px solid rgba(224,90,90,.25);color:var(--error);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s;margin-top:4px}
        .btn-cancelar:hover{background:rgba(224,90,90,.15)}
        .btn-cancelar:disabled{opacity:.4;cursor:not-allowed}
        @media(max-width:900px){.stats{grid-template-columns:1fr 1fr}.nav-links{display:none}.content{padding:24px 16px}}
      `}</style>

            {/* NAVBAR */}
            <nav className="navbar">
                <div className="nav-brand" onClick={() => navigate('/cliente/inicio')}>
                    <div className="nav-brand-icon"><IconRest /></div>
                    <span className="nav-brand-name">Gastro</span>
                </div>
                <div className="nav-links">
                    {NAV_ITEMS.map(item => (
                        <div key={item.key} className={`nav-link ${activeNav === item.key ? 'active' : ''}`}
                            onClick={() => { setActiveNav(item.key); navigate(item.path) }}>
                            {item.icon}{item.label}
                        </div>
                    ))}
                </div>
                <div className="nav-right">
                    <NotificacionesPanel isAdmin={false} />
                    <div className="nav-avatar-wrap">
                        <div className="nav-avatar" onClick={() => setMenuOpen(p => !p)}>
                            {avatarSrc ? <img src={avatarSrc} alt="av" onError={e => e.target.style.display = 'none'} /> : initials}
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

            <div className="page">
                <div className="content">

                    <div className="page-header">
                        <div className="page-title">Mis Reservaciones</div>
                        <div className="page-sub">Historial de tus reservas de mesas</div>
                    </div>

                    {/* STATS */}
                    <div className="stats">
                        <div className="sc">
                            <div className="sc-icon">📅</div>
                            <div className="sc-val">{reservaciones.length}</div>
                            <div className="sc-lbl">Total reservaciones</div>
                        </div>
                        <div className="sc">
                            <div className="sc-icon">⏳</div>
                            <div className="sc-val" style={{ color: '#e8c96a' }}>{proximas}</div>
                            <div className="sc-lbl">Próximas activas</div>
                        </div>
                        <div className="sc">
                            <div className="sc-icon">✅</div>
                            <div className="sc-val" style={{ color: 'var(--success)' }}>
                                {reservaciones.filter(r => (r.estado?.nombre || r.estado) === 'COMPLETADA').length}
                            </div>
                            <div className="sc-lbl">Completadas</div>
                        </div>
                    </div>

                    {/* LISTA */}
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Reservaciones</div>
                                <div className="card-sub">{filtradas.length} registros</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                <div className="filtros">
                                    {['TODOS', 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'].map(f => (
                                        <button key={f} className={`fbtn ${filtro === f ? 'active' : ''}`}
                                            onClick={() => setFiltro(f)}>
                                            {f === 'TODOS' ? 'Todos' : ESTADO_STYLES[f]?.label || f}
                                        </button>
                                    ))}
                                </div>
                                <button className="refresh-btn" onClick={() => { loadedRef.current = false; load() }}>
                                    <IconRefresh /> Actualizar
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                                        <div className="skel" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <div className="skel" style={{ height: 14, width: '50%' }} />
                                            <div className="skel" style={{ height: 11, width: '70%' }} />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : filtradas.length === 0 ? (
                            <div className="empty">
                                <div className="empty-icon">📅</div>
                                <div className="empty-title">{filtro !== 'TODOS' ? 'Sin reservaciones en este estado' : 'Aún no tienes reservaciones'}</div>
                                <div style={{ fontSize: 13, marginBottom: 20 }}>
                                    {filtro !== 'TODOS' ? 'Cambia el filtro para ver otras' : '¡Reserva una mesa ahora!'}
                                </div>
                                {filtro === 'TODOS' && (
                                    <button className="btn-primary" onClick={() => navigate('/cliente/reservar')}>
                                        <IconTable /> Hacer una reservación
                                    </button>
                                )}
                            </div>
                        ) : (
                            filtradas
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map(r => {
                                    const st = es(r.estado)
                                    const estadoNombre = r.estado?.nombre || r.estado || ''
                                    const puedeCancelar = ['PENDIENTE', 'CONFIRMADA'].includes(estadoNombre)
                                    return (
                                        <div key={r._id} className="res-row" onClick={() => setDetalle(r)}>
                                            <div className="res-icon">📅</div>
                                            <div className="res-info">
                                                <div className="res-rest">{r.restaurante?.nombre || 'Restaurante'}</div>
                                                <div className="res-meta">
                                                    <span><IconCalendar /> {r.fecha || '—'}</span>
                                                    <span>·</span>
                                                    <span><IconClock /> {r.hora || '—'}</span>
                                                    <span>·</span>
                                                    <span>👥 {r.numPersonas} persona(s)</span>
                                                    {r.mesa && <><span>·</span><span>Mesa #{r.mesa?.numeroMesa}</span></>}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <span className="badge-estado" style={{ background: st.bg, borderColor: st.bd, color: st.tx }}>
                                                        {st.label}
                                                    </span>
                                                    {['CANCELADA', 'COMPLETADA'].includes(estadoNombre) && (
                                                        <button
                                                            onClick={e => { e.stopPropagation(); ocultarReservacion(r._id); if (detalle?._id === r._id) setDetalle(null) }}
                                                            title="Quitar de la vista"
                                                            style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,.05)', border: '1px solid var(--glass-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, flexShrink: 0 }}>
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                                {puedeCancelar && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleCancelar(r._id) }}
                                                        disabled={cancelando}
                                                        style={{ padding: '4px 10px', borderRadius: 7, background: 'rgba(224,90,90,.08)', border: '1px solid rgba(224,90,90,.2)', color: 'var(--error)', cursor: 'pointer', fontSize: 11, fontFamily: "'Outfit',sans-serif" }}>
                                                        Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                        )}
                    </div>

                    {/* Botón nueva reservación */}
                    <div style={{ textAlign: 'center' }}>
                        <button className="btn-primary" onClick={() => navigate('/cliente/reservar')}>
                            <IconTable /> Nueva reservación
                        </button>
                    </div>
                </div>
            </div>

            {/* PANEL DETALLE */}
            {detalle && (
                <div className="panel-ov" onClick={e => e.target === e.currentTarget && setDetalle(null)}>
                    <div className="panel">
                        <div className="panel-head">
                            <div className="panel-title">Detalle de Reservación</div>
                            <button className="panel-close" onClick={() => setDetalle(null)}><IconClose /></button>
                        </div>
                        <div className="panel-body">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {(() => {
                                    const st = es(detalle.estado)
                                    return <span className="badge-estado" style={{ background: st.bg, borderColor: st.bd, color: st.tx, fontSize: 13, padding: '6px 18px' }}>{st.label}</span>
                                })()}
                            </div>
                            <div>
                                <div className="dsec-title">Información</div>
                                <div className="drow"><span className="dk">Restaurante</span><span className="dv">{detalle.restaurante?.nombre || '—'}</span></div>
                                <div className="drow"><span className="dk"><IconCalendar /> Fecha</span><span className="dv gold">{detalle.fecha || '—'}</span></div>
                                <div className="drow"><span className="dk"><IconClock /> Hora</span><span className="dv gold">{detalle.hora || '—'}</span></div>
                                <div className="drow"><span className="dk">Personas</span><span className="dv">{detalle.numPersonas}</span></div>
                                <div className="drow">
                                    <span className="dk">Mesa</span>
                                    <span className="dv">{detalle.mesa ? `Mesa #${detalle.mesa?.numeroMesa} · ${detalle.mesa?.ubicacion || ''}` : 'Sin preferencia'}</span>
                                </div>
                                {detalle.observaciones && (
                                    <div className="drow"><span className="dk">Observaciones</span><span className="dv" style={{ maxWidth: 200, textAlign: 'right' }}>{detalle.observaciones}</span></div>
                                )}
                                <div className="drow">
                                    <span className="dk">Reservada el</span>
                                    <span className="dv">{detalle.createdAt ? new Date(detalle.createdAt).toLocaleString('es-GT') : '—'}</span>
                                </div>
                            </div>

                            {(() => {
                                const estadoNombre = detalle.estado?.nombre || detalle.estado || ''
                                return ['PENDIENTE', 'CONFIRMADA'].includes(estadoNombre) ? (
                                    <button className="btn-cancelar" disabled={cancelando}
                                        onClick={() => handleCancelar(detalle._id)}>
                                        {cancelando ? 'Cancelando...' : '✕ Cancelar esta reservación'}
                                    </button>
                                ) : (
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
                                        {estadoNombre === 'CANCELADA' ? 'Esta reservación fue cancelada' : 'Esta reservación ya fue completada'}
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
            {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        </>
    )
}