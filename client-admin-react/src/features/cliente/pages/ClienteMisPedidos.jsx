import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'
import NotificacionesPanel from '../../../shared/components/NotificacionesPanel'

/* ─── ICONS ─── */
const IconHome = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconRest = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
const IconEye = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
const IconClose = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IconClock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const IconBag = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>

const NAV_ITEMS = [
  { key: 'inicio', label: 'Inicio', icon: <IconHome />, path: '/cliente/inicio' },
  { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/cliente/menu' },
  { key: 'mis-pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/cliente/mis-pedidos' },
  { key: 'reservar', label: 'Reservar', icon: <IconTable />, path: '/cliente/reservar' },
  { key: 'mis-reservaciones', label: 'Reservas', icon: <IconTable />, path: '/cliente/mis-reservaciones' },
  { key: 'resenas', label: 'Reseñas', icon: <IconStar />, path: '/cliente/resenas' },
  { key: 'perfil', label: 'Perfil', icon: <IconUser />, path: '/cliente/perfil' },
]

const ESTADO_STYLE = {
  PENDIENTE: { bg: 'rgba(201,168,76,.12)', bd: 'rgba(201,168,76,.35)', tx: '#e8c96a', label: 'Pendiente' },
  CONFIRMADO: { bg: 'rgba(91,155,213,.1)', bd: 'rgba(91,155,213,.3)', tx: '#90c0e8', label: 'Confirmado' },
  PREPARANDO: { bg: 'rgba(201,120,40,.1)', bd: 'rgba(201,120,40,.3)', tx: '#e8a060', label: 'Preparando' },
  EN_CAMINO: { bg: 'rgba(100,160,220,.1)', bd: 'rgba(100,160,220,.3)', tx: '#78b8e8', label: 'En camino' },
  ENTREGADO: { bg: 'rgba(76,175,130,.1)', bd: 'rgba(76,175,130,.3)', tx: '#7dd9ae', label: 'Entregado' },
  CANCELADO: { bg: 'rgba(224,90,90,.1)', bd: 'rgba(224,90,90,.3)', tx: '#e08080', label: 'Cancelado' },
}

const TIPO_STYLE = {
  DOMICILIO: { bg: 'rgba(100,160,220,.08)', tx: '#78aee0' },
  RECOGER: { bg: 'rgba(76,175,130,.08)', tx: '#5caf82' },
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function ClienteMisPedidos() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'mis-pedidos'
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

  const [menuOpen, setMenuOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)   // ← hamburguesa
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState('TODOS')
  const [detalle, setDetalle] = useState(null)
  const [toast, setToast] = useState(null)
  const [ocultas, setOcultas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pedidos_ocultos') || '[]') } catch { return [] }
  })

  const ocultarPedido = (id) => {
    const nuevos = [...ocultas, id]
    setOcultas(nuevos)
    try { localStorage.setItem('pedidos_ocultos', JSON.stringify(nuevos)) } catch { }
  }
  const loadedRef = useRef(false)

  const showToast = (msg, type = 'error') => setToast({ msg, type })

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/pedidos/mis-pedidos')
      setPedidos(res.data?.data || [])
    } catch {
      showToast('Error al cargar tus pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  const filtrados = pedidos.filter(p =>
    (filtro === 'TODOS' || p.estado === filtro) && !ocultas.includes(p._id)
  )

  const calcTotal = p => {
    if (p.total) return `Q ${Number(p.total).toFixed(2)}`
    if (p.detalles?.length) {
      const s = p.detalles.reduce((a, d) => a + (d.subtotal || d.precio * d.cantidad || 0), 0)
      return `Q ${s.toFixed(2)}`
    }
    return '—'
  }

  const timeAgo = iso => {
    if (!iso) return '—'
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
    if (diff < 1) return 'ahora'
    if (diff < 60) return `${diff} min`
    if (diff < 1440) return `${Math.floor(diff / 60)}h`
    return `${Math.floor(diff / 1440)}d`
  }

  const es = e => ESTADO_STYLE[e] || { bg: 'rgba(255,255,255,.05)', bd: 'rgba(255,255,255,.1)', tx: '#aaa', label: e }
  const ts = t => TIPO_STYLE[t] || { bg: 'rgba(255,255,255,.05)', tx: '#aaa' }

  const activos = pedidos.filter(p => ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO'].includes(p.estado)).length
  const entregados = pedidos.filter(p => p.estado === 'ENTREGADO').length
  const gastado = pedidos.filter(p => p.estado === 'ENTREGADO').reduce((s, p) => s + (p.total || 0), 0)

  const initials = (user?.name?.[0] || 'U').toUpperCase()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --black:#07080a;--deep:#0d0f12;
          --glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);
          --gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;
          --success:#4caf82;--error:#e05a5a;
          --radius-card:20px;--ease-out-expo:cubic-bezier(0.16,1,0.3,1);
          --nav-h:64px;
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}

        /* ── NAVBAR ── */
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

        /* ── HAMBURGUESA ── */
        .btn-hamb{display:none;background:none;border:none;color:var(--gold);font-size:22px;cursor:pointer;padding:4px 8px;border-radius:8px;line-height:1;transition:background .2s}
        .btn-hamb:hover{background:var(--gold-dim)}

        /* ── DRAWER NAV MÓVIL ── */
        .nav-drawer-ov{display:none;position:fixed;inset:0;z-index:150;background:rgba(7,8,10,.7);backdrop-filter:blur(6px)}
        .nav-drawer-ov.open{display:block}
        .nav-drawer{position:fixed;top:var(--nav-h);left:-260px;width:240px;height:calc(100vh - var(--nav-h));background:var(--deep);border-right:1px solid var(--glass-bd);z-index:160;display:flex;flex-direction:column;padding:16px 12px;gap:4px;transition:left .3s var(--ease-out-expo);overflow-y:auto}
        .nav-drawer.open{left:0}
        .drawer-link{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s;border:1px solid transparent}
        .drawer-link:hover{background:var(--glass-bg);color:var(--text)}
        .drawer-link.active{background:var(--gold-dim);color:var(--gold-lt);border-color:rgba(201,168,76,.2)}
        .drawer-sep{height:1px;background:var(--glass-bd);margin:8px 4px}

        /* ── PAGE ── */
        .page{padding-top:var(--nav-h);min-height:100vh}
        .content{max-width:960px;margin:0 auto;padding:40px 24px}

        /* ── HEADER ── */
        .page-header{margin-bottom:28px}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--text);margin-bottom:4px}
        .page-sub{font-size:13px;color:var(--text-muted)}

        /* ── STATS ── */
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}
        .sc{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:20px;position:relative;overflow:hidden;transition:border-color .2s,transform .2s}
        .sc::before{content:'';position:absolute;top:0;left:0;width:60px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .sc::after{content:'';position:absolute;top:0;left:0;width:1px;height:60px;background:linear-gradient(180deg,var(--gold),transparent)}
        .sc:hover{border-color:rgba(201,168,76,.2);transform:translateY(-2px)}
        .sc-icon{font-size:20px;margin-bottom:8px}
        .sc-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;line-height:1;margin-bottom:3px}
        .sc-lbl{font-size:11px;color:var(--text-muted)}

        /* ── CARD / FILTROS ── */
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .card-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--glass-bd);gap:12px;flex-wrap:wrap}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500}
        .card-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .header-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .filtros{display:flex;gap:6px;flex-wrap:wrap}
        .fbtn{padding:6px 14px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s;white-space:nowrap}
        .fbtn:hover{color:var(--text)}
        .fbtn.active{background:var(--gold-dim);border-color:rgba(201,168,76,.3);color:var(--gold-lt)}
        .refresh-btn{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:9px;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;transition:all .2s}
        .refresh-btn:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3)}

        /* ── LISTA ── */
        .pedidos-list{display:flex;flex-direction:column;gap:0}
        .pedido-row{display:flex;align-items:center;gap:16px;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;transition:background .15s}
        .pedido-row:last-child{border-bottom:none}
        .pedido-row:hover{background:rgba(255,255,255,.02)}
        .pedido-id{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;color:var(--gold-lt);min-width:64px}
        .pedido-info{flex:1}
        .pedido-rest{font-size:13px;color:var(--text);margin-bottom:3px}
        .pedido-meta{font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .pedido-total{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold-lt);white-space:nowrap}
        .badge-estado{display:inline-flex;align-items:center;padding:4px 12px;border-radius:20px;font-size:11px;border:1px solid;white-space:nowrap}
        .badge-tipo{display:inline-flex;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:500}
        .ver-btn{width:32px;height:32px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);transition:all .2s;flex-shrink:0}
        .pedido-row:hover .ver-btn{color:var(--gold-lt);border-color:rgba(201,168,76,.3);background:var(--gold-dim)}

        /* ── EMPTY ── */
        .empty{text-align:center;padding:64px 24px;color:var(--text-muted)}
        .empty-icon{font-size:48px;margin-bottom:16px;opacity:.3}
        .empty-title{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--text-mid);margin-bottom:8px}
        .empty-sub{font-size:13px;margin-bottom:24px}
        .btn-primary{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;border-radius:12px;background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s}
        .btn-primary:hover{border-color:rgba(201,168,76,.6);transform:translateY(-1px)}

        /* ── PANEL DETALLE ── */
        .panel-ov{position:fixed;inset:0;background:rgba(7,8,10,.82);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-start;justify-content:flex-end}
        .panel{width:100%;max-width:440px;height:100vh;background:var(--deep);border-left:1px solid var(--glass-bd);overflow-y:auto;display:flex;flex-direction:column;animation:slideIn .3s var(--ease-out-expo)}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .panel-head{padding:24px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--deep);z-index:1}
        .panel-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500}
        .panel-close{width:32px;height:32px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .panel-close:hover{color:var(--error)}
        .panel-body{padding:24px;flex:1;display:flex;flex-direction:column;gap:20px}
        .dsec{display:flex;flex-direction:column;gap:8px}
        .dsec-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);opacity:.7;border-bottom:1px solid rgba(201,168,76,.15);padding-bottom:4px}
        .drow{display:flex;justify-content:space-between;align-items:center;padding:7px 0}
        .dk{font-size:12px;color:var(--text-muted)}
        .dv{font-size:13px;color:var(--text);text-align:right}
        .dv.gold{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt)}
        .item-row{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:8px;border:1px solid var(--glass-bd);margin-bottom:6px}
        .item-name{font-size:13px;color:var(--text)}
        .item-qty{font-size:11px;color:var(--text-muted);margin-top:2px}
        .item-price{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt)}
        .total-row{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);border-radius:12px;margin-top:4px}
        .total-label{font-size:13px;color:var(--text-mid)}
        .total-val{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--gold-lt)}

        /* ── SKELETON ── */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .skel-row{display:flex;align-items:center;gap:16px;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.04)}

        /* ── TOAST ── */
        .toast{position:fixed;bottom:28px;right:28px;padding:12px 20px;border-radius:12px;font-size:13px;font-family:'Outfit',sans-serif;z-index:999;animation:slideUp .3s ease;border:1px solid}
        .toast-success{background:rgba(76,175,130,.15);border-color:rgba(76,175,130,.3);color:var(--success)}
        .toast-error{background:rgba(224,90,90,.15);border-color:rgba(224,90,90,.3);color:var(--error)}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

        /* ── RESPONSIVE ── */
        @media(max-width:900px){
          .stats{grid-template-columns:1fr 1fr}
          .nav-links{display:none}
          .btn-hamb{display:block}
          .content{padding:24px 16px}
        }
        @media(max-width:600px){
          .stats{grid-template-columns:1fr}
          .pedido-total{display:none}
        }
      `}</style>

      {/* ── DRAWER OVERLAY (móvil) ── */}
      <div
        className={`nav-drawer-ov ${navOpen ? 'open' : ''}`}
        onClick={() => setNavOpen(false)}
      />

      {/* ── DRAWER (móvil) ── */}
      <div className={`nav-drawer ${navOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map(item => (
          <div
            key={item.key}
            className={`drawer-link ${activeNav === item.key ? 'active' : ''}`}
            onClick={() => { setNavOpen(false); setActiveNav(item.key); navigate(item.path) }}
          >
            {item.icon}{item.label}
          </div>
        ))}
        <div className="drawer-sep" />
        <div
          className="drawer-link"
          onClick={() => { setNavOpen(false); navigate('/cliente/perfil') }}
        >
          <IconUser /> Mi perfil
        </div>
        <div
          className="drawer-link"
          style={{ color: 'var(--error)' }}
          onClick={() => { setNavOpen(false); logout() }}
        >
          <IconLogout /> Cerrar sesión
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/cliente/inicio')}>
          <button
            className="btn-hamb"
            onClick={e => { e.stopPropagation(); setNavOpen(p => !p) }}
            aria-label="Abrir menú"
          >
            {navOpen ? '✕' : '☰'}
          </button>
          <div className="nav-brand-icon"><IconRest /></div>
          <span className="nav-brand-name">Gastro</span>
        </div>

        <div className="nav-links">
          {NAV_ITEMS.map(item => (
            <div
              key={item.key}
              className={`nav-link ${activeNav === item.key ? 'active' : ''}`}
              onClick={() => { setActiveNav(item.key); navigate(item.path) }}
            >
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
                <div className="nd-item" onClick={() => { setMenuOpen(false); navigate('/cliente/perfil') }}><IconUser /> Mi perfil</div>
                <div className="nd-item danger" onClick={() => { setMenuOpen(false); logout() }}><IconLogout /> Cerrar sesión</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <div className="page">
        <div className="content">

          <div className="page-header">
            <div className="page-title">Mis Pedidos</div>
            <div className="page-sub">Historial completo de tus pedidos</div>
          </div>

          {/* STATS */}
          <div className="stats">
            <div className="sc">
              <div className="sc-icon">🧾</div>
              <div className="sc-val">{pedidos.length}</div>
              <div className="sc-lbl">Total pedidos</div>
            </div>
            <div className="sc">
              <div className="sc-icon">🚀</div>
              <div className="sc-val" style={{ color: '#90c0e8' }}>{activos}</div>
              <div className="sc-lbl">En proceso</div>
            </div>
            <div className="sc">
              <div className="sc-icon">💰</div>
              <div className="sc-val" style={{ color: 'var(--gold-lt)', fontSize: 22 }}>
                Q {gastado.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </div>
              <div className="sc-lbl">Total gastado</div>
            </div>
          </div>

          {/* LISTA */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Pedidos</div>
                <div className="card-sub">{filtrados.length} registros</div>
              </div>
              <div className="header-right">
                <div className="filtros">
                  {['TODOS', 'PENDIENTE', 'PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'].map(f => (
                    <button key={f} className={`fbtn ${filtro === f ? 'active' : ''}`}
                      onClick={() => setFiltro(f)}>
                      {f === 'TODOS' ? 'Todos' : ESTADO_STYLE[f]?.label || f}
                    </button>
                  ))}
                </div>
                <button className="refresh-btn" onClick={() => { loadedRef.current = false; load() }}>
                  <IconRefresh /> Actualizar
                </button>
              </div>
            </div>

            {loading ? (
              <>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skel-row">
                    <div className="skel" style={{ width: 48, height: 28 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div className="skel" style={{ height: 14, width: '60%' }} />
                      <div className="skel" style={{ height: 11, width: '40%' }} />
                    </div>
                    <div className="skel" style={{ width: 60, height: 22 }} />
                  </div>
                ))}
              </>
            ) : filtrados.length === 0 ? (
              <div className="empty">
                <div className="empty-icon"><IconBag /></div>
                <div className="empty-title">{filtro !== 'TODOS' ? 'Sin pedidos en este estado' : 'Aún no tienes pedidos'}</div>
                <div className="empty-sub">{filtro !== 'TODOS' ? 'Cambia el filtro para ver otros pedidos' : '¡Explora nuestro menú y haz tu primer pedido!'}</div>
                {filtro === 'TODOS' && (
                  <button className="btn-primary" onClick={() => navigate('/cliente/menu')}>
                    <IconMenu /> Ver el menú
                  </button>
                )}
              </div>
            ) : (
              <div className="pedidos-list">
                {filtrados
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(p => {
                    const st = es(p.estado)
                    const tt = ts(p.tipoEntrega)
                    return (
                      <div key={p._id} className="pedido-row" onClick={() => setDetalle(p)}>
                        <div className="pedido-id">#{p._id?.slice(-5).toUpperCase()}</div>
                        <div className="pedido-info">
                          <div className="pedido-rest">{p.restaurante?.nombre || 'Restaurante'}</div>
                          <div className="pedido-meta">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <IconClock /> {timeAgo(p.createdAt)}
                            </span>
                            <span>·</span>
                            <span>{p.detalles?.length || 0} item(s)</span>
                            <span>·</span>
                            <span className="badge-tipo" style={{ background: tt.bg, color: tt.tx }}>
                              {p.tipoEntrega === 'DOMICILIO' ? '🛵 Domicilio' : '🏪 Recoger'}
                            </span>
                          </div>
                        </div>
                        <div className="pedido-total">{calcTotal(p)}</div>
                        <span className="badge-estado" style={{ background: st.bg, borderColor: st.bd, color: st.tx }}>
                          {st.label}
                        </span>
                        {['ENTREGADO', 'CANCELADO'].includes(p.estado) && (
                          <button
                            onClick={e => { e.stopPropagation(); ocultarPedido(p._id); if (detalle?._id === p._id) setDetalle(null) }}
                            title="Quitar de la vista"
                            style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,.04)', border: '1px solid var(--glass-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, flexShrink: 0 }}>
                            ✕
                          </button>
                        )}
                        <div className="ver-btn"><IconEye /></div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PANEL DETALLE ── */}
      {detalle && (
        <div className="panel-ov" onClick={e => e.target === e.currentTarget && setDetalle(null)}>
          <div className="panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">Detalle del pedido</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                  #{detalle._id?.slice(-6).toUpperCase()}
                </div>
              </div>
              <button className="panel-close" onClick={() => setDetalle(null)}><IconClose /></button>
            </div>
            <div className="panel-body">

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {(() => {
                  const st = es(detalle.estado)
                  return (
                    <span className="badge-estado" style={{ background: st.bg, borderColor: st.bd, color: st.tx, fontSize: 13, padding: '6px 18px' }}>
                      {st.label}
                    </span>
                  )
                })()}
              </div>

              <div className="dsec">
                <div className="dsec-title">Información general</div>
                <div className="drow">
                  <span className="dk">Restaurante</span>
                  <span className="dv">{detalle.restaurante?.nombre || '—'}</span>
                </div>
                <div className="drow">
                  <span className="dk">Tipo de entrega</span>
                  <span className="badge-tipo" style={{ ...ts(detalle.tipoEntrega), padding: '2px 10px', borderRadius: 6 }}>
                    {detalle.tipoEntrega === 'DOMICILIO' ? '🛵 Domicilio' : '🏪 Para recoger'}
                  </span>
                </div>
                <div className="drow">
                  <span className="dk">Fecha</span>
                  <span className="dv gold">
                    {detalle.createdAt ? new Date(detalle.createdAt).toLocaleString('es-GT') : '—'}
                  </span>
                </div>
              </div>

              {detalle.tipoEntrega === 'DOMICILIO' && detalle.direccionEntrega && (
                <div className="dsec">
                  <div className="dsec-title">Dirección de entrega</div>
                  <div className="drow"><span className="dk">Calle</span><span className="dv">{detalle.direccionEntrega.calle}</span></div>
                  {detalle.direccionEntrega.colonia && <div className="drow"><span className="dk">Colonia</span><span className="dv">{detalle.direccionEntrega.colonia}</span></div>}
                  <div className="drow"><span className="dk">Ciudad</span><span className="dv">{detalle.direccionEntrega.ciudad}, {detalle.direccionEntrega.departamento}</span></div>
                </div>
              )}

              <div className="dsec">
                <div className="dsec-title">Items del pedido</div>
                {detalle.detalles?.length > 0
                  ? detalle.detalles.map((d, i) => (
                    <div key={i} className="item-row">
                      <div>
                        <div className="item-name">{d.plato?.nombre || 'Plato'}</div>
                        <div className="item-qty">x{d.cantidad || 1}</div>
                      </div>
                      <div className="item-price">Q {Number(d.subtotal || d.precio || 0).toFixed(2)}</div>
                    </div>
                  ))
                  : <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sin detalle disponible</div>
                }
                <div className="total-row">
                  <span className="total-label">Total del pedido</span>
                  <span className="total-val">{calcTotal(detalle)}</span>
                </div>
              </div>

              {detalle.notas && (
                <div className="dsec">
                  <div className="dsec-title">Notas</div>
                  <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>{detalle.notas}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  )
}