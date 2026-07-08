import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'

const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconRestaurant = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
const IconClose = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IconEye = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
const IconBurger = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
)
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

const ESTADOS = ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO']
const EST = {
  PENDIENTE: { bg: 'rgba(201,168,76,.12)', bd: 'rgba(201,168,76,.35)', tx: '#e8c96a' },
  CONFIRMADO: { bg: 'rgba(91,155,213,.1)', bd: 'rgba(91,155,213,.3)', tx: '#90c0e8' },
  PREPARANDO: { bg: 'rgba(201,120,40,.1)', bd: 'rgba(201,120,40,.3)', tx: '#e8a060' },
  EN_CAMINO: { bg: 'rgba(100,160,220,.1)', bd: 'rgba(100,160,220,.3)', tx: '#78b8e8' },
  ENTREGADO: { bg: 'rgba(76,175,130,.1)', bd: 'rgba(76,175,130,.3)', tx: '#7dd9ae' },
  CANCELADO: { bg: 'rgba(224,90,90,.1)', bd: 'rgba(224,90,90,.3)', tx: '#e08080' },
}
const TIPO = {
  DOMICILIO: { bg: 'rgba(100,160,220,.08)', tx: '#78aee0' },
  RECOGER: { bg: 'rgba(76,175,130,.08)', tx: '#5caf82' },
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function AdminPedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'pedidos'
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])
  const handleNavClick = (path, key) => { setActiveNav(key); setMobileOpen(false);navigate(path) }

  // ── Avatar refrescado desde ms-auth ──
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

  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const [pedidoDetalle, setPedidoDetalle] = useState(null)
  const [toast, setToast] = useState(null)
  const [ocultas, setOcultas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_pedidos_ocultos') || '[]') } catch { return [] }
  })
  const ocultarPedido = (id) => {
    const nuevos = [...ocultas, id]
    setOcultas(nuevos)
    try { localStorage.setItem('admin_pedidos_ocultos', JSON.stringify(nuevos)) } catch { }
  }
  const [cambiando, setCambiando] = useState(null)
  const loadedRef = useRef(false)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/pedidos/pedidos')
      setPedidos(res.data?.data || [])
    } catch { showToast('Error al cargar los pedidos', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  const cambiarEstado = async (id, nuevoEstado) => {
    setCambiando(id)
    try {
      await api.put(`/pedidos/pedidos/${id}`, { estado: nuevoEstado })
      setPedidos(prev => prev.map(p => p._id === id ? { ...p, estado: nuevoEstado } : p))
      if (pedidoDetalle?._id === id) setPedidoDetalle(prev => ({ ...prev, estado: nuevoEstado }))
      showToast('Estado actualizado')
    } catch { showToast('Error al actualizar estado', 'error') }
    finally { setCambiando(null) }
  }

  const filtrados = pedidos.filter(p => {
    const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado
    const q = busqueda.toLowerCase()
    const matchBusq = !q || (p._id || '').toLowerCase().includes(q) || (p.usuario?.name || p.usuario || '').toLowerCase().includes(q) || (p.restaurante?.nombre || '').toLowerCase().includes(q)
    return matchEstado && matchBusq && !ocultas.includes(p._id)
  })

  const hoy = new Date().toISOString().split('T')[0]
  const stats = [
    { label: 'Total Pedidos', value: pedidos.length, icon: '🧾', color: 'var(--gold-lt)' },
    { label: 'Preparando', value: pedidos.filter(p => p.estado === 'PREPARANDO').length, icon: '🍳', color: '#e8a060' },
    { label: 'En Camino', value: pedidos.filter(p => p.estado === 'EN_CAMINO').length, icon: '🛵', color: '#90c0e8' },
    { label: 'Entregados hoy', value: pedidos.filter(p => p.estado === 'ENTREGADO' && p.updatedAt?.substring(0, 10) === hoy).length, icon: '✅', color: '#7dd9ae' },
  ]

  const calcTotal = p => {
    if (p.total) return `Q ${Number(p.total).toFixed(2)}`
    if (p.detalles?.length) { const s = p.detalles.reduce((a, d) => a + (d.subtotal || d.precio * d.cantidad || 0), 0); return `Q ${s.toFixed(2)}` }
    return '—'
  }

  const es = e => EST[e] || { bg: 'rgba(255,255,255,.05)', bd: 'rgba(255,255,255,.1)', tx: '#aaa' }
  const ts = t => TIPO[t] || { bg: 'rgba(255,255,255,.05)', tx: '#aaa' }

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght=300;400;500;600&family=Outfit:wght=300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --black:#07080a;
  --deep:#0d0f12;
  --glass-bg:rgba(255,255,255,.045);
  --glass-bd:rgba(255,255,255,.09);
  --gold:#c9a84c;
  --gold-lt:#e8c96a;
  --gold-dim:rgba(201,168,76,.08);
  --text:#f0ead8;
  --text-mid:#9a9385;
  --text-muted:#5a554d;
  --success:#4caf82;
  --error:#e05a5a;
  --radius-card:20px;
  --radius-inp:11px;
  --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
  --sidebar-w:240px;
}

body{
  font-family:'Outfit',sans-serif;
  background:var(--black);
  color:var(--text);
  min-height:100vh;
  overflow-x:hidden;
  -webkit-text-size-adjust:100%;
}

.admin-layout{display:flex;min-height:100vh;position:relative}

/* ── SIDEBAR INMÓVIL EN PC ── */
.admin-sidebar{
  width:var(--sidebar-w);
  background:var(--deep);
  border-right:1px solid var(--glass-bd);
  display:flex;
  flex-direction:column;
  position:fixed;
  top:0;left:0;bottom:0;
  z-index:100;
  overflow:hidden;
}

.sidebar-brand{
  padding:24px 20px 20px;
  border-bottom:1px solid var(--glass-bd);
  display:flex;align-items:center;gap:12px;
  flex-shrink:0;min-height:80px;position:relative;
}
.sidebar-brand::after{
  content:'';position:absolute;bottom:-1px;left:0;
  width:80px;height:1px;
  background:linear-gradient(90deg,var(--gold),transparent);
}

.brand-icon{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));
  border:1px solid rgba(201,168,76,.25);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;color:var(--gold);
}
.brand-text{overflow:hidden;white-space:nowrap}
.brand-name{
  font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;
  letter-spacing:1.5px;text-transform:uppercase;color:var(--text);
  display:block;line-height:1;
}
.brand-role{
  font-size:9px;letter-spacing:2.5px;text-transform:uppercase;
  color:var(--gold);opacity:.7;display:block;margin-top:3px;
}

.sidebar-nav{flex:1;padding:16px 10px;overflow-y:auto;overflow-x:hidden}
.nav-label{
  font-size:9px;letter-spacing:2px;text-transform:uppercase;
  color:var(--text-muted);padding:0 10px;margin:16px 0 8px;
  white-space:nowrap;
}

.nav-item{
  display:flex;align-items:center;gap:12px;padding:10px;
  border-radius:10px;cursor:pointer;color:var(--text-mid);
  font-size:13.5px;transition:all .2s;
  position:relative;white-space:nowrap;margin-bottom:2px;
}
.nav-item:hover{background:var(--glass-bg);color:var(--text)}
.nav-item.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.15)}
.nav-item.active::before{
  content:'';position:absolute;left:0;top:20%;bottom:20%;
  width:2px;border-radius:2px;background:var(--gold);
}
.nav-icon{flex-shrink:0;display:flex}
.nav-text{overflow:hidden}

.sidebar-footer{padding:16px 10px;border-top:1px solid var(--glass-bd)}
.sb-user{
  display:flex;align-items:center;gap:10px;padding:10px;
  border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);
  margin-bottom:8px;overflow:hidden;cursor:pointer;
  transition:border-color .2s,background .2s;
}
.sb-user:hover{border-color:rgba(201,168,76,.35);background:var(--gold-dim)}
.sb-av{
  width:32px;height:32px;border-radius:8px;
  background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));
  border:1px solid rgba(201,168,76,.2);
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:600;color:var(--gold-lt);
  flex-shrink:0;font-family:'Cormorant Garamond',serif;overflow:hidden;
}
.sb-av img{width:100%;height:100%;object-fit:cover;border-radius:7px}
.sb-uinfo{overflow:hidden}
.sb-uname{font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-urole{font-size:10px;color:var(--gold);letter-spacing:.5px;text-transform:uppercase}

.sb-out{
  display:flex;align-items:center;gap:10px;padding:9px 10px;
  border-radius:10px;background:none;border:none;
  color:var(--text-muted);cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:13px;
  width:100%;transition:all .2s;white-space:nowrap;
}
.sb-out:hover{background:rgba(224,90,90,.08);color:var(--error)}

/* ── BOTÓN DE TOGGLE OCULTO EN PC ── */
.sidebar-toggle{
  display: none !important;
}

/* ── MAIN FIJO PARA ESCRITORIO ── */
.admin-main{
  flex:1;
  margin-left:var(--sidebar-w);
  min-height:100vh;
  display:flex;flex-direction:column;
  min-width:0;
}

.admin-topbar{
  height:64px;
  background:var(--deep);
  border-bottom:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;
  position:sticky;top:0;z-index:50;
}
.topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.5px}
.topbar-sub{font-size:11px;color:var(--text-muted)}
.topbar-right{display:flex;align-items:center;gap:10px}
.topbar-btn{
  width:36px;height:36px;border-radius:10px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:center;
  color:var(--text-muted);cursor:pointer;transition:all .2s;
}
.topbar-btn:hover{color:var(--gold)}

.admin-content{padding:24px;flex:1}

/* ── STATS ── */
.stats-row{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:12px;
  margin-bottom:28px;
}
@media(min-width:768px){
  .stats-row{
    grid-template-columns:repeat(4,1fr);
    gap:16px;
  }
}

.stat-card{
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  border-radius:var(--radius-card);padding:16px;
  position:relative;overflow:hidden;
  transition:border-color .25s,transform .2s;
}
@media(min-width:768px){.stat-card{padding:22px}}

.stat-card::before{
  content:'';position:absolute;top:0;left:0;
  width:60px;height:1px;
  background:linear-gradient(90deg,var(--gold),transparent);
}
.stat-card::after{
  content:'';position:absolute;top:0;left:0;
  width:1px;height:60px;
  background:linear-gradient(180deg,var(--gold),transparent);
}
.stat-card:hover{border-color:rgba(201,168,76,.2);transform:translateY(-2px)}

.stat-icon{font-size:18px;margin-bottom:8px}
@media(min-width:768px){.stat-icon{font-size:22px;margin-bottom:10px}}

.stat-val{
  font-family:'Cormorant Garamond',serif;font-size:26px;
  font-weight:500;line-height:1;margin-bottom:4px;
}
@media(min-width:768px){.stat-val{font-size:32px}}

.stat-lbl{
  font-size:10.5px;color:var(--text-muted);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
@media(min-width:768px){.stat-lbl{font-size:11.5px;white-space:normal}}

/* ── SECTION CARD ── */
.section-card{
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  border-radius:var(--radius-card);overflow:hidden;
}

.section-header{
  display:flex;align-items:flex-start;justify-content:space-between;
  padding:16px 20px;border-bottom:1px solid var(--glass-bd);
  gap:12px;flex-wrap:wrap;
}
@media(min-width:768px){.section-header{padding:20px 24px}}

.section-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;letter-spacing:.3px}
.section-sub{font-size:11px;color:var(--text-muted);margin-top:2px}

.header-right{
  display:flex;flex-direction:column;
  align-items:stretch;gap:8px;width:100%;
}
@media(min-width:600px){
  .header-right{flex-direction:row;align-items:center;width:auto;flex-wrap:wrap}
}

/* ── FILTROS ── */
.filters{
  display:flex;
  flex-wrap:nowrap;
  overflow-x:auto;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
  gap:6px;
  padding-bottom:2px;
}
.filters::-webkit-scrollbar{display:none}

.filter-btn{
  padding:5px 12px;border-radius:7px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  color:var(--text-muted);cursor:pointer;
  font-size:11.5px;font-family:'Outfit',sans-serif;
  transition:all .2s;white-space:nowrap;flex-shrink:0;
}
.filter-btn:hover{color:var(--text)}
.filter-btn.active{background:var(--gold-dim);border-color:rgba(201,168,76,.3);color:var(--gold-lt)}

.search-box{
  display:flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.04);
  border:1px solid var(--glass-bd);border-radius:10px;
  padding:7px 12px;
}
.search-box input{
  background:none;border:none;outline:none;
  color:var(--text);font-family:'Outfit',sans-serif;
  font-size:13px;width:100%;
}
@media(min-width:600px){.search-box input{width:160px}}
.search-box input::placeholder{color:var(--text-muted)}

.refresh-btn{
  display:flex;align-items:center;justify-content:center;gap:6px;
  padding:8px 14px;border-radius:10px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  color:var(--text-muted);cursor:pointer;
  font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s;
}
.refresh-btn:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3)}

/* ── TABLA ── */
.table-responsive{
  width:100%;
  overflow-x:auto;
  -webkit-overflow-scrolling:touch;
}
.table-responsive::-webkit-scrollbar{height:4px}
.table-responsive::-webkit-scrollbar-thumb{background:rgba(201,168,76,.35);border-radius:4px}
.table-responsive::-webkit-scrollbar-track{background:transparent}

.data-table{
  width:100%;
  border-collapse:collapse;
  min-width:600px;
}

.data-table th{
  padding:10px 16px;text-align:left;
  font-size:10px;font-weight:500;letter-spacing:1.5px;
  text-transform:uppercase;color:var(--text-muted);
  border-bottom:1px solid var(--glass-bd);
  background:rgba(255,255,255,.015);
}
@media(min-width:768px){.data-table th{padding:10px 20px}}

.data-table td{
  padding:12px 16px;font-size:13px;
  border-bottom:1px solid rgba(255,255,255,.04);
  vertical-align:middle;
}
@media(min-width:768px){.data-table td{padding:14px 20px}}

.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:rgba(255,255,255,.02)}

.cell-id{font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--text-muted)}
.cell-main{font-size:13px;color:var(--text)}
.cell-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
.cell-total{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt)}

.badge{
  display:inline-flex;align-items:center;
  padding:3px 10px;border-radius:20px;
  font-size:11px;border:1px solid;white-space:nowrap;
}
.badge-tipo{display:inline-flex;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:500}

.action-btns{display:flex;gap:6px}
.action-btn{
  width:30px;height:30px;border-radius:8px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--text-muted);transition:all .2s;
}
.action-btn:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3);background:var(--gold-dim)}

.estado-select{background:transparent;border:none;outline:none;font-family:'Outfit',sans-serif;font-size:11px;cursor:pointer;color:inherit}
.estado-select option{background:var(--deep);color:var(--text)}

/* ── FILA VACÍA COMPLETAMENTE CENTRADA ── */
.empty-row td, .loading-row td {
  padding: 80px 24px !important;
  color: var(--text-mid);
  text-align: center !important;
}

.empty-row td > div:last-child, 
.empty-icon {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  right: 0;
  display: block;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.empty-icon {
  font-size: 38px;
  margin-bottom: 12px;
}

/* ── MODAL PANEL ── */
.modal-ov{
  position:fixed;inset:0;
  background:rgba(7,8,10,.82);backdrop-filter:blur(8px);
  z-index:200;display:flex;align-items:flex-start;justify-content:flex-end;
}
.modal-panel{
  width:100%;max-width:440px;height:100vh;
  background:var(--deep);border-left:1px solid var(--glass-bd);
  overflow-y:auto;display:flex;flex-direction:column;
  animation:slideIn .3s var(--ease-out-expo);
}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}

.panel-header{
  padding:24px;border-bottom:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;background:var(--deep);z-index:1;
}
.panel-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500}
.panel-close{
  width:32px;height:32px;border-radius:8px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--text-muted);transition:all .2s;
}
.panel-close:hover{color:var(--error)}

.panel-body{padding:24px;flex:1;display:flex;flex-direction:column;gap:20px}
.dsec{display:flex;flex-direction:column;gap:8px}
.dsec-title{
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--gold);opacity:.7;
  border-bottom:1px solid rgba(201,168,76,.15);padding-bottom:4px;
}
.drow{display:flex;justify-content:space-between;align-items:center;padding:6px 0}
.dk{font-size:12px;color:var(--text-muted)}
.dv{font-size:13px;color:var(--text);text-align:right}
.dv.gold{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt)}

.item-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:8px 12px;background:rgba(255,255,255,.03);
  border-radius:8px;border:1px solid var(--glass-bd);
}
.item-name{font-size:13px;color:var(--text)}
.item-qty{font-size:11px;color:var(--text-muted);margin-top:2px}
.item-price{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt)}

.estado-btns{display:flex;flex-wrap:wrap;gap:6px}
.estado-opt{
  padding:6px 14px;border-radius:8px;
  border:1px solid var(--glass-bd);background:var(--glass-bg);
  color:var(--text-muted);cursor:pointer;
  font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s;
}
.estado-opt.current{color:var(--gold-lt);border-color:rgba(201,168,76,.4);background:var(--gold-dim)}

.total-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:14px 16px;
  background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);
  border-radius:12px;margin-top:4px;
}
.total-label{font-size:13px;color:var(--text-mid)}
.total-val{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--gold-lt)}

/* ── TOAST ── */
.toast{
  position:fixed;bottom:24px;right:24px;left:24px;
  padding:12px 20px;border-radius:12px;
  font-size:13px;font-family:'Outfit',sans-serif;
  z-index:999;animation:slideUp .3s var(--ease-out-expo);
  border:1px solid;text-align:center;
}
@media(min-width:576px){.toast{left:auto;text-align:left}}
.toast-success{background:rgba(76,175,130,.15);border-color:rgba(76,175,130,.3);color:var(--success)}
.toast-error{background:rgba(224,90,90,.15);border-color:rgba(224,90,90,.3);color:var(--error)}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* ── MOBILE DISPOSITIVOS (<768px) ── */
@media(max-width:767.98px){
  .admin-sidebar{
    transform:translateX(-100%);
    width:var(--sidebar-w)!important;
    box-shadow:10px 0 30px rgba(0,0,0,.5);
    transition:transform .3s var(--ease-out-expo);
  }

  .admin-sidebar.mobile-open{transform:translateX(0)}
  .admin-main{margin-left:0}
  .admin-topbar{padding:0 16px}
  .admin-content{padding:16px}
  .modal-panel{max-width:100%}

  .data-table{
    display:block;
    overflow-x:auto;
    -webkit-overflow-scrolling:touch;
    min-width:unset;
    width:100%;
  }

  .data-table thead,
  .data-table tbody,
  .data-table tr:not(.empty-row):not(.loading-row){
    display:table;
    width:100%;
    table-layout:auto;
  }

  .data-table tr.empty-row,
  .data-table tr.loading-row {
    display: table-row; 
  }

  .empty-row td > div:last-child, 
  .empty-icon {
    max-width: calc(100vw - 64px);
    position: sticky;
    left: 0;
  }

  .data-table th,
  .data-table td{
    padding:10px 10px;
    font-size:12px;
    white-space:nowrap;
  }

  .cell-main{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px}
  .cell-sub{font-size:10px}
  .cell-id{font-size:12px}

  .action-btn{
    width:26px;
    height:26px;
  }
}
      `}</style>

      <div className="admin-layout">
        {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'} ${mobileOpen ? 'open' : ''}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(p => !p)}><IconChevron /></button>
          <div className="sidebar-brand">
            <div className="brand-icon"><IconRestaurant /></div>
            <div className="brand-text">
              <span className="brand-name">Gastro</span>
              <span className="brand-role">Admin Panel</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Navegación</div>
            {NAV_ITEMS.map(item => (
              <div key={item.key} className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path, item.key)}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sb-user" onClick={() => navigate('/admin/perfil')}>
              <div className="sb-av">
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" onError={() => setAvatarSrc(null)} />
                  : (user?.name || 'A')[0].toUpperCase()
                }
              </div>
              <div className="sb-uinfo">
                <div className="sb-uname">{user?.name || user?.nombre || 'Admin'}</div>
                <div className="sb-urole">Administrador</div>
              </div>
            </div>
            <button className="sb-out" onClick={logout}><IconLogout /><span>Cerrar sesión</span></button>
          </div>
        </aside>

        <main className={`admin-main ${sidebarOpen ? '' : 'collapsed'}`}>
          <header className="admin-topbar">
            <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            <IconBurger />
          </button>
            <div>
              <div className="topbar-title">Gestión de Pedidos</div>
              <div className="topbar-sub">Panel de control · Pedidos</div>
            </div>
            <div className="topbar-right">
              <button className="topbar-btn"><IconBell /></button>
            </div>
          </header>

          <div className="admin-content">
            <div className="stats-row">
              {stats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="section-card">
              <div className="section-header">
                <div>
                  <div className="section-title">Pedidos</div>
                  <div className="section-sub">{filtrados.length} registros encontrados</div>
                </div>
                <div className="header-right">
                  <div className="filters">
                    <button className={`filter-btn ${filtroEstado === 'TODOS' ? 'active' : ''}`} onClick={() => setFiltroEstado('TODOS')}>Todos</button>
                    {ESTADOS.map(e => (
                      <button key={e} className={`filter-btn ${filtroEstado === e ? 'active' : ''}`} onClick={() => setFiltroEstado(e)}>
                        {e.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  <div className="search-box">
                    <IconSearch />
                    <input placeholder="Buscar pedido, cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                  </div>
                  <button className="refresh-btn" onClick={() => { loadedRef.current = false; load() }}>
                    <IconRefresh /> Actualizar
                  </button>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr><th>ID</th><th>Cliente</th><th>Restaurante</th><th>Tipo</th><th>Items</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row"><td colSpan={8}><div className="empty-icon">⏳</div><div>Cargando pedidos...</div></td></tr>
                  ) : filtrados.length === 0 ? (
                    <tr className="empty-row"><td colSpan={8}><div className="empty-icon">🧾</div><div>{busqueda || filtroEstado !== 'TODOS' ? 'Sin resultados' : 'Sin pedidos registrados'}</div></td></tr>
                  ) : filtrados.map(p => {
                    const st = es(p.estado); const tt = ts(p.tipoEntrega)
                    const nombreCliente = p.usuario?.name ? `${p.usuario.name} ${p.usuario?.surname || ''}`.trim() : p.usuario || '—'
                    return (
                      <tr key={p._id}>
                        <td><span className="cell-id">#{p._id?.slice(-6).toUpperCase()}</span></td>
                        <td><div className="cell-main">{nombreCliente}</div><div className="cell-sub">{p.usuario?.email || ''}</div></td>
                        <td><div className="cell-main">{p.restaurante?.nombre || '—'}</div></td>
                        <td><span className="badge-tipo" style={{ background: tt.bg, color: tt.tx }}>{p.tipoEntrega || '—'}</span></td>
                        <td>
                          <div className="cell-main">{p.detalles?.length || 0} item(s)</div>
                          <div className="cell-sub">{p.detalles?.slice(0, 2).map(d => d.plato?.nombre || 'Plato').join(', ')}{p.detalles?.length > 2 ? '...' : ''}</div>
                        </td>
                        <td><span className="cell-total">{calcTotal(p)}</span></td>
                        <td>
                          <span className="badge" style={{ background: st.bg, borderColor: st.bd, color: st.tx }}>
                            <select className="estado-select" value={p.estado || ''} style={{ color: 'inherit' }}
                              disabled={cambiando === p._id}
                              onChange={e => cambiarEstado(p._id, e.target.value)}
                              onClick={e => e.stopPropagation()}>
                              {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
                            </select>
                          </span>
                        </td>
                        <td><div className="action-btns">
                          <button className="action-btn" onClick={() => setPedidoDetalle(p)}><IconEye /></button>
                          {['ENTREGADO', 'CANCELADO'].includes(p.estado) && (
                            <button className="action-btn"
                              title="Quitar de la vista"
                              onClick={e => { e.stopPropagation(); ocultarPedido(p._id); if (pedidoDetalle?._id === p._id) setPedidoDetalle(null) }}
                              style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                              ✕
                            </button>
                          )}
                        </div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {pedidoDetalle && (
        <div className="modal-ov" onClick={e => e.target === e.currentTarget && setPedidoDetalle(null)}>
          <div className="modal-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Detalle del Pedido</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>#{pedidoDetalle._id?.slice(-6).toUpperCase()}</div>
              </div>
              <button className="panel-close" onClick={() => setPedidoDetalle(null)}><IconClose /></button>
            </div>
            <div className="panel-body">
              <div className="dsec">
                <div className="dsec-title">Información general</div>
                <div className="drow"><span className="dk">Cliente</span><span className="dv">{pedidoDetalle.usuario?.name ? `${pedidoDetalle.usuario.name} ${pedidoDetalle.usuario?.surname || ''}`.trim() : pedidoDetalle.usuario || '—'}</span></div>
                {pedidoDetalle.usuario?.email && <div className="drow"><span className="dk">Email</span><span className="dv">{pedidoDetalle.usuario.email}</span></div>}
                <div className="drow"><span className="dk">Restaurante</span><span className="dv">{pedidoDetalle.restaurante?.nombre || '—'}</span></div>
                <div className="drow"><span className="dk">Tipo entrega</span><span className="badge-tipo" style={{ ...ts(pedidoDetalle.tipoEntrega), padding: '2px 10px', borderRadius: 6 }}>{pedidoDetalle.tipoEntrega || '—'}</span></div>
                <div className="drow"><span className="dk">Fecha</span><span className="dv gold">{pedidoDetalle.createdAt ? new Date(pedidoDetalle.createdAt).toLocaleString('es-GT') : '—'}</span></div>
              </div>
              {pedidoDetalle.tipoEntrega === 'DOMICILIO' && pedidoDetalle.direccionEntrega && (
                <div className="dsec">
                  <div className="dsec-title">Dirección de entrega</div>
                  <div className="drow"><span className="dk">Calle</span><span className="dv">{pedidoDetalle.direccionEntrega.calle}</span></div>
                  <div className="drow"><span className="dk">Ciudad</span><span className="dv">{pedidoDetalle.direccionEntrega.ciudad}, {pedidoDetalle.direccionEntrega.departamento}</span></div>
                </div>
              )}
              <div className="dsec">
                <div className="dsec-title">Items del pedido</div>
                {pedidoDetalle.detalles?.length > 0
                  ? pedidoDetalle.detalles.map((d, i) => (
                    <div key={i} className="item-row">
                      <div><div className="item-name">{d.plato?.nombre || 'Plato'}</div><div className="item-qty">x{d.cantidad || 1}</div></div>
                      <div className="item-price">Q {Number(d.subtotal || d.precio || 0).toFixed(2)}</div>
                    </div>
                  ))
                  : <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sin detalle disponible</div>
                }
                <div className="total-row"><span className="total-label">Total del pedido</span><span className="total-val">{calcTotal(pedidoDetalle)}</span></div>
              </div>
              <div className="dsec">
                <div className="dsec-title">Cambiar estado</div>
                <div className="estado-btns">
                  {ESTADOS.map(e => {
                    const s = es(e)
                    return (
                      <button key={e} className={`estado-opt ${pedidoDetalle.estado === e ? 'current' : ''}`}
                        style={pedidoDetalle.estado === e ? { background: s.bg, borderColor: s.bd, color: s.tx } : {}}
                        disabled={cambiando === pedidoDetalle._id}
                        onClick={() => cambiarEstado(pedidoDetalle._id, e)}>
                        {e.replace('_', ' ')}
                      </button>
                    )
                  })}
                </div>
              </div>
              {pedidoDetalle.notas && <div className="dsec"><div className="dsec-title">Notas</div><div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>{pedidoDetalle.notas}</div></div>}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  )
}