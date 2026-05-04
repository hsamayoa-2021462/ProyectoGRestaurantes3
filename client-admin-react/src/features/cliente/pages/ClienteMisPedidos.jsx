// src/features/cliente/pages/ClienteMisPedidos.jsx
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import api from '../../../shared/api/api'

/* ─── ICONS ─── */
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/>
  </svg>
)
const IconBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
  </svg>
)

const NAV_LINKS = [
  { key: 'inicio',      label: 'Inicio' },
  { key: 'menu',        label: 'Menú' },
  { key: 'reservar',    label: 'Reservar Mesa' },
  { key: 'pedidos',     label: 'Mis Pedidos' },
  { key: 'experiencia', label: 'Experiencia' },
]

const STATUS_COLORS = {
  'PENDIENTE':   { bg: 'rgba(201,168,76,.12)', border: 'rgba(201,168,76,.35)', color: '#e8c96a',  label: 'Pendiente' },
  'EN_COCINA':   { bg: 'rgba(201,168,76,.12)', border: 'rgba(201,168,76,.35)', color: '#e8c96a',  label: 'En cocina' },
  'EN_CAMINO':   { bg: 'rgba(100,160,220,.1)', border: 'rgba(100,160,220,.3)', color: '#90c0e8',  label: 'En camino' },
  'ENTREGADO':   { bg: 'rgba(76,175,130,.1)',  border: 'rgba(76,175,130,.3)',  color: '#7dd9ae',  label: 'Entregado' },
  'PAGADO':      { bg: 'rgba(130,100,200,.1)', border: 'rgba(130,100,200,.3)', color: '#c0a0e8',  label: 'Pagado' },
  'CANCELADO':   { bg: 'rgba(224,90,90,.1)',   border: 'rgba(224,90,90,.3)',   color: '#e08080',  label: 'Cancelado' },
  'En cocina':   { bg: 'rgba(201,168,76,.12)', border: 'rgba(201,168,76,.35)', color: '#e8c96a',  label: 'En cocina' },
  'Entregado':   { bg: 'rgba(76,175,130,.1)',  border: 'rgba(76,175,130,.3)',  color: '#7dd9ae',  label: 'Entregado' },
  'Pagado':      { bg: 'rgba(130,100,200,.1)', border: 'rgba(130,100,200,.3)', color: '#c0a0e8',  label: 'Pagado' },
  'Cancelado':   { bg: 'rgba(224,90,90,.1)',   border: 'rgba(224,90,90,.3)',   color: '#e08080',  label: 'Cancelado' },
}

const TRACKING_STEPS = [
  { key: 'PENDIENTE',  label: 'Recibido',   emoji: '📋' },
  { key: 'EN_COCINA',  label: 'Preparando', emoji: '🍳' },
  { key: 'EN_CAMINO',  label: 'En camino',  emoji: '🛵' },
  { key: 'ENTREGADO',  label: 'Entregado',  emoji: '✅' },
]
const TRACKING_ORDER = ['PENDIENTE', 'EN_COCINA', 'EN_CAMINO', 'ENTREGADO']

const FILTROS = ['Todos', 'Activos', 'Entregado', 'Pagado', 'Cancelado']

// Pedidos mock como fallback
const PEDIDOS_MOCK = [
  {
    _id: 'm1', numero: '#4530',
    fecha: '2026-05-02T20:15:00Z',
    mesa: { numero: 'Mesa 7' }, tipo: 'Presencial',
    items: [
      { plato: { nombre: 'Risotto de Mariscos' }, cantidad: 1, precio: 245 },
      { plato: { nombre: 'Agua Mineral' }, cantidad: 2, precio: 30 },
    ],
    estado: 'EN_COCINA', total: 305,
  },
  {
    _id: 'm2', numero: '#4521',
    fecha: '2026-05-02T14:32:00Z',
    mesa: { numero: 'Mesa 4' }, tipo: 'Presencial',
    items: [
      { plato: { nombre: 'Filete a la Parrilla' }, cantidad: 1, precio: 280 },
      { plato: { nombre: 'Vino Tinto' }, cantidad: 2, precio: 100 },
    ],
    estado: 'PAGADO', total: 480,
  },
  {
    _id: 'm3', numero: '#4498',
    fecha: '2026-04-28T19:45:00Z',
    mesa: { numero: 'Delivery' }, tipo: 'Delivery',
    items: [
      { plato: { nombre: 'Pizza Margarita' }, cantidad: 2, precio: 145 },
      { plato: { nombre: 'Tiramisú' }, cantidad: 1, precio: 90 },
    ],
    estado: 'ENTREGADO', total: 380,
  },
  {
    _id: 'm4', numero: '#4475',
    fecha: '2026-04-20T13:10:00Z',
    mesa: { numero: 'Mesa 2' }, tipo: 'Presencial',
    items: [
      { plato: { nombre: 'Pasta Carbonara' }, cantidad: 1, precio: 180 },
      { plato: { nombre: 'Ensalada César' }, cantidad: 1, precio: 95 },
    ],
    estado: 'PAGADO', total: 355,
  },
]

function formatFecha(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}
function formatHora(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

export default function ClienteMisPedidos() {
  const [activeNav, setActiveNav] = useState('pedidos')
  const { user, logout } = useAuthStore()

  const [pedidos, setPedidos]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [expandido, setExpandido]   = useState(null)
  const [filtro, setFiltro]         = useState('Todos')
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/pedidos/mis-pedidos')
      setPedidos(res.data.data || [])
    } catch {
      setPedidos(PEDIDOS_MOCK)
    }
    setLastUpdate(new Date())
    setLoading(false)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const isActivo = (p) => ['PENDIENTE', 'EN_COCINA', 'EN_CAMINO', 'En cocina', 'En camino'].includes(p.estado)

  const pedidoActivo = pedidos.find(isActivo)

  const getTrackingIndex = (estado) => {
    const map = { 'En cocina': 'EN_COCINA', 'En camino': 'EN_CAMINO', 'Entregado': 'ENTREGADO', 'Pagado': 'PAGADO' }
    const normalizado = map[estado] || estado
    const idx = TRACKING_ORDER.indexOf(normalizado)
    return idx === -1 ? 1 : idx
  }

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtro === 'Todos') return true
    if (filtro === 'Activos') return isActivo(p)
    const estadoNorm = (STATUS_COLORS[p.estado]?.label || p.estado).toLowerCase()
    return estadoNorm === filtro.toLowerCase()
  })

  const totalCompletados = pedidos.filter(p => ['PAGADO', 'ENTREGADO', 'Pagado', 'Entregado'].includes(p.estado)).length
  const totalGastado = pedidos
    .filter(p => ['PAGADO', 'ENTREGADO', 'Pagado', 'Entregado'].includes(p.estado))
    .reduce((acc, p) => acc + (Number(p.total) || 0), 0)

  const getEstadoStyle = (estado) => STATUS_COLORS[estado] || { bg: 'rgba(201,168,76,.12)', border: 'rgba(201,168,76,.3)', color: '#e8c96a', label: estado }
  const getEstadoLabel = (estado) => STATUS_COLORS[estado]?.label || estado

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --black:#07080a; --deep:#0d0f12; --surface:#12151a;
          --glass-bg:rgba(255,255,255,0.045); --glass-bd:rgba(255,255,255,0.09);
          --gold:#c9a84c; --gold-lt:#e8c96a; --gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8; --text-mid:#9a9385; --text-muted:#5a554d;
          --success:#4caf82; --error:#e05a5a;
          --radius-card:20px;
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
        }
        body { font-family:'Outfit',sans-serif; background:var(--black); color:var(--text); min-height:100vh; overflow-x:hidden; }

        /* NAVBAR */
        .cliente-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          height:70px;
          background:rgba(7,8,10,.85);
          backdrop-filter:blur(24px) saturate(180%);
          border-bottom:1px solid var(--glass-bd);
          display:flex; align-items:center; justify-content:space-between;
          padding:0 48px;
        }
        .nav-brand { display:flex; align-items:center; gap:12px; }
        .nav-brand-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05)); border:1px solid rgba(201,168,76,.25); display:flex; align-items:center; justify-content:center; color:var(--gold); }
        .nav-brand-name { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500; letter-spacing:2px; text-transform:uppercase; color:var(--text); }
        .nav-links { display:flex; align-items:center; gap:2px; }
        .nav-link { padding:7px 14px; border-radius:8px; font-size:13px; color:var(--text-mid); cursor:pointer; transition:all .2s; background:none; border:none; font-family:'Outfit',sans-serif; }
        .nav-link:hover { color:var(--text); background:var(--glass-bg); }
        .nav-link.active { color:var(--gold-lt); background:var(--gold-dim); }
        .nav-right { display:flex; align-items:center; gap:10px; }
        .nav-avatar { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.08)); border:1px solid rgba(201,168,76,.2); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:500; color:var(--gold-lt); cursor:pointer; }
        .nav-logout-btn { display:flex; align-items:center; gap:6px; padding:7px 12px; border-radius:8px; background:none; border:1px solid rgba(255,255,255,.08); color:var(--text-muted); cursor:pointer; font-family:'Outfit',sans-serif; font-size:12.5px; transition:all .2s; }
        .nav-logout-btn:hover { border-color:rgba(224,90,90,.3); color:#e05a5a; background:rgba(224,90,90,.06); }

        /* PAGE */
        .cliente-page { padding-top:70px; min-height:100vh; }

        /* HERO */
        .page-hero {
          padding:52px 48px 40px;
          background:linear-gradient(180deg,var(--deep) 0%,var(--black) 100%);
          border-bottom:1px solid var(--glass-bd);
          position:relative; overflow:hidden;
        }
        .page-hero::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--gold),transparent); opacity:.3; }
        .page-hero-bg { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 100% at 80% 50%,rgba(201,168,76,.04) 0%,transparent 60%); }
        .page-hero-inner { position:relative; z-index:1; }
        .page-eyebrow { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); opacity:.8; margin-bottom:10px; display:flex; align-items:center; gap:12px; }
        .page-eyebrow::before { content:''; width:30px; height:1px; background:linear-gradient(90deg,transparent,var(--gold)); }
        .page-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,4vw,48px); font-weight:400; color:var(--text); letter-spacing:-.5px; line-height:1.1; }
        .page-title span { color:var(--gold-lt); font-style:italic; }
        .page-subtitle { font-size:14px; color:var(--text-mid); margin-top:8px; font-weight:300; }

        /* STATS STRIP */
        .stats-strip { display:flex; gap:16px; margin-top:28px; flex-wrap:wrap; align-items:center; justify-content:space-between; }
        .stats-pills { display:flex; gap:12px; flex-wrap:wrap; }
        .stat-pill { background:var(--glass-bg); border:1px solid var(--glass-bd); border-radius:12px; padding:12px 20px; display:flex; align-items:center; gap:10px; }
        .stat-pill-icon { font-size:18px; }
        .stat-pill-value { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:500; color:var(--gold-lt); line-height:1; }
        .stat-pill-label { font-size:11px; color:var(--text-muted); margin-top:1px; }
        .pulse-dot { width:8px; height:8px; border-radius:50%; background:var(--gold); box-shadow:0 0 0 0 rgba(201,168,76,.4); animation:pulse-ring 1.8s ease-out infinite; flex-shrink:0; }
        @keyframes pulse-ring { 0% { box-shadow:0 0 0 0 rgba(201,168,76,.4); } 70% { box-shadow:0 0 0 8px rgba(201,168,76,0); } 100% { box-shadow:0 0 0 0 rgba(201,168,76,0); } }

        /* REFRESH BTN */
        .refresh-btn { display:flex; align-items:center; gap:7px; padding:8px 14px; border-radius:10px; background:var(--glass-bg); border:1px solid var(--glass-bd); color:var(--text-muted); cursor:pointer; font-family:'Outfit',sans-serif; font-size:12px; transition:all .2s; }
        .refresh-btn:hover { color:var(--gold-lt); border-color:rgba(201,168,76,.3); }
        .refresh-btn.spinning svg { animation:spin .7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .last-update { font-size:11px; color:var(--text-muted); }

        /* CONTENT */
        .pedidos-content { padding:36px 48px; max-width:900px; margin:0 auto; }

        /* PEDIDO ACTIVO */
        .activo-card { background:var(--glass-bg); border:1px solid rgba(201,168,76,.2); border-radius:var(--radius-card); padding:26px 28px; margin-bottom:32px; position:relative; overflow:hidden; }
        .activo-card::before { content:''; position:absolute; top:0; left:0; width:100%; height:2px; background:linear-gradient(90deg,var(--gold),rgba(201,168,76,.2),transparent); }
        .activo-label { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .activo-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(201,168,76,.3),transparent); }
        .activo-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; gap:12px; }
        .activo-id { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:500; color:var(--gold-lt); }
        .activo-meta { font-size:12.5px; color:var(--text-mid); margin-top:2px; }
        .status-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; border:1px solid; white-space:nowrap; }

        /* TRACKING */
        .tracking-wrap { position:relative; }
        .tracking-line-bg { position:absolute; top:16px; left:16px; right:16px; height:2px; background:var(--glass-bd); border-radius:2px; z-index:0; }
        .tracking-line-fill { position:absolute; top:16px; left:16px; height:2px; background:linear-gradient(90deg,var(--gold),var(--gold-lt)); border-radius:2px; z-index:1; transition:width .6s var(--ease-out-expo); }
        .tracking-steps { display:flex; justify-content:space-between; position:relative; z-index:2; }
        .tracking-step { display:flex; flex-direction:column; align-items:center; gap:8px; flex:1; }
        .tracking-dot-wrap { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid var(--glass-bd); background:var(--deep); transition:all .4s var(--ease-out-expo); font-size:13px; }
        .tracking-dot-wrap.done { border-color:var(--gold); background:var(--gold-dim); box-shadow:0 0 12px rgba(201,168,76,.2); }
        .tracking-dot-wrap.current { border-color:var(--gold-lt); background:rgba(201,168,76,.15); box-shadow:0 0 16px rgba(201,168,76,.3); }
        .tracking-step-label { font-size:11px; color:var(--text-muted); text-align:center; transition:color .3s; white-space:nowrap; }
        .tracking-step-label.done { color:var(--text-mid); }
        .tracking-step-label.current { color:var(--gold-lt); font-weight:500; }
        .activo-items { margin-top:20px; padding-top:16px; border-top:1px solid var(--glass-bd); display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
        .activo-item-tag { background:var(--glass-bg); border:1px solid var(--glass-bd); border-radius:8px; padding:4px 10px; font-size:12px; color:var(--text-mid); }
        .activo-total { font-family:'Cormorant Garamond',serif; font-size:18px; color:var(--gold-lt); font-weight:500; margin-left:auto; }

        /* HISTORIAL */
        .historial-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:12px; }
        .historial-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:500; color:var(--text); }
        .filtros-wrap { display:flex; gap:6px; flex-wrap:wrap; }
        .filtro-btn { padding:6px 14px; border-radius:7px; background:var(--glass-bg); border:1px solid var(--glass-bd); color:var(--text-muted); cursor:pointer; font-size:12px; font-family:'Outfit',sans-serif; transition:all .2s; }
        .filtro-btn:hover { color:var(--text); }
        .filtro-btn.active { background:var(--gold-dim); border-color:rgba(201,168,76,.3); color:var(--gold-lt); }

        /* PEDIDO CARD */
        .pedido-card { background:var(--glass-bg); border:1px solid var(--glass-bd); border-radius:var(--radius-card); margin-bottom:10px; overflow:hidden; transition:border-color .2s; cursor:pointer; }
        .pedido-card:hover { border-color:rgba(201,168,76,.15); }
        .pedido-card-header { display:flex; align-items:center; gap:14px; padding:18px 22px; flex-wrap:wrap; }
        .pedido-card-id { font-family:'Cormorant Garamond',serif; font-size:18px; color:var(--gold-lt); font-weight:500; min-width:60px; }
        .pedido-card-fecha { font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:5px; }
        .pedido-card-mesa { font-size:12.5px; color:var(--text-mid); }
        .pedido-card-total { font-family:'Cormorant Garamond',serif; font-size:20px; color:var(--gold-lt); font-weight:500; margin-left:auto; }
        .pedido-card-chevron { color:var(--text-muted); transition:transform .25s var(--ease-out-expo); flex-shrink:0; }
        .pedido-card-chevron.open { transform:rotate(180deg); }
        .pedido-card-body { border-top:1px solid var(--glass-bd); padding:16px 22px 18px; animation:expand-in .2s ease-out; }
        @keyframes expand-in { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .pedido-items-title { font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-muted); margin-bottom:10px; }
        .pedido-item-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.04); }
        .pedido-item-row:last-child { border-bottom:none; }
        .pedido-item-name { font-size:13px; color:var(--text); }
        .pedido-item-qty { font-size:11px; color:var(--text-muted); background:var(--glass-bg); border-radius:4px; padding:2px 7px; margin-left:8px; }
        .pedido-item-price { font-family:'Cormorant Garamond',serif; font-size:15px; color:var(--gold-lt); }
        .pedido-total-row { display:flex; align-items:center; justify-content:space-between; padding-top:12px; margin-top:6px; border-top:1px solid var(--glass-bd); }
        .pedido-total-label { font-size:12px; color:var(--text-muted); letter-spacing:.5px; }
        .pedido-total-val { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:500; color:var(--gold-lt); }

        /* SKELETON */
        .skeleton { background:rgba(255,255,255,.06); border-radius:8px; animation:shimmer 1.4s ease-in-out infinite; }
        @keyframes shimmer { 0%,100% { opacity:.6; } 50% { opacity:1; } }
        .skeleton-card { background:var(--glass-bg); border:1px solid var(--glass-bd); border-radius:var(--radius-card); padding:20px 22px; margin-bottom:10px; }
        .skel-line { height:14px; margin-bottom:8px; }
        .skel-short { width:30%; }
        .skel-mid   { width:55%; }
        .skel-full  { width:90%; }

        /* EMPTY */
        .empty-state { text-align:center; padding:64px 24px; color:var(--text-muted); }
        .empty-icon { font-size:44px; margin-bottom:14px; }
        .empty-title { font-family:'Cormorant Garamond',serif; font-size:24px; color:var(--text-mid); margin-bottom:8px; }
        .empty-desc { font-size:13.5px; font-weight:300; margin-bottom:24px; }
        .btn-primary { position:relative; padding:12px 28px; background:linear-gradient(135deg,rgba(201,168,76,.18) 0%,rgba(201,168,76,.06) 100%); border:1px solid rgba(201,168,76,.35); border-radius:11px; font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; letter-spacing:1px; text-transform:uppercase; color:var(--gold-lt); cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:border-color .25s,transform .15s; }
        .btn-primary:hover { border-color:rgba(201,168,76,.6); transform:translateY(-1px); }

        /* FOOTER */
        .cliente-footer { border-top:1px solid var(--glass-bd); padding:28px 48px; display:flex; align-items:center; justify-content:space-between; color:var(--text-muted); font-size:12px; margin-top:40px; }
        .footer-brand { font-family:'Cormorant Garamond',serif; font-size:17px; color:var(--text-mid); letter-spacing:1.5px; }
        .footer-gold { color:var(--gold); }

        @media (max-width:900px) {
          .nav-links { display:none; }
          .cliente-nav { padding:0 24px; }
          .page-hero { padding:40px 24px 30px; }
          .pedidos-content { padding:24px; }
          .cliente-footer { padding:24px; flex-direction:column; gap:8px; }
        }
      `}</style>

      <div className="cliente-page">

        {/* NAVBAR */}
        <nav className="cliente-nav">
          <div className="nav-brand">
            <div className="nav-brand-icon"><IconMenu /></div>
            <span className="nav-brand-name">Restaurante</span>
          </div>
          <div className="nav-links">
            {NAV_LINKS.map(link => (
              <button key={link.key} className={`nav-link ${activeNav === link.key ? 'active' : ''}`} onClick={() => setActiveNav(link.key)}>
                {link.label}
              </button>
            ))}
          </div>
          <div className="nav-right">
            <div className="nav-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <button className="nav-logout-btn" onClick={logout}><IconLogout /> Salir</button>
          </div>
        </nav>

        {/* HERO */}
        <div className="page-hero">
          <div className="page-hero-bg" />
          <div className="page-hero-inner">
            <div className="page-eyebrow">Mis Pedidos</div>
            <h1 className="page-title">Tu historial de <span>sabores</span></h1>
            <p className="page-subtitle">Bienvenido{user?.name ? `, ${user.name}` : ''}. Aquí puedes seguir tus pedidos y ver tu historial.</p>

            <div className="stats-strip">
              <div className="stats-pills">
                <div className="stat-pill">
                  <div className="stat-pill-icon">🧾</div>
                  <div>
                    <div className="stat-pill-value">{pedidos.length}</div>
                    <div className="stat-pill-label">Pedidos totales</div>
                  </div>
                </div>
                <div className="stat-pill">
                  <div className="stat-pill-icon">✅</div>
                  <div>
                    <div className="stat-pill-value">{totalCompletados}</div>
                    <div className="stat-pill-label">Completados</div>
                  </div>
                </div>
                {totalGastado > 0 && (
                  <div className="stat-pill">
                    <div className="stat-pill-icon">💰</div>
                    <div>
                      <div className="stat-pill-value">Q {totalGastado.toLocaleString()}</div>
                      <div className="stat-pill-label">Total gastado</div>
                    </div>
                  </div>
                )}
                {pedidoActivo && (
                  <div className="stat-pill" style={{ borderColor: 'rgba(201,168,76,.3)' }}>
                    <div className="pulse-dot" />
                    <div>
                      <div className="stat-pill-value" style={{ color: 'var(--gold-lt)', fontSize: '14px', marginTop: '2px' }}>1 pedido activo</div>
                      <div className="stat-pill-label">En este momento</div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <button className={`refresh-btn ${loading ? 'spinning' : ''}`} onClick={load} disabled={loading}>
                  <IconRefresh /> {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
                {lastUpdate && <span className="last-update">Última actualización: {lastUpdate.toLocaleTimeString('es-GT')}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pedidos-content">

          {/* PEDIDO ACTIVO */}
          {pedidoActivo && (() => {
            const currentIdx = getTrackingIndex(pedidoActivo.estado)
            const fillPct = (currentIdx / (TRACKING_ORDER.length - 1)) * 100
            const sc = getEstadoStyle(pedidoActivo.estado)
            return (
              <div className="activo-card">
                <div className="activo-label"><div className="pulse-dot" />Pedido en curso</div>
                <div className="activo-top">
                  <div>
                    <div className="activo-id">{pedidoActivo.numero || `#${pedidoActivo._id?.slice(-5).toUpperCase()}`}</div>
                    <div className="activo-meta">
                      {pedidoActivo.mesa?.numero || 'Mesa'} · {formatHora(pedidoActivo.fecha)} · {pedidoActivo.tipo || 'Presencial'}
                    </div>
                  </div>
                  <span className="status-badge" style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                    {getEstadoLabel(pedidoActivo.estado)}
                  </span>
                </div>
                <div className="tracking-wrap">
                  <div className="tracking-line-bg" />
                  <div className="tracking-line-fill" style={{ width: `calc(${fillPct}% * ((100% - 32px) / 100%) + 16px)` }} />
                  <div className="tracking-steps">
                    {TRACKING_STEPS.map((step, i) => {
                      const isDone = i < currentIdx
                      const isCurrent = i === currentIdx
                      return (
                        <div className="tracking-step" key={step.key}>
                          <div className={`tracking-dot-wrap ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                            {isDone ? <IconCheck /> : step.emoji}
                          </div>
                          <span className={`tracking-step-label ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>{step.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="activo-items">
                  {(pedidoActivo.items || []).map((item, i) => (
                    <span className="activo-item-tag" key={i}>
                      {item.cantidad || item.qty}x {item.plato?.nombre || item.nombre}
                    </span>
                  ))}
                  <span className="activo-total">Q {Number(pedidoActivo.total).toFixed(2)}</span>
                </div>
              </div>
            )
          })()}

          {/* HISTORIAL */}
          <div className="historial-header">
            <div className="historial-title">Historial</div>
            <div className="filtros-wrap">
              {FILTROS.map(f => (
                <button key={f} className={`filtro-btn ${filtro === f ? 'active' : ''}`} onClick={() => setFiltro(f)}>{f}</button>
              ))}
            </div>
          </div>

          {loading ? (
            [1, 2, 3].map(n => (
              <div className="skeleton-card" key={n}>
                <div className="skeleton skel-line skel-short" />
                <div className="skeleton skel-line skel-full" />
                <div className="skeleton skel-line skel-mid" />
              </div>
            ))
          ) : pedidosFiltrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <div className="empty-title">Sin pedidos aquí</div>
              <div className="empty-desc">No tienes pedidos con ese filtro todavía.</div>
              <button className="btn-primary" onClick={() => setActiveNav('menu')}>
                Explorar el menú <IconArrow />
              </button>
            </div>
          ) : pedidosFiltrados.map((p, i) => {
            const sc = getEstadoStyle(p.estado)
            const isOpen = expandido === i
            return (
              <div className="pedido-card" key={p._id || i}>
                <div className="pedido-card-header" onClick={() => setExpandido(isOpen ? null : i)}>
                  <div className="pedido-card-id">{p.numero || `#${p._id?.slice(-5).toUpperCase()}`}</div>
                  <div className="pedido-card-fecha"><IconClock /> {formatFecha(p.fecha)} · {formatHora(p.fecha)}</div>
                  <div className="pedido-card-mesa">{p.mesa?.numero || '—'}</div>
                  <span className="status-badge" style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                    {getEstadoLabel(p.estado)}
                  </span>
                  <div className="pedido-card-total">Q {Number(p.total || 0).toFixed(2)}</div>
                  <div className={`pedido-card-chevron ${isOpen ? 'open' : ''}`}><IconChevronDown /></div>
                </div>
                {isOpen && (
                  <div className="pedido-card-body">
                    <div className="pedido-items-title">Artículos del pedido</div>
                    {(p.items || []).map((item, j) => (
                      <div className="pedido-item-row" key={j}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="pedido-item-name">{item.plato?.nombre || item.nombre || '—'}</span>
                          <span className="pedido-item-qty">x{item.cantidad || item.qty || 1}</span>
                        </div>
                        <span className="pedido-item-price">Q {Number(item.precio || item.subtotal || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pedido-total-row">
                      <span className="pedido-total-label">Total del pedido</span>
                      <span className="pedido-total-val">Q {Number(p.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <footer className="cliente-footer">
          <div className="footer-brand">Restaurante <span className="footer-gold">·</span> Guatemala</div>
          <div>© {new Date().getFullYear()} · Todos los derechos reservados</div>
        </footer>
      </div>
    </>
  )
}
