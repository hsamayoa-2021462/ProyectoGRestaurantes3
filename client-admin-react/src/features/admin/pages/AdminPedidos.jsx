// src/features/admin/pages/AdminPedidos.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'

/* ─── ICONS ─── */
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/>
  </svg>
)
const IconOrders = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)
const IconTable = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
)
const IconRestaurant = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2"/>
  </svg>
)
const IconReport = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconTrend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)

/* ─── NAV ITEMS ─── */
const NAV_ITEMS = [
  { key: 'dashboard',     label: 'Dashboard',      icon: <IconDashboard />, path: '/admin' },
  { key: 'menu',          label: 'Menú',            icon: <IconMenu />,       path: '/admin/menu' },
  { key: 'pedidos',       label: 'Pedidos',         icon: <IconOrders />,     path: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones',   icon: <IconTable />,      path: '/admin/reservaciones' },
  { key: 'restaurantes',  label: 'Restaurantes',    icon: <IconRestaurant />, path: '/admin/restaurantes' },
  { key: 'clientes',      label: 'Clientes',        icon: <IconUsers />,      path: '/admin/clientes' },
  { key: 'reportes',      label: 'Reportes',        icon: <IconReport />,     path: '/admin/reportes' },
]

/* ─── COLORES DE ESTADO ─── */
const STATUS_COLORS = {
  'En cocina':  { bg: 'rgba(201,168,76,.12)', border: 'rgba(201,168,76,.35)', color: '#e8c96a' },
  'Entregado':  { bg: 'rgba(76,175,130,.1)',  border: 'rgba(76,175,130,.3)',  color: '#7dd9ae' },
  'En camino':  { bg: 'rgba(100,160,220,.1)', border: 'rgba(100,160,220,.3)', color: '#90c0e8' },
  'Pagado':     { bg: 'rgba(130,100,200,.1)', border: 'rgba(130,100,200,.3)', color: '#c0a0e8' },
  'Cancelado':  { bg: 'rgba(224,90,90,.1)',   border: 'rgba(224,90,90,.3)',   color: '#e08080' },
}

/* ─── DATOS MOCK ─── */
const PEDIDOS_INICIALES = [
  {
    id: '#4521',
    cliente: 'Carlos Méndez',
    mesa: 'Mesa 4',
    tipo: 'Presencial',
    items: [
      { nombre: 'Filete a la Parrilla', qty: 1, precio: 'Q 280' },
      { nombre: 'Vino Tinto',           qty: 2, precio: 'Q 100' },
    ],
    estado: 'En cocina',
    total: 'Q 480',
    hora: '14:32',
  },
  {
    id: '#4520',
    cliente: 'Ana González',
    mesa: 'Mesa 7',
    tipo: 'Presencial',
    items: [
      { nombre: 'Pasta Carbonara', qty: 1, precio: 'Q 180' },
      { nombre: 'Ensalada César',  qty: 1, precio: 'Q 95'  },
    ],
    estado: 'Entregado',
    total: 'Q 275',
    hora: '14:15',
  },
  {
    id: '#4519',
    cliente: 'Roberto Lima',
    mesa: 'Delivery',
    tipo: 'Delivery',
    items: [
      { nombre: 'Pizza Margarita', qty: 2, precio: 'Q 145' },
    ],
    estado: 'En camino',
    total: 'Q 290',
    hora: '13:58',
  },
  {
    id: '#4518',
    cliente: 'María Castillo',
    mesa: 'Mesa 2',
    tipo: 'Presencial',
    items: [
      { nombre: 'Risotto de Mariscos', qty: 1, precio: 'Q 245' },
      { nombre: 'Agua Mineral',        qty: 2, precio: 'Q 30'  },
    ],
    estado: 'Pagado',
    total: 'Q 305',
    hora: '13:30',
  },
  {
    id: '#4517',
    cliente: 'Luis Pérez',
    mesa: 'Mesa 11',
    tipo: 'Presencial',
    items: [
      { nombre: 'Costillas BBQ', qty: 1, precio: 'Q 320' },
      { nombre: 'Mojito',        qty: 2, precio: 'Q 100' },
    ],
    estado: 'Pagado',
    total: 'Q 520',
    hora: '13:10',
  },
  {
    id: '#4516',
    cliente: 'Sofía Torres',
    mesa: 'Para llevar',
    tipo: 'Para llevar',
    items: [
      { nombre: 'Tiramisú',    qty: 2, precio: 'Q 90' },
      { nombre: 'Café Espresso', qty: 2, precio: 'Q 40' },
    ],
    estado: 'Entregado',
    total: 'Q 260',
    hora: '12:50',
  },
  {
    id: '#4515',
    cliente: 'Diego Morales',
    mesa: 'Mesa 9',
    tipo: 'Presencial',
    items: [
      { nombre: 'Salmón a la Plancha', qty: 1, precio: 'Q 265' },
    ],
    estado: 'Cancelado',
    total: 'Q 265',
    hora: '12:20',
  },
]

const ESTADOS = ['Todos', 'En cocina', 'En camino', 'Entregado', 'Pagado', 'Cancelado']
const ESTADOS_CAMBIO = ['En cocina', 'En camino', 'Entregado', 'Pagado', 'Cancelado']

const TIPO_COLORS = {
  'Presencial':  { bg: 'rgba(201,168,76,.08)',  color: '#c9a84c' },
  'Delivery':    { bg: 'rgba(100,160,220,.08)', color: '#78aee0' },
  'Para llevar': { bg: 'rgba(76,175,130,.08)',  color: '#5caf82' },
}

export default function AdminPedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => {
    const item = NAV_ITEMS.find(i => i.path === location.pathname)
    return item ? item.key : 'pedidos'
  }
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

  const handleNavClick = (path, key) => {
    setActiveNav(key)
    navigate(path)
  }

  /* ─── STATE DEL COMPONENTE ─── */
  const [pedidos, setPedidos] = useState(PEDIDOS_INICIALES)
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [pedidoDetalle, setPedidoDetalle] = useState(null)

  /* ─── FILTRADO ─── */
  const pedidosFiltrados = pedidos.filter(p => {
    const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado
    const q = busqueda.toLowerCase()
    const coincideBusqueda =
      p.id.toLowerCase().includes(q) ||
      p.cliente.toLowerCase().includes(q) ||
      p.mesa.toLowerCase().includes(q)
    return coincideEstado && coincideBusqueda
  })

  /* ─── CAMBIAR ESTADO ─── */
  const cambiarEstado = (id, nuevoEstado) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
    if (pedidoDetalle?.id === id) {
      setPedidoDetalle(prev => ({ ...prev, estado: nuevoEstado }))
    }
  }

  /* ─── STATS ─── */
  const stats = [
    { label: 'Total Pedidos',  value: pedidos.length,                                         icon: '🧾', color: 'var(--gold-lt)' },
    { label: 'En Cocina',      value: pedidos.filter(p => p.estado === 'En cocina').length,   icon: '🍳', color: '#e8c96a' },
    { label: 'En Camino',      value: pedidos.filter(p => p.estado === 'En camino').length,   icon: '🛵', color: '#90c0e8' },
    { label: 'Pagados Hoy',    value: pedidos.filter(p => p.estado === 'Pagado').length,      icon: '✅', color: '#c0a0e8' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black:      #07080a;
          --deep:       #0d0f12;
          --surface:    #12151a;
          --glass-bg:   rgba(255,255,255,0.045);
          --glass-bd:   rgba(255,255,255,0.09);
          --glass-hi:   rgba(255,255,255,0.13);
          --gold:       #c9a84c;
          --gold-lt:    #e8c96a;
          --gold-glow:  rgba(201,168,76,.22);
          --gold-dim:   rgba(201,168,76,.08);
          --text:       #f0ead8;
          --text-mid:   #9a9385;
          --text-muted: #5a554d;
          --success:    #4caf82;
          --error:      #e05a5a;
          --radius-card: 20px;
          --radius-inp:  11px;
          --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
          --sidebar-w: 240px;
        }
        body { font-family: 'Outfit', sans-serif; background: var(--black); color: var(--text); min-height: 100vh; overflow-x: hidden; }

        /* ── LAYOUT ── */
        .admin-layout { display: flex; min-height: 100vh; }

        /* ── SIDEBAR ── */
        .admin-sidebar {
          width: var(--sidebar-w); background: var(--deep);
          border-right: 1px solid var(--glass-bd);
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 100; transition: width .3s var(--ease-out-expo); overflow: hidden;
        }
        .admin-sidebar.collapsed { width: 64px; }
        .sidebar-brand {
          padding: 24px 20px 20px; border-bottom: 1px solid var(--glass-bd);
          display: flex; align-items: center; gap: 12px;
          flex-shrink: 0; min-height: 80px; position: relative;
        }
        .sidebar-brand::after {
          content: ''; position: absolute; bottom: -1px; left: 0;
          width: 80px; height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .brand-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(201,168,76,.2), rgba(201,168,76,.05));
          border: 1px solid rgba(201,168,76,.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--gold); box-shadow: 0 0 16px rgba(201,168,76,.1);
        }
        .brand-text { overflow: hidden; white-space: nowrap; }
        .brand-text-name {
          font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 500;
          letter-spacing: 1.5px; text-transform: uppercase; color: var(--text);
          display: block; line-height: 1;
        }
        .brand-text-role {
          font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--gold); opacity: .7; display: block; margin-top: 3px;
        }
        .sidebar-nav { flex: 1; padding: 16px 10px; overflow-y: auto; overflow-x: hidden; }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: var(--glass-bd); border-radius: 2px; }
        .nav-label {
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--text-muted); padding: 0 10px; margin: 16px 0 8px;
          white-space: nowrap; overflow: hidden; transition: opacity .2s;
        }
        .admin-sidebar.collapsed .nav-label { opacity: 0; }
        .nav-item {
          display: flex; align-items: center; gap: 12px; padding: 10px;
          border-radius: 10px; cursor: pointer; color: var(--text-mid);
          font-size: 13.5px; font-weight: 400; letter-spacing: .3px;
          transition: all .2s; position: relative; white-space: nowrap; margin-bottom: 2px;
        }
        .nav-item:hover { background: var(--glass-bg); color: var(--text); }
        .nav-item.active {
          background: var(--gold-dim); color: var(--gold-lt);
          border: 1px solid rgba(201,168,76,.15);
        }
        .nav-item.active::before {
          content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 2px; border-radius: 2px; background: var(--gold);
        }
        .nav-icon { flex-shrink: 0; display: flex; }
        .nav-text { overflow: hidden; transition: opacity .2s, width .3s; }
        .admin-sidebar.collapsed .nav-text { opacity: 0; width: 0; }
        .sidebar-footer { padding: 16px 10px; border-top: 1px solid var(--glass-bd); }
        .user-card {
          display: flex; align-items: center; gap: 10px; padding: 10px;
          border-radius: 10px; background: var(--glass-bg);
          border: 1px solid var(--glass-bd); margin-bottom: 8px; overflow: hidden;
        }
        .user-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, rgba(201,168,76,.3), rgba(201,168,76,.1));
          border: 1px solid rgba(201,168,76,.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: var(--gold-lt);
          flex-shrink: 0; font-family: 'Cormorant Garamond', serif;
        }
        .user-info { overflow: hidden; }
        .user-name {
          font-size: 13px; font-weight: 500; color: var(--text);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .user-role { font-size: 10px; color: var(--gold); letter-spacing: .5px; text-transform: uppercase; }
        .admin-sidebar.collapsed .user-info { display: none; }
        .logout-btn {
          display: flex; align-items: center; gap: 10px; padding: 9px 10px;
          border-radius: 10px; background: none; border: none;
          color: var(--text-muted); cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 13px; width: 100%;
          transition: all .2s; white-space: nowrap;
        }
        .logout-btn:hover { background: rgba(224,90,90,.08); color: var(--error); }
        .admin-sidebar.collapsed .logout-btn span { display: none; }
        .sidebar-toggle {
          position: absolute; top: 50%; right: -12px; transform: translateY(-50%);
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--deep); border: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-muted); transition: all .2s; z-index: 101;
        }
        .sidebar-toggle:hover { color: var(--gold); border-color: rgba(201,168,76,.3); }
        .sidebar-toggle svg { transition: transform .3s; }
        .admin-sidebar.collapsed .sidebar-toggle svg { transform: rotate(180deg); }

        /* ── MAIN ── */
        .admin-main {
          flex: 1; margin-left: var(--sidebar-w);
          transition: margin-left .3s var(--ease-out-expo);
          min-height: 100vh; display: flex; flex-direction: column;
        }
        .admin-main.collapsed { margin-left: 64px; }

        /* TOPBAR */
        .admin-topbar {
          height: 64px; background: var(--deep);
          border-bottom: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; position: sticky; top: 0; z-index: 50;
        }
        .topbar-left { display: flex; flex-direction: column; }
        .topbar-title {
          font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 500;
          letter-spacing: .5px; color: var(--text);
        }
        .topbar-breadcrumb { font-size: 11px; color: var(--text-muted); letter-spacing: .3px; }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .topbar-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); cursor: pointer; transition: all .2s; position: relative;
        }
        .topbar-btn:hover { color: var(--gold); border-color: rgba(201,168,76,.2); }
        .notif-dot {
          position: absolute; top: 6px; right: 6px;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--gold); border: 1.5px solid var(--deep);
        }
        .topbar-date {
          font-size: 12px; color: var(--text-muted); background: var(--glass-bg);
          border: 1px solid var(--glass-bd); border-radius: 8px; padding: 6px 12px;
        }

        /* ── CONTENT ── */
        .admin-content { padding: 32px; flex: 1; }

        /* STATS */
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 28px;
        }
        .stat-card {
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          border-radius: var(--radius-card); padding: 20px; position: relative; overflow: hidden;
          transition: border-color .25s, transform .2s;
        }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 60px; height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .stat-card::after {
          content: ''; position: absolute; top: 0; left: 0;
          width: 1px; height: 60px;
          background: linear-gradient(180deg, var(--gold), transparent);
        }
        .stat-card:hover { border-color: rgba(201,168,76,.2); transform: translateY(-2px); }
        .stat-icon { font-size: 22px; margin-bottom: 10px; }
        .stat-value {
          font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 500;
          line-height: 1; margin-bottom: 4px;
        }
        .stat-label { font-size: 11.5px; color: var(--text-muted); letter-spacing: .3px; }

        /* FILTERS */
        .filters-bar {
          display: flex; gap: 8px; align-items: center;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .filter-btn {
          padding: 7px 16px; border-radius: 8px;
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          color: var(--text-mid); cursor: pointer; font-size: 12.5px;
          font-family: 'Outfit', sans-serif; transition: all .2s; white-space: nowrap;
        }
        .filter-btn:hover { background: var(--glass-hi); color: var(--text); }
        .filter-btn.active {
          background: var(--gold-dim); border-color: rgba(201,168,76,.3); color: var(--gold-lt);
        }
        .search-wrap {
          margin-left: auto; position: relative;
        }
        .search-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); pointer-events: none;
        }
        .search-input {
          padding: 8px 14px 8px 34px; border-radius: 9px;
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          color: var(--text); font-family: 'Outfit', sans-serif;
          font-size: 13px; outline: none; width: 230px; transition: border-color .2s;
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-input:focus { border-color: rgba(201,168,76,.35); }

        /* TABLE CARD */
        .table-card {
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          border-radius: var(--radius-card); overflow: hidden;
        }
        .table-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 16px; border-bottom: 1px solid var(--glass-bd);
        }
        .table-card-title {
          font-family: 'Cormorant Garamond', serif; font-size: 17px;
          font-weight: 500; color: var(--text); letter-spacing: .3px;
        }
        .table-card-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table th {
          padding: 10px 20px; text-align: left; font-size: 10px; font-weight: 500;
          letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted);
          border-bottom: 1px solid var(--glass-bd); background: rgba(255,255,255,.015);
          white-space: nowrap;
        }
        .orders-table td {
          padding: 13px 20px; font-size: 13px;
          border-bottom: 1px solid rgba(255,255,255,.04); color: var(--text);
          vertical-align: middle;
        }
        .orders-table tr:last-child td { border-bottom: none; }
        .orders-table tr:hover td { background: rgba(255,255,255,.02); }
        .order-id {
          font-family: 'Cormorant Garamond', serif; font-size: 15px;
          color: var(--gold-lt); font-weight: 500;
        }
        .status-badge {
          display: inline-flex; align-items: center; padding: 3px 10px;
          border-radius: 20px; font-size: 11px; font-weight: 400; border: 1px solid;
          white-space: nowrap;
        }
        .tipo-badge {
          display: inline-flex; align-items: center; padding: 2px 8px;
          border-radius: 6px; font-size: 10px; letter-spacing: .5px;
        }
        .estado-select {
          background: var(--deep); border: 1px solid var(--glass-bd);
          color: var(--text-mid); border-radius: 7px; padding: 5px 8px;
          font-family: 'Outfit', sans-serif; font-size: 12px; cursor: pointer;
          outline: none; transition: border-color .2s;
        }
        .estado-select:hover { border-color: rgba(201,168,76,.3); color: var(--text); }
        .detail-btn {
          padding: 5px 12px; border-radius: 7px;
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          color: var(--text-mid); cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 12px;
          transition: all .2s; white-space: nowrap;
        }
        .detail-btn:hover {
          background: var(--gold-dim); border-color: rgba(201,168,76,.25); color: var(--gold-lt);
        }
        .empty-state {
          text-align: center; padding: 60px 24px;
          color: var(--text-muted); font-size: 14px;
        }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }

        /* MODAL DETALLE */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(7,8,10,.8);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal-box {
          background: var(--deep); border: 1px solid var(--glass-bd);
          border-radius: var(--radius-card); width: 100%; max-width: 480px;
          position: relative; overflow: hidden;
        }
        .modal-box::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 120px; height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .modal-box::after {
          content: ''; position: absolute; top: 0; left: 0;
          width: 1px; height: 120px;
          background: linear-gradient(180deg, var(--gold), transparent);
        }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 24px 16px; border-bottom: 1px solid var(--glass-bd);
        }
        .modal-title {
          font-family: 'Cormorant Garamond', serif; font-size: 22px;
          font-weight: 500; color: var(--text);
        }
        .modal-close {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-muted); transition: all .2s;
        }
        .modal-close:hover { color: var(--error); border-color: rgba(224,90,90,.3); }
        .modal-body { padding: 20px 24px; }
        .modal-meta {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;
        }
        .modal-meta-item { }
        .modal-meta-label {
          font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 3px;
        }
        .modal-meta-value { font-size: 13px; color: var(--text); }
        .modal-items-title {
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 10px; padding-bottom: 8px;
          border-bottom: 1px solid var(--glass-bd);
        }
        .modal-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,.04);
        }
        .modal-item:last-child { border-bottom: none; }
        .modal-item-name { font-size: 13px; color: var(--text); }
        .modal-item-qty {
          font-size: 11px; color: var(--text-muted);
          background: var(--glass-bg); border-radius: 4px;
          padding: 2px 7px; margin-left: 8px;
        }
        .modal-item-price {
          font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--gold-lt);
        }
        .modal-total {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 0 0; margin-top: 8px;
          border-top: 1px solid var(--glass-bd);
        }
        .modal-total-label { font-size: 13px; color: var(--text-mid); letter-spacing: .5px; }
        .modal-total-value {
          font-family: 'Cormorant Garamond', serif; font-size: 26px;
          font-weight: 500; color: var(--gold-lt);
        }
        .modal-estado-wrap {
          padding: 16px 24px 20px; border-top: 1px solid var(--glass-bd);
          display: flex; align-items: center; gap: 12px;
        }
        .modal-estado-label { font-size: 12px; color: var(--text-muted); flex-shrink: 0; }
        .modal-estado-select {
          flex: 1; background: var(--glass-bg); border: 1px solid var(--glass-bd);
          color: var(--text); border-radius: 9px; padding: 8px 12px;
          font-family: 'Outfit', sans-serif; font-size: 13px; cursor: pointer;
          outline: none; transition: border-color .2s;
        }
        .modal-estado-select:hover { border-color: rgba(201,168,76,.35); }

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .admin-topbar { padding: 0 16px; }
          .admin-content { padding: 20px 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .search-wrap { margin-left: 0; width: 100%; }
          .search-input { width: 100%; }
        }
      `}</style>

      <div className="admin-layout">
        {/* ── SIDEBAR ── */}
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IconChevron />
          </button>
          <div className="sidebar-brand">
            <div className="brand-icon"><IconMenu /></div>
            <div className="brand-text">
              <span className="brand-text-name">Restaurante</span>
              <span className="brand-text-role">Admin Panel</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Principal</div>
            {NAV_ITEMS.map(item => (
              <div
                key={item.key}
                className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path, item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'A'}</div>
              <div className="user-info">
                <div className="user-name">{user?.name || 'Admin'}</div>
                <div className="user-role">Administrador</div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <IconLogout /><span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className={`admin-main ${sidebarOpen ? '' : 'collapsed'}`}>
          {/* TOPBAR */}
          <header className="admin-topbar">
            <div className="topbar-left">
              <span className="topbar-title">Pedidos</span>
              <span className="topbar-breadcrumb">Gestión de pedidos · Todos los pedidos</span>
            </div>
            <div className="topbar-right">
              <div className="topbar-date">
                {new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <button className="topbar-btn">
                <IconBell /><div className="notif-dot" />
              </button>
            </div>
          </header>

          {/* CONTENT */}
          <div className="admin-content">

            {/* STATS */}
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* FILTERS */}
            <div className="filters-bar">
              {ESTADOS.map(est => (
                <button
                  key={est}
                  className={`filter-btn ${filtroEstado === est ? 'active' : ''}`}
                  onClick={() => setFiltroEstado(est)}
                >
                  {est}
                </button>
              ))}
              <div className="search-wrap">
                <span className="search-icon"><IconSearch /></span>
                <input
                  className="search-input"
                  placeholder="Buscar pedido, mesa o cliente..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="table-card">
              <div className="table-card-header">
                <div>
                  <div className="table-card-title">Lista de Pedidos</div>
                  <div className="table-card-sub">
                    {pedidosFiltrados.length} pedido{pedidosFiltrados.length !== 1 ? 's' : ''} encontrado{pedidosFiltrados.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {pedidosFiltrados.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  No se encontraron pedidos con ese filtro
                </div>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Mesa / Zona</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Hora</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.map((p, i) => {
                      const sc = STATUS_COLORS[p.estado] || {}
                      const tc = TIPO_COLORS[p.tipo] || {}
                      return (
                        <tr key={i}>
                          <td><span className="order-id">{p.id}</span></td>
                          <td style={{ color: 'var(--text)', fontSize: '13px' }}>{p.cliente}</td>
                          <td style={{ color: 'var(--text-mid)', fontSize: '12.5px' }}>{p.mesa}</td>
                          <td>
                            <span className="tipo-badge" style={{ background: tc.bg, color: tc.color }}>
                              {p.tipo}
                            </span>
                          </td>
                          <td>
                            <span className="status-badge" style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                              {p.estado}
                            </span>
                          </td>
                          <td style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: 'var(--gold-lt)' }}>
                            {p.total}
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{p.hora}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <select
                                className="estado-select"
                                value={p.estado}
                                onChange={e => cambiarEstado(p.id, e.target.value)}
                              >
                                {ESTADOS_CAMBIO.map(est => (
                                  <option key={est} value={est}>{est}</option>
                                ))}
                              </select>
                              <button className="detail-btn" onClick={() => setPedidoDetalle(p)}>
                                Ver
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL DETALLE ── */}
      {pedidoDetalle && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setPedidoDetalle(null) }}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">Pedido {pedidoDetalle.id}</div>
              <button className="modal-close" onClick={() => setPedidoDetalle(null)}><IconClose /></button>
            </div>
            <div className="modal-body">
              <div className="modal-meta">
                <div className="modal-meta-item">
                  <div className="modal-meta-label">Cliente</div>
                  <div className="modal-meta-value">{pedidoDetalle.cliente}</div>
                </div>
                <div className="modal-meta-item">
                  <div className="modal-meta-label">Mesa / Zona</div>
                  <div className="modal-meta-value">{pedidoDetalle.mesa}</div>
                </div>
                <div className="modal-meta-item">
                  <div className="modal-meta-label">Hora</div>
                  <div className="modal-meta-value">{pedidoDetalle.hora}</div>
                </div>
                <div className="modal-meta-item">
                  <div className="modal-meta-label">Tipo</div>
                  <div className="modal-meta-value">{pedidoDetalle.tipo}</div>
                </div>
              </div>
              <div className="modal-items-title">Artículos del pedido</div>
              {pedidoDetalle.items.map((item, i) => (
                <div className="modal-item" key={i}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="modal-item-name">{item.nombre}</span>
                    <span className="modal-item-qty">x{item.qty}</span>
                  </div>
                  <span className="modal-item-price">{item.precio}</span>
                </div>
              ))}
              <div className="modal-total">
                <span className="modal-total-label">Total</span>
                <span className="modal-total-value">{pedidoDetalle.total}</span>
              </div>
            </div>
            <div className="modal-estado-wrap">
              <span className="modal-estado-label">Cambiar estado:</span>
              <select
                className="modal-estado-select"
                value={pedidoDetalle.estado}
                onChange={e => cambiarEstado(pedidoDetalle.id, e.target.value)}
              >
                {ESTADOS_CAMBIO.map(est => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  )
}