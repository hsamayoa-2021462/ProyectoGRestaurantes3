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
const IconBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>

const NAV = [
  { key: 'dashboard',     label: 'Dashboard',     icon: <IconDash />,    path: '/admin/dashboard' },
  { key: 'menu',          label: 'Menú',           icon: <IconMenu />,    path: '/admin/menu' },
  { key: 'pedidos',       label: 'Pedidos',        icon: <IconOrders />,  path: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones',  icon: <IconTable />,   path: '/admin/reservaciones' },
  { key: 'restaurantes',  label: 'Restaurantes',   icon: <IconRest />,    path: '/admin/restaurantes' },
  { key: 'clientes',      label: 'Clientes',       icon: <IconUsers />,   path: '/admin/clientes' },
  { key: 'reportes',      label: 'Reportes',       icon: <IconReport />,  path: '/admin/reportes' },
  { key: 'resenas',       label: 'Reseñas',        icon: <IconStar />,    path: '/admin/resenas' },
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

  const getActiveKey = () => NAV.find(i => i.path === location.pathname)?.key || 'reservaciones'
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [avatarSrc, setAvatarSrc]     = useState(user?.profilePicture || null)
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
  const loadedRef                         = useRef(false)

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

    // Si es COMPLETADA usar endpoint especial que libera la mesa
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
          --glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);
          --gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;
          --success:#4caf82;--error:#e05a5a;
          --sb-w:220px;--radius-card:20px;
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}

        /* LAYOUT */
        .layout{display:flex;min-height:100vh}
        .sidebar{width:var(--sb-w);flex-shrink:0;background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:50;transition:transform .3s}
        .sidebar.closed{transform:translateX(-100%)}
        .sb-logo{padding:24px 20px 16px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:10px}
        .sb-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;color:var(--gold);flex-shrink:0}
        .sb-logo-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase}
        .sb-nav{flex:1;padding:12px 8px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
        .sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s;border:1px solid transparent}
        .sb-item:hover{background:var(--glass-bg);color:var(--text)}
        .sb-item.active{background:var(--gold-dim);color:var(--gold-lt);border-color:rgba(201,168,76,.2)}
        .sb-footer{padding:16px 8px;border-top:1px solid var(--glass-bd)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:background .2s}
        .sb-user:hover{background:var(--glass-bg)}
        .sb-av{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold-lt);font-family:'Cormorant Garamond',serif;flex-shrink:0;overflow:hidden}
        .sb-av img{width:100%;height:100%;object-fit:cover}
        .sb-uname{font-size:12px;font-weight:500;color:var(--text)}
        .sb-role{font-size:10px;color:var(--text-muted)}
        .sb-out{width:100%;margin-top:6px;padding:8px;border-radius:10px;background:none;border:1px solid rgba(224,90,90,.2);color:var(--error);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
        .sb-out:hover{background:rgba(224,90,90,.08)}

        /* MAIN */
        .main{flex:1;margin-left:var(--sb-w);display:flex;flex-direction:column;min-height:100vh;transition:margin .3s}
        .main.full{margin-left:0}

        /* TOPBAR */
        .topbar{padding:20px 32px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--deep);position:sticky;top:0;z-index:40}
        .topbar-left{display:flex;align-items:center;gap:14px}
        .topbar-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500}
        .topbar-sub{font-size:12px;color:var(--text-muted)}
        .topbar-right{display:flex;align-items:center;gap:10px}
        .topbar-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .topbar-btn:hover{color:var(--gold)}
        .menu-btn{background:none;border:none;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px}

        /* CONTENT */
        .content{padding:28px 32px;display:flex;flex-direction:column;gap:24px}

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
        .data-table{width:100%;border-collapse:collapse}
        .data-table th{padding:11px 16px;text-align:left;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid var(--glass-bd);font-weight:400;white-space:nowrap}
        .data-table td{padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle}
        .data-table tr:last-child td{border-bottom:none}
        .data-table tr:hover td{background:rgba(255,255,255,.02)}
        .cell-main{font-size:13px;color:var(--text)}
        .cell-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .cell-mono{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt)}
        .badge-estado{display:inline-flex;align-items:center;padding:4px 12px;border-radius:20px;font-size:11px;border:1px solid;white-space:nowrap}

        /* ESTADO SELECT */
        .estado-select{background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:8px;padding:6px 10px;color:var(--text-mid);font-family:'Outfit',sans-serif;font-size:12px;cursor:pointer;outline:none;transition:border-color .2s}
        .estado-select:hover{border-color:rgba(201,168,76,.3)}
        .estado-select option{background:var(--deep);color:var(--text)}

        /* ACTION BTNS */
        .action-btns{display:flex;align-items:center;gap:6px}
        .action-btn{width:30px;height:30px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .action-btn:hover{color:var(--text);background:rgba(255,255,255,.08)}
        .action-btn.danger:hover{color:var(--error);border-color:rgba(224,90,90,.3);background:rgba(224,90,90,.08)}
        .action-btn.success:hover{color:var(--success);border-color:rgba(76,175,130,.3);background:rgba(76,175,130,.08)}
        .action-btn:disabled{opacity:.3;cursor:not-allowed}

        /* EMPTY/LOADING */
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

        /* TOAST */
        .toast{position:fixed;bottom:28px;right:28px;padding:12px 20px;border-radius:12px;font-size:13px;z-index:999;animation:slideUp .3s ease;border:1px solid}
        .toast-success{background:rgba(76,175,130,.15);border-color:rgba(76,175,130,.3);color:var(--success)}
        .toast-error{background:rgba(224,90,90,.15);border-color:rgba(224,90,90,.3);color:var(--error)}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

        /* DROPDOWN AVATAR */
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

        @media(max-width:900px){.stats-grid{grid-template-columns:1fr 1fr}.sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}.main{margin-left:0}.content{padding:20px 16px}}
      `}</style>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div className="sb-logo">
          <div className="sb-logo-icon"><IconRest /></div>
          <span className="sb-logo-name">Gastro</span>
        </div>
        <nav className="sb-nav">
          {NAV.map(item => (
            <div key={item.key} className={`sb-item ${activeNav === item.key ? 'active' : ''}`}
              onClick={() => { setActiveNav(item.key); navigate(item.path) }}>
              {item.icon}{item.label}
            </div>
          ))}
        </nav>
        <div className="sb-footer">
          <div className="sb-user" onClick={() => navigate('/admin/perfil')}>
            <div className="sb-av">
              {avatarSrc ? <img src={avatarSrc} alt="av" onError={() => setAvatarSrc(null)} /> : initials}
            </div>
            <div><div className="sb-uname">{user?.name || 'Admin'}</div><div className="sb-role">Administrador</div></div>
          </div>
          <button className="sb-out" onClick={logout}><IconLogout /> Cerrar sesión</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className={`main ${sidebarOpen ? '' : 'full'}`}>
        <div className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(p => !p)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div className="topbar-title">Reservaciones</div>
              <div className="topbar-sub">Gestión de mesas y reservas</div>
            </div>
          </div>
          <div className="topbar-right">
            <div className="av-wrap">
              <div className="av-btn" onClick={() => setMenuOpen(p => !p)}>
                {avatarSrc ? <img src={avatarSrc} alt="av" onError={() => setAvatarSrc(null)} /> : initials}
              </div>
              {menuOpen && (
                <div className="av-drop">
                  <div className="av-drop-user">
                    <div className="av-drop-name">{user?.name}</div>
                    <div className="av-drop-email">{user?.email}</div>
                  </div>
                  <div className="av-drop-item" onClick={() => { setMenuOpen(false); navigate('/admin/perfil') }}><IconUser /> Mi perfil</div>
                  <div className="av-drop-item danger" onClick={() => { setMenuOpen(false); logout() }}><IconLogout /> Cerrar sesión</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="content">

          {/* STATS */}
          <div className="stats-grid">
            <div className="sc">
              <div className="sc-icon">📅</div>
              <div className="sc-val">{reservaciones.length}</div>
              <div className="sc-lbl">Total reservaciones</div>
            </div>
            <div className="sc">
              <div className="sc-icon">⏳</div>
              <div className="sc-val" style={{ color: '#e8c96a' }}>{pendientes}</div>
              <div className="sc-lbl">Pendientes</div>
            </div>
            <div className="sc">
              <div className="sc-icon">✅</div>
              <div className="sc-val" style={{ color: 'var(--success)' }}>{confirmadas}</div>
              <div className="sc-lbl">Confirmadas</div>
            </div>
            <div className="sc">
              <div className="sc-icon">🗓️</div>
              <div className="sc-val" style={{ color: '#90c0e8' }}>{deHoy}</div>
              <div className="sc-lbl">Hoy</div>
            </div>
          </div>

          {/* TABLA */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Reservaciones</div>
                <div className="card-sub">{filtradas.length} registros</div>
              </div>
              <div className="header-actions">
                <div className="search-wrap">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input placeholder="Buscar cliente, restaurante..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="filtros">
                  {['TODOS', 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'].map(f => (
                    <button key={f} className={`fbtn ${filtroEstado === f ? 'active' : ''}`}
                      onClick={() => setFiltroEstado(f)}>
                      {f === 'TODOS' ? 'Todos' : ESTADO_STYLES[f]?.label || f}
                    </button>
                  ))}
                </div>
                <button className="refresh-btn" onClick={() => { loadedRef.current = false; load() }}>
                  <IconRefresh /> Actualizar
                </button>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Restaurante</th>
                  <th>Mesa</th>
                  <th><IconCalendar /> Fecha</th>
                  <th><IconClock /> Hora</th>
                  <th>Personas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="loading-row"><td colSpan={8}>Cargando...</td></tr>
                ) : filtradas.length === 0 ? (
                  <tr className="empty-row"><td colSpan={8}>📅 Sin reservaciones</td></tr>
                ) : filtradas
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(r => {
                    const estadoNombre = r.estado?.nombre || r.estado || ''
                    const st = es(r.estado)
                    const puedeCambiar = !['CANCELADA', 'COMPLETADA'].includes(estadoNombre)
                    const puedeEliminar = ['PENDIENTE', 'CANCELADA'].includes(estadoNombre)
                    return (
                      <tr key={r._id} style={{ cursor: 'pointer' }} onClick={() => setDetalle(r)}>
                        <td>
                          <div className="cell-main">{r.usuario || '—'}</div>
                        </td>
                        <td><div className="cell-main">{r.restaurante?.nombre || '—'}</div></td>
                        <td>
                          {r.mesa
                            ? <><div className="cell-main">Mesa #{r.mesa?.numeroMesa}</div><div className="cell-sub">{r.mesa?.ubicacion || ''}</div></>
                            : <div className="cell-sub">Sin mesa asignada</div>
                          }
                        </td>
                        <td>
                          <div className="cell-main" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <IconCalendar /> {r.fecha || '—'}
                          </div>
                        </td>
                        <td>
                          <div className="cell-main" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <IconClock /> {r.hora || '—'}
                          </div>
                        </td>
                        <td><div className="cell-mono">{r.numPersonas || '—'}</div></td>
                        <td>
                          <span className="badge-estado" style={{ background: st.bg, borderColor: st.bd, color: st.tx }}>
                            {st.label}
                          </span>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="action-btns">
                            {puedeCambiar && (
                              <select className="estado-select"
                                value={estadoNombre}
                                onChange={e => handleEstado(r._id, e.target.value)}>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="CONFIRMADA">Confirmar</option>
                                <option value="COMPLETADA">Completar</option>
                                <option value="CANCELADA">Cancelar</option>
                              </select>
                            )}
                            {['CANCELADA', 'COMPLETADA'].includes(estadoNombre) && (
                              <button className="action-btn"
                                title="Quitar de la vista"
                                onClick={() => { ocultarReservacion(r._id); if (detalle?._id === r._id) setDetalle(null) }}>
                                ✕
                              </button>
                            )}
                            <button className="action-btn danger"
                              disabled={!puedeEliminar}
                              title={puedeEliminar ? 'Eliminar' : 'Solo se eliminan Pendientes o Canceladas'}
                              onClick={() => handleDelete(r._id, estadoNombre)}>
                              <IconTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PANEL DETALLE */}
      {detalle && (
        <div className="panel-ov" onClick={e => e.target === e.currentTarget && setDetalle(null)}>
          <div className="panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">Detalle de Reservación</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>#{detalle._id?.slice(-6).toUpperCase()}</div>
              </div>
              <button className="panel-close" onClick={() => setDetalle(null)}><IconClose /></button>
            </div>
            <div className="panel-body">

              {/* Estado */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {(() => {
                  const st = es(detalle.estado)
                  return <span className="badge-estado" style={{ background: st.bg, borderColor: st.bd, color: st.tx, fontSize: 13, padding: '6px 18px' }}>{st.label}</span>
                })()}
              </div>

              <div className="dsec">
                <div className="dsec-title">Información general</div>
                <div className="drow"><span className="dk">Usuario</span><span className="dv">{detalle.usuario || '—'}</span></div>
                <div className="drow"><span className="dk">Restaurante</span><span className="dv">{detalle.restaurante?.nombre || '—'}</span></div>
                <div className="drow">
                  <span className="dk"><IconCalendar /> Fecha</span>
                  <span className="dv gold">{detalle.fecha || '—'}</span>
                </div>
                <div className="drow">
                  <span className="dk"><IconClock /> Hora</span>
                  <span className="dv gold">{detalle.hora || '—'}</span>
                </div>
                <div className="drow"><span className="dk">Personas</span><span className="dv">{detalle.numPersonas || '—'}</span></div>
                <div className="drow">
                  <span className="dk">Mesa</span>
                  <span className="dv">
                    {detalle.mesa ? `Mesa #${detalle.mesa?.numeroMesa} · ${detalle.mesa?.ubicacion || ''}` : 'Sin preferencia'}
                  </span>
                </div>
                {detalle.observaciones && (
                  <div className="drow"><span className="dk">Observaciones</span><span className="dv" style={{ maxWidth: 220, textAlign: 'right' }}>{detalle.observaciones}</span></div>
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
                          ✅ Marcar como completada (libera mesa)
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

      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  )
}