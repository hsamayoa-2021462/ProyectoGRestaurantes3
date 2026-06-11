import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'
import NotificacionesPanel from '../../../shared/components/NotificacionesPanel'

/* ─── ICONS ─── */
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconRestaurant = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
const IconTrend = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
const IconClock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const IconCalendar = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: <IconDashboard />, path: '/admin' },
  { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/admin/menu' },
  { key: 'pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />, path: '/admin/reservaciones' },
  { key: 'restaurantes', label: 'Restaurantes', icon: <IconRestaurant />, path: '/admin/restaurantes' },
  { key: 'clientes', label: 'Clientes', icon: <IconUsers />, path: '/admin/clientes' },
  { key: 'reportes', label: 'Reportes', icon: <IconReport />, path: '/admin/reportes' },
  { key: 'resenas', label: 'Reseñas', icon: <IconStar />, path: '/admin/resenas' },
]

const ESTADO_STYLE = {
  PENDIENTE: { bg: 'rgba(201,168,76,.12)', bd: 'rgba(201,168,76,.35)', tx: '#e8c96a' },
  CONFIRMADO: { bg: 'rgba(91,155,213,.1)', bd: 'rgba(91,155,213,.3)', tx: '#90c0e8' },
  PREPARANDO: { bg: 'rgba(201,120,40,.1)', bd: 'rgba(201,120,40,.3)', tx: '#e8a060' },
  EN_CAMINO: { bg: 'rgba(100,160,220,.1)', bd: 'rgba(100,160,220,.3)', tx: '#78b8e8' },
  ENTREGADO: { bg: 'rgba(76,175,130,.1)', bd: 'rgba(76,175,130,.3)', tx: '#7dd9ae' },
  CANCELADO: { bg: 'rgba(224,90,90,.1)', bd: 'rgba(224,90,90,.3)', tx: '#e08080' },
}

const RESERVA_STYLE = {
  CONFIRMADA: { bg: 'rgba(76,175,130,.1)', bd: 'rgba(76,175,130,.25)', tx: '#7dd9ae' },
  PENDIENTE: { bg: 'rgba(201,168,76,.08)', bd: 'rgba(201,168,76,.2)', tx: '#e8c96a' },
  CANCELADA: { bg: 'rgba(224,90,90,.1)', bd: 'rgba(224,90,90,.25)', tx: '#e08080' },
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'dashboard'
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])
  const handleNavClick = (path, key) => { setActiveNav(key); navigate(path) }

  const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture || null)
  useEffect(() => {
    const refreshFoto = async () => {
      try {
        const res = await authApi.get('/auth/profile')
        const url = res.data?.data?.profilePicture
        if (url) setAvatarSrc(url)
      } catch { }
    }
    refreshFoto()
  }, [])

  // ── Datos ──
  const [pedidos, setPedidos] = useState([])
  const [reservaciones, setReservaciones] = useState([])
  const [clientes, setClientes] = useState([])
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)
  const loadedRef = useRef(false)

  const load = async () => {
    setLoading(true)
    try {
      const [pedRes, resRes, cliRes, mesRes] = await Promise.all([
        api.get('/pedidos/pedidos'),
        api.get('/reservaciones/reservaciones'),
        authApi.get('/users'),
        api.get('/restaurante/mesas'),
      ])
      setPedidos(pedRes.data?.data || [])
      setReservaciones(resRes.data?.data || [])
      setClientes(cliRes.data?.users || [])
      setMesas(mesRes.data?.data || [])
    } catch { /* silencioso en dashboard */ }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  // ── Cálculos ──
  const hoy = new Date().toISOString().split('T')[0]

  const ingresosHoy = pedidos.filter(p => p.estado === 'ENTREGADO' && (p.createdAt || '').substring(0, 10) === hoy)
    .reduce((s, p) => s + (p.total || 0), 0)
  const pedidosActivos = pedidos.filter(p => ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO'].includes(p.estado)).length
  const mesasReservadas = mesas.filter(m => m.estado === 'RESERVADA').length
  const reservasHoy = reservaciones.filter(r => (r.fecha || '').substring(0, 10) === hoy).length

  // Últimos 5 pedidos
  const ultimosPedidos = [...pedidos]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Reservaciones de hoy
  const reservasDeHoy = reservaciones
    .filter(r => (r.fecha || '').substring(0, 10) === hoy)
    .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
    .slice(0, 5)

  const fmtQ = n => `Q ${Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`

  const timeAgo = (iso) => {
    if (!iso) return '—'
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
    if (diff < 1) return 'ahora'
    if (diff < 60) return `${diff} min`
    if (diff < 1440) return `${Math.floor(diff / 60)}h`
    return `${Math.floor(diff / 1440)}d`
  }

  const STATS = [
    {
      label: 'Ingresos Hoy',
      value: loading ? '...' : fmtQ(ingresosHoy),
      icon: '💰',
      delta: 'Pedidos entregados',
      positive: true,
    },
    {
      label: 'Pedidos Activos',
      value: loading ? '...' : pedidosActivos,
      icon: '🧾',
      delta: `${pedidos.length} totales`,
      positive: true,
    },
    {
      label: 'Mesas Reservadas',
      value: loading ? '...' : `${mesasReservadas}/${mesas.length}`,
      icon: '🪑',
      delta: mesas.length > 0 ? `${Math.round((mesasReservadas / mesas.length) * 100)}% reservadas` : '—',
      positive: mesasReservadas < mesas.length,
    },
    {
      label: 'Reservas Hoy',
      value: loading ? '...' : reservasHoy,
      icon: '📅',
      delta: `${clientes.length} clientes registrados`,
      positive: true,
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --black:#07080a;--deep:#0d0f12;--surface:#12151a;
          --glass-bg:rgba(255,255,255,0.045);--glass-bd:rgba(255,255,255,0.09);--glass-hi:rgba(255,255,255,0.13);
          --gold:#c9a84c;--gold-lt:#e8c96a;--gold-glow:rgba(201,168,76,.22);--gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;
          --success:#4caf82;--error:#e05a5a;
          --radius-card:20px;--radius-inp:11px;
          --blur:blur(24px) saturate(180%);
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
          --sidebar-w:240px;
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}
        .admin-layout{display:flex;min-height:100vh}

        /* SIDEBAR */
        .admin-sidebar{width:var(--sidebar-w);background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:width .3s var(--ease-out-expo);overflow:hidden}
        .admin-sidebar.collapsed{width:64px}
        .sidebar-brand{padding:24px 20px 20px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:80px;position:relative}
        .sidebar-brand::after{content:'';position:absolute;bottom:-1px;left:0;width:80px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--gold);box-shadow:0 0 16px rgba(201,168,76,.1)}
        .brand-text{overflow:hidden;white-space:nowrap}
        .brand-text-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text);display:block;line-height:1}
        .brand-text-role{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);opacity:.7;display:block;margin-top:3px}
        .sidebar-nav{flex:1;padding:16px 10px;overflow-y:auto;overflow-x:hidden}
        .sidebar-nav::-webkit-scrollbar{width:3px}
        .sidebar-nav::-webkit-scrollbar-thumb{background:var(--glass-bd);border-radius:2px}
        .nav-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);padding:0 10px;margin:16px 0 8px;white-space:nowrap;overflow:hidden;transition:opacity .2s}
        .admin-sidebar.collapsed .nav-label{opacity:0}
        .nav-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13.5px;font-weight:400;letter-spacing:.3px;transition:all .2s;position:relative;white-space:nowrap;margin-bottom:2px}
        .nav-item:hover{background:var(--glass-bg);color:var(--text)}
        .nav-item.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.15)}
        .nav-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;border-radius:2px;background:var(--gold)}
        .nav-icon{flex-shrink:0;display:flex}
        .nav-text{overflow:hidden;transition:opacity .2s,width .3s}
        .admin-sidebar.collapsed .nav-text{opacity:0;width:0}
        
        .sidebar-footer{padding:16px 10px;border-top:1px solid var(--glass-bd)}
        .user-card{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);margin-bottom:8px;overflow:hidden;cursor:pointer;transition:border-color .2s,background .2s}
        .user-card:hover{border-color:rgba(201,168,76,.35);background:var(--gold-dim)}
        .user-avatar{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold-lt);flex-shrink:0;font-family:'Cormorant Garamond',serif;overflow:hidden}
        .user-avatar img{width:100%;height:100%;object-fit:cover;border-radius:7px}
        .user-info{overflow:hidden}
        .user-name{font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .user-role{font-size:10px;color:var(--gold);letter-spacing:.5px;text-transform:uppercase}
        .admin-sidebar.collapsed .user-info{display:none}
        
        .logout-btn{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;width:100%;transition:all .2s;white-space:nowrap}
        .logout-btn:hover{background:rgba(224,90,90,.08);color:var(--error)}
        .admin-sidebar.collapsed .logout-btn span{display:none}
        
        .sidebar-toggle{position:absolute;top:50%;right:-12px;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:var(--deep);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s;z-index:101;flex-shrink:0}
        .sidebar-toggle:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}
        .sidebar-toggle svg{transition:transform .3s}
        .admin-sidebar.collapsed .sidebar-toggle svg{transform:rotate(180deg)}

        /* MAIN */
        .admin-main{flex:1;margin-left:var(--sidebar-w);transition:margin-left .3s var(--ease-out-expo);min-height:100vh;display:flex;flex-direction:column}
        .admin-main.collapsed{margin-left:64px}
        .admin-topbar{height:64px;background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:50}
        .topbar-left{display:flex;flex-direction:column}
        .topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.5px;color:var(--text)}
        .topbar-breadcrumb{font-size:11px;color:var(--text-muted);letter-spacing:.3px}
        .topbar-right{display:flex;align-items:center;gap:12px}
        .topbar-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s;position:relative}
        .topbar-btn:hover{color:var(--gold);border-color:rgba(201,168,76,.2)}
        .topbar-date{font-size:12px;color:var(--text-muted);background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:8px;padding:6px 12px}
        .admin-content{padding:32px;flex:1}

        /* STATS */
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .stat-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:22px;position:relative;overflow:hidden;transition:border-color .25s,transform .2s}
        .stat-card::before{content:'';position:absolute;top:0;left:0;width:60px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .stat-card::after{content:'';position:absolute;top:0;left:0;width:1px;height:60px;background:linear-gradient(180deg,var(--gold),transparent)}
        .stat-card:hover{border-color:rgba(201,168,76,.2);transform:translateY(-2px)}
        .stat-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .stat-icon{font-size:22px}
        .stat-delta{display:flex;align-items:center;gap:4px;font-size:10px;font-weight:500;padding:3px 8px;border-radius:20px;background:rgba(76,175,130,.1);color:var(--success)}
        .stat-value{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:500;color:var(--text);letter-spacing:.5px;line-height:1;margin-bottom:4px}
        .stat-label{font-size:11px;color:var(--text-muted)}
        .stat-sub{font-size:10.5px;color:var(--text-muted);margin-top:4px}

        /* ACCIONES RÁPIDAS */
        .quick-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .quick-btn{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:14px;padding:16px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--text-mid);font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:.3px;transition:all .2s;text-align:center}
        .quick-btn:hover{background:var(--gold-dim);border-color:rgba(201,168,76,.25);color:var(--gold-lt);transform:translateY(-2px)}
        .quick-btn-icon{font-size:20px}

        /* GRID CARDS */
        .dash-grid{display:grid;grid-template-columns:1fr 360px;gap:20px;margin-bottom:20px}
        .dash-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .dash-card-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px 16px;border-bottom:1px solid var(--glass-bd)}
        .dash-card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;color:var(--text);letter-spacing:.3px}
        .dash-card-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .view-all{font-size:11.5px;color:var(--gold);background:none;border:none;cursor:pointer;font-family:'Outfit',sans-serif;opacity:.8;transition:opacity .2s;display:flex;align-items:center;gap:4px}
        .view-all:hover{opacity:1}

        /* TABLA PEDIDOS */
        .orders-table{width:100%;border-collapse:collapse}
        .orders-table th{padding:9px 20px;text-align:left;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid var(--glass-bd);background:rgba(255,255,255,.015)}
        .orders-table td{padding:12px 20px;font-size:13px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--text)}
        .orders-table tr:last-child td{border-bottom:none}
        .orders-table tr:hover td{background:rgba(255,255,255,.02)}
        .order-id{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt);font-weight:500}
        .order-sub{font-size:11px;color:var(--text-muted);margin-top:1px}
        .status-badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:10px;border:1px solid;white-space:nowrap}
        .empty-dash{text-align:center;padding:40px;color:var(--text-muted);font-size:13px}
        .empty-dash-icon{font-size:28px;margin-bottom:8px;opacity:.35}

        /* RESERVAS HOY */
        .reserv-list{padding:4px 0}
        .reserv-item{display:flex;align-items:center;gap:12px;padding:11px 20px;border-bottom:1px solid rgba(255,255,255,.04);transition:background .15s}
        .reserv-item:last-child{border-bottom:none}
        .reserv-item:hover{background:rgba(255,255,255,.02)}
        .reserv-time{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:var(--gold-lt);min-width:52px;letter-spacing:.5px}
        .reserv-info{flex:1}
        .reserv-name{font-size:13px;color:var(--text)}
        .reserv-meta{font-size:11px;color:var(--text-muted);margin-top:2px}

        /* LOADING SKELETON */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:6px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        @media(max-width:1200px){.stats-grid{grid-template-columns:repeat(2,1fr)}.dash-grid{grid-template-columns:1fr}.quick-actions{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><IconChevron /></button>
          <div className="sidebar-brand">
            <div className="brand-icon"><IconRestaurant /></div>
            <div className="brand-text">
              <span className="brand-text-name">Gastro</span>
              <span className="brand-text-role">Admin Panel</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Principal</div>
            {NAV_ITEMS.map(item => (
              <div key={item.key} className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path, item.key)}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-card" onClick={() => navigate('/admin/perfil')}>
              <div className="user-avatar">
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" onError={() => setAvatarSrc(null)} />
                  : (user?.name || user?.nombre || 'A')[0].toUpperCase()
                }
              </div>
              <div className="user-info">
                <div className="user-name">{user?.name || user?.nombre || 'Admin'}</div>
                <div className="user-role">Administrador</div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <IconLogout />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className={`admin-main ${sidebarOpen ? '' : 'collapsed'}`}>
          <header className="admin-topbar">
            <div className="topbar-left">
              <span className="topbar-title">Dashboard</span>
              <span className="topbar-breadcrumb">Panel de control · Resumen general</span>
            </div>
            <div className="topbar-right">
              <div className="topbar-date">
                {new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <NotificacionesPanel isAdmin={true} />
            </div>
          </header>

          <div className="admin-content">
            {/* STATS */}
            <div className="stats-grid">
              {STATS.map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-header">
                    <span className="stat-icon">{s.icon}</span>
                    <span className="stat-delta"><IconTrend /> En vivo</span>
                  </div>
                  {loading
                    ? <div className="skel" style={{ height: 32, width: '60%', marginBottom: 8 }} />
                    : <div className="stat-value">{s.value}</div>
                  }
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-sub">{s.delta}</div>
                </div>
              ))}
            </div>

            {/* ACCIONES RÁPIDAS */}
            <div className="quick-actions">
              {[
                { icon: '🪑', label: 'Ver Mesas', path: '/admin/restaurantes' },
                { icon: '🍽️', label: 'Gestionar Menú', path: '/admin/menu' },
                { icon: '🧾', label: 'Ver Pedidos', path: '/admin/pedidos' },
                { icon: '📅', label: 'Reservaciones', path: '/admin/reservaciones' },
              ].map((a, i) => (
                <button className="quick-btn" key={i} onClick={() => navigate(a.path)}>
                  <span className="quick-btn-icon">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>

            {/* GRID PRINCIPAL */}
            <div className="dash-grid">
              {/* Últimos pedidos */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <div className="dash-card-title">Pedidos Recientes</div>
                    <div className="dash-card-sub">Últimos {ultimosPedidos.length} pedidos del sistema</div>
                  </div>
                  <button className="view-all" onClick={() => navigate('/admin/pedidos')}>
                    Ver todos <IconChevron />
                  </button>
                </div>
                {loading ? (
                  <div className="empty-dash">
                    <div className="skel" style={{ height: 40, marginBottom: 8 }} />
                    <div className="skel" style={{ height: 40, marginBottom: 8 }} />
                    <div className="skel" style={{ height: 40 }} />
                  </div>
                ) : ultimosPedidos.length === 0 ? (
                  <div className="empty-dash">
                    <div className="empty-dash-icon">🧾</div>
                    <div>Sin pedidos registrados aún</div>
                  </div>
                ) : (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Hace</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimosPedidos.map(p => {
                        const st = ESTADO_STYLE[p.estado] || {}
                        const nombreCliente = p.usuario?.name
                          ? `${p.usuario.name} ${p.usuario?.surname || ''}`.trim()
                          : p.usuario || '—'
                        return (
                          <tr key={p._id}>
                            <td><span className="order-id">#{p._id?.slice(-5).toUpperCase()}</span></td>
                            <td>
                              <div>{nombreCliente}</div>
                              <div className="order-sub">{p.tipoEntrega || ''}</div>
                            </td>
                            <td>
                              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: 'var(--gold-lt)' }}>
                                Q {Number(p.total || 0).toFixed(2)}
                              </div>
                            </td>
                            <td>
                              <span className="status-badge"
                                style={{ background: st.bg, borderColor: st.bd, color: st.tx }}>
                                {p.estado}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <IconClock /> {timeAgo(p.createdAt)}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Reservaciones de hoy */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <div className="dash-card-title">Reservaciones Hoy</div>
                    <div className="dash-card-sub">{reservasHoy} reservas para hoy</div>
                  </div>
                  <button className="view-all" onClick={() => navigate('/admin/reservaciones')}>
                    Ver todas <IconChevron />
                  </button>
                </div>
                {loading ? (
                  <div className="empty-dash">
                    <div className="skel" style={{ height: 56, marginBottom: 8 }} />
                    <div className="skel" style={{ height: 56 }} />
                  </div>
                ) : reservasDeHoy.length === 0 ? (
                  <div className="empty-dash">
                    <div className="empty-dash-icon">📅</div>
                    <div>Sin reservaciones para hoy</div>
                  </div>
                ) : (
                  <div className="reserv-list">
                    {reservasDeHoy.map((r, i) => {
                      const estadoNombre = typeof r.estado === 'object' ? r.estado?.nombre : r.estado
                      const st = RESERVA_STYLE[estadoNombre] || RESERVA_STYLE.PENDIENTE
                      const clienteData = clientes.find(c => c.id === r.usuario)
                      const clienteNombre = clienteData
                        ? `${clienteData.name || ''} ${clienteData.surname || ''}`.trim()
                        : r.usuario || '—'
                      return (
                        <div key={r._id || i} className="reserv-item">
                          <div className="reserv-time">
                            <IconCalendar /> {r.hora || '—'}
                          </div>
                          <div className="reserv-info">
                            <div className="reserv-name">{clienteNombre}</div>
                            <div className="reserv-meta">
                              {r.mesa ? `Mesa #${r.mesa.numeroMesa}` : 'Sin mesa'} · {r.numPersonas || '—'} personas
                            </div>
                          </div>
                          <span className="status-badge"
                            style={{ background: st.bg, borderColor: st.bd, color: st.tx, fontSize: 10 }}>
                            {estadoNombre}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RESUMEN MESAS */}
            {!loading && mesas.length > 0 && (
              <div className="dash-card" style={{ marginBottom: 0 }}>
                <div className="dash-card-header">
                  <div>
                    <div className="dash-card-title">Estado de Mesas</div>
                    <div className="dash-card-sub">{mesas.length} mesas en total</div>
                  </div>
                </div>
                <div style={{ padding: '16px 24px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Disponibles', cnt: mesas.filter(m => m.estado === 'DISPONIBLE').length, color: '#4caf82', bg: 'rgba(76,175,130,.1)', bd: 'rgba(76,175,130,.25)' },
                    { label: 'Ocupadas', cnt: mesas.filter(m => m.estado === 'OCUPADA').length, color: '#e08080', bg: 'rgba(224,90,90,.1)', bd: 'rgba(224,90,90,.25)' },
                    { label: 'Reservadas', cnt: mesas.filter(m => m.estado === 'RESERVADA').length, color: '#e8c96a', bg: 'rgba(201,168,76,.08)', bd: 'rgba(201,168,76,.2)' },
                    { label: 'Mantenimiento', cnt: mesas.filter(m => m.estado === 'MANTENIMIENTO').length, color: '#9a9385', bg: 'rgba(120,120,140,.1)', bd: 'rgba(120,120,140,.2)' },
                  ].map((m, i) => (
                    <div key={i} style={{
                      padding: '10px 18px', borderRadius: 12, background: m.bg, border: `1px solid ${m.bd}`,
                      display: 'flex', alignItems: 'center', gap: 10
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                      <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>{m.label}: </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{m.cnt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}