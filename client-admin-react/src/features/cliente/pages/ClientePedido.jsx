import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'
import NotificacionesPanel from '../../../shared/components/NotificacionesPanel'

/* ─── ICONS ─── */
const IconHome    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IconMenu    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/></svg>
const IconOrders  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const IconTable   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
const IconStar    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconUser    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLogout  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
const IconRest    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2"/></svg>
const IconBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
const IconArrow   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
const IconCheck   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconPin     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconTruck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
const IconStore   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>

const NAV_ITEMS = [
  { key: 'inicio',            label: 'Inicio',      icon: <IconHome />,   path: '/cliente/inicio' },
  { key: 'menu',              label: 'Menú',         icon: <IconMenu />,   path: '/cliente/menu' },
  { key: 'mis-pedidos',       label: 'Pedidos',     icon: <IconOrders />, path: '/cliente/mis-pedidos' },
  { key: 'reservar',          label: 'Reservar',     icon: <IconTable />,  path: '/cliente/reservar' },
  { key: 'mis-reservaciones', label: 'Reservas',    icon: <IconTable />,  path: '/cliente/mis-reservaciones' },
  { key: 'resenas',           label: 'Reseñas',      icon: <IconStar />,   path: '/cliente/resenas' },
  { key: 'perfil',            label: 'Perfil',       icon: <IconUser />,   path: '/cliente/perfil' },
]

export default function ClientePedido() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || ''
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
  const initials = (user?.name?.[0] || 'U').toUpperCase()

  // ── Carrito desde sessionStorage ──
  const [carrito, setCarrito] = useState([])
  const [restauranteId, setRestauranteId] = useState(null)
  const [restaurante, setRestaurante] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('carrito')
    const restId = sessionStorage.getItem('restauranteId')
    if (!raw || !restId) { navigate('/cliente/menu'); return }
    try {
      setCarrito(JSON.parse(raw))
      setRestauranteId(restId)
    } catch { navigate('/cliente/menu') }
  }, [])

  // Cargar datos del restaurante
  useEffect(() => {
    if (!restauranteId) return
    const fetchRest = async () => {
      try {
        const res = await api.get(`/restaurante/restaurantes/${restauranteId}`)
        setRestaurante(res.data?.data || res.data)
      } catch { }
    }
    fetchRest()
  }, [restauranteId])

  // ── Formulario ──
  const [tipoEntrega, setTipoEntrega] = useState('RECOGER')
  const [direccion, setDireccion] = useState({ calle: '', colonia: '', ciudad: '', departamento: '' })
  const [observaciones, setObservaciones] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [pedidoCreado, setPedidoCreado] = useState(null) // pedido exitoso

  // ── Cálculos ──
  const subtotal = carrito.reduce((s, i) => s + i.plato.precio * i.cantidad, 0)
  const total = subtotal

  const sf = (k, v) => setDireccion(d => ({ ...d, [k]: v }))

  // ── Enviar pedido ──
  const handleSubmit = async () => {
    setError(null)

    if (tipoEntrega === 'DOMICILIO') {
      if (!direccion.calle.trim()) return setError('La calle es obligatoria')
      if (!direccion.ciudad.trim()) return setError('La ciudad es obligatoria')
    }

    const detalles = carrito.map(i => ({
      plato: i.plato._id,
      cantidad: i.cantidad,
      precioUnitario: i.plato.precio,
      subtotal: i.plato.precio * i.cantidad,
    }))

    const payload = {
      usuario: user.id,
      restaurante: restauranteId,
      detalles,
      tipoEntrega,
      total,
      ...(tipoEntrega === 'DOMICILIO' ? { direccionEntrega: direccion } : {}),
      ...(observaciones.trim() ? { observaciones: observaciones.trim() } : {}),
    }

    setEnviando(true)
    try {
      const res = await api.post('/pedidos/pedidos', payload)
      const pedido = res.data?.data || res.data
      setPedidoCreado(pedido)
      // Limpiar sessionStorage
      sessionStorage.removeItem('carrito')
      sessionStorage.removeItem('restauranteId')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el pedido. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  // ── Pantalla de éxito ──
  if (pedidoCreado) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          :root{--black:#07080a;--deep:#0d0f12;--glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);--gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);--text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;--success:#4caf82;--nav-h:64px;}
          body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;}
        `}</style>
        <div style={{ textAlign: 'center', padding: 40, maxWidth: 480 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(76,175,130,.15)', border: '2px solid rgba(76,175,130,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--success)' }}>
            <IconCheck />
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500, marginBottom: 8 }}>¡Pedido realizado!</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
            Tu pedido #{pedidoCreado._id?.slice(-6).toUpperCase()} ha sido recibido y está siendo procesado.
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>
            Puedes seguir el estado en <strong style={{ color: 'var(--gold-lt)' }}>Mis Pedidos</strong>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => navigate('/cliente/mis-pedidos')}
              style={{ padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1))', border: '1px solid rgba(201,168,76,.35)', color: 'var(--gold-lt)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500 }}>
              Ver mis pedidos
            </button>
            <button onClick={() => navigate('/cliente/menu')}
              style={{ padding: '11px 24px', borderRadius: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-bd)', color: 'var(--text-mid)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
              Volver al menú
            </button>
          </div>
        </div>
      </>
    )
  }

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
        .nav-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .nav-btn:hover{color:var(--gold)}
        .back-btn{display:flex;align-items:center;gap:8px;background:none;border:none;color:var(--text-muted);font-family:'Outfit',sans-serif;font-size:13px;cursor:pointer;padding:6px 10px;border-radius:8px;transition:all .2s}
        .back-btn:hover{color:var(--gold-lt);background:var(--glass-bg)}

        /* PAGE */
        .page{padding-top:var(--nav-h);min-height:100vh}
        .content{max-width:900px;margin:0 auto;padding:40px 24px;display:grid;grid-template-columns:1fr 360px;gap:28px;align-items:start}

        /* COLUMNA IZQUIERDA */
        .col-left{display:flex;flex-direction:column;gap:20px}

        /* CARDS */
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .card-header{padding:18px 22px;border-bottom:1px solid var(--glass-bd)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500}
        .card-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .card-body{padding:20px 22px;display:flex;flex-direction:column;gap:14px}

        /* TIPO ENTREGA */
        .tipo-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .tipo-opt{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:12px;border:1px solid var(--glass-bd);cursor:pointer;transition:all .2s;background:var(--glass-bg)}
        .tipo-opt:hover{border-color:rgba(201,168,76,.3)}
        .tipo-opt.selected{border-color:rgba(201,168,76,.45);background:var(--gold-dim)}
        .tipo-opt-icon{width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;color:var(--text-muted);flex-shrink:0}
        .tipo-opt.selected .tipo-opt-icon{color:var(--gold-lt)}
        .tipo-opt-label{font-size:13px;font-weight:500;color:var(--text-mid)}
        .tipo-opt.selected .tipo-opt-label{color:var(--gold-lt)}
        .tipo-opt-sub{font-size:11px;color:var(--text-muted);margin-top:2px}

        /* FORM */
        .form-group{display:flex;flex-direction:column;gap:6px}
        .form-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted)}
        .form-input,.form-textarea{background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:var(--radius-inp);padding:10px 14px;color:var(--text);font-family:'Outfit',sans-serif;font-size:13.5px;outline:none;transition:border-color .2s;width:100%}
        .form-input:focus,.form-textarea:focus{border-color:rgba(201,168,76,.4)}
        .form-input::placeholder,.form-textarea::placeholder{color:var(--text-muted)}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .form-textarea{resize:vertical;min-height:80px}

        /* ERROR */
        .error-msg{padding:12px 16px;border-radius:10px;background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.25);color:var(--error);font-size:13px}

        /* COLUMNA DERECHA — resumen */
        .col-right{position:sticky;top:calc(var(--nav-h) + 24px)}
        .resumen-item{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .resumen-item:last-child{border-bottom:none}
        .resumen-nombre{font-size:13px;color:var(--text)}
        .resumen-qty{font-size:11px;color:var(--text-muted);margin-top:2px}
        .resumen-precio{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt);white-space:nowrap}
        .resumen-total{display:flex;justify-content:space-between;align-items:center;padding:16px 22px;background:rgba(201,168,76,.06);border-top:1px solid rgba(201,168,76,.15)}
        .resumen-total-label{font-size:13px;color:var(--text-mid)}
        .resumen-total-val{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--gold-lt)}
        .rest-info{display:flex;flex-direction:column;gap:4px;padding:14px 22px;border-bottom:1px solid var(--glass-bd)}
        .rest-nombre{font-size:13px;font-weight:500;color:var(--text)}
        .rest-sub{font-size:11px;color:var(--text-muted)}

        /* BOTÓN CONFIRMAR */
        .btn-confirmar{width:100%;padding:14px;border-radius:12px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.12));border:1px solid rgba(201,168,76,.4);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 22px 22px}
        .btn-confirmar:hover{border-color:rgba(201,168,76,.65);transform:translateY(-1px)}
        .btn-confirmar:disabled{opacity:.4;cursor:not-allowed;transform:none}

        @media(max-width:900px){.content{grid-template-columns:1fr}.col-right{position:static}.nav-links{display:none}}
        @media(max-width:600px){.form-row{grid-template-columns:1fr}.tipo-options{grid-template-columns:1fr}}
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/cliente/inicio')}>
          <div className="nav-brand-icon"><IconRest /></div>
          <span className="nav-brand-name">Gastro</span>
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
          <button className="back-btn" onClick={() => navigate('/cliente/menu')}>
            <IconArrow /> Volver al menú
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
        <div className="content">

          {/* COL IZQUIERDA */}
          <div className="col-left">

            {/* Tipo de entrega */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Tipo de entrega</div>
                <div className="card-sub">¿Cómo quieres recibir tu pedido?</div>
              </div>
              <div className="card-body">
                <div className="tipo-options">
                  <div className={`tipo-opt ${tipoEntrega === 'RECOGER' ? 'selected' : ''}`}
                    onClick={() => setTipoEntrega('RECOGER')}>
                    <div className="tipo-opt-icon"><IconStore /></div>
                    <div>
                      <div className="tipo-opt-label">Para recoger</div>
                      <div className="tipo-opt-sub">Retiras en el local</div>
                    </div>
                  </div>
                  <div className={`tipo-opt ${tipoEntrega === 'DOMICILIO' ? 'selected' : ''}`}
                    onClick={() => setTipoEntrega('DOMICILIO')}>
                    <div className="tipo-opt-icon"><IconTruck /></div>
                    <div>
                      <div className="tipo-opt-label">A domicilio</div>
                      <div className="tipo-opt-sub">Te lo llevamos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dirección (solo si domicilio) */}
            {tipoEntrega === 'DOMICILIO' && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Dirección de entrega</div>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Calle *</label>
                    <input className="form-input" placeholder="Ej: 6a Av. 10-20 Zona 1"
                      value={direccion.calle} onChange={e => sf('calle', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Colonia / Zona</label>
                    <input className="form-input" placeholder="Ej: Zona 10"
                      value={direccion.colonia} onChange={e => sf('colonia', e.target.value)} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Ciudad *</label>
                      <input className="form-input" placeholder="Guatemala"
                        value={direccion.ciudad} onChange={e => sf('ciudad', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Departamento</label>
                      <input className="form-input" placeholder="Guatemala"
                        value={direccion.departamento} onChange={e => sf('departamento', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Observaciones */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Observaciones</div>
                <div className="card-sub">Opcional — alergias, instrucciones especiales, etc.</div>
              </div>
              <div className="card-body">
                <textarea className="form-textarea"
                  placeholder="Ej: Sin cebolla, extra salsa..."
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)} />
              </div>
            </div>

            {error && <div className="error-msg">⚠ {error}</div>}
          </div>

          {/* COL DERECHA — resumen */}
          <div className="col-right">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Resumen del pedido</div>
              </div>

              {/* Info restaurante */}
              {restaurante && (
                <div className="rest-info">
                  <div className="rest-nombre">{restaurante.nombre}</div>
                  <div className="rest-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IconPin /> {restaurante.direccion}
                  </div>
                </div>
              )}

              {/* Items */}
              <div style={{ padding: '8px 22px' }}>
                {carrito.map((item, i) => (
                  <div key={i} className="resumen-item">
                    <div>
                      <div className="resumen-nombre">{item.plato.nombre}</div>
                      <div className="resumen-qty">x{item.cantidad} · Q {item.plato.precio.toFixed(2)} c/u</div>
                    </div>
                    <div className="resumen-precio">Q {(item.plato.precio * item.cantidad).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="resumen-total">
                <span className="resumen-total-label">Total</span>
                <span className="resumen-total-val">Q {total.toFixed(2)}</span>
              </div>

              {/* Botón confirmar */}
              <button className="btn-confirmar" onClick={handleSubmit} disabled={enviando || carrito.length === 0}>
                {enviando ? 'Procesando...' : '✓ Confirmar pedido'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
    </>
  )
}