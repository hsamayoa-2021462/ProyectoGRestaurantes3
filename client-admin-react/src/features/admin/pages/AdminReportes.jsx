// src/features/admin/pages/AdminReportes.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'

const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconRest = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const IconDash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
const IconTrend = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: <IconDash />, path: '/admin' },
  { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/admin/menu' },
  { key: 'pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />, path: '/admin/reservaciones' },
  { key: 'restaurantes', label: 'Restaurantes', icon: <IconRest />, path: '/admin/restaurantes' },
  { key: 'clientes', label: 'Clientes', icon: <IconUsers />, path: '/admin/clientes' },
  { key: 'reportes', label: 'Reportes', icon: <IconReport />, path: '/admin/reportes' },
  { key: 'resenas', label: 'Reseñas', icon: <IconStar />, path: '/admin/resenas' },
]

const TABS = ['General', 'Pedidos', 'Reservaciones', 'Restaurantes']

function BarChart({ data, valueKey, labelKey, color = '#c9a84c', height = 200, prefix = '' }) {
  if (!data.length) return <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>Sin datos suficientes para graficar</div>
  const max = Math.max(...data.map(d => d[valueKey] || 0)) || 1
  const barW = Math.max(28, Math.min(56, Math.floor(600 / data.length) - 10))
  const gap = Math.max(8, Math.floor(barW * 0.3))
  const padL = 48, padR = 16, padT = 24, padB = 36
  const totalW = Math.max(data.length * (barW + gap) + padL + padR, 400)
  const svgH = height + padT + padB
  const gridLines = 4
  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '8px 0' }}>
      <svg width={totalW} height={svgH} style={{ display: 'block' }}>
        {/* Grid lines */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const yLine = padT + (height / gridLines) * i
          const val = Math.round(max - (max / gridLines) * i)
          return (
            <g key={i}>
              <line x1={padL} y1={yLine} x2={totalW - padR} y2={yLine}
                stroke="rgba(255,255,255,.06)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padL - 6} y={yLine + 4} textAnchor="end"
                fill="rgba(240,234,216,.35)" fontSize="10" fontFamily="'Outfit',sans-serif">
                {prefix}{val > 999 ? `${(val / 1000).toFixed(1)}k` : val}
              </text>
            </g>
          )
        })}
        {/* Bars */}
        {data.map((d, i) => {
          const val = d[valueKey] || 0
          const barH = Math.max((val / max) * height, val > 0 ? 6 : 0)
          const x = padL + i * (barW + gap)
          const y = padT + height - barH
          return (
            <g key={i}>
              {/* Fondo barra */}
              <rect x={x} y={padT} width={barW} height={height}
                fill="transparent" rx={6} />
              {/* Barra valor */}
              <rect x={x} y={y} width={barW} height={barH}
                fill={color} opacity={0.85} rx={6} />
              {/* Etiqueta fecha */}
              <text x={x + barW / 2} y={svgH - 6} textAnchor="middle"
                fill="rgba(240,234,216,.5)" fontSize="10" fontFamily="'Outfit',sans-serif">
                {String(d[labelKey] || '').substring(0, 5)}
              </text>
              {/* Valor encima de la barra */}
              {val > 0 && (
                <text x={x + barW / 2} y={y - 6} textAnchor="middle"
                  fill={color} fontSize="11" fontWeight="600" fontFamily="'Outfit',sans-serif">
                  {prefix}{val > 999 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              )}
            </g>
          )
        })}
        {/* Línea base */}
        <line x1={padL} y1={padT + height} x2={totalW - padR} y2={padT + height}
          stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      </svg>
    </div>
  )
}

function DonutChart({ slices, size = 120 }) {
  const r = 40, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1
  let offset = 0
  return (
    <svg width={size} height={size}>
      {slices.map((sl, i) => {
        const pct = sl.value / total, dash = pct * circ
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={sl.color} strokeWidth="18"
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }} />
        offset += dash; return el
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fill="var(--text)" fontSize="14" fontFamily="'Cormorant Garamond',serif" fontWeight="500">{total}</text>
    </svg>
  )
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function AdminReportes() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'reportes'
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])
  const handleNavClick = (path, key) => { setActiveNav(key); navigate(path) }

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

  const [tab, setTab] = useState('General')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [reservaciones, setReservaciones] = useState([])
  const [restaurantes, setRestaurantes] = useState([])
  const [clientes, setClientes] = useState([])
  const [mesas, setMesas] = useState([])
  const loadedRef = useRef(false)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = async () => {
    setLoading(true)
    try {
      const [pedRes, resRes, restRes, cliRes, mesRes] = await Promise.all([
        api.get('/pedidos/pedidos'),
        api.get('/reservaciones/reservaciones'),
        api.get('/restaurante/restaurantes'),
        authApi.get('/users'),
        api.get('/restaurante/mesas'),
      ])
      setPedidos(pedRes.data?.data || [])
      setReservaciones(resRes.data?.data || [])
      console.log('Reservaciones:', resRes.data?.data?.slice(0,2))
      setRestaurantes(restRes.data?.data || [])
      setClientes(cliRes.data?.users || [])
      setMesas(mesRes.data?.data || [])
    } catch { showToast('Error al cargar los reportes', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadedRef.current = false
      load()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => { loadedRef.current = false; load() }

  // ── Cálculos ──
  const pad = n => String(n).padStart(2, '0')
  const now = new Date()
  const hoy = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const mes = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`

  const pedidosHoy = pedidos.filter(p => (p.createdAt || '').substring(0, 10) === hoy)
  const pedidosMes = pedidos.filter(p => (p.createdAt || '').substring(0, 7) === mes)
  const ingresosTotal = pedidos.filter(p => p.estado === 'ENTREGADO').reduce((s, p) => s + (p.total || 0), 0)
  const ingresosHoy = pedidosHoy.filter(p => p.estado === 'ENTREGADO').reduce((s, p) => s + (p.total || 0), 0)
  const ingresosMes = pedidosMes.filter(p => p.estado === 'ENTREGADO').reduce((s, p) => s + (p.total || 0), 0)
  const pedidosCancelados = pedidos.filter(p => p.estado === 'CANCELADO').length
  const pedidosEntregados = pedidos.filter(p => p.estado === 'ENTREGADO').length
  const ticketPromedio = pedidosEntregados > 0 ? ingresosTotal / pedidosEntregados : 0

  const estadosPedido = [
    { label: 'Entregado', value: pedidos.filter(p => p.estado === 'ENTREGADO').length, color: '#4caf82' },
    { label: 'Cancelado', value: pedidos.filter(p => p.estado === 'CANCELADO').length, color: '#e05a5a' },
    { label: 'Preparando', value: pedidos.filter(p => p.estado === 'PREPARANDO').length, color: '#e8a060' },
    { label: 'En camino', value: pedidos.filter(p => p.estado === 'EN_CAMINO').length, color: '#90c0e8' },
    { label: 'Pendiente', value: pedidos.filter(p => p.estado === 'PENDIENTE').length, color: '#e8c96a' },
  ].filter(e => e.value > 0)

  const pedidosPorDia = (() => {
    const dias = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      dias[key] = { fecha: key.substring(5), total: 0, ingresos: 0 }
    }
    pedidos.forEach(p => {
      if (!p.createdAt) return
      const d = new Date(p.createdAt)
      const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      if (dias[key]) { dias[key].total++; if (p.estado === 'ENTREGADO') dias[key].ingresos += (p.total || 0) }
    })
    return Object.values(dias)
  })()

  const reservPorDia = (() => {
    const pad = n => String(n).padStart(2, '0')
    const dias = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      dias[key] = { fecha: key.substring(5), total: 0 }
    }
    reservaciones.forEach(r => {
      if (!r.createdAt && !r.fecha) return
      const d = new Date(r.createdAt || r.fecha)
      const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      if (dias[key]) dias[key].total++
    })
    return Object.values(dias)
  })()

  const domicilio = pedidos.filter(p => p.tipoEntrega === 'DOMICILIO').length
  const recoger = pedidos.filter(p => p.tipoEntrega === 'RECOGER').length
  const resHoy = reservaciones.filter(r => (r.fecha || '').substring(0, 10) === hoy).length
  const resMes = reservaciones.filter(r => (r.fecha || '').substring(0, 7) === mes).length
  const resConfirmadas = reservaciones.filter(r => { const n = typeof r.estado === 'object' ? r.estado?.nombre : r.estado; return n === 'CONFIRMADA' }).length
  const resPendientes = reservaciones.filter(r => { const n = typeof r.estado === 'object' ? r.estado?.nombre : r.estado; return n === 'PENDIENTE' }).length
  const restActivos = restaurantes.filter(r => r.estado !== false).length
  const mesasTotal = mesas.length
  const mesasDisp = mesas.filter(m => m.estado === 'DISPONIBLE').length
  const mesasOcupadas = mesas.filter(m => m.estado === 'OCUPADA').length
  const clientesActivos = clientes.filter(c => c.status).length
  const clientesVerif = clientes.filter(c => c.isEmailVerified).length

  const fmtQ = n => `Q ${Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const pct = (a, b) => b > 0 ? `${Math.round((a / b) * 100)}%` : '0%'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--black:#07080a;--deep:#0d0f12;--glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);--gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);--text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;--success:#4caf82;--error:#e05a5a;--info:#5b9bd5;--radius-card:20px;--radius-inp:11px;--ease-out-expo:cubic-bezier(0.16,1,0.3,1);--sidebar-w:240px;}
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}
        .layout{display:flex;min-height:100vh}
        .sidebar{width:var(--sidebar-w);background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:width .3s var(--ease-out-expo);overflow:hidden}
        .sidebar.col{width:64px}
        .sb-brand{padding:24px 20px 20px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:80px;position:relative}
        .sb-brand::after{content:'';position:absolute;bottom:-1px;left:0;width:80px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .sb-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--gold)}
        .sb-text{overflow:hidden;white-space:nowrap}
        .sb-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text);display:block;line-height:1}
        .sb-role{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);opacity:.7;display:block;margin-top:3px}
        .sb-nav{flex:1;padding:16px 10px;overflow-y:auto;overflow-x:hidden}
        .nav-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);padding:0 10px;margin:16px 0 8px;white-space:nowrap;transition:opacity .2s}
        .sidebar.col .nav-lbl{opacity:0}
        .ni{display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13.5px;transition:all .2s;position:relative;white-space:nowrap;margin-bottom:2px}
        .ni:hover{background:var(--glass-bg);color:var(--text)}
        .ni.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.15)}
        .ni.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;border-radius:2px;background:var(--gold)}
        .ni-icon{flex-shrink:0;display:flex}
        .ni-text{overflow:hidden;transition:opacity .2s,width .3s}
        .sidebar.col .ni-text{opacity:0;width:0}
        .sb-footer{padding:16px 10px;border-top:1px solid var(--glass-bd)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);margin-bottom:8px;overflow:hidden;cursor:pointer;transition:border-color .2s,background .2s}
        .sb-user:hover{border-color:rgba(201,168,76,.35);background:var(--gold-dim)}
        .sb-av{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold-lt);flex-shrink:0;font-family:'Cormorant Garamond',serif;overflow:hidden}
        .sb-av img{width:100%;height:100%;object-fit:cover;border-radius:7px}
        .sb-uinfo{overflow:hidden}
        .sb-uname{font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-urole{font-size:10px;color:var(--gold);letter-spacing:.5px;text-transform:uppercase}
        .sidebar.col .sb-uinfo{display:none}
        .sb-out{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;width:100%;transition:all .2s;white-space:nowrap}
        .sb-out:hover{background:rgba(224,90,90,.08);color:var(--error)}
        .sidebar.col .sb-out span{display:none}
        .sb-toggle{position:absolute;top:50%;right:-12px;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:var(--deep);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s;z-index:101}
        .sb-toggle:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}
        .sb-toggle svg{transition:transform .3s}
        .sidebar.col .sb-toggle svg{transform:rotate(180deg)}
        .main{flex:1;margin-left:var(--sidebar-w);transition:margin-left .3s var(--ease-out-expo);min-height:100vh;display:flex;flex-direction:column}
        .main.col{margin-left:64px}
        .topbar{height:64px;background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:50}
        .topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.5px}
        .topbar-sub{font-size:11px;color:var(--text-muted)}
        .topbar-r{display:flex;align-items:center;gap:10px}
        .topbar-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .topbar-btn:hover{color:var(--gold)}
        .refresh-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s}
        .refresh-btn:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3)}
        .content{padding:32px;flex:1}
        .tabs{display:flex;gap:4px;margin-bottom:28px;background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:12px;padding:4px;width:fit-content}
        .tab-btn{padding:8px 20px;border-radius:9px;border:none;background:none;color:var(--text-muted);font-family:'Outfit',sans-serif;font-size:13px;cursor:pointer;transition:all .2s;white-space:nowrap}
        .tab-btn:hover{color:var(--text)}
        .tab-btn.active{background:var(--gold-dim);border:1px solid rgba(201,168,76,.2);color:var(--gold-lt)}
        .sg4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px}
        .sg3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px}
        .sg2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
        .sc{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:20px;position:relative;overflow:hidden;transition:border-color .25s,transform .2s}
        .sc::before{content:'';position:absolute;top:0;left:0;width:60px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .sc::after{content:'';position:absolute;top:0;left:0;width:1px;height:60px;background:linear-gradient(180deg,var(--gold),transparent)}
        .sc:hover{border-color:rgba(201,168,76,.2);transform:translateY(-2px)}
        .sc-icon{font-size:20px;margin-bottom:8px}
        .sc-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;line-height:1;margin-bottom:3px}
        .sc-lbl{font-size:11px;color:var(--text-muted)}
        .sc-delta{font-size:11px;margin-top:4px;display:flex;align-items:center;gap:4px;color:var(--text-muted)}
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden;margin-bottom:20px}
        .card-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--glass-bd)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;letter-spacing:.3px}
        .card-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .card-body{padding:20px 24px}
        .metric-list{display:flex;flex-direction:column;gap:0}
        .metric-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .metric-row:last-child{border-bottom:none}
        .metric-label{font-size:13px;color:var(--text-muted)}
        .metric-value{font-family:'Cormorant Garamond',serif;font-size:17px;color:var(--gold-lt)}
        .dona-wrap{display:flex;align-items:center;gap:24px;flex-wrap:wrap}
        .dona-legend{display:flex;flex-direction:column;gap:8px;flex:1}
        .legend-item{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-muted)}
        .legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .legend-val{margin-left:auto;font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--text)}
        .prog-row{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
        .prog-row:last-child{margin-bottom:0}
        .prog-top{display:flex;justify-content:space-between;font-size:12px}
        .prog-label{color:var(--text-muted)}
        .prog-val{color:var(--text)}
        .prog-bar{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
        .prog-fill{height:100%;border-radius:3px;transition:width .4s ease}
        .loading-overlay{display:flex;align-items:center;justify-content:center;padding:80px;flex-direction:column;gap:16px;color:var(--text-muted)}
        .spinner{width:32px;height:32px;border:2px solid rgba(201,168,76,.2);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .toast{position:fixed;bottom:28px;right:28px;padding:12px 20px;border-radius:12px;font-size:13px;font-family:'Outfit',sans-serif;z-index:999;animation:slideUp .3s ease both;border:1px solid}
        .toast-success{background:rgba(76,175,130,.15);border-color:rgba(76,175,130,.3);color:var(--success)}
        .toast-error{background:rgba(224,90,90,.15);border-color:rgba(224,90,90,.3);color:var(--error)}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:1200px){.sg4{grid-template-columns:repeat(2,1fr)}.sg3{grid-template-columns:1fr 1fr}}
        @media(max-width:900px){.content{padding:20px}.sg2{grid-template-columns:1fr}.sg3{grid-template-columns:1fr}}
      `}</style>

      <div className="layout">
        <aside className={`sidebar ${sidebarOpen ? '' : 'col'}`}>
          <button className="sb-toggle" onClick={() => setSidebarOpen(p => !p)}><IconChevron /></button>
          <div className="sb-brand">
            <div className="sb-icon"><IconRest /></div>
            <div className="sb-text">
              <span className="sb-name">Gastro</span>
              <span className="sb-role">Admin Panel</span>
            </div>
          </div>
          <nav className="sb-nav">
            <div className="nav-lbl">Navegación</div>
            {NAV_ITEMS.map(item => (
              <div key={item.key} className={`ni ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path, item.key)}>
                <span className="ni-icon">{item.icon}</span>
                <span className="ni-text">{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="sb-footer">
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

        <main className={`main ${sidebarOpen ? '' : 'col'}`}>
          <header className="topbar">
            <div>
              <div className="topbar-title">Reportes en tiempo real</div>
              <div className="topbar-sub">Calculado desde los datos actuales del sistema</div>
            </div>
            <div className="topbar-r">
              <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
                <IconRefresh /> {loading ? 'Cargando...' : 'Actualizar'}
              </button>
              <button className="topbar-btn"><IconBell /></button>
            </div>
          </header>

          <div className="content">
            {loading ? (
              <div className="loading-overlay"><div className="spinner" /><span>Calculando estadísticas...</span></div>
            ) : (
              <>
                <div className="tabs">
                  {TABS.map(t => (
                    <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
                  ))}
                </div>

                {tab === 'General' && (
                  <>
                    <div className="sg4">
                      {[
                        { icon: '💰', val: fmtQ(ingresosTotal), lbl: 'Ingresos Totales', color: 'var(--gold-lt)', delta: `Hoy: ${fmtQ(ingresosHoy)}` },
                        { icon: '🧾', val: pedidos.length, lbl: 'Total Pedidos', color: 'var(--text)', delta: `Este mes: ${pedidosMes.length}` },
                        { icon: '📅', val: reservaciones.length, lbl: 'Total Reservaciones', color: 'var(--text)', delta: `Hoy: ${resHoy}` },
                        { icon: '👥', val: clientes.length, lbl: 'Clientes Registrados', color: 'var(--text)', delta: `Activos: ${clientesActivos}` },
                      ].map((s, i) => (
                        <div key={i} className="sc">
                          <div className="sc-icon">{s.icon}</div>
                          <div className="sc-val" style={{ color: s.color }}>{s.val}</div>
                          <div className="sc-lbl">{s.lbl}</div>
                          <div className="sc-delta"><IconTrend /> {s.delta}</div>
                        </div>
                      ))}
                    </div>
                    <div className="sg2">
                      <div className="card">
                        <div className="card-header"><div><div className="card-title">Resumen financiero</div><div className="card-sub">Solo pedidos entregados</div></div></div>
                        <div className="card-body">
                          <div className="metric-list">
                            {[
                              { label: 'Ingresos hoy', value: fmtQ(ingresosHoy) },
                              { label: 'Ingresos este mes', value: fmtQ(ingresosMes) },
                              { label: 'Ingresos totales', value: fmtQ(ingresosTotal) },
                              { label: 'Ticket promedio', value: fmtQ(ticketPromedio) },
                              { label: 'Pedidos entregados', value: pedidosEntregados },
                              { label: 'Pedidos cancelados', value: pedidosCancelados },
                            ].map((m, i) => <div key={i} className="metric-row"><span className="metric-label">{m.label}</span><span className="metric-value">{m.value}</span></div>)}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header"><div><div className="card-title">Resumen operacional</div><div className="card-sub">Estado actual del negocio</div></div></div>
                        <div className="card-body">
                          <div className="metric-list">
                            {[
                              { label: 'Restaurantes activos', value: `${restActivos} / ${restaurantes.length}` },
                              { label: 'Mesas disponibles', value: `${mesasDisp} / ${mesasTotal}` },
                              { label: 'Mesas ocupadas', value: mesasOcupadas },
                              { label: 'Reservas confirmadas', value: resConfirmadas },
                              { label: 'Reservas pendientes', value: resPendientes },
                              { label: 'Clientes verificados', value: `${clientesVerif} / ${clientes.length}` },
                            ].map((m, i) => <div key={i} className="metric-row"><span className="metric-label">{m.label}</span><span className="metric-value">{m.value}</span></div>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {tab === 'Pedidos' && (
                  <>
                    <div className="sg4">
                      {[
                        { icon: '🧾', val: pedidos.length, lbl: 'Total Pedidos', color: 'var(--text)' },
                        { icon: '✅', val: pedidosEntregados, lbl: 'Entregados', color: 'var(--success)' },
                        { icon: '❌', val: pedidosCancelados, lbl: 'Cancelados', color: 'var(--error)' },
                        { icon: '💰', val: fmtQ(ticketPromedio), lbl: 'Ticket Promedio', color: 'var(--gold-lt)' },
                      ].map((s, i) => <div key={i} className="sc"><div className="sc-icon">{s.icon}</div><div className="sc-val" style={{ color: s.color }}>{s.val}</div><div className="sc-lbl">{s.lbl}</div></div>)}
                    </div>
                    <div className="card">
                      <div className="card-header"><div><div className="card-title">Pedidos por día</div><div className="card-sub">Últimos 14 días</div></div></div>
                      <div className="card-body"><BarChart data={pedidosPorDia} valueKey="total" labelKey="fecha" color="#c9a84c" /></div>
                    </div>
                    <div className="sg2">
                      <div className="card">
                        <div className="card-header"><div><div className="card-title">Estado de pedidos</div><div className="card-sub">{pedidos.length} pedidos totales</div></div></div>
                        <div className="card-body">
                          <div className="dona-wrap">
                            <DonutChart slices={estadosPedido} size={130} />
                            <div className="dona-legend">
                              {estadosPedido.map((s, i) => (
                                <div key={i} className="legend-item">
                                  <div className="legend-dot" style={{ background: s.color }} />
                                  <span>{s.label}</span>
                                  <span className="legend-val">{s.value} ({pct(s.value, pedidos.length)})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header"><div><div className="card-title">Tipo de entrega</div></div></div>
                        <div className="card-body">
                          <div className="prog-row">
                            <div className="prog-top"><span className="prog-label">🛵 Domicilio</span><span className="prog-val">{domicilio} ({pct(domicilio, pedidos.length)})</span></div>
                            <div className="prog-bar"><div className="prog-fill" style={{ width: pct(domicilio, pedidos.length), background: '#90c0e8' }} /></div>
                          </div>
                          <div className="prog-row">
                            <div className="prog-top"><span className="prog-label">🏪 Para recoger</span><span className="prog-val">{recoger} ({pct(recoger, pedidos.length)})</span></div>
                            <div className="prog-bar"><div className="prog-fill" style={{ width: pct(recoger, pedidos.length), background: '#7dd9ae' }} /></div>
                          </div>
                          <div style={{ marginTop: 20 }}>
                            <div className="card-title" style={{ fontSize: 14, marginBottom: 12 }}>Ingresos por día</div>
                            <BarChart data={pedidosPorDia} valueKey="ingresos" labelKey="fecha" color="#4caf82" prefix="Q" height={100} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {tab === 'Reservaciones' && (
                  <>
                    <div className="sg3">
                      {[
                        { icon: '📅', val: reservaciones.length, lbl: 'Total Reservaciones', color: 'var(--text)' },
                        { icon: '✅', val: resConfirmadas, lbl: 'Confirmadas', color: 'var(--success)' },
                        { icon: '⏳', val: resPendientes, lbl: 'Pendientes', color: 'var(--gold-lt)' },
                      ].map((s, i) => <div key={i} className="sc"><div className="sc-icon">{s.icon}</div><div className="sc-val" style={{ color: s.color }}>{s.val}</div><div className="sc-lbl">{s.lbl}</div></div>)}
                    </div>
                    <div className="card">
                      <div className="card-header"><div><div className="card-title">Reservaciones por día</div><div className="card-sub">Últimos 14 días</div></div></div>
                      <div className="card-body"><BarChart data={reservPorDia} valueKey="total" labelKey="fecha" color="#5b9bd5" /></div>
                    </div>
                    <div className="card">
                      <div className="card-header"><div><div className="card-title">Distribución por estado</div></div></div>
                      <div className="card-body">
                        {['CONFIRMADA', 'PENDIENTE', 'CANCELADA', 'COMPLETADA', 'NO_SHOW'].map((e, i) => {
                          const colors = ['#4caf82', '#e8c96a', '#e05a5a', '#5b9bd5', '#9a9385']
                          const cnt = reservaciones.filter(r => { const n = typeof r.estado === 'object' ? r.estado?.nombre : r.estado; return n === e }).length
                          return (
                            <div key={e} className="prog-row">
                              <div className="prog-top"><span className="prog-label" style={{ color: colors[i] }}>{e.replace('_', ' ')}</span><span className="prog-val">{cnt} ({pct(cnt, reservaciones.length)})</span></div>
                              <div className="prog-bar"><div className="prog-fill" style={{ width: pct(cnt, reservaciones.length), background: colors[i] }} /></div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}

                {tab === 'Restaurantes' && (
                  <>
                    <div className="sg3">
                      {[
                        { icon: '🍽️', val: restaurantes.length, lbl: 'Total Restaurantes', color: 'var(--text)' },
                        { icon: '✅', val: restActivos, lbl: 'Activos', color: 'var(--success)' },
                        { icon: '🪑', val: mesasTotal, lbl: 'Total Mesas', color: 'var(--text)' },
                      ].map((s, i) => <div key={i} className="sc"><div className="sc-icon">{s.icon}</div><div className="sc-val" style={{ color: s.color }}>{s.val}</div><div className="sc-lbl">{s.lbl}</div></div>)}
                    </div>
                    <div className="sg2">
                      <div className="card">
                        <div className="card-header"><div><div className="card-title">Estado de mesas</div></div></div>
                        <div className="card-body">
                          {[
                            { label: 'Disponibles', value: mesasDisp, color: '#4caf82' },
                            { label: 'Ocupadas', value: mesas.filter(m => m.estado === 'OCUPADA').length, color: '#e05a5a' },
                            { label: 'Reservadas', value: mesas.filter(m => m.estado === 'RESERVADA').length, color: '#e8c96a' },
                            { label: 'Mantenimiento', value: mesas.filter(m => m.estado === 'MANTENIMIENTO').length, color: '#9a9385' },
                          ].map((m, i) => (
                            <div key={i} className="prog-row">
                              <div className="prog-top"><span className="prog-label" style={{ color: m.color }}>{m.label}</span><span className="prog-val">{m.value} ({pct(m.value, mesasTotal)})</span></div>
                              <div className="prog-bar"><div className="prog-fill" style={{ width: pct(m.value, mesasTotal), background: m.color }} /></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header"><div><div className="card-title">Pedidos por restaurante</div></div></div>
                        <div className="card-body">
                          {restaurantes.length === 0
                            ? <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>Sin restaurantes</div>
                            : restaurantes.map(r => {
                              const cnt = pedidos.filter(p => { const rid = typeof p.restaurante === 'object' ? p.restaurante?._id : p.restaurante; return rid === r._id }).length
                              return (
                                <div key={r._id} className="prog-row">
                                  <div className="prog-top"><span className="prog-label">{r.nombre}</span><span className="prog-val">{cnt} pedidos</span></div>
                                  <div className="prog-bar"><div className="prog-fill" style={{ width: pct(cnt, pedidos.length || 1), background: 'var(--gold)' }} /></div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  )
}