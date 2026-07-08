import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'

/* ─── ICONS ─── */
const IconDash    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const IconMenu    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/></svg>
const IconOrders  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const IconTable   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
const IconUsers   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const IconStar   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconReport  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const IconUser    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLogout  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
const IconRest    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2"/></svg>
const IconCalendar= () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconClock   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconTrash   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
const IconCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
const IconClose   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
const IconBurger  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
const IconSearch  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

const NAV = [
  { key: 'dashboard',     label: 'Dashboard',     icon: <IconDash />,    path: '/admin' },
  { key: 'menu',          label: 'Menú',          icon: <IconMenu />,    path: '/admin/menu' },
  { key: 'pedidos',       label: 'Pedidos',       icon: <IconOrders />,  path: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />,   path: '/admin/reservaciones' },
  { key: 'restaurantes',  label: 'Restaurantes',  icon: <IconRest />,    path: '/admin/restaurantes' },
  { key: 'clientes',      label: 'Clientes',      icon: <IconUsers />,   path: '/admin/clientes' },
  { key: 'reportes',      label: 'Reportes',      icon: <IconReport />,  path: '/admin/reportes' },
  { key: 'resenas',       label: 'Reseñas',       icon: <IconStar />,    path: '/admin/resenas' },
]

const ESTADO_STYLES = {
  PENDIENTE:   { bg: 'rgba(201,168,76,.12)',  bd: 'rgba(201,168,76,.3)',  tx: '#e8c96a', label: 'Pendiente' },
  CONFIRMADA:  { bg: 'rgba(76,175,130,.1)',   bd: 'rgba(76,175,130,.3)',  tx: '#7dd9ae', label: 'Confirmada' },
  CANCELADA:   { bg: 'rgba(224,90,90,.1)',    bd: 'rgba(224,90,90,.3)',   tx: '#e08080', label: 'Cancelada' },
  COMPLETADA:  { bg: 'rgba(91,155,213,.1)',   bd: 'rgba(91,155,213,.3)',  tx: '#90c0e8', label: 'Completada' },
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function AdminReservaciones() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen]   = useState(false)

  const getActiveKey = () => NAV.find(i => i.path === location.pathname)?.key || 'reservaciones'
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

  const handleNavClick = (path, key) => { 
    setActiveNav(key)
    setMobileOpen(false) 
    navigate(path) 
  }

  const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture || null)
  useEffect(() => {
    authApi.get('/auth/profile').then(r => {
      const url = r.data?.data?.profilePicture
      if (url) setAvatarSrc(url)
    }).catch(() => {})
  }, [])

  const [reservaciones, setReservaciones] = useState([])
  const [estadosRes, setEstadosRes]       = useState([])
  const [loading, setLoading]             = useState(false)
  const [search, setSearch]               = useState('')
  const [filtroEstado, setFiltroEstado]   = useState('TODOS')
  const [detalle, setDetalle]             = useState(null)
  const [toast, setToast]                 = useState(null)
  const [menuOpen, setMenuOpen]           = useState(false)
  const [ocultas, setOcultas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_reservaciones_ocultas') || '[]') } catch { return [] }
  })
  const ocultarReservacion = (id) => {
    const nuevas = [...ocultas, id]
    setOcultas(nuevas)
    try { localStorage.setItem('admin_reservaciones_ocultas', JSON.stringify(nuevas)) } catch { }
  }
  const loadedRef = useRef(false)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = async () => {
    setLoading(true)
    try {
      const [resRes, estRes] = await Promise.all([
        api.get('/reservaciones/reservaciones'),
        api.get('/reservaciones/estados-reservacion'),
      ])
      setReservaciones(resRes.data?.data || [])
      setEstadosRes(estRes.data?.data || [])
    } catch { showToast('Error al cargar reservaciones', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  // ── Cambiar estado ──
  const handleEstado = async (id, nombreEstado) => {
    const estadoDoc = estadosRes.find(e => e.nombre === nombreEstado)
    if (!estadoDoc) return showToast(`Estado ${nombreEstado} no configurado`, 'error')

    if (nombreEstado === 'COMPLETADA') {
      try {
        await api.put(`/reservaciones/reservaciones/${id}/completar`)
        setReservaciones(prev => prev.map(r => r._id === id ? { ...r, estado: { ...r.estado, nombre: 'COMPLETADA' } } : r))
        if (detalle?._id === id) setDetalle(prev => ({ ...prev, estado: { ...prev.estado, nombre: 'COMPLETADA' } }))
        showToast('Reservación completada — mesa liberada ✅')
      } catch (err) { showToast(err.response?.data?.message || 'Error', 'error') }
      return
    }

    try {
      await api.put(`/reservaciones/reservaciones/${id}`, { estado: estadoDoc._id })
      setReservaciones(prev => prev.map(r => r._id === id ? { ...r, estado: estadoDoc } : r))
      if (detalle?._id === id) setDetalle(prev => ({ ...prev, estado: estadoDoc }))
      showToast('Estado actualizado')
    } catch (err) { showToast(err.response?.data?.message || 'Error al actualizar', 'error') }
  }

  // ── Eliminar ──
  const handleDelete = async (id, estadoNombre) => {
    if (!['PENDIENTE', 'CANCELADA'].includes(estadoNombre)) {
      return showToast('Solo se pueden eliminar reservaciones Pendientes o Canceladas', 'error')
    }
    if (!window.confirm('¿Eliminar esta reservación?')) return
    try {
      await api.delete(`/reservaciones/reservaciones/${id}`)
      setReservaciones(prev => prev.filter(r => r._id !== id))
      if (detalle?._id === id) setDetalle(null)
      showToast('Reservación eliminada')
    } catch (err) { showToast(err.response?.data?.message || 'Error al eliminar', 'error') }
  }

  // ── Filtros ──
  const filtradas = reservaciones.filter(r => {
    const estadoNombre = r.estado?.nombre || r.estado || ''
    const matchEstado = filtroEstado === 'TODOS' || estadoNombre === filtroEstado
    const matchSearch = !search ||
      (r.usuario || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.restaurante?.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.mesa?.numeroMesa?.toString() || '').includes(search)
    return matchEstado && matchSearch && !ocultas.includes(r._id)
  })

  // Stats
  const pendientes  = reservaciones.filter(r => (r.estado?.nombre || r.estado) === 'PENDIENTE').length
  const confirmadas = reservaciones.filter(r => (r.estado?.nombre || r.estado) === 'CONFIRMADA').length
  const hoy         = new Date().toISOString().substring(0, 10)
  const deHoy       = reservaciones.filter(r => r.fecha?.substring(0, 10) === hoy).length

  const initials = (user?.name?.[0] || 'A').toUpperCase()
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
        
        /* LAYOUT GENERAL */
        .admin-layout{display:flex;min-height:100vh}

        /* SIDEBAR */
        .admin-sidebar{width:var(--sidebar-w);background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:width .3s var(--ease-out-expo), transform .3s var(--ease-out-expo);overflow:hidden}
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
        .nav-text{overflow:hidden;transition:opacity .2s, width .3s}
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

        /* MAIN Y TOPBAR */
        .admin-main{flex:1;margin-left:var(--sidebar-w);transition:margin-left .3s var(--ease-out-expo);min-height:100vh;display:flex;flex-direction:column}
        .admin-main.collapsed{margin-left:64px}
        .admin-topbar{height:64px;background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:50}
        .topbar-left{display:flex;flex-direction:row;align-items:center;gap:14px}
        .topbar-titles{display:flex;flex-direction:column}
        .topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.5px;color:var(--text);line-height:1.2}
        .topbar-breadcrumb{font-size:11px;color:var(--text-muted);letter-spacing:.3px}
        .topbar-right{display:flex;align-items:center;gap:12px}

        /* BURGER Y OVERLAY */
        .burger-btn{display:none;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-mid);padding:8px;border-radius:8px;cursor:pointer;align-items:center;justify-content:center;transition:all .2s}
        .burger-btn:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}
        .mobile-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:99}

        /* CONTENT GENERAL */
        .admin-content{padding:32px;flex:1;display:flex;flex-direction:column;gap:24px}

        /* STATS */
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .sc{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:20px;position:relative;overflow:hidden}
        .sc::before{content:'';position:absolute;top:0;left:0;width:60px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .sc-icon{font-size:20px;margin-bottom:8px}
        .sc-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;line-height:1;margin-bottom:3px}
        .sc-lbl{font-size:11px;color:var(--text-muted)}

        /* CARD TABLA */
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .card-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--glass-bd);gap:12px;flex-wrap:wrap}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500}
        .card-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .header-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .search-wrap{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:10px;padding:7px 12px}
        .search-wrap input{background:none;border:none;outline:none;color:var(--text);font-family:'Outfit',sans-serif;font-size:13px;width:180px}
        .search-wrap input::placeholder{color:var(--text-muted)}

        /* FILTROS */
        .filtros{display:flex;gap:6px;flex-wrap:wrap}
        .fbtn{padding:6px 14px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s;white-space:nowrap}
        .fbtn:hover{color:var(--text)}
        .fbtn.active{background:var(--gold-dim);border-color:rgba(201,168,76,.3);color:var(--gold-lt)}
        .refresh-btn{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:9px;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s}
        .refresh-btn:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3)}

        /* TABLA */
        .table-responsive{width:100%;overflow-x:auto}
        .data-table{width:100%;border-collapse:collapse}
        .data-table th{padding:11px 16px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid var(--glass-bd);font-weight:400;white-space:nowrap}
        .data-table td{padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle;white-space:nowrap}
        .data-table tr:last-child td{border-bottom:none}
        .data-table tr:hover td{background:rgba(255,255,255,.02)}
        .cell-main{font-size:13px;color:var(--text)}
        .cell-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .cell-mono{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt)}
        .badge-estado{display:inline-flex;align-items:center;padding:4px 12px;border-radius:20px;font-size:11px;border:1px solid;white-space:nowrap}

        /* ESTADO SELECT Y BOTONES */
        .estado-select{background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:8px;padding:6px 10px;color:var(--text-mid);font-family:'Outfit',sans-serif;font-size:12px;cursor:pointer;outline:none;transition:border-color .2s}
        .estado-select:hover{border-color:rgba(201,168,76,.3)}
        .estado-select option{background:var(--deep);color:var(--text)}
        .action-btns{display:flex;align-items:center;gap:6px}
        .action-btn{width:30px;height:30px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .action-btn:hover{color:var(--text);background:rgba(255,255,255,.08)}
        .action-btn.danger:hover{color:var(--error);border-color:rgba(224,90,90,.3);background:rgba(224,90,90,.08)}
        .action-btn:disabled{opacity:.3;cursor:not-allowed}

        .empty-row td{text-align:center;padding:48px;color:var(--text-muted);font-size:13px}
        .loading-row td{text-align:center;padding:32px;color:var(--text-muted);font-size:13px}

        /* PANEL DETALLE */
        .panel-ov{position:fixed;inset:0;background:rgba(7,8,10,.82);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-start;justify-content:flex-end}
        .panel{width:100%;max-width:440px;height:100vh;background:var(--deep);border-left:1px solid var(--glass-bd);overflow-y:auto;display:flex;flex-direction:column;animation:slideIn .3s cubic-bezier(0.16,1,0.3,1)}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .panel-head{padding:22px 24px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--deep);z-index:1}
        .panel-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500}
        .panel-close{width:32px;height:32px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .panel-close:hover{color:var(--error)}
        .panel-body{padding:24px;flex:1;display:flex;flex-direction:column;gap:20px}
        .dsec{display:flex;flex-direction:column;gap:8px}
        .dsec-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);opacity:.7;border-bottom:1px solid rgba(201,168,76,.15);padding-bottom:4px}
        .drow{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .drow:last-child{border-bottom:none}
        .dk{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:5px}
        .dv{font-size:13px;color:var(--text);text-align:right}
        .dv.gold{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt)}
        .panel-actions{display:flex;flex-direction:column;gap:8px}
        .pa-btn{width:100%;padding:11px;border-radius:10px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid}
        .pa-btn.confirm{background:rgba(76,175,130,.1);border-color:rgba(76,175,130,.3);color:var(--success)}
        .pa-btn.confirm:hover{background:rgba(76,175,130,.18)}
        .pa-btn.complete{background:rgba(91,155,213,.1);border-color:rgba(91,155,213,.3);color:#90c0e8}
        .pa-btn.complete:hover{background:rgba(91,155,213,.18)}
        .pa-btn.danger{background:rgba(224,90,90,.08);border-color:rgba(224,90,90,.25);color:var(--error)}
        .pa-btn.danger:hover{background:rgba(224,90,90,.15)}
        .pa-btn:disabled{opacity:.4;cursor:not-allowed}

        /* TOAST Y AVATAR DROPDOWN */
        .toast{position:fixed;bottom:28px;right:28px;padding:12px 20px;border-radius:12px;font-size:13px;z-index:999;animation:slideUp .3s ease;border:1px solid}
        .toast-success{background:rgba(76,175,130,.15);border-color:rgba(76,175,130,.3);color:var(--success)}
        .toast-error{background:rgba(224,90,90,.15);border-color:rgba(224,90,90,.3);color:var(--error)}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        
        .av-wrap{position:relative}
        .av-btn{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--gold-lt);cursor:pointer;overflow:hidden}
        .av-btn img{width:100%;height:100%;object-fit:cover}
        .av-drop{position:absolute;top:calc(100%+8px);right:0;background:var(--deep);border:1px solid var(--glass-bd);border-radius:14px;padding:8px;min-width:180px;z-index:200;animation:fadeIn .15s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .av-drop-user{padding:10px 12px;border-bottom:1px solid var(--glass-bd);margin-bottom:6px}
        .av-drop-name{font-size:13px;font-weight:500}
        .av-drop-email{font-size:11px;color:var(--text-muted)}
        .av-drop-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s}
        .av-drop-item:hover{background:var(--glass-bg);color:var(--text)}
        .av-drop-item.danger:hover{background:rgba(224,90,90,.08);color:var(--error)}

        /* RESPONSIVE MOBILE */
        @media(max-width:1200px){
          .stats-grid{grid-template-columns:repeat(2,1fr)}
        }
        
        @media(max-width:768px){
          .burger-btn{display:flex}
          .admin-main, .admin-main.collapsed{margin-left:0 !important}
          .admin-content{padding:16px}
          .topbar-breadcrumb{display:none}
          
          /* ── DISEÑO 2x2 PREMIUM SIN ESPACIO MUERTO ── */
          .stats-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 12px; 
            margin-bottom: 24px;
          }
          
          .sc { 
            padding: 20px 14px; 
            min-height: 125px; /* Forzamos altura elegante como tu Dashboard principal */
            display: flex;
            flex-direction: column;
            justify-content: space-between; /* Distribuye el título arriba y el número abajo */
          }
          
          .sc-icon {
            font-size: 22px;
            margin-bottom: 0; /* Controlado ahora por el flexbox */
            display: inline-block;
          }
          
          .sc-val { 
            font-size: 28px; /* Número grande e imponente */
            font-weight: 500;
            margin-top: auto; /* Anclado firmemente abajo */
            margin-bottom: 4px;
          }
          
          .sc-lbl {
            font-size: 12px; /* Texto un poco más nítido y legible */
            color: var(--text-mid);
          }
          /* ────────────────────────────────────────── */

          /* Ajuste estricto Topbar */
          .admin-topbar {
            padding: 0 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            height: 64px !important;
            position: relative !important;
          }
          .topbar-left {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            max-width: calc(100% - 180px) !important;
          }
          .topbar-title {
            font-size: 18px !important;
            white-space: nowrap !important;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .topbar-right {
            position: absolute !important;
            top: 50% !important;
            right: 16px !important;
            transform: translateY(-50%) !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 10px !important;
            margin: 0 !important;
          }

          /* Drawer Sidebar Mobile */
          .admin-sidebar{
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            width: var(--sidebar-w) !important;
            z-index: 100;
            box-shadow: 10px 0 30px rgba(0,0,0,0.5);
          }
          .admin-sidebar.mobile-open{
            transform: translateX(0);
          }
          .sidebar-toggle{display:none}
          
          .mobile-overlay.show{display:block}
          
          .admin-sidebar .nav-text, .admin-sidebar .user-info, .admin-sidebar .logout-btn span{
            opacity: 1 !important;
            width: auto !important;
            display: block !important;
          }
          
          .card-header{flex-direction:column;align-items:flex-start}
          .header-actions{width:100%;justify-content:space-between}
          .search-wrap{width:100%}
          .search-wrap input{width:100%}
          .filtros{overflow-x:auto;padding-bottom:4px;flex-wrap:nowrap}
        }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="admin-layout">
        {/* FONDO OSCURO MÓVIL */}
        <div className={`mobile-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)} />

        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'} ${mobileOpen ? 'mobile-open' : ''}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><IconChevron /></button>
          <div className="sidebar-brand">
            <div className="brand-icon"><IconRest /></div>
            <div className="brand-text">
              <span className="brand-text-name">Gastro</span>
              <span className="brand-text-role">Admin Panel</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Principal</div>
            {NAV.map(item => (
              <div key={item.key} className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path, item.key)}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </div>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <div className="user-card" onClick={() => { navigate('/admin/perfil'); setMobileOpen(false); }}>
              <div className="user-avatar">
                {avatarSrc ? <img src={avatarSrc} alt="avatar" onError={() => setAvatarSrc(null)} /> : initials}
              </div>
              <div className="user-info">
                <div className="user-name">{user?.name || 'Admin'}</div>
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
              {/* BOTÓN HAMBURGUESA */}
              <button className="burger-btn" onClick={() => setMobileOpen(!mobileOpen)}>
                <IconBurger />
              </button>
              <div className="topbar-titles">
                <span className="topbar-title">Reservaciones</span>
                <span className="topbar-breadcrumb">Gestión de mesas y reservas</span>
              </div>
            </div>
            
            <div className="topbar-right">
              <div className="av-wrap">
                <div className="av-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  {avatarSrc ? <img src={avatarSrc} alt="av" onError={() => setAvatarSrc(null)} /> : initials}
                </div>
                {menuOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setMenuOpen(false)} />
                    <div className="av-drop">
                      <div className="av-drop-user">
                        <div className="av-drop-name">{user?.name} {user?.surname}</div>
                        <div className="av-drop-email">{user?.email}</div>
                      </div>
                      <div className="av-drop-item" onClick={() => { setMenuOpen(false); navigate('/admin/perfil') }}><IconUser /> Mi Perfil</div>
                      <div className="av-drop-item danger" onClick={() => { setMenuOpen(false); logout() }}><IconLogout /> Cerrar Sesión</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <div className="admin-content">
            {/* STATS */}
            <div className="stats-grid">
              <div className="sc">
                <div className="sc-icon">📋</div>
                <div className="sc-val">{reservaciones.length - ocultas.length}</div>
                <div className="sc-lbl">Total Visibles</div>
              </div>
              <div className="sc">
                <div className="sc-icon">⏳</div>
                <div className="sc-val">{pendientes}</div>
                <div className="sc-lbl">Pendientes</div>
              </div>
              <div className="sc">
                <div className="sc-icon">✅</div>
                <div className="sc-val">{confirmadas}</div>
                <div className="sc-lbl">Confirmadas</div>
              </div>
              <div className="sc">
                <div className="sc-icon">📅</div>
                <div className="sc-val">{deHoy}</div>
                <div className="sc-lbl">Reservas Hoy</div>
              </div>
            </div>

            {/* TABLA DE RESERVAS */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Listado de Reservaciones</div>
                  <div className="card-sub">{filtradas.length} registros</div>
                </div>
                <div className="header-actions">
                  <div className="search-wrap">
                    <IconSearch />
                    <input type="text" placeholder="Buscar cliente, restaurante..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <button className="refresh-btn" onClick={() => { loadedRef.current = false; load() }}><IconRefresh /> Actualizar</button>
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-bd)' }}>
                <div className="filtros">
                  {['TODOS', 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'].map(f => (
                    <button key={f} className={`fbtn ${filtroEstado === f ? 'active' : ''}`} onClick={() => setFiltroEstado(f)}>
                      {f === 'TODOS' ? 'Todos' : ESTADO_STYLES[f]?.label || f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Restaurante / Mesa</th>
                      <th>Fecha y Hora</th>
                      <th>Pax</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="loading-row"><td colSpan="7">Cargando reservaciones...</td></tr>
                    ) : filtradas.length === 0 ? (
                      <tr className="empty-row"><td colSpan="7">📅 Sin reservaciones</td></tr>
                    ) : (
                      filtradas
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(r => {
                        const st = es(r.estado)
                        const nombreEstado = r.estado?.nombre || r.estado || ''
                        const puedeCambiar  = !['CANCELADA', 'COMPLETADA'].includes(nombreEstado)
                        const puedeEliminar = ['PENDIENTE', 'CANCELADA'].includes(nombreEstado)
                        return (
                          <tr key={r._id} style={{ cursor: 'pointer' }} onClick={() => setDetalle(r)}>
                            <td><span className="cell-mono">#{r._id.slice(-5).toUpperCase()}</span></td>
                            <td>
                              <div className="cell-main">{r.usuario?.name ? `${r.usuario.name} ${r.usuario.surname || ''}` : r.usuario || '—'}</div>
                            </td>
                            <td>
                              <div className="cell-main">{r.restaurante?.nombre || '—'}</div>
                              <div className="cell-sub">Mesa {r.mesa?.numeroMesa || 'N/A'}</div>
                            </td>
                            <td>
                              <div className="cell-main" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconCalendar /> {r.fecha ? r.fecha.substring(0, 10) : '—'}</div>
                              <div className="cell-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconClock /> {r.hora || '—'}</div>
                            </td>
                            <td><div className="cell-main">{r.numPersonas}</div></td>
                            <td>
                              <span className="badge-estado" style={{ background: st.bg, borderColor: st.bd, color: st.tx }}>
                                {st.label}
                              </span>
                            </td>
                            <td onClick={e => e.stopPropagation()}>
                              <div className="action-btns">
                                {puedeCambiar && (
                                  <select
                                    className="estado-select"
                                    value={nombreEstado}
                                    onChange={(e) => handleEstado(r._id, e.target.value)}
                                  >
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="CONFIRMADA">Confirmar</option>
                                    <option value="COMPLETADA">Completar</option>
                                    <option value="CANCELADA">Cancelar</option>
                                  </select>
                                )}
                                {['CANCELADA', 'COMPLETADA'].includes(nombreEstado) && (
                                  <button
                                    className="action-btn"
                                    title="Quitar de la vista"
                                    onClick={() => { ocultarReservacion(r._id); if (detalle?._id === r._id) setDetalle(null) }}
                                  >
                                    <IconClose />
                                  </button>
                                )}
                                <button
                                  className="action-btn danger"
                                  disabled={!puedeEliminar}
                                  title={puedeEliminar ? 'Eliminar' : 'Solo se eliminan Pendientes o Canceladas'}
                                  onClick={() => handleDelete(r._id, nombreEstado)}
                                >
                                  <IconTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* PANEL LATERAL DE DETALLES */}
        {detalle && (
          <div className="panel-ov" onClick={(e) => { if (e.target === e.currentTarget) setDetalle(null) }}>
            <div className="panel">
              <div className="panel-head">
                <div>
                  <div className="panel-title">Detalle de Reserva</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>#{detalle._id?.slice(-6).toUpperCase()}</div>
                </div>
                <button className="panel-close" onClick={() => setDetalle(null)}><IconClose /></button>
              </div>
              <div className="panel-body">

                {/* Estado */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span className="badge-estado" style={{
                    background: es(detalle.estado).bg,
                    borderColor: es(detalle.estado).bd,
                    color: es(detalle.estado).tx,
                    fontSize: 13, padding: '6px 18px'
                  }}>
                    {es(detalle.estado).label}
                  </span>
                </div>

                <div className="dsec">
                  <div className="dsec-title">Datos del Cliente</div>
                  <div className="drow">
                    <span className="dk">Nombre</span>
                    <span className="dv">{detalle.usuario?.name ? `${detalle.usuario.name} ${detalle.usuario.surname || ''}` : (detalle.usuario || '—')}</span>
                  </div>
                  {detalle.usuario?.email && (
                    <div className="drow">
                      <span className="dk">Email</span>
                      <span className="dv">{detalle.usuario.email}</span>
                    </div>
                  )}
                  {detalle.usuario?.phone && (
                    <div className="drow">
                      <span className="dk">Teléfono</span>
                      <span className="dv">{detalle.usuario.phone}</span>
                    </div>
                  )}
                </div>

                <div className="dsec">
                  <div className="dsec-title">Logística</div>
                  <div className="drow">
                    <span className="dk">Restaurante</span>
                    <span className="dv">{detalle.restaurante?.nombre || 'N/A'}</span>
                  </div>
                  <div className="drow">
                    <span className="dk">Mesa</span>
                    <span className="dv">
                      {detalle.mesa ? `Mesa #${detalle.mesa?.numeroMesa}${detalle.mesa?.ubicacion ? ` · ${detalle.mesa.ubicacion}` : ''}` : 'Sin preferencia'}
                    </span>
                  </div>
                  <div className="drow">
                    <span className="dk">Personas</span>
                    <span className="dv">{detalle.numPersonas || '—'} pax</span>
                  </div>
                  <div className="drow">
                    <span className="dk"><IconCalendar /> Fecha</span>
                    <span className="dv gold">{detalle.fecha ? detalle.fecha.substring(0, 10) : '—'}</span>
                  </div>
                  <div className="drow">
                    <span className="dk"><IconClock /> Hora</span>
                    <span className="dv gold">{detalle.hora || '—'}</span>
                  </div>
                  {detalle.observaciones && (
                    <div className="drow">
                      <span className="dk">Observaciones</span>
                      <span className="dv" style={{ maxWidth: 220, textAlign: 'right' }}>{detalle.observaciones}</span>
                    </div>
                  )}
                  <div className="drow">
                    <span className="dk">Creada</span>
                    <span className="dv">{detalle.createdAt ? new Date(detalle.createdAt).toLocaleString('es-GT') : '—'}</span>
                  </div>
                </div>

                {/* Acciones */}
                {(() => {
                  const estadoNombre = detalle.estado?.nombre || detalle.estado || ''
                  const puedeCambiar = !['CANCELADA', 'COMPLETADA'].includes(estadoNombre)
                  const puedeEliminar = ['PENDIENTE', 'CANCELADA'].includes(estadoNombre)
                  return (
                    <div className="dsec">
                      <div className="dsec-title">Acciones</div>
                      <div className="panel-actions">
                        {puedeCambiar && estadoNombre !== 'CONFIRMADA' && (
                          <button className="pa-btn confirm" onClick={() => handleEstado(detalle._id, 'CONFIRMADA')}>
                            <IconCheck /> Confirmar reservación
                          </button>
                        )}
                        {puedeCambiar && (
                          <button className="pa-btn complete" onClick={() => handleEstado(detalle._id, 'COMPLETADA')}>
                            <IconCheck /> Marcar como completada (libera mesa)
                          </button>
                        )}
                        {puedeCambiar && (
                          <button className="pa-btn danger" onClick={() => handleEstado(detalle._id, 'CANCELADA')}>
                            <IconClose /> Cancelar reservación
                          </button>
                        )}
                        {puedeEliminar && (
                          <button className="pa-btn danger" onClick={() => handleDelete(detalle._id, estadoNombre)}>
                            <IconTrash /> Eliminar reservación
                          </button>
                        )}
                        {!puedeCambiar && !puedeEliminar && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                            No hay acciones disponibles para este estado
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}