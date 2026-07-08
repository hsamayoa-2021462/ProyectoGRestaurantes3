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
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
const IconCart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
const IconMinus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
const IconClose = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IconTag = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
/* ─── ICON HAMBURGUESA ─── */
const IconHamburger = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
/* ─── ICON FILTRO ─── */
const IconFilter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>

const NAV_ITEMS = [
  { key: 'inicio', label: 'Inicio', icon: <IconHome />, path: '/cliente/inicio' },
  { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/cliente/menu' },
  { key: 'mis-pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/cliente/mis-pedidos' },
  { key: 'reservar', label: 'Reservar', icon: <IconTable />, path: '/cliente/reservar' },
  { key: 'mis-reservaciones', label: 'Reservas', icon: <IconTable />, path: '/cliente/mis-reservaciones' },
  { key: 'resenas', label: 'Reseñas', icon: <IconStar />, path: '/cliente/resenas' },
  { key: 'perfil', label: 'Perfil', icon: <IconUser />, path: '/cliente/perfil' },
]

export default function ClienteMenu() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'menu'
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // ── Datos ──
  const [restaurantes, setRestaurantes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [platos, setPlatos] = useState([])
  const [disponibilidad, setDisponibilidad] = useState({})
  const [maximos, setMaximos] = useState({})
  const [loading, setLoading] = useState(true)
  const loadedRef = useRef(false)

  // ── Filtros ──
  const [restSelec, setRestSelec] = useState(null)
  const [catSelec, setCatSelec] = useState(null)
  const [search, setSearch] = useState('')

  // ── Carrito ──
  const [carrito, setCarrito] = useState([])
  const [carritoOpen, setCarritoOpen] = useState(false)
  const [resenas, setResenas] = useState([])
  const [promedioRes, setPromedioRes] = useState(0)

  // ── Cerrar menú móvil al cambiar ruta ──
  useEffect(() => { setMobileNavOpen(false) }, [location.pathname])

  const load = async () => {
    setLoading(true)
    try {
      const [restRes, catRes, platRes] = await Promise.all([
        api.get('/restaurante/restaurantes'),
        api.get('/menu/categorias-plato'),
        api.get('/menu/platos?disponible=true'),
      ])

      const rests = restRes.data?.data || []
      setRestaurantes(rests)
      setCategorias(catRes.data?.data || [])
      setPlatos(platRes.data?.data || [])

      if (rests.length > 0) {
        setRestSelec(rests[0]._id)
        const dispRes = await api.get(`/menu/platos/disponibilidad?restaurante=${rests[0]._id}`)
        const mapa = {}
        const mapaMax = {}
        const datos = dispRes.data?.data || []

        datos.forEach(d => {
          mapa[d.platoId] = d.tieneStock
          mapaMax[d.platoId] = d.maximoDisponible
        })
        setDisponibilidad(mapa)
        setMaximos(mapaMax)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  // ── Platos filtrados ──
  const platosFiltrados = platos.filter(p => {
    const matchRest = !restSelec || (
      typeof p.restaurante === 'object'
        ? p.restaurante?._id === restSelec
        : p.restaurante === restSelec
    )
    const matchCat = !catSelec || (
      typeof p.categoria === 'object'
        ? p.categoria?._id === catSelec
        : p.categoria === catSelec
    )
    const matchSearch = !search ||
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (p.descripcion || '').toLowerCase().includes(search.toLowerCase())
    return matchRest && matchCat && matchSearch
  })

  // ── Categorías del restaurante seleccionado ──
  const catsFiltradas = categorias.filter(c => {
    if (!restSelec) return true
    const rid = typeof c.restaurante === 'object' ? c.restaurante?._id : c.restaurante
    return rid === restSelec
  })

  const tieneStock = (plato) => disponibilidad[plato._id] !== false

  // ── Carrito helpers ──
  const agregarAlCarrito = (plato) => {
    const itemExistente = carrito.find(i => i.plato._id === plato._id)
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0

    if (cantidadActual >= (maximos[plato._id] || 0)) {
      alert(`Ya no hay suficiente stock de ${plato.nombre}`)
      return
    }

    setCarrito(prev => {
      const existe = prev.find(i => i.plato._id === plato._id)
      if (existe) {
        return prev.map(i => i.plato._id === plato._id ? { ...i, cantidad: i.cantidad + 1 } : i)
      }
      return [...prev, { plato, cantidad: 1 }]
    })
  }

  const quitarDelCarrito = (platoId) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.plato._id === platoId)
      if (existe?.cantidad === 1) return prev.filter(i => i.plato._id !== platoId)
      return prev.map(i => i.plato._id === platoId ? { ...i, cantidad: i.cantidad - 1 } : i)
    })
  }

  const eliminarDelCarrito = (platoId) => setCarrito(prev => prev.filter(i => i.plato._id !== platoId))
  const cantidadEnCarrito = (platoId) => carrito.find(i => i.plato._id === platoId)?.cantidad || 0
  const totalCarrito = carrito.reduce((s, i) => s + i.plato.precio * i.cantidad, 0)
  const itemsCarrito = carrito.reduce((s, i) => s + i.cantidad, 0)

  const irAPedido = () => {
    if (carrito.length === 0) return
    sessionStorage.setItem('carrito', JSON.stringify(carrito))
    sessionStorage.setItem('restauranteId', restSelec)
    navigate('/cliente/pedido/nuevo')
  }

  const initials = (user?.name?.[0] || 'U').toUpperCase()

  const SidebarContent = () => (
    <>
      <div>
        <div className="sidebar-section-title">Restaurantes</div>
        {loading
          ? [1, 2].map(i => <div key={i} className="skel" style={{ height: 36, marginBottom: 6 }} />)
          : restaurantes.map(r => (
            <div key={r._id}
              className={`rest-item ${restSelec === r._id ? 'active' : ''}`}
              onClick={() => {
                setRestSelec(r._id)
                setCatSelec(null)
                setMobileSidebarOpen(false)
                api.get(`/menu/platos/disponibilidad?restaurante=${r._id}`)
                  .then(res => {
                    const mapa = {}
                    const mapaMax = {}
                    const datos = res.data?.data || []
                    datos.forEach(d => {
                      mapa[d.platoId] = d.tieneStock
                      mapaMax[d.platoId] = d.maximoDisponible
                    })
                    setDisponibilidad(mapa)
                    setMaximos(mapaMax)
                  }).catch(() => { })
              }}>
              <div className="rest-dot" />
              {r.nombre}
            </div>
          ))
        }
      </div>

      {restSelec && resenas.length > 0 && (
        <div>
          <div className="sidebar-section-title">Reseñas ⭐ {promedioRes}/5</div>
          {resenas.slice(0, 3).map(r => (
            <div key={r._id} style={{ padding: '8px 10px', marginBottom: 6, background: 'rgba(255,255,255,.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>{r.nombreUsuario || 'Cliente'}</span>
                <span style={{ fontSize: 11, color: '#c9a84c' }}>{'★'.repeat(r.estrellas)}{'☆'.repeat(5 - r.estrellas)}</span>
              </div>
              {r.comentario && <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>"{r.comentario.substring(0, 60)}{r.comentario.length > 60 ? '…' : ''}"</div>}
            </div>
          ))}
          {resenas.length > 3 && <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 10px' }}>+{resenas.length - 3} reseñas más</div>}
        </div>
      )}

      <div>
        <div className="sidebar-section-title">Categorías</div>
        <div className={`cat-todos ${!catSelec ? 'active' : ''}`} onClick={() => { setCatSelec(null); setMobileSidebarOpen(false) }}>
          Todos los platos
        </div>
        {loading
          ? [1, 2, 3].map(i => <div key={i} className="skel" style={{ height: 30, marginBottom: 4 }} />)
          : catsFiltradas.map(c => (
            <div key={c._id}
              className={`cat-item ${catSelec === c._id ? 'active' : ''}`}
              onClick={() => { setCatSelec(c._id); setMobileSidebarOpen(false) }}>
              <IconTag /> {c.nombre}
            </div>
          ))
        }
      </div>
    </>
  )

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
          --radius-card:20px;--radius-inp:11px;
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
          --nav-h:64px;
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}

        /* NAVBAR */
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
        .nav-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s;position:relative}
        .nav-btn:hover{color:var(--gold)}
        .cart-badge{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:var(--gold);color:var(--black);font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid var(--black)}

        .hamburger-btn{display:none;width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);align-items:center;justify-content:center;color:var(--text-mid);cursor:pointer;transition:all .2s;flex-shrink:0}
        .hamburger-btn:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}

        /* MENÚ MÓVIL OVERLAY */
        .mobile-nav-overlay{display:none;position:fixed;inset:0;background:rgba(7,8,10,.85);backdrop-filter:blur(10px);z-index:150;animation:fadeIn .2s ease}
        .mobile-nav-overlay.open{display:block}
        .mobile-nav-panel{position:fixed;top:0;left:0;width:280px;height:100vh;height:100dvh;background:var(--deep);border-right:1px solid var(--glass-bd);z-index:160;display:flex;flex-direction:column;animation:slideInLeft .25s var(--ease-out-expo)}
        @keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        .mobile-nav-header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--glass-bd)}
        .mobile-nav-brand{display:flex;align-items:center;gap:8px;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:var(--gold)}
        .mobile-nav-close{width:32px;height:32px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .mobile-nav-close:hover{color:var(--error)}
        .mobile-nav-user{padding:16px 20px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:12px}
        .mobile-nav-avatar{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--gold-lt);overflow:hidden;flex-shrink:0}
        .mobile-nav-avatar img{width:100%;height:100%;object-fit:cover}
        .mobile-nav-user-info .mobile-nav-uname{font-size:13px;font-weight:500;color:var(--text)}
        .mobile-nav-user-info .mobile-nav-uemail{font-size:11px;color:var(--text-muted);margin-top:2px}
        .mobile-nav-links{flex:1;overflow-y:auto;padding:12px;-webkit-overflow-scrolling:touch}
        .mobile-nav-link{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;cursor:pointer;color:var(--text-mid);font-size:14px;transition:all .2s;margin-bottom:4px;border:1px solid transparent}
        .mobile-nav-link:hover{background:var(--glass-bg);color:var(--text)}
        .mobile-nav-link.active{background:var(--gold-dim);color:var(--gold-lt);border-color:rgba(201,168,76,.2)}
        .mobile-nav-footer{padding:16px 20px;border-top:1px solid var(--glass-bd)}
        .mobile-nav-logout{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;cursor:pointer;color:var(--error);font-size:13px;transition:all .2s;border:1px solid rgba(224,90,90,.15)}
        .mobile-nav-logout:hover{background:rgba(224,90,90,.08)}

        /* SIDEBAR FILTROS MÓVIL */
        .mobile-sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(7,8,10,.8);backdrop-filter:blur(8px);z-index:130;animation:fadeIn .2s ease}
        .mobile-sidebar-overlay.open{display:block}
        .mobile-sidebar-panel{position:fixed;top:0;right:0;width:280px;height:100vh;height:100dvh;background:var(--deep);border-left:1px solid var(--glass-bd);z-index:140;display:flex;flex-direction:column;overflow-y:auto;animation:slideInRight .25s var(--ease-out-expo);-webkit-overflow-scrolling:touch}
        @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .mobile-sidebar-header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--glass-bd);position:sticky;top:0;background:var(--deep);z-index:1}
        .mobile-sidebar-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;color:var(--text)}
        .mobile-sidebar-body{padding:16px;display:flex;flex-direction:column;gap:24px}

        /* BARRA SUPERIOR DE BÚSQUEDA Y FILTROS EN MÓVIL */
        .mobile-top-bar{display:none;align-items:center;gap:8px;margin-bottom:20px;width:100%;box-sizing:border-box}
        .mobile-search-wrapper{flex:1;min-width:0;display:flex;align-items:center;gap:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:12px;padding:10px 12px}
        .mobile-search-icon{color:var(--text-muted);display:flex;align-items:center;flex-shrink:0}
        .mobile-search-input{background:none;border:none;outline:none;color:var(--text);font-family:'Outfit',sans-serif;font-size:14px;width:100%;min-width:0}
        .mobile-search-input::placeholder{color:var(--text-muted)}
        .btn-filtros-mobile{display:none;align-items:center;gap:6px;padding:10px 12px;border-radius:12px;background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-mid);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;transition:all .2s;white-space:nowrap;flex-shrink:0}
        .btn-filtros-mobile:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}
        .filtros-badge{background:var(--gold);color:var(--black);border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center}

        /* PAGE & LAYOUT */
        .page{padding-top:var(--nav-h);min-height:100vh}
        .layout{display:flex;height:calc(100vh - var(--nav-h))}

        /* SIDEBAR DESKTOP */
        .sidebar{width:220px;flex-shrink:0;background:var(--deep);border-right:1px solid var(--glass-bd);overflow-y:auto;padding:20px 12px;display:flex;flex-direction:column;gap:24px}
        .sidebar::-webkit-scrollbar{width:3px}
        .sidebar::-webkit-scrollbar-thumb{background:var(--glass-bd);border-radius:2px}
        .sidebar-section-title{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);padding:0 8px;margin-bottom:6px}
        .rest-item{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s;border:1px solid transparent;word-break:break-word}
        .rest-item:hover{background:var(--glass-bg);color:var(--text)}
        .rest-item.active{background:var(--gold-dim);color:var(--gold-lt);border-color:rgba(201,168,76,.2)}
        .rest-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);flex-shrink:0;opacity:.6}
        .rest-item.active .rest-dot{opacity:1}
        .cat-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:9px;cursor:pointer;color:var(--text-mid);font-size:12.5px;transition:all .2s;word-break:break-word}
        .cat-item:hover{background:var(--glass-bg);color:var(--text)}
        .cat-item.active{background:rgba(201,168,76,.08);color:var(--gold-lt)}
        .cat-todos{font-size:12px;color:var(--text-muted);padding:6px 10px;cursor:pointer;transition:color .2s}
        .cat-todos:hover{color:var(--text)}
        .cat-todos.active{color:var(--gold-lt)}

        /* CONTENIDO PRINCIPAL */
        .main{flex:1;overflow-y:auto;padding:28px 32px;-webkit-overflow-scrolling:touch}
        .main::-webkit-scrollbar{width:4px}
        .main::-webkit-scrollbar-thumb{background:var(--glass-bd);border-radius:2px}

        /* SEARCH BAR DESKTOP */
        .search-bar{display:flex;align-items:center;gap:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:12px;padding:10px 16px;margin-bottom:24px}
        .search-bar input{background:none;border:none;outline:none;color:var(--text);font-family:'Outfit',sans-serif;font-size:14px;flex:1}
        .search-bar input::placeholder{color:var(--text-muted)}
        .search-icon{color:var(--text-muted);display:flex;flex-shrink:0}

        /* SECCIÓN TÍTULO */
        .section-header{margin-bottom:20px}
        .section-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:var(--text)}
        .section-sub{font-size:12px;color:var(--text-muted);margin-top:3px}

        /* GRID DE PLATOS */
        .platos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
        .plato-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden;transition:border-color .2s,transform .2s,opacity .2s;display:flex;flex-direction:column}
        .plato-card:hover{border-color:rgba(201,168,76,.2);transform:translateY(-2px)}
        .plato-card.sin-stock{opacity:.6}
        .plato-card.sin-stock:hover{transform:none;border-color:var(--glass-bd)}
        .plato-img{height:140px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:40px;position:relative;overflow:hidden}
        .plato-img img{width:100%;height:100%;object-fit:cover}
        .plato-cat{position:absolute;top:10px;left:10px;background:rgba(7,8,10,.75);border:1px solid var(--glass-bd);border-radius:20px;padding:3px 10px;font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;backdrop-filter:blur(4px)}
        .sin-stock-overlay{position:absolute;inset:0;background:rgba(7,8,10,.6);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)}
        .sin-stock-badge{background:rgba(224,90,90,.2);border:1px solid rgba(224,90,90,.4);color:var(--error);padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500}
        .plato-body{padding:16px;flex:1;display:flex;flex-direction:column;gap:12px}
        .plato-nombre{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;color:var(--text);line-height:1.2}
        .plato-desc{font-size:12px;color:var(--text-muted);line-height:1.5;flex:1}
        .plato-footer{display:flex;align-items:center;justify-content:space-between;margin-top:4px;gap:8px}
        .plato-precio{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:500;color:var(--gold-lt);white-space:nowrap}
        .plato-acciones{display:flex;align-items:center;gap:6px}
        .btn-cantidad{width:28px;height:28px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s;flex-shrink:0}
        .btn-cantidad:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3);background:var(--gold-dim)}
        .btn-agregar{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:9px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.08));border:1px solid rgba(201,168,76,.3);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;transition:all .2s;white-space:nowrap}
        .btn-agregar:hover{border-color:rgba(201,168,76,.55);background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.14))}
        .cant-badge{width:28px;height:28px;border-radius:8px;background:var(--gold-dim);border:1px solid rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt);font-weight:500;flex-shrink:0}
        .no-disponible{font-size:11px;color:var(--error);padding:7px 10px;white-space:nowrap}

        /* EMPTY */
        .empty{text-align:center;padding:80px 24px;color:var(--text-muted)}
        .empty-icon{font-size:48px;margin-bottom:16px;opacity:.3}
        .empty-title{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--text-mid);margin-bottom:8px}

        /* SKELETON */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* CARRITO PANEL */
        .carrito-ov{position:fixed;inset:0;background:rgba(7,8,10,.82);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-start;justify-content:flex-end}
        .carrito-panel{width:100%;max-width:400px;height:100vh;height:100dvh;background:var(--deep);border-left:1px solid var(--glass-bd);display:flex;flex-direction:column;animation:slideIn .3s var(--ease-out-expo)}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .carrito-head{padding:24px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between}
        .carrito-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500}
        .carrito-close{width:32px;height:32px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .carrito-close:hover{color:var(--error)}
        .carrito-body{flex:1;overflow-y:auto;padding:16px 24px;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch}
        .carrito-item{display:flex;align-items:center;gap:12px;padding:12px;background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:12px}
        .carrito-item-info{flex:1;min-width:0}
        .carrito-item-nombre{font-size:13px;color:var(--text);margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .carrito-item-precio{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt)}
        .carrito-item-acciones{display:flex;align-items:center;gap:4px;flex-shrink:0}
        .carrito-empty{text-align:center;padding:40px;color:var(--text-muted);font-size:13px}
        .carrito-footer{padding:20px 24px;border-top:1px solid var(--glass-bd);display:flex;flex-direction:column;gap:12px;background:var(--deep)}
        .carrito-total{display:flex;justify-content:space-between;align-items:center}
        .carrito-total-label{font-size:13px;color:var(--text-mid)}
        .carrito-total-val{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--gold-lt)}
        .btn-pedido{width:100%;padding:13px;border-radius:12px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.12));border:1px solid rgba(201,168,76,.4);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-pedido:hover{border-color:rgba(201,168,76,.65);transform:translateY(-1px)}
        .btn-pedido:disabled{opacity:.4;cursor:not-allowed;transform:none}
        .btn-vaciar{width:100%;padding:9px;border-radius:10px;background:none;border:1px solid rgba(224,90,90,.2);color:var(--error);cursor:pointer;font-family:'Outfit',sans-serif;font-size:12px;transition:all .2s}
        .btn-vaciar:hover{background:rgba(224,90,90,.08)}

        /* ── RESPONSIVE MEDIA QUERIES ── */
        @media(max-width:1024px){
          .platos-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
        }

        @media(max-width:900px){
          .sidebar{display:none}
          .nav-links{display:none}
          .main{padding:20px 16px;height:calc(100vh - var(--nav-h));height:calc(100dvh - var(--nav-h))}
          .layout{height:auto}
          .hamburger-btn{display:flex}
          .btn-filtros-mobile{display:flex}
          .mobile-top-bar{display:flex}
          .search-bar{display:none}
          .navbar{padding:0 20px}
        }

        @media(max-width:600px) {
          .platos-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}
        }

        @media(max-width:480px){
          .platos-grid{grid-template-columns:1fr;gap:16px}
          .navbar{padding:0 12px}
          .nav-brand-name{font-size:18px;letter-spacing:1px}
          .mobile-nav-panel, .mobile-sidebar-panel, .carrito-panel {
            width: 100vw;
            max-width: 100vw;
          }
          .main{padding:16px 12px}
          .mobile-top-bar{gap:6px} /* Junta más la barra de búsqueda y el botón en móviles */
          .mobile-search-wrapper{padding:8px 10px}
        }
      `}</style>

      {/* ── MENÚ MÓVIL OVERLAY ── */}
      {mobileNavOpen && (
        <>
          <div className="mobile-nav-overlay open" onClick={() => setMobileNavOpen(false)} />
          <div className="mobile-nav-panel">
            <div className="mobile-nav-header">
              <div className="mobile-nav-brand"><IconRest /> Gastro</div>
              <div className="mobile-nav-close" onClick={() => setMobileNavOpen(false)}><IconClose /></div>
            </div>
            <div className="mobile-nav-user">
              <div className="mobile-nav-avatar">
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" onError={e => e.target.style.display = 'none'} />
                  : initials}
              </div>
              <div className="mobile-nav-user-info">
                <div className="mobile-nav-uname">{user?.name || 'Usuario'} {user?.surname || ''}</div>
                <div className="mobile-nav-uemail">{user?.email || ''}</div>
              </div>
            </div>
            <div className="mobile-nav-links">
              {NAV_ITEMS.map(item => (
                <div key={item.key}
                  className={`mobile-nav-link ${activeNav === item.key ? 'active' : ''}`}
                  onClick={() => { setActiveNav(item.key); navigate(item.path); setMobileNavOpen(false) }}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
            <div className="mobile-nav-footer">
              <div className="mobile-nav-logout" onClick={() => { setMobileNavOpen(false); logout() }}>
                <IconLogout /> Cerrar sesión
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SIDEBAR FILTROS MÓVIL ── */}
      {mobileSidebarOpen && (
        <>
          <div className="mobile-sidebar-overlay open" onClick={() => setMobileSidebarOpen(false)} />
          <div className="mobile-sidebar-panel">
            <div className="mobile-sidebar-header">
              <div className="mobile-sidebar-title">Filtros</div>
              <div className="mobile-nav-close" onClick={() => setMobileSidebarOpen(false)}><IconClose /></div>
            </div>
            <div className="mobile-sidebar-body">
              <SidebarContent />
            </div>
          </div>
        </>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="hamburger-btn" onClick={() => setMobileNavOpen(p => !p)}>
            {mobileNavOpen ? <IconClose /> : <IconHamburger />}
          </div>
          <div className="nav-brand" onClick={() => navigate('/cliente/inicio')}>
            <div className="nav-brand-icon"><IconRest /></div>
            <span className="nav-brand-name">Gastro</span>
          </div>
        </div>
        <div className="nav-links">
          {NAV_ITEMS.map(item => (
            <div key={item.key} className={`nav-link ${activeNav === item.key ? 'active' : ''}`}
              onClick={() => { setActiveNav(item.key); navigate(item.path) }}>
              {item.icon}{item.label}
            </div>
          ))}
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => setCarritoOpen(true)}>
            <IconCart />
            {itemsCarrito > 0 && <span className="cart-badge">{itemsCarrito}</span>}
          </button>
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

      <div className="page">
        <div className="layout">
          {/* SIDEBAR DESKTOP */}
          <aside className="sidebar">
            <SidebarContent />
          </aside>

          {/* MAIN */}
          <main className="main">
            {/* BARRA SUPERIOR MÓVIL CORRECTAMENTE RESPONSIVA */}
            <div className="mobile-top-bar">
              <div className="mobile-search-wrapper">
                <span className="mobile-search-icon"><IconSearch /></span>
                <input
                  className="mobile-search-input"
                  placeholder="Buscar platos..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="btn-filtros-mobile" onClick={() => setMobileSidebarOpen(true)}>
                <IconFilter /> Filtros
                {(restSelec || catSelec) && (
                  <span className="filtros-badge">{[restSelec, catSelec].filter(Boolean).length}</span>
                )}
              </button>
            </div>

            {/* Buscador DESKTOP */}
            <div className="search-bar">
              <span className="search-icon"><IconSearch /></span>
              <input
                placeholder="Buscar platos, ingredientes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Título sección */}
            <div className="section-header">
              <div className="section-title">
                {catSelec
                  ? categorias.find(c => c._id === catSelec)?.nombre || 'Platos'
                  : 'Todos los platos'
                }
              </div>
              <div className="section-sub">
                {loading ? 'Cargando...' : `${platosFiltrados.length} platos disponibles`}
              </div>
            </div>

            {/* Grid platos */}
            {loading ? (
              <div className="platos-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--glass-bd)' }}>
                    <div className="skel" style={{ height: 140 }} />
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="skel" style={{ height: 18, width: '70%' }} />
                      <div className="skel" style={{ height: 12, width: '90%' }} />
                      <div className="skel" style={{ height: 12, width: '60%' }} />
                      <div className="skel" style={{ height: 32, marginTop: 8 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : platosFiltrados.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🍽️</div>
                <div className="empty-title">{search ? 'Sin resultados' : 'Sin platos disponibles'}</div>
              </div>
            ) : (
              <div className="platos-grid">
                {platosFiltrados.map(p => {
                  const cant = cantidadEnCarrito(p._id)
                  const catNombre = typeof p.categoria === 'object'
                    ? p.categoria?.nombre
                    : categorias.find(c => c._id === p.categoria)?.nombre
                  const hayStock = tieneStock(p)

                  return (
                    <div key={p._id} className={`plato-card${hayStock ? '' : ' sin-stock'}`}>
                      <div className="plato-img">
                        {p.imagen ? <img src={p.imagen} alt={p.nombre} /> : '🍽️'}
                        {catNombre && (
                          <div className="plato-cat"><IconTag />{catNombre}</div>
                        )}
                        {!hayStock && (
                          <div className="sin-stock-overlay">
                            <span className="sin-stock-badge">Sin stock</span>
                          </div>
                        )}
                      </div>
                      <div className="plato-body">
                        <div className="plato-nombre">{p.nombre}</div>
                        {p.descripcion && (
                          <div className="plato-desc">
                            {p.descripcion.length > 80 ? p.descripcion.substring(0, 80) + '…' : p.descripcion}
                          </div>
                        )}
                        <div className="plato-footer">
                          <div className="plato-precio">Q {Number(p.precio).toFixed(2)}</div>
                          <div className="plato-acciones">
                            {!hayStock ? (
                              <span className="no-disponible">No disponible</span>
                            ) : cant > 0 ? (
                              <>
                                <button className="btn-cantidad" onClick={() => quitarDelCarrito(p._id)}><IconMinus /></button>
                                <div className="cant-badge">{cant}</div>
                                <button className="btn-cantidad" onClick={() => agregarAlCarrito(p)}><IconPlus /></button>
                              </>
                            ) : (
                              <button className="btn-agregar" onClick={() => agregarAlCarrito(p)}>
                                <IconPlus /> Agregar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* PANEL CARRITO */}
      {carritoOpen && (
        <div className="carrito-ov" onClick={e => e.target === e.currentTarget && setCarritoOpen(false)}>
          <div className="carrito-panel">
            <div className="carrito-head">
              <div className="carrito-title">Tu pedido</div>
              <button className="carrito-close" onClick={() => setCarritoOpen(false)}><IconClose /></button>
            </div>
            <div className="carrito-body">
              {carrito.length === 0 ? (
                <div className="carrito-empty">
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: .3 }}>🛒</div>
                  <div>Tu carrito está vacío</div>
                  <div style={{ marginTop: 6, fontSize: 12 }}>Agrega platos desde el menú</div>
                </div>
              ) : carrito.map(item => (
                <div key={item.plato._id} className="carrito-item">
                  <div className="carrito-item-info">
                    <div className="carrito-item-nombre">{item.plato.nombre}</div>
                    <div className="carrito-item-precio">Q {(item.plato.precio * item.cantidad).toFixed(2)}</div>
                  </div>
                  <div className="carrito-item-acciones">
                    <button className="btn-cantidad" onClick={() => quitarDelCarrito(item.plato._id)}><IconMinus /></button>
                    <div className="cant-badge">{item.cantidad}</div>
                    <button className="btn-cantidad" onClick={() => agregarAlCarrito(item.plato)}><IconPlus /></button>
                    <button className="btn-cantidad" style={{ color: 'var(--error)' }} onClick={() => eliminarDelCarrito(item.plato._id)}><IconClose /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="carrito-footer">
              <div className="carrito-total">
                <span className="carrito-total-label">Total ({itemsCarrito} items)</span>
                <span className="carrito-total-val">Q {totalCarrito.toFixed(2)}</span>
              </div>
              <button className="btn-pedido" onClick={irAPedido} disabled={carrito.length === 0}>
                <IconOrders /> Realizar pedido
              </button>
              {carrito.length > 0 && (
                <button className="btn-vaciar" onClick={() => setCarrito([])}>Vaciar carrito</button>
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
    </>
  )
}