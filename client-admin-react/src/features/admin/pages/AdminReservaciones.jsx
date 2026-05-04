// src/features/admin/pages/AdminReservaciones.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api from '../../../shared/api/api'

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
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)

const NAV_ITEMS = [
  { key: 'dashboard',     label: 'Dashboard',      icon: <IconDashboard />, path: '/admin' },
  { key: 'menu',          label: 'Menú',            icon: <IconMenu />,      path: '/admin/menu' },
  { key: 'pedidos',       label: 'Pedidos',         icon: <IconOrders />,    path: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones',   icon: <IconTable />,     path: '/admin/reservaciones' },
  { key: 'restaurantes',  label: 'Restaurantes',    icon: <IconRestaurant />,path: '/admin/restaurantes' },
  { key: 'clientes',      label: 'Clientes',        icon: <IconUsers />,     path: '/admin/clientes' },
  { key: 'reportes',      label: 'Reportes',        icon: <IconReport />,    path: '/admin/reportes' },
]

const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA']

const ESTADO_STYLES = {
  PENDIENTE:   { badge: 'badge-gold',  label: 'Pendiente' },
  CONFIRMADA:  { badge: 'badge-green', label: 'Confirmada' },
  CANCELADA:   { badge: 'badge-red',   label: 'Cancelada' },
  COMPLETADA:  { badge: 'badge-blue',  label: 'Completada' },
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function AdminReservaciones() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => {
    const item = NAV_ITEMS.find(i => i.path === location.pathname)
    return item ? item.key : 'reservaciones'
  }
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])
  const handleNavClick = (path, key) => { setActiveNav(key); navigate(path) }

  const [reservaciones, setReservaciones] = useState([])
  const [mesas, setMesas]                 = useState([])
  const [clientes, setClientes]           = useState([])
  const [restaurantes, setRestaurantes]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [search, setSearch]     = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [toast, setToast]       = useState(null)
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState({})
  const [saving, setSaving]     = useState(false)
  const [detalle, setDetalle]   = useState(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = async () => {
    setLoading(true)
    try {
      const [resRes, mesRes, cliRes, restRes] = await Promise.all([
        api.get('/reservaciones'),
        api.get('/mesas'),
        api.get('/usuarios?rol=cliente'),
        api.get('/restaurante'),
      ])
      setReservaciones(resRes.data.data || [])
      setMesas(mesRes.data.data || [])
      setClientes(cliRes.data.data || [])
      setRestaurantes(restRes.data.data || [])
    } catch {
      // fallback mock
      setReservaciones([
        { _id: '1', cliente: { nombre: 'Ana García', email: 'ana@mail.com' }, mesa: { numero: 'Mesa 3', zona: 'Terraza' }, restaurante: { nombre: 'Sucursal Central' }, fecha: '2026-05-10', hora: '19:30', personas: 4, estado: 'CONFIRMADA', notas: 'Cumpleaños', createdAt: new Date().toISOString() },
        { _id: '2', cliente: { nombre: 'Carlos Ruiz', email: 'carlos@mail.com' }, mesa: { numero: 'Mesa 7', zona: 'Interior' }, restaurante: { nombre: 'Sucursal Central' }, fecha: '2026-05-10', hora: '20:00', personas: 2, estado: 'PENDIENTE', notas: '', createdAt: new Date().toISOString() },
        { _id: '3', cliente: { nombre: 'María López', email: 'maria@mail.com' }, mesa: { numero: 'Mesa 1', zona: 'Bar' }, restaurante: { nombre: 'Sucursal Norte' }, fecha: '2026-05-09', hora: '13:00', personas: 6, estado: 'COMPLETADA', notas: 'Aniversario', createdAt: new Date().toISOString() },
        { _id: '4', cliente: { nombre: 'José Torres', email: 'jose@mail.com' }, mesa: { numero: 'Mesa 5', zona: 'Privado' }, restaurante: { nombre: 'Sucursal Norte' }, fecha: '2026-05-08', hora: '21:00', personas: 8, estado: 'CANCELADA', notas: '', createdAt: new Date().toISOString() },
        { _id: '5', cliente: { nombre: 'Laura Pérez', email: 'laura@mail.com' }, mesa: { numero: 'Mesa 2', zona: 'Ventana' }, restaurante: { nombre: 'Sucursal Central' }, fecha: '2026-05-11', hora: '12:30', personas: 3, estado: 'PENDIENTE', notas: 'Vegetariana', createdAt: new Date().toISOString() },
      ])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm({}); setModal({ type: 'create' }) }
  const openEdit   = (r)  => { setForm({ ...r, mesa: r.mesa?._id || r.mesa, cliente: r.cliente?._id || r.cliente, restaurante: r.restaurante?._id || r.restaurante }); setModal({ type: 'edit', item: r }) }
  const closeModal = ()   => { setModal(null); setForm({}) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal.type === 'create') {
        await api.post('/reservaciones', form)
        showToast('Reservación creada')
      } else {
        await api.put(`/reservaciones/${modal.item._id}`, form)
        showToast('Reservación actualizada')
      }
      closeModal(); load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al guardar', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta reservación?')) return
    try {
      await api.delete(`/reservaciones/${id}`)
      showToast('Reservación eliminada'); load()
    } catch (err) {
      showToast(err.response?.data?.message || 'No se puede eliminar', 'error')
    }
  }

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/reservaciones/${id}`, { estado: nuevoEstado })
      showToast('Estado actualizado'); load()
    } catch {
      showToast('Error al actualizar estado', 'error')
    }
  }

  const filtered = reservaciones.filter(r => {
    const matchBusq = !search ||
      (r.cliente?.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.mesa?.numero    || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.restaurante?.nombre || '').toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'TODOS' || r.estado === filtroEstado
    return matchBusq && matchEstado
  })

  const total       = reservaciones.length
  const pendientes  = reservaciones.filter(r => r.estado === 'PENDIENTE').length
  const confirmadas = reservaciones.filter(r => r.estado === 'CONFIRMADA').length
  const hoy = new Date().toISOString().split('T')[0]
  const deHoy = reservaciones.filter(r => r.fecha?.substring(0, 10) === hoy).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --black:#07080a; --deep:#0d0f12; --surface:#12151a;
          --glass-bg:rgba(255,255,255,0.045); --glass-bd:rgba(255,255,255,0.09); --glass-hi:rgba(255,255,255,0.13);
          --gold:#c9a84c; --gold-lt:#e8c96a; --gold-glow:rgba(201,168,76,.22); --gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8; --text-mid:#9a9385; --text-muted:#5a554d;
          --success:#4caf82; --error:#e05a5a; --info:#5b9bd5;
          --radius-card:20px; --radius-inp:11px;
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
          --sidebar-w:240px;
        }
        body { font-family:'Outfit',sans-serif; background:var(--black); color:var(--text); min-height:100vh; overflow-x:hidden; }
        .admin-layout { display:flex; min-height:100vh; }

        /* SIDEBAR */
        .admin-sidebar {
          width:var(--sidebar-w); background:var(--deep); border-right:1px solid var(--glass-bd);
          display:flex; flex-direction:column;
          position:fixed; top:0; left:0; bottom:0; z-index:100;
          transition:width .3s var(--ease-out-expo); overflow:hidden;
        }
        .admin-sidebar.collapsed { width:64px; }
        .sidebar-brand {
          padding:24px 20px 20px; border-bottom:1px solid var(--glass-bd);
          display:flex; align-items:center; gap:12px; flex-shrink:0; min-height:80px; position:relative;
        }
        .sidebar-brand::after { content:''; position:absolute; bottom:-1px; left:0; width:80px; height:1px; background:linear-gradient(90deg,var(--gold),transparent); }
        .brand-icon {
          width:36px; height:36px; border-radius:10px;
          background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));
          border:1px solid rgba(201,168,76,.25); display:flex; align-items:center; justify-content:center;
          flex-shrink:0; color:var(--gold);
        }
        .brand-text { overflow:hidden; white-space:nowrap; }
        .brand-text-name { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--text); display:block; line-height:1; }
        .brand-text-role { font-size:9px; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); opacity:.7; display:block; margin-top:3px; }
        .sidebar-nav { flex:1; padding:16px 10px; overflow-y:auto; overflow-x:hidden; }
        .sidebar-nav::-webkit-scrollbar { width:3px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background:var(--glass-bd); border-radius:2px; }
        .nav-label { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); padding:0 10px; margin:16px 0 8px; white-space:nowrap; overflow:hidden; transition:opacity .2s; }
        .admin-sidebar.collapsed .nav-label { opacity:0; }
        .nav-item { display:flex; align-items:center; gap:12px; padding:10px; border-radius:10px; cursor:pointer; color:var(--text-mid); font-size:13.5px; font-weight:400; letter-spacing:.3px; transition:all .2s; position:relative; white-space:nowrap; margin-bottom:2px; }
        .nav-item:hover { background:var(--glass-bg); color:var(--text); }
        .nav-item.active { background:var(--gold-dim); color:var(--gold-lt); border:1px solid rgba(201,168,76,.15); }
        .nav-item.active::before { content:''; position:absolute; left:0; top:20%; bottom:20%; width:2px; border-radius:2px; background:var(--gold); }
        .nav-icon { flex-shrink:0; display:flex; }
        .nav-text { overflow:hidden; transition:opacity .2s, width .3s; }
        .admin-sidebar.collapsed .nav-text { opacity:0; width:0; }
        .sidebar-footer { padding:16px 10px; border-top:1px solid var(--glass-bd); }
        .user-card { display:flex; align-items:center; gap:10px; padding:10px; border-radius:10px; background:var(--glass-bg); border:1px solid var(--glass-bd); margin-bottom:8px; overflow:hidden; }
        .user-avatar { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1)); border:1px solid rgba(201,168,76,.2); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; color:var(--gold-lt); flex-shrink:0; font-family:'Cormorant Garamond',serif; }
        .user-info { overflow:hidden; }
        .user-name { font-size:13px; font-weight:500; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .user-role { font-size:10px; color:var(--gold); letter-spacing:.5px; text-transform:uppercase; }
        .admin-sidebar.collapsed .user-info { display:none; }
        .logout-btn { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:10px; background:none; border:none; color:var(--text-muted); cursor:pointer; font-family:'Outfit',sans-serif; font-size:13px; width:100%; transition:all .2s; white-space:nowrap; }
        .logout-btn:hover { background:rgba(224,90,90,.08); color:var(--error); }
        .admin-sidebar.collapsed .logout-btn span { display:none; }
        .sidebar-toggle { position:absolute; top:50%; right:-12px; transform:translateY(-50%); width:24px; height:24px; border-radius:50%; background:var(--deep); border:1px solid var(--glass-bd); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-muted); transition:all .2s; z-index:101; }
        .sidebar-toggle:hover { color:var(--gold); border-color:rgba(201,168,76,.3); }
        .sidebar-toggle svg { transition:transform .3s; }
        .admin-sidebar.collapsed .sidebar-toggle svg { transform:rotate(180deg); }

        /* MAIN */
        .admin-main { flex:1; margin-left:var(--sidebar-w); transition:margin-left .3s var(--ease-out-expo); min-height:100vh; display:flex; flex-direction:column; }
        .admin-main.collapsed { margin-left:64px; }
        .admin-topbar { height:64px; background:var(--deep); border-bottom:1px solid var(--glass-bd); display:flex; align-items:center; justify-content:space-between; padding:0 32px; position:sticky; top:0; z-index:50; }
        .topbar-left { display:flex; flex-direction:column; }
        .topbar-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500; letter-spacing:.5px; color:var(--text); }
        .topbar-breadcrumb { font-size:11px; color:var(--text-muted); letter-spacing:.3px; }
        .topbar-right { display:flex; align-items:center; gap:12px; }
        .topbar-btn { width:36px; height:36px; border-radius:10px; background:var(--glass-bg); border:1px solid var(--glass-bd); display:flex; align-items:center; justify-content:center; color:var(--text-muted); cursor:pointer; transition:all .2s; position:relative; }
        .topbar-btn:hover { color:var(--gold); border-color:rgba(201,168,76,.2); }
        .notif-dot { position:absolute; top:6px; right:6px; width:7px; height:7px; border-radius:50%; background:var(--gold); border:1.5px solid var(--deep); }
        .topbar-date { font-size:12px; color:var(--text-muted); background:var(--glass-bg); border:1px solid var(--glass-bd); border-radius:8px; padding:6px 12px; }
        .admin-content { padding:32px; flex:1; }

        /* STATS */
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
        .stat-card { background:var(--glass-bg); border:1px solid var(--glass-bd); border-radius:var(--radius-card); padding:22px; position:relative; overflow:hidden; transition:border-color .25s,transform .2s; }
        .stat-card::before { content:''; position:absolute; top:0; left:0; width:60px; height:1px; background:linear-gradient(90deg,var(--gold),transparent); }
        .stat-card::after  { content:''; position:absolute; top:0; left:0; width:1px; height:60px; background:linear-gradient(180deg,var(--gold),transparent); }
        .stat-card:hover { border-color:rgba(201,168,76,.2); transform:translateY(-2px); }
        .stat-value { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:500; color:var(--text); line-height:1; margin-bottom:4px; }
        .stat-label { font-size:11.5px; color:var(--text-muted); letter-spacing:.3px; }
        .stat-icon { font-size:22px; margin-bottom:10px; }

        /* FILTROS */
        .filters-wrap { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .filter-btn { padding:6px 14px; border-radius:7px; background:var(--glass-bg); border:1px solid var(--glass-bd); color:var(--text-muted); cursor:pointer; font-size:12px; font-family:'Outfit',sans-serif; transition:all .2s; }
        .filter-btn:hover { color:var(--text); }
        .filter-btn.active { background:var(--gold-dim); border-color:rgba(201,168,76,.3); color:var(--gold-lt); }

        /* TABLE CARD */
        .table-card { background:var(--glass-bg); border:1px solid var(--glass-bd); border-radius:var(--radius-card); overflow:hidden; }
        .table-card-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--glass-bd); gap:12px; flex-wrap:wrap; }
        .table-card-title { font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:500; color:var(--text); letter-spacing:.3px; }
        .table-card-sub { font-size:11px; color:var(--text-muted); margin-top:2px; }
        .header-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .search-wrap { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,.04); border:1px solid var(--glass-bd); border-radius:10px; padding:7px 12px; }
        .search-wrap input { background:none; border:none; outline:none; color:var(--text); font-family:'Outfit',sans-serif; font-size:13px; width:180px; }
        .search-wrap input::placeholder { color:var(--text-muted); }
        .search-icon { color:var(--text-muted); display:flex; }
        .btn-primary { display:flex; align-items:center; gap:6px; padding:9px 16px; border-radius:10px; background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1)); border:1px solid rgba(201,168,76,.3); color:var(--gold-lt); cursor:pointer; font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; transition:all .2s; white-space:nowrap; }
        .btn-primary:hover { background:linear-gradient(135deg,rgba(201,168,76,.35),rgba(201,168,76,.18)); border-color:rgba(201,168,76,.5); transform:translateY(-1px); }
        .data-table { width:100%; border-collapse:collapse; }
        .data-table th { padding:10px 24px; text-align:left; font-size:10px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-muted); border-bottom:1px solid var(--glass-bd); background:rgba(255,255,255,.015); }
        .data-table td { padding:14px 24px; font-size:13px; border-bottom:1px solid rgba(255,255,255,.04); color:var(--text); vertical-align:middle; }
        .data-table tr:last-child td { border-bottom:none; }
        .data-table tr:hover td { background:rgba(255,255,255,.02); }
        .cell-main { font-size:13.5px; color:var(--text); font-weight:400; }
        .cell-sub { font-size:11.5px; color:var(--text-muted); margin-top:2px; }
        .cell-mono { font-family:'Cormorant Garamond',serif; font-size:16px; color:var(--gold-lt); }
        .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:400; border:1px solid; white-space:nowrap; }
        .badge-green { background:rgba(76,175,130,.1);  border-color:rgba(76,175,130,.25); color:var(--success); }
        .badge-gold  { background:rgba(201,168,76,.08); border-color:rgba(201,168,76,.2);  color:var(--gold); }
        .badge-red   { background:rgba(224,90,90,.1);   border-color:rgba(224,90,90,.25);  color:var(--error); }
        .badge-blue  { background:rgba(91,155,213,.1);  border-color:rgba(91,155,213,.25); color:var(--info); }
        .action-btns { display:flex; gap:6px; }
        .action-btn { width:30px; height:30px; border-radius:8px; background:var(--glass-bg); border:1px solid var(--glass-bd); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-muted); transition:all .2s; }
        .action-btn:hover { color:var(--gold-lt); border-color:rgba(201,168,76,.3); background:var(--gold-dim); }
        .action-btn.danger:hover { color:var(--error); border-color:rgba(224,90,90,.3); background:rgba(224,90,90,.08); }
        .loading-row td, .empty-row td { text-align:center; padding:48px; color:var(--text-muted); font-size:13px; }
        .empty-icon { font-size:28px; margin-bottom:8px; opacity:.4; }

        /* SELECT ESTADO INLINE */
        .select-estado {
          background:transparent; border:none; outline:none;
          font-family:'Outfit',sans-serif; font-size:11px;
          cursor:pointer; color:inherit;
        }
        .select-estado option { background:var(--deep); color:var(--text); }

        /* MODAL */
        .modal-overlay { position:fixed; inset:0; background:rgba(7,8,10,.8); backdrop-filter:blur(6px); z-index:200; display:flex; align-items:center; justify-content:center; padding:24px; }
        .modal-box { background:var(--deep); border:1px solid var(--glass-bd); border-radius:20px; width:100%; max-width:520px; overflow:hidden; max-height:90vh; overflow-y:auto; }
        .modal-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--glass-bd); position:sticky; top:0; background:var(--deep); z-index:1; }
        .modal-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:500; color:var(--text); }
        .modal-close { width:32px; height:32px; border-radius:8px; background:var(--glass-bg); border:1px solid var(--glass-bd); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-muted); transition:all .2s; }
        .modal-close:hover { color:var(--error); border-color:rgba(224,90,90,.3); }
        .modal-body { padding:24px; display:flex; flex-direction:column; gap:14px; }
        .form-group { display:flex; flex-direction:column; gap:6px; }
        .form-label { font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); }
        .form-input,.form-select,.form-textarea { background:rgba(255,255,255,.04); border:1px solid var(--glass-bd); border-radius:var(--radius-inp); padding:10px 14px; color:var(--text); font-family:'Outfit',sans-serif; font-size:13.5px; outline:none; transition:border-color .2s; width:100%; }
        .form-input:focus,.form-select:focus,.form-textarea:focus { border-color:rgba(201,168,76,.4); }
        .form-select option { background:var(--deep); }
        .form-textarea { resize:vertical; min-height:80px; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:4px; }
        .btn-cancel { padding:9px 18px; border-radius:10px; background:none; border:1px solid var(--glass-bd); color:var(--text-muted); cursor:pointer; font-family:'Outfit',sans-serif; font-size:13px; transition:all .2s; }
        .btn-cancel:hover { border-color:var(--glass-hi); color:var(--text); }
        .btn-save { padding:9px 22px; border-radius:10px; background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.12)); border:1px solid rgba(201,168,76,.35); color:var(--gold-lt); cursor:pointer; font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; transition:all .2s; }
        .btn-save:hover { background:linear-gradient(135deg,rgba(201,168,76,.45),rgba(201,168,76,.2)); }
        .btn-save:disabled { opacity:.5; cursor:not-allowed; }

        /* DETALLE MODAL */
        .detalle-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.04); }
        .detalle-row:last-child { border-bottom:none; }
        .detalle-key { font-size:12px; color:var(--text-muted); }
        .detalle-val { font-size:13px; color:var(--text); text-align:right; }
        .detalle-val.gold { font-family:'Cormorant Garamond',serif; font-size:16px; color:var(--gold-lt); }

        /* TOAST */
        .toast { position:fixed; bottom:28px; right:28px; padding:12px 20px; border-radius:12px; font-size:13.5px; font-family:'Outfit',sans-serif; z-index:300; animation:slideUp .3s var(--ease-out-expo); border:1px solid; }
        .toast-success { background:rgba(76,175,130,.15); border-color:rgba(76,175,130,.3); color:var(--success); }
        .toast-error   { background:rgba(224,90,90,.15);  border-color:rgba(224,90,90,.3);  color:var(--error); }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        @media (max-width:1200px) {
          .stats-grid { grid-template-columns:repeat(2,1fr); }
        }
      `}</style>

      <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><IconChevron /></button>
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
              <div key={item.key} className={`nav-item ${activeNav === item.key ? 'active' : ''}`} onClick={() => handleNavClick(item.path, item.key)}>
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
            <button className="logout-btn" onClick={logout}><IconLogout /><span>Cerrar sesión</span></button>
          </div>
        </aside>

        {/* MAIN */}
        <main className={`admin-main ${sidebarOpen ? '' : 'collapsed'}`}>
          <header className="admin-topbar">
            <div className="topbar-left">
              <span className="topbar-title">Gestión de Reservaciones</span>
              <span className="topbar-breadcrumb">Panel de control · Reservaciones</span>
            </div>
            <div className="topbar-right">
              <div className="topbar-date">{new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              <button className="topbar-btn"><IconBell /><div className="notif-dot" /></button>
            </div>
          </header>

          <div className="admin-content">

            {/* STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{total}</div>
                <div className="stat-label">Total Reservaciones</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">{pendientes}</div>
                <div className="stat-label">Pendientes</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{confirmadas}</div>
                <div className="stat-label">Confirmadas</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🗓️</div>
                <div className="stat-value">{deHoy}</div>
                <div className="stat-label">Para hoy</div>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-card">
              <div className="table-card-header">
                <div>
                  <div className="table-card-title">Reservaciones</div>
                  <div className="table-card-sub">{filtered.length} registros encontrados</div>
                </div>
                <div className="header-actions">
                  <div className="filters-wrap">
                    {['TODOS', ...ESTADOS].map(e => (
                      <button key={e} className={`filter-btn ${filtroEstado === e ? 'active' : ''}`} onClick={() => setFiltroEstado(e)}>
                        {e === 'TODOS' ? 'Todos' : (ESTADO_STYLES[e]?.label || e)}
                      </button>
                    ))}
                  </div>
                  <div className="search-wrap">
                    <span className="search-icon"><IconSearch /></span>
                    <input placeholder="Buscar cliente, mesa..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <button className="btn-primary" onClick={openCreate}><IconPlus /> Nueva Reservación</button>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Mesa</th>
                    <th>Restaurante</th>
                    <th>Fecha & Hora</th>
                    <th>Personas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row"><td colSpan={7}>Cargando...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr className="empty-row"><td colSpan={7}><div className="empty-icon">📅</div><div>Sin reservaciones registradas</div></td></tr>
                  ) : filtered.map(r => {
                    const est = ESTADO_STYLES[r.estado] || { badge: 'badge-gold', label: r.estado }
                    return (
                      <tr key={r._id}>
                        <td>
                          <div className="cell-main">{r.cliente?.nombre || r.cliente?.name || '—'}</div>
                          <div className="cell-sub">{r.cliente?.email || ''}</div>
                        </td>
                        <td>
                          <div className="cell-main">{r.mesa?.numero || '—'}</div>
                          <div className="cell-sub">{r.mesa?.zona || ''}</div>
                        </td>
                        <td><span className="badge badge-gold">{r.restaurante?.nombre || '—'}</span></td>
                        <td>
                          <div className="cell-main" style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <IconCalendar /> {r.fecha?.substring(0,10) || '—'}
                          </div>
                          <div className="cell-sub">{r.hora || ''}</div>
                        </td>
                        <td><div className="cell-mono">{r.personas || '—'}</div></td>
                        <td>
                          <span className={`badge ${est.badge}`}>
                            <select
                              className="select-estado"
                              value={r.estado}
                              style={{ color: 'inherit' }}
                              onChange={e => handleChangeEstado(r._id, e.target.value)}
                              onClick={e => e.stopPropagation()}
                            >
                              {ESTADOS.map(s => <option key={s} value={s}>{ESTADO_STYLES[s]?.label || s}</option>)}
                            </select>
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="action-btn" title="Ver detalle" onClick={() => setDetalle(r)}><IconEye /></button>
                            <button className="action-btn" title="Editar" onClick={() => openEdit(r)}><IconEdit /></button>
                            <button className="action-btn danger" title="Eliminar" onClick={() => handleDelete(r._id)}><IconTrash /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL CREAR/EDITAR */}
      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <Modal title={modal.type === 'create' ? 'Nueva Reservación' : 'Editar Reservación'} onClose={closeModal}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input className="form-input" type="date" value={form.fecha?.substring(0,10) || ''} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Hora *</label>
              <input className="form-input" type="time" value={form.hora || ''} onChange={e => setForm(f => ({ ...f, hora: e.target.value }))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">N° Personas *</label>
              <input className="form-input" type="number" min="1" max="20" value={form.personas || ''} onChange={e => setForm(f => ({ ...f, personas: e.target.value }))} placeholder="2" />
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="form-select" value={form.estado || 'PENDIENTE'} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                {ESTADOS.map(s => <option key={s} value={s}>{ESTADO_STYLES[s]?.label || s}</option>)}
              </select>
            </div>
          </div>
          {mesas.length > 0 && (
            <div className="form-group">
              <label className="form-label">Mesa</label>
              <select className="form-select" value={form.mesa || ''} onChange={e => setForm(f => ({ ...f, mesa: e.target.value }))}>
                <option value="">Seleccionar mesa...</option>
                {mesas.map(m => <option key={m._id} value={m._id}>{m.numero} — {m.zona}</option>)}
              </select>
            </div>
          )}
          {restaurantes.length > 0 && (
            <div className="form-group">
              <label className="form-label">Restaurante</label>
              <select className="form-select" value={form.restaurante || ''} onChange={e => setForm(f => ({ ...f, restaurante: e.target.value }))}>
                <option value="">Seleccionar restaurante...</option>
                {restaurantes.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
              </select>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Notas</label>
            <textarea className="form-textarea" value={form.notas || ''} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} placeholder="Observaciones, solicitudes especiales..." />
          </div>
          <div className="form-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </Modal>
      )}

      {/* MODAL DETALLE */}
      {detalle && (
        <Modal title="Detalle de Reservación" onClose={() => setDetalle(null)}>
          <div className="detalle-row"><span className="detalle-key">Cliente</span><span className="detalle-val">{detalle.cliente?.nombre || detalle.cliente?.name || '—'}</span></div>
          <div className="detalle-row"><span className="detalle-key">Email</span><span className="detalle-val">{detalle.cliente?.email || '—'}</span></div>
          <div className="detalle-row"><span className="detalle-key">Mesa</span><span className="detalle-val gold">{detalle.mesa?.numero} — {detalle.mesa?.zona || '—'}</span></div>
          <div className="detalle-row"><span className="detalle-key">Restaurante</span><span className="detalle-val">{detalle.restaurante?.nombre || '—'}</span></div>
          <div className="detalle-row"><span className="detalle-key">Fecha</span><span className="detalle-val gold">{detalle.fecha?.substring(0,10) || '—'}</span></div>
          <div className="detalle-row"><span className="detalle-key">Hora</span><span className="detalle-val gold">{detalle.hora || '—'}</span></div>
          <div className="detalle-row"><span className="detalle-key">Personas</span><span className="detalle-val">{detalle.personas || '—'}</span></div>
          <div className="detalle-row"><span className="detalle-key">Estado</span>
            <span className={`badge ${ESTADO_STYLES[detalle.estado]?.badge || 'badge-gold'}`}>{ESTADO_STYLES[detalle.estado]?.label || detalle.estado}</span>
          </div>
          {detalle.notas && <div className="detalle-row"><span className="detalle-key">Notas</span><span className="detalle-val" style={{ maxWidth: 200, textAlign:'right' }}>{detalle.notas}</span></div>}
          <div className="form-actions" style={{ marginTop: 8 }}>
            <button className="btn-cancel" onClick={() => setDetalle(null)}>Cerrar</button>
            <button className="btn-save" onClick={() => { setDetalle(null); openEdit(detalle) }}>Editar</button>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  )
}
