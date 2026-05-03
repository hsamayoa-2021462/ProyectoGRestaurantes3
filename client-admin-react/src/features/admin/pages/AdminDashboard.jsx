// src/features/admin/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'   // ← ÚNICA LÍNEA NUEVA EN IMPORTS
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
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
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
const IconTrend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
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
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

// ---------- MODIFICADO: se añadió la propiedad 'path' a cada ítem ----------
const NAV_ITEMS = [
  { key: 'dashboard',     label: 'Dashboard',      icon: <IconDashboard />, path: '/admin' },
  { key: 'menu',          label: 'Menú',            icon: <IconMenu />,       path: '/admin/menu' },
  { key: 'pedidos',       label: 'Pedidos',         icon: <IconOrders />,     path: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones',   icon: <IconTable />,      path: '/admin/reservaciones' },
  { key: 'restaurantes',  label: 'Restaurantes',    icon: <IconRestaurant />, path: '/admin/restaurantes' },
  { key: 'clientes',      label: 'Clientes',        icon: <IconUsers />,      path: '/admin/clientes' },
  { key: 'reportes',      label: 'Reportes',        icon: <IconReport />,     path: '/admin/reportes' },
]

const STATS = [
  { label: 'Ingresos Hoy',      value: 'Q 4,820',  delta: '+12%', positive: true,  icon: '💰' },
  { label: 'Pedidos Activos',   value: '38',        delta: '+5',   positive: true,  icon: '🧾' },
  { label: 'Mesas Ocupadas',    value: '12/20',     delta: '60%',  positive: true,  icon: '🪑' },
  { label: 'Clientes Hoy',      value: '127',       delta: '-3%',  positive: false, icon: '👥' },
]

const RECENT_ORDERS = [
  { id: '#4521', table: 'Mesa 4',  items: 'Filete, Vino Tinto',         status: 'En cocina',   amount: 'Q 380', time: '5 min' },
  { id: '#4520', table: 'Mesa 7',  items: 'Pasta, Ensalada César',      status: 'Entregado',   amount: 'Q 210', time: '18 min' },
  { id: '#4519', table: 'Delivery', items: 'Pizza Margarita x2',        status: 'En camino',   amount: 'Q 290', time: '32 min' },
  { id: '#4518', table: 'Mesa 2',  items: 'Risotto, Agua mineral',      status: 'Entregado',   amount: 'Q 175', time: '45 min' },
  { id: '#4517', table: 'Mesa 11', items: 'Costillas BBQ, Mojito x2',   status: 'Pagado',      amount: 'Q 520', time: '1h 10m' },
]

const STATUS_COLORS = {
  'En cocina':  { bg: 'rgba(201,168,76,.12)', border: 'rgba(201,168,76,.35)', color: '#e8c96a' },
  'Entregado':  { bg: 'rgba(76,175,130,.1)',  border: 'rgba(76,175,130,.3)',  color: '#7dd9ae' },
  'En camino':  { bg: 'rgba(100,160,220,.1)', border: 'rgba(100,160,220,.3)', color: '#90c0e8' },
  'Pagado':     { bg: 'rgba(130,100,200,.1)', border: 'rgba(130,100,200,.3)', color: '#c0a0e8' },
}

const RESERVATIONS_TODAY = [
  { name: 'Carlos Méndez',   time: '13:00', party: 4, table: 'Mesa 3',  status: 'Confirmada' },
  { name: 'Ana González',    time: '14:30', party: 2, table: 'Mesa 8',  status: 'Confirmada' },
  { name: 'Roberto Lima',    time: '19:00', party: 6, table: 'Mesa 12', status: 'Pendiente' },
  { name: 'María Castillo',  time: '20:00', party: 3, table: 'Mesa 5',  status: 'Confirmada' },
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()       // ← nuevo
  const location = useLocation()       // ← nuevo

  // Determinar el ítem activo según la ruta actual
  const getActiveKey = () => {
    const currentPath = location.pathname
    const item = NAV_ITEMS.find(item => item.path === currentPath)
    return item ? item.key : 'dashboard'
  }

  const [activeNav, setActiveNav] = useState(getActiveKey())

  // Sincronizar activeNav cuando la URL cambie (navegación directa o botón atrás)
  useEffect(() => {
    setActiveNav(getActiveKey())
  }, [location.pathname])

  const handleNavClick = (path, key) => {
    setActiveNav(key)
    navigate(path)   // ← navegación real
  }

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
          --blur:        blur(24px) saturate(180%);
          --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
          --sidebar-w: 240px;
        }

        body { font-family: 'Outfit', sans-serif; background: var(--black); color: var(--text); min-height: 100vh; overflow-x: hidden; }

        /* ── LAYOUT ── */
        .admin-layout { display: flex; min-height: 100vh; }

        /* ── SIDEBAR ── */
        .admin-sidebar {
          width: var(--sidebar-w);
          background: var(--deep);
          border-right: 1px solid var(--glass-bd);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          transition: width .3s var(--ease-out-expo);
          overflow: hidden;
        }
        .admin-sidebar.collapsed { width: 64px; }

        .sidebar-brand {
          padding: 24px 20px 20px;
          border-bottom: 1px solid var(--glass-bd);
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          min-height: 80px;
          position: relative;
        }
        .sidebar-brand::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 80px; height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
        }

        .brand-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(201,168,76,.2), rgba(201,168,76,.05));
          border: 1px solid rgba(201,168,76,.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: var(--gold);
          box-shadow: 0 0 16px rgba(201,168,76,.1);
        }

        .brand-text { overflow: hidden; white-space: nowrap; }
        .brand-text-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 500;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--text);
          display: block; line-height: 1;
        }
        .brand-text-role {
          font-size: 9px; letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gold); opacity: .7;
          display: block; margin-top: 3px;
        }

        /* NAV */
        .sidebar-nav { flex: 1; padding: 16px 10px; overflow-y: auto; overflow-x: hidden; }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: var(--glass-bd); border-radius: 2px; }

        .nav-label {
          font-size: 9px; letter-spacing: 2px;
          text-transform: uppercase; color: var(--text-muted);
          padding: 0 10px; margin: 16px 0 8px;
          white-space: nowrap; overflow: hidden;
          transition: opacity .2s;
        }
        .admin-sidebar.collapsed .nav-label { opacity: 0; }

        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 10px;
          border-radius: 10px;
          cursor: pointer;
          color: var(--text-mid);
          font-size: 13.5px; font-weight: 400;
          letter-spacing: .3px;
          transition: all .2s;
          position: relative;
          white-space: nowrap;
          margin-bottom: 2px;
        }
        .nav-item:hover { background: var(--glass-bg); color: var(--text); }
        .nav-item.active {
          background: var(--gold-dim);
          color: var(--gold-lt);
          border: 1px solid rgba(201,168,76,.15);
        }
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 2px;
          border-radius: 2px;
          background: var(--gold);
        }
        .nav-icon { flex-shrink: 0; display: flex; }
        .nav-text { overflow: hidden; transition: opacity .2s, width .3s; }
        .admin-sidebar.collapsed .nav-text { opacity: 0; width: 0; }

        /* SIDEBAR FOOTER */
        .sidebar-footer {
          padding: 16px 10px;
          border-top: 1px solid var(--glass-bd);
        }

        .user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px;
          border-radius: 10px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-bd);
          margin-bottom: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .user-card:hover {
          border-color: rgba(201,168,76,.35);
          background: var(--gold-dim);
        }
        .user-avatar {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(201,168,76,.3), rgba(201,168,76,.1));
          border: 1px solid rgba(201,168,76,.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
          color: var(--gold-lt);
          flex-shrink: 0;
          font-family: 'Cormorant Garamond', serif;
        }
        .user-info { overflow: hidden; }
        .user-name {
          font-size: 13px; font-weight: 500;
          color: var(--text); white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .user-role {
          font-size: 10px; color: var(--gold);
          letter-spacing: .5px; text-transform: uppercase;
        }
        .admin-sidebar.collapsed .user-info { display: none; }

        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px;
          border-radius: 10px;
          background: none; border: none;
          color: var(--text-muted); cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; width: 100%;
          transition: all .2s;
          white-space: nowrap;
        }
        .logout-btn:hover { background: rgba(224,90,90,.08); color: var(--error); }
        .admin-sidebar.collapsed .logout-btn span { display: none; }

        /* TOGGLE BTN */
        .sidebar-toggle {
          position: absolute;
          top: 50%;
          right: -12px;
          transform: translateY(-50%);
          width: 24px; height: 24px;
          border-radius: 50%;
          background: var(--deep);
          border: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--text-muted);
          transition: all .2s;
          z-index: 101;
          flex-shrink: 0;
        }
        .sidebar-toggle:hover { color: var(--gold); border-color: rgba(201,168,76,.3); }
        .sidebar-toggle svg { transition: transform .3s; }
        .admin-sidebar.collapsed .sidebar-toggle svg { transform: rotate(180deg); }

        /* ── MAIN ── */
        .admin-main {
          flex: 1;
          margin-left: var(--sidebar-w);
          transition: margin-left .3s var(--ease-out-expo);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .admin-main.collapsed { margin-left: 64px; }

        /* TOPBAR */
        .admin-topbar {
          height: 64px;
          background: var(--deep);
          border-bottom: 1px solid var(--glass-bd);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky; top: 0; z-index: 50;
        }

        .topbar-left { display: flex; flex-direction: column; }
        .topbar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 500;
          letter-spacing: .5px; color: var(--text);
        }
        .topbar-breadcrumb {
          font-size: 11px; color: var(--text-muted);
          letter-spacing: .3px;
        }
        .topbar-right { display: flex; align-items: center; gap: 12px; }

        .topbar-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); cursor: pointer;
          transition: all .2s;
          position: relative;
        }
        .topbar-btn:hover { color: var(--gold); border-color: rgba(201,168,76,.2); }
        .notif-dot {
          position: absolute;
          top: 6px; right: 6px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--gold);
          border: 1.5px solid var(--deep);
        }

        .topbar-date {
          font-size: 12px; color: var(--text-muted);
          background: var(--glass-bg);
          border: 1px solid var(--glass-bd);
          border-radius: 8px;
          padding: 6px 12px;
        }

        /* ── CONTENT ── */
        .admin-content { padding: 32px; flex: 1; }

        /* STATS GRID */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-bd);
          border-radius: var(--radius-card);
          padding: 22px;
          position: relative;
          overflow: hidden;
          transition: border-color .25s, transform .2s;
          cursor: default;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 60px; height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .stat-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 60px;
          background: linear-gradient(180deg, var(--gold), transparent);
        }
        .stat-card:hover { border-color: rgba(201,168,76,.2); transform: translateY(-2px); }

        .stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .stat-icon { font-size: 22px; }
        .stat-delta {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 500;
          padding: 3px 8px; border-radius: 20px;
        }
        .stat-delta.positive {
          background: rgba(76,175,130,.1);
          color: var(--success);
        }
        .stat-delta.negative {
          background: rgba(224,90,90,.1);
          color: var(--error);
        }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; font-weight: 500;
          color: var(--text);
          letter-spacing: .5px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label { font-size: 11.5px; color: var(--text-muted); letter-spacing: .3px; }

        /* GRID 2-COL */
        .dash-grid { display: grid; grid-template-columns: 1fr 380px; gap: 20px; margin-bottom: 20px; }

        /* CARDS */
        .dash-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-bd);
          border-radius: var(--radius-card);
          overflow: hidden;
        }
        .dash-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--glass-bd);
        }
        .dash-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px; font-weight: 500;
          color: var(--text); letter-spacing: .3px;
        }
        .dash-card-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .view-all-btn {
          font-size: 11.5px; color: var(--gold);
          background: none; border: none;
          cursor: pointer; letter-spacing: .5px;
          font-family: 'Outfit', sans-serif;
          opacity: .8; transition: opacity .2s;
          display: flex; align-items: center; gap: 4px;
        }
        .view-all-btn:hover { opacity: 1; }

        /* TABLE */
        .orders-table { width: 100%; border-collapse: collapse; }
        .orders-table th {
          padding: 10px 24px;
          text-align: left;
          font-size: 10px; font-weight: 500;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 1px solid var(--glass-bd);
          background: rgba(255,255,255,.015);
        }
        .orders-table td {
          padding: 13px 24px;
          font-size: 13px;
          border-bottom: 1px solid rgba(255,255,255,.04);
          color: var(--text);
        }
        .orders-table tr:last-child td { border-bottom: none; }
        .orders-table tr:hover td { background: rgba(255,255,255,.02); }

        .order-id { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--gold-lt); font-weight: 500; }
        .order-items { color: var(--text-mid); font-size: 12.5px; }
        .order-amount { font-weight: 500; color: var(--text); }
        .order-time { font-size: 11px; color: var(--text-muted); }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px; font-weight: 400;
          border: 1px solid;
          white-space: nowrap;
        }

        /* RESERVATIONS LIST */
        .reserv-list { padding: 8px 0; }
        .reserv-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 24px;
          border-bottom: 1px solid rgba(255,255,255,.04);
          transition: background .15s;
        }
        .reserv-item:last-child { border-bottom: none; }
        .reserv-item:hover { background: rgba(255,255,255,.02); }
        .reserv-time {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 500;
          color: var(--gold-lt); min-width: 52px;
          letter-spacing: .5px;
        }
        .reserv-info { flex: 1; }
        .reserv-name { font-size: 13px; color: var(--text); }
        .reserv-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
        .reserv-status {
          font-size: 10px; padding: 3px 8px; border-radius: 20px;
          font-weight: 400;
        }
        .reserv-status.confirmed {
          background: rgba(76,175,130,.1); border: 1px solid rgba(76,175,130,.25);
          color: var(--success);
        }
        .reserv-status.pending {
          background: rgba(201,168,76,.08); border: 1px solid rgba(201,168,76,.2);
          color: var(--gold);
        }

        /* QUICK ACTIONS */
        .quick-actions {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 20px;
        }
        .quick-btn {
          background: var(--glass-bg);
          border: 1px solid var(--glass-bd);
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          color: var(--text-mid);
          font-family: 'Outfit', sans-serif;
          font-size: 12px; letter-spacing: .3px;
          transition: all .2s;
          text-align: center;
        }
        .quick-btn:hover {
          background: var(--gold-dim);
          border-color: rgba(201,168,76,.25);
          color: var(--gold-lt);
          transform: translateY(-2px);
        }
        .quick-btn-icon { font-size: 20px; }

        /* TOP DISHES */
        .dish-list { padding: 8px 0; }
        .dish-item {
          display: flex; align-items: center; gap: 14px;
          padding: 10px 24px;
          border-bottom: 1px solid rgba(255,255,255,.04);
        }
        .dish-item:last-child { border-bottom: none; }
        .dish-rank {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; color: var(--text-muted);
          min-width: 24px; text-align: center;
        }
        .dish-name { font-size: 13px; color: var(--text); flex: 1; }
        .dish-orders { font-size: 11px; color: var(--text-muted); }
        .dish-bar-wrap { width: 80px; height: 4px; background: rgba(255,255,255,.06); border-radius: 2px; }
        .dish-bar { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-lt)); }
        .dish-stars { display: flex; gap: 1px; color: var(--gold); align-items: center; font-size: 11px; }

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-grid { grid-template-columns: 1fr; }
          .quick-actions { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="admin-layout">
        {/* ── SIDEBAR ── */}
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          {/* Toggle */}
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IconChevron />
          </button>

          {/* Brand */}
          <div className="sidebar-brand">
            <div className="brand-icon"><IconMenu /></div>
            <div className="brand-text">
              <span className="brand-text-name">Restaurante</span>
              <span className="brand-text-role">Admin Panel</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            <div className="nav-label">Principal</div>
            {NAV_ITEMS.map(item => (
              <div
                key={item.key}
                className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path, item.key)}   // ← modificado
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="user-card" onClick={() => navigate('/admin/perfil')} title="Ver mi perfil">
              <div className="user-avatar">
                {user?.profilePicture
                  ? <img src={user.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} />
                  : user?.name?.[0]?.toUpperCase() || 'A'
                }
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

        {/* ── MAIN ── */}
        <main className={`admin-main ${sidebarOpen ? '' : 'collapsed'}`}>
          {/* Topbar */}
          <header className="admin-topbar">
            <div className="topbar-left">
              <span className="topbar-title">Dashboard</span>
              <span className="topbar-breadcrumb">Panel de control · Resumen general</span>
            </div>
            <div className="topbar-right">
              <div className="topbar-date">
                {new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <button className="topbar-btn">
                <IconBell />
                <div className="notif-dot" />
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="admin-content">

            {/* STATS */}
            <div className="stats-grid">
              {STATS.map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-header">
                    <span className="stat-icon">{s.icon}</span>
                    <span className={`stat-delta ${s.positive ? 'positive' : 'negative'}`}>
                      <IconTrend />{s.delta}
                    </span>
                  </div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions">
              {[
                { icon: '➕', label: 'Agregar Mesa' },
                { icon: '🍽️', label: 'Nuevo Plato' },
                { icon: '📋', label: 'Tomar Pedido' },
                { icon: '🗓️', label: 'Nueva Reserva' },
              ].map((a, i) => (
                <button className="quick-btn" key={i}>
                  <span className="quick-btn-icon">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>

            {/* GRID */}
            <div className="dash-grid">

              {/* PEDIDOS RECIENTES */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <div className="dash-card-title">Pedidos Recientes</div>
                    <div className="dash-card-sub">Actividad de los últimos 60 minutos</div>
                  </div>
                  <button className="view-all-btn">Ver todos <IconChevron /></button>
                </div>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Mesa / Zona</th>
                      <th>Artículos</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((o, i) => {
                      const sc = STATUS_COLORS[o.status] || {}
                      return (
                        <tr key={i}>
                          <td><span className="order-id">{o.id}</span></td>
                          <td style={{ color: 'var(--text-mid)', fontSize: '12.5px' }}>{o.table}</td>
                          <td><span className="order-items">{o.items}</span></td>
                          <td>
                            <span className="status-badge" style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                              {o.status}
                            </span>
                          </td>
                          <td><span className="order-amount">{o.amount}</span></td>
                          <td><span className="order-time">{o.time}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* RESERVACIONES HOY */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <div className="dash-card-title">Reservaciones Hoy</div>
                    <div className="dash-card-sub">{RESERVATIONS_TODAY.length} reservas programadas</div>
                  </div>
                  <button className="view-all-btn">Ver todas <IconChevron /></button>
                </div>
                <div className="reserv-list">
                  {RESERVATIONS_TODAY.map((r, i) => (
                    <div className="reserv-item" key={i}>
                      <div className="reserv-time">{r.time}</div>
                      <div className="reserv-info">
                        <div className="reserv-name">{r.name}</div>
                        <div className="reserv-meta">{r.table} · {r.party} personas</div>
                      </div>
                      <span className={`reserv-status ${r.status === 'Confirmada' ? 'confirmed' : 'pending'}`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TOP PLATOS */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div>
                  <div className="dash-card-title">Platos Más Pedidos</div>
                  <div className="dash-card-sub">Ranking del mes</div>
                </div>
              </div>
              <div className="dish-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {[
                  { name: 'Filete a la Parrilla', orders: 142, pct: 100, stars: 4.9 },
                  { name: 'Risotto de Mariscos',  orders: 128, pct: 90,  stars: 4.8 },
                  { name: 'Pasta Carbonara',       orders: 115, pct: 81,  stars: 4.7 },
                  { name: 'Ensalada César',        orders: 98,  pct: 69,  stars: 4.6 },
                  { name: 'Costillas BBQ',          orders: 87,  pct: 61,  stars: 4.8 },
                  { name: 'Tiramisú',              orders: 76,  pct: 54,  stars: 4.9 },
                ].map((d, i) => (
                  <div className="dish-item" key={i}>
                    <div className="dish-rank">{i + 1}</div>
                    <div className="dish-name">{d.name}</div>
                    <div className="dish-stars">
                      <IconStar /> {d.stars}
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 12 }}>
                      <div className="dish-orders" style={{ marginBottom: 4 }}>{d.orders} pedidos</div>
                      <div className="dish-bar-wrap">
                        <div className="dish-bar" style={{ width: `${d.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}