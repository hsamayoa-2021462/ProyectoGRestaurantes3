// src/features/cliente/pages/ClienteInicio.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'
import NotificacionesPanel from '../../../shared/components/NotificacionesPanel'

/* ─── ICONS ─── */
const IconHome    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IconMenu    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/></svg>
const IconOrders  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const IconTable   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
const IconUser    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLogout  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
const IconRest    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2"/></svg>
const IconBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
const IconClock   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconPin     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconStar    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconPhone   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>

const NAV_ITEMS = [
  { key: 'inicio',            label: 'Inicio',      icon: <IconHome />,   path: '/cliente/inicio' },
  { key: 'menu',              label: 'Menú',         icon: <IconMenu />,   path: '/cliente/menu' },
  { key: 'mis-pedidos',       label: 'Pedidos',     icon: <IconOrders />, path: '/cliente/mis-pedidos' },
  { key: 'reservar',          label: 'Reservar',     icon: <IconTable />,  path: '/cliente/reservar' },
  { key: 'mis-reservaciones', label: 'Reservas',    icon: <IconTable />,  path: '/cliente/mis-reservaciones' },
  { key: 'resenas',           label: 'Reseñas',      icon: <IconStar />,   path: '/cliente/resenas' },
  { key: 'perfil',            label: 'Perfil',       icon: <IconUser />,   path: '/cliente/perfil' },
]

const ESTADO_STYLE = {
  PENDIENTE:  { bg: 'rgba(201,168,76,.12)', bd: 'rgba(201,168,76,.35)', tx: '#e8c96a', label: 'Pendiente' },
  CONFIRMADO: { bg: 'rgba(91,155,213,.1)',  bd: 'rgba(91,155,213,.3)',  tx: '#90c0e8', label: 'Confirmado' },
  PREPARANDO: { bg: 'rgba(201,120,40,.1)',  bd: 'rgba(201,120,40,.3)',  tx: '#e8a060', label: 'Preparando' },
  EN_CAMINO:  { bg: 'rgba(100,160,220,.1)', bd: 'rgba(100,160,220,.3)', tx: '#78b8e8', label: 'En camino' },
  ENTREGADO:  { bg: 'rgba(76,175,130,.1)',  bd: 'rgba(76,175,130,.3)',  tx: '#7dd9ae', label: 'Entregado' },
  CANCELADO:  { bg: 'rgba(224,90,90,.1)',   bd: 'rgba(224,90,90,.3)',   tx: '#e08080', label: 'Cancelado' },
}

const ACCESOS = [
  { icon: '🍽️', label: 'Ver el menú',     sub: 'Explora nuestros platos',    path: '/cliente/menu',        color: 'rgba(201,168,76,.15)' },
  { icon: '🧾', label: 'Hacer un pedido', sub: 'Pide a domicilio o para llevar', path: '/cliente/menu',     color: 'rgba(91,155,213,.12)' },
  { icon: '📅', label: 'Reservar mesa',   sub: 'Reserva con anticipación',    path: '/cliente/reservar',    color: 'rgba(76,175,130,.12)' },
  { icon: '📋', label: 'Mis pedidos',     sub: 'Historial y seguimiento',     path: '/cliente/mis-pedidos', color: 'rgba(200,100,180,.12)' },
]

export default function ClienteInicio() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'inicio'
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

  // ── Avatar ──
  const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture || null)
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await authApi.get('/auth/profile')
        const url = res.data?.data?.profilePicture
        if (url) setAvatarSrc(url)
      } catch { }
    }
    fetch()
  }, [])

  const [menuOpen, setMenuOpen]         = useState(false)
  const [pedidos, setPedidos]           = useState([])
  const [restaurantes, setRestaurantes] = useState([])
  const [loading, setLoading]           = useState(true)
  const loadedRef                       = useRef(false)

  const load = async () => {
    setLoading(true)
    try {
      const [pedRes, restRes] = await Promise.all([
        api.get('/pedidos/mis-pedidos'),
        api.get('/restaurante/restaurantes'),
      ])
      setPedidos(pedRes.data?.data || [])
      setRestaurantes(restRes.data?.data || [])
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  // Últimos 3 pedidos
  const ultimosPedidos = [...pedidos]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  // Pedidos activos
  const pedidosActivos = pedidos.filter(p =>
    ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO'].includes(p.estado)
  )

  const timeAgo = iso => {
    if (!iso) return '—'
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
    if (diff < 1) return 'ahora'
    if (diff < 60) return `${diff} min`
    if (diff < 1440) return `${Math.floor(diff / 60)}h`
    return `${Math.floor(diff / 1440)}d`
  }

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
  const initials = (user?.name?.[0] || 'U').toUpperCase()

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
          --radius-card:20px;
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
          --nav-h:64px;
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}

        /* NAVBAR */
        .navbar{position:fixed;top:0;left:0;right:0;height:var(--nav-h);background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:100}
        .navbar::after{content:'';position:absolute;bottom:-1px;left:0;width:200px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .nav-brand{display:flex;align-items:center;gap:10px;cursor:pointer}
        .nav-brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;color:var(--gold)}
        .nav-brand-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text)}
        .nav-links{display:flex;align-items:center;gap:4px}
        .nav-link{display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s;white-space:nowrap;background:none;border:none;font-family:'Outfit',sans-serif}
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

        /* PAGE */
        .page{padding-top:var(--nav-h);min-height:100vh}
        .content{max-width:1000px;margin:0 auto;padding:40px 24px}

        /* HERO BIENVENIDA */
        .hero{background:var(--deep);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:36px 40px;margin-bottom:28px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:24px}
        .hero::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 80% 50%,rgba(201,168,76,.07),transparent 60%);pointer-events:none}
        .hero::after{content:'';position:absolute;top:0;left:0;width:300px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .hero-left{position:relative;z-index:1}
        .hero-saludo{font-size:13px;color:var(--gold);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
        .hero-nombre{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:500;color:var(--text);line-height:1.1;margin-bottom:12px}
        .hero-sub{font-size:14px;color:var(--text-muted);max-width:400px;line-height:1.6}
        .hero-btn{display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:11px 24px;border-radius:12px;background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s;text-decoration:none}
        .hero-btn:hover{border-color:rgba(201,168,76,.6);transform:translateY(-1px)}
        .hero-right{position:relative;z-index:1;font-size:80px;opacity:.15;flex-shrink:0}

        /* ALERTA PEDIDOS ACTIVOS */
        .alerta-activos{background:rgba(91,155,213,.08);border:1px solid rgba(91,155,213,.2);border-radius:14px;padding:14px 20px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;transition:border-color .2s}
        .alerta-activos:hover{border-color:rgba(91,155,213,.4)}
        .alerta-left{display:flex;align-items:center;gap:12px}
        .alerta-icon{font-size:20px}
        .alerta-texto{font-size:13px;color:#90c0e8;font-weight:500}
        .alerta-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .alerta-arrow{color:#90c0e8;display:flex}

        /* ACCESOS RÁPIDOS */
        .section-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;margin-bottom:16px}
        .accesos-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:36px}
        .acceso-card{border-radius:16px;padding:20px 16px;cursor:pointer;transition:all .2s;border:1px solid var(--glass-bd);background:var(--glass-bg);text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
        .acceso-card:hover{transform:translateY(-3px);border-color:rgba(201,168,76,.25)}
        .acceso-icon{font-size:28px}
        .acceso-label{font-size:13px;font-weight:500;color:var(--text)}
        .acceso-sub{font-size:11px;color:var(--text-muted)}

        /* GRID INFERIOR */
        .bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}

        /* CARD GENÉRICA */
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .card-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--glass-bd)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500}
        .card-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .ver-mas{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--gold);cursor:pointer;background:none;border:none;font-family:'Outfit',sans-serif;transition:opacity .2s}
        .ver-mas:hover{opacity:.7}

        /* PEDIDOS RECIENTES */
        .pedido-row{display:flex;align-items:center;gap:12px;padding:13px 22px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;transition:background .15s}
        .pedido-row:last-child{border-bottom:none}
        .pedido-row:hover{background:rgba(255,255,255,.02)}
        .pedido-id{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt);min-width:52px}
        .pedido-info{flex:1}
        .pedido-rest{font-size:13px;color:var(--text)}
        .pedido-meta{font-size:11px;color:var(--text-muted);margin-top:2px;display:flex;align-items:center;gap:6px}
        .pedido-total{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt);white-space:nowrap}
        .badge-estado{display:inline-flex;padding:3px 9px;border-radius:20px;font-size:10px;border:1px solid;white-space:nowrap}

        /* RESTAURANTES */
        .rest-row{display:flex;align-items:center;gap:14px;padding:13px 22px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;transition:background .15s}
        .rest-row:last-child{border-bottom:none}
        .rest-row:hover{background:rgba(255,255,255,.02)}
        .rest-avatar{width:40px;height:40px;border-radius:10px;background:var(--surface);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;overflow:hidden}
        .rest-avatar img{width:100%;height:100%;object-fit:cover}
        .rest-info{flex:1}
        .rest-nombre{font-size:13px;font-weight:500;color:var(--text)}
        .rest-meta{font-size:11px;color:var(--text-muted);margin-top:3px;display:flex;align-items:center;gap:6px}
        .rest-flecha{color:var(--text-muted);display:flex}

        /* EMPTY */
        .empty-state{text-align:center;padding:32px 16px;color:var(--text-muted)}
        .empty-icon{font-size:32px;margin-bottom:10px;opacity:.3}
        .empty-text{font-size:13px}
        .empty-btn{margin-top:12px;padding:8px 18px;border-radius:9px;background:var(--gold-dim);border:1px solid rgba(201,168,76,.2);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:12px;transition:all .2s}
        .empty-btn:hover{border-color:rgba(201,168,76,.4)}

        /* SKELETON */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        @media(max-width:1000px){.accesos-grid{grid-template-columns:repeat(2,1fr)}.bottom-grid{grid-template-columns:1fr}}
        @media(max-width:700px){.nav-links{display:none}.content{padding:24px 16px}.hero{padding:24px}.hero-right{display:none}.hero-nombre{font-size:26px}}
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
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" onError={e => e.target.style.display = 'none'} />
                : initials}
            </div>
            {menuOpen && (
              <div className="nav-dropdown">
                <div className="nd-user">
                  <div className="nd-name">{user?.name || 'Usuario'}</div>
                  <div className="nd-email">{user?.email || ''}</div>
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

      <div className="page">
        <div className="content">

          {/* HERO */}
          <div className="hero">
            <div className="hero-left">
              <div className="hero-saludo">{saludo}</div>
              <div className="hero-nombre">{user?.name || 'Bienvenido'} {user?.surname || ''} 👋</div>
              <div className="hero-sub">
                ¿Qué se te antoja hoy? Explora nuestra carta, haz un pedido o reserva una mesa.
              </div>
              <div className="hero-btn" onClick={() => navigate('/cliente/menu')}>
                <IconMenu /> Explorar el menú
              </div>
            </div>
            <div className="hero-right">🍽️</div>
          </div>

          {/* ALERTA PEDIDOS ACTIVOS */}
          {pedidosActivos.length > 0 && (
            <div className="alerta-activos" onClick={() => navigate('/cliente/mis-pedidos')}>
              <div className="alerta-left">
                <div className="alerta-icon">🚀</div>
                <div>
                  <div className="alerta-texto">
                    {pedidosActivos.length === 1
                      ? 'Tienes 1 pedido en proceso'
                      : `Tienes ${pedidosActivos.length} pedidos en proceso`
                    }
                  </div>
                  <div className="alerta-sub">Toca para ver el estado actual</div>
                </div>
              </div>
              <div className="alerta-arrow"><IconChevron /></div>
            </div>
          )}

          {/* ACCESOS RÁPIDOS */}
          <div className="section-title">¿Qué quieres hacer?</div>
          <div className="accesos-grid">
            {ACCESOS.map((a, i) => (
              <div key={i} className="acceso-card"
                style={{ background: a.color, borderColor: 'transparent' }}
                onClick={() => navigate(a.path)}>
                <div className="acceso-icon">{a.icon}</div>
                <div className="acceso-label">{a.label}</div>
                <div className="acceso-sub">{a.sub}</div>
              </div>
            ))}
          </div>

          {/* GRID INFERIOR */}
          <div className="bottom-grid">

            {/* Pedidos recientes */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Pedidos recientes</div>
                  <div className="card-sub">{pedidos.length} pedidos en total</div>
                </div>
                <button className="ver-mas" onClick={() => navigate('/cliente/mis-pedidos')}>
                  Ver todos <IconChevron />
                </button>
              </div>

              {loading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 22px', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      <div className="skel" style={{ width: 48, height: 18 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="skel" style={{ height: 13, width: '70%' }} />
                        <div className="skel" style={{ height: 10, width: '40%' }} />
                      </div>
                    </div>
                  ))}
                </>
              ) : ultimosPedidos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🧾</div>
                  <div className="empty-text">Aún no tienes pedidos</div>
                  <button className="empty-btn" onClick={() => navigate('/cliente/menu')}>
                    Hacer mi primer pedido
                  </button>
                </div>
              ) : (
                ultimosPedidos.map(p => {
                  const st = ESTADO_STYLE[p.estado] || { bg: 'rgba(255,255,255,.05)', bd: 'rgba(255,255,255,.1)', tx: '#aaa', label: p.estado }
                  return (
                    <div key={p._id} className="pedido-row"
                      onClick={() => navigate('/cliente/mis-pedidos')}>
                      <div className="pedido-id">#{p._id?.slice(-5).toUpperCase()}</div>
                      <div className="pedido-info">
                        <div className="pedido-rest">{p.restaurante?.nombre || 'Restaurante'}</div>
                        <div className="pedido-meta">
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <IconClock /> {timeAgo(p.createdAt)}
                          </span>
                          · {p.detalles?.length || 0} item(s)
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                        <div className="pedido-total">Q {Number(p.total || 0).toFixed(2)}</div>
                        <span className="badge-estado" style={{ background: st.bg, borderColor: st.bd, color: st.tx }}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Restaurantes */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Nuestros restaurantes</div>
                  <div className="card-sub">{restaurantes.length} sucursales disponibles</div>
                </div>
              </div>

              {loading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 14, padding: '13px 22px', borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'center' }}>
                      <div className="skel" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="skel" style={{ height: 13, width: '60%' }} />
                        <div className="skel" style={{ height: 10, width: '80%' }} />
                      </div>
                    </div>
                  ))}
                </>
              ) : restaurantes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏪</div>
                  <div className="empty-text">Sin restaurantes disponibles</div>
                </div>
              ) : (
                restaurantes.slice(0, 4).map(r => (
                  <div key={r._id} className="rest-row" onClick={() => navigate('/cliente/menu')}>
                    <div className="rest-avatar">
                      🍽️
                    </div>
                    <div className="rest-info">
                      <div className="rest-nombre">{r.nombre}</div>
                      <div className="rest-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <IconPin /> {r.direccion}
                        </span>
                        {r.telefono && (
                          <>· <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><IconPhone /> {r.telefono}</span></>
                        )}
                      </div>
                    </div>
                    <div className="rest-flecha"><IconChevron /></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
    </>
  )
}