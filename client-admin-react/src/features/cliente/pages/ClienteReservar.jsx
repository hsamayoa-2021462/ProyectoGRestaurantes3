// src/features/cliente/pages/ClienteReservar.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'
import NotificacionesPanel from '../../../shared/components/NotificacionesPanel'

/* ─── ICONS ─── */
<<<<<<< HEAD
const IconHome    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IconMenu    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/></svg>
const IconOrders  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const IconTable   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
const IconStar    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconUser    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLogout  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
const IconRest    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2"/></svg>
const IconBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
const IconCheck   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconPin     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconPhone   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const IconChair   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 7V4a2 2 0 012-2h12a2 2 0 012 2v3"/><path d="M4 7h16v4H4z"/><path d="M8 11v9M16 11v9M8 20h8"/></svg>
const IconCalendar = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>

const NAV_ITEMS = [
  { key: 'inicio',            label: 'Inicio',      icon: <IconHome />,   path: '/cliente/inicio' },
  { key: 'menu',              label: 'Menú',         icon: <IconMenu />,   path: '/cliente/menu' },
  { key: 'mis-pedidos',       label: 'Pedidos',     icon: <IconOrders />, path: '/cliente/mis-pedidos' },
  { key: 'reservar',          label: 'Reservar',     icon: <IconTable />,  path: '/cliente/reservar' },
  { key: 'mis-reservaciones', label: 'Reservas',    icon: <IconTable />,  path: '/cliente/mis-reservaciones' },
  { key: 'resenas',           label: 'Reseñas',      icon: <IconStar />,   path: '/cliente/resenas' },
  { key: 'perfil',            label: 'Perfil',       icon: <IconUser />,   path: '/cliente/perfil' },
]

// Generar horas disponibles según horario del restaurante
const generarHoras = (apertura, cierre) => {
  const defaultApertura = '09:00'
  const defaultCierre   = '22:00'
  const [hA, mA] = (apertura || defaultApertura).split(':').map(Number)
  const [hC, mC] = (cierre   || defaultCierre  ).split(':').map(Number)
  const inicio = hA * 60 + (mA || 0)
  const fin    = hC * 60 + (mC || 0)
  const horas  = []
  for (let min = inicio; min < fin; min += 30) {
    const h = String(Math.floor(min / 60)).padStart(2, '0')
    const m = String(min % 60).padStart(2, '0')
    horas.push(`${h}:${m}`)
  }
  return horas
}
=======
const IconHome = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconRest = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconCheck = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
const IconPin = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
const IconPhone = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
const IconChair = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 7V4a2 2 0 012-2h12a2 2 0 012 2v3" /><path d="M4 7h16v4H4z" /><path d="M8 11v9M16 11v9M8 20h8" /></svg>
const IconCalendar = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>

const NAV_ITEMS = [
  { key: 'inicio', label: 'Inicio', icon: <IconHome />, path: '/cliente/inicio' },
  { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/cliente/menu' },
  { key: 'mis-pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/cliente/mis-pedidos' },
  { key: 'reservar', label: 'Reservar', icon: <IconTable />, path: '/cliente/reservar' },
  { key: 'mis-reservaciones', label: 'Reservas', icon: <IconTable />, path: '/cliente/mis-reservaciones' },
  { key: 'resenas', label: 'Reseñas', icon: <IconStar />, path: '/cliente/resenas' },
  { key: 'perfil', label: 'Perfil', icon: <IconUser />, path: '/cliente/perfil' },
]

const HORAS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
]
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184

export default function ClienteReservar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'reservar'
  const [activeNav, setActiveNav] = useState(getActiveKey())
  useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

<<<<<<< HEAD
  // ── Avatar ──
=======
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
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
<<<<<<< HEAD
=======
  const [navOpen, setNavOpen] = useState(false)
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
  const initials = (user?.name?.[0] || 'U').toUpperCase()

  // ── Datos ──
  const [restaurantes, setRestaurantes] = useState([])
<<<<<<< HEAD
  const [mesas, setMesas]               = useState([])
  const [estadosRes, setEstadosRes]     = useState([])
  const [loading, setLoading]           = useState(true)
  const loadedRef                       = useRef(false)

  // ── Horas disponibles según restaurante ──
  const [horasDisponibles, setHorasDisponibles] = useState(generarHoras())

  // ── Form ──
  const [paso, setPaso]             = useState(1)  // 1: restaurante, 2: fecha/mesa, 3: confirmación
  const [restaurante, setRestaurante] = useState(null)
  const [fecha, setFecha]           = useState('')
  const [hora, setHora]             = useState('')
  const [mesa, setMesa]             = useState(null)
  const [numPersonas, setNumPersonas] = useState(2)
  const [observaciones, setObservaciones] = useState('')
  const [enviando, setEnviando]     = useState(false)
  const [error, setError]           = useState(null)
=======
  const [mesas, setMesas] = useState([])
  const [estadosRes, setEstadosRes] = useState([])
  const [loading, setLoading] = useState(true)
  const loadedRef = useRef(false)

  // ── Form ──
  const [paso, setPaso] = useState(1)
  const [restaurante, setRestaurante] = useState(null)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [mesa, setMesa] = useState(null)
  const [numPersonas, setNumPersonas] = useState(2)
  const [observaciones, setObservaciones] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
  const [reservaCreada, setReservaCreada] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [restRes, estRes] = await Promise.all([
        api.get('/restaurante/restaurantes'),
        api.get('/reservaciones/estados-reservacion'),
      ])
      setRestaurantes(restRes.data?.data || [])
      setEstadosRes(estRes.data?.data || [])
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

<<<<<<< HEAD
  // Cargar mesas cuando se selecciona restaurante
=======
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
  const cargarMesas = async (restId) => {
    try {
      const res = await api.get(`/restaurante/mesas?restaurante=${restId}`)
      const data = res.data
      const lista = Array.isArray(data) ? data : (data.mesas || data.data || [])
      setMesas(lista.filter(m => m.estado === 'DISPONIBLE'))
    } catch { setMesas([]) }
  }

  const seleccionarRestaurante = (r) => {
    setRestaurante(r)
    setMesa(null)
    setMesas([])
<<<<<<< HEAD
    setHora('')
    cargarMesas(r._id)
    // Generar horas según horario del restaurante
    setHorasDisponibles(generarHoras(r.horarioApertura, r.horarioCierre))
    setPaso(2)
  }

  // ── Enviar reservación ──
=======
    cargarMesas(r._id)
    setPaso(2)
  }

>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
  const handleSubmit = async () => {
    setError(null)
    if (!restaurante) return setError('Selecciona un restaurante')
    if (!fecha) return setError('Selecciona una fecha')
    if (!hora) return setError('Selecciona una hora')
    if (!numPersonas || numPersonas < 1) return setError('Ingresa el número de personas')

<<<<<<< HEAD
    // Estado PENDIENTE
=======
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
    const estadoPendiente = estadosRes.find(e => e.nombre === 'PENDIENTE') || estadosRes[0]
    if (!estadoPendiente) return setError('No hay estados de reservación configurados')

    const payload = {
      usuario: user.id,
      restaurante: restaurante._id,
      fecha,
      hora,
      numPersonas: Number(numPersonas),
      estado: estadoPendiente._id,
      ...(mesa ? { mesa: mesa._id } : {}),
      ...(observaciones.trim() ? { observaciones: observaciones.trim() } : {}),
    }

    setEnviando(true)
    try {
      const res = await api.post('/reservaciones/reservaciones', payload)
      setReservaCreada(res.data?.data || res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la reservación')
    } finally {
      setEnviando(false)
    }
  }

<<<<<<< HEAD
  // ── Pantalla de éxito ──
=======
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
  if (reservaCreada) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
<<<<<<< HEAD
          :root{--black:#07080a;--deep:#0d0f12;--glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);--gold:#c9a84c;--gold-lt:#e8c96a;--text:#f0ead8;--text-muted:#5a554d;--success:#4caf82;}
          body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;}
        `}</style>
        <div style={{ textAlign: 'center', padding: 40, maxWidth: 480 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(76,175,130,.15)', border: '2px solid rgba(76,175,130,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--success)' }}>
            <IconCheck />
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500, marginBottom: 8 }}>¡Reservación realizada!</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
            Tu reservación para el <strong style={{ color: 'var(--gold-lt)' }}>{fecha}</strong> a las <strong style={{ color: 'var(--gold-lt)' }}>{hora}</strong>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
            en <strong style={{ color: 'var(--gold-lt)' }}>{restaurante?.nombre}</strong> ha sido recibida.
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 32 }}>
            Estado inicial: <strong>PENDIENTE</strong> — el restaurante la confirmará pronto.
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setReservaCreada(null); setPaso(1); setRestaurante(null); setFecha(''); setHora(''); setMesa(null); setObservaciones(''); setMesas([]) }}
              style={{ padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1))', border: '1px solid rgba(201,168,76,.35)', color: 'var(--gold-lt)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500 }}>
              Nueva reservación
            </button>
            <button onClick={() => navigate('/cliente/inicio')}
              style={{ padding: '11px 24px', borderRadius: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-bd)', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
              Ir al inicio
            </button>
=======
          :root{--black:#07080a;--deep:#0d0f12;--glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);--gold:#c9a84c;--gold-lt:#e8c96a;--text:#f0ead8;--text-muted:#5a554d;--success:#4caf82;--nav-h:64px;--ease-out-expo:cubic-bezier(0.16,1,0.3,1);}
          body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;}
          .navbar{position:fixed;top:0;left:0;right:0;height:var(--nav-h);background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:100}
          .navbar::after{content:'';position:absolute;bottom:-1px;left:0;width:200px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
          .nav-brand{display:flex;align-items:center;gap:10px;cursor:pointer}
          .nav-brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;color:var(--gold)}
          .nav-brand-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text)}
          .btn-hamb{display:none;background:none;border:none;color:var(--gold);font-size:22px;cursor:pointer;padding:4px 8px;border-radius:8px;line-height:1}
          .nav-drawer-ov{display:none;position:fixed;inset:0;z-index:150;background:rgba(7,8,10,.7);backdrop-filter:blur(6px)}
          .nav-drawer-ov.open{display:block}
          .nav-drawer{position:fixed;top:var(--nav-h);left:-260px;width:240px;height:calc(100vh - var(--nav-h));background:var(--deep);border-right:1px solid var(--glass-bd);z-index:160;display:flex;flex-direction:column;padding:16px 12px;gap:4px;transition:left .3s var(--ease-out-expo);overflow-y:auto}
          .nav-drawer.open{left:0}
          .drawer-link{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;cursor:pointer;color:var(--text-muted);font-size:13px;transition:all .2s;border:1px solid transparent}
          .drawer-link:hover{background:var(--glass-bg);color:var(--text)}
          .drawer-sep{height:1px;background:var(--glass-bd);margin:8px 4px}
          .nav-links{display:flex;align-items:center;gap:4px}
          .nav-link{display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:10px;cursor:pointer;color:var(--text-muted);font-size:13px;transition:all .2s;white-space:nowrap;background:none;border:none;font-family:'Outfit',sans-serif}
          .nav-link:hover{background:var(--glass-bg);color:var(--text)}
          .nav-right{display:flex;align-items:center;gap:10px}
          .success-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding-top:var(--nav-h)}
          .success-box{text-align:center;padding:40px;max-width:480px}
          @media(max-width:900px){.nav-links{display:none}.btn-hamb{display:block}.navbar{padding:0 16px}}
        `}</style>

        <div className={`nav-drawer-ov ${navOpen ? 'open' : ''}`} onClick={() => setNavOpen(false)} />
        <div className={`nav-drawer ${navOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(item => (
            <div key={item.key} className={`drawer-link ${activeNav === item.key ? 'active' : ''}`}
              onClick={() => { setNavOpen(false); setActiveNav(item.key); navigate(item.path) }}>
              {item.icon}{item.label}
            </div>
          ))}
          <div className="drawer-sep" />
          <div className="drawer-link" style={{ color: 'var(--error)' }} onClick={() => { setNavOpen(false); logout() }}>
            <IconLogout /> Cerrar sesión
          </div>
        </div>

        <nav className="navbar">
          <div className="nav-brand" onClick={() => navigate('/cliente/inicio')}>
            <button className="btn-hamb" onClick={e => { e.stopPropagation(); setNavOpen(p => !p) }} aria-label="Abrir menú">
              {navOpen ? '✕' : '☰'}
            </button>
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
            <NotificacionesPanel isAdmin={false} />
          </div>
        </nav>

        <div className="success-wrap">
          <div className="success-box">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(76,175,130,.15)', border: '2px solid rgba(76,175,130,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--success)' }}>
              <IconCheck />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500, marginBottom: 8 }}>¡Reservación realizada!</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
              Tu reservación para el <strong style={{ color: 'var(--gold-lt)' }}>{fecha}</strong> a las <strong style={{ color: 'var(--gold-lt)' }}>{hora}</strong>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
              en <strong style={{ color: 'var(--gold-lt)' }}>{restaurante?.nombre}</strong> ha sido recibida.
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 32 }}>
              Estado inicial: <strong>PENDIENTE</strong> — el restaurante la confirmará pronto.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setReservaCreada(null); setPaso(1); setRestaurante(null); setFecha(''); setHora(''); setMesa(null); setObservaciones('') }}
                style={{ padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1))', border: '1px solid rgba(201,168,76,.35)', color: 'var(--gold-lt)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500 }}>
                Nueva reservación
              </button>
              <button onClick={() => navigate('/cliente/inicio')}
                style={{ padding: '11px 24px', borderRadius: 12, background: 'var(--glass-bg)', border: '1px solid var(--glass-bd)', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
                Ir al inicio
              </button>
            </div>
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
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

<<<<<<< HEAD
        /* NAVBAR */
=======
        /* ── NAVBAR ── */
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
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
<<<<<<< HEAD
        .nav-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .nav-btn:hover{color:var(--gold)}

        /* PAGE */
        .page{padding-top:var(--nav-h);min-height:100vh}
        .content{max-width:860px;margin:0 auto;padding:40px 24px}

        /* STEPS */
        .steps{display:flex;align-items:center;gap:0;margin-bottom:40px}
        .step{display:flex;align-items:center;gap:10px;flex:1}
        .step-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0;transition:all .3s}
        .step-circle.done{background:rgba(76,175,130,.15);border:1px solid rgba(76,175,130,.3);color:var(--success)}
        .step-circle.active{background:var(--gold-dim);border:1px solid rgba(201,168,76,.4);color:var(--gold-lt)}
        .step-circle.pending{background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted)}
        .step-label{font-size:12px;color:var(--text-muted);white-space:nowrap}
        .step-label.active{color:var(--gold-lt)}
        .step-line{flex:1;height:1px;background:var(--glass-bd);margin:0 8px}
        .step-line.done{background:rgba(76,175,130,.3)}

        /* CARDS */
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden;margin-bottom:20px}
        .card-header{padding:20px 24px;border-bottom:1px solid var(--glass-bd)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500}
        .card-sub{font-size:12px;color:var(--text-muted);margin-top:3px}
        .card-body{padding:24px}

        /* RESTAURANTES GRID */
        .rest-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
        .rest-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:16px;padding:18px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
        .rest-card::before{content:'';position:absolute;top:0;left:0;width:50px;height:1px;background:linear-gradient(90deg,var(--gold),transparent);opacity:0;transition:opacity .2s}
        .rest-card:hover{border-color:rgba(201,168,76,.3);transform:translateY(-2px)}
        .rest-card:hover::before{opacity:1}
        .rest-card.selected{border-color:rgba(201,168,76,.5);background:var(--gold-dim)}
        .rest-card.selected::before{opacity:1}
        .rest-nombre{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;margin-bottom:8px}
        .rest-meta{display:flex;flex-direction:column;gap:4px}
        .rest-meta-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)}
        .rest-meta-item svg{color:var(--gold);flex-shrink:0}
        .rest-check{position:absolute;top:12px;right:12px;width:22px;height:22px;border-radius:50%;background:rgba(76,175,130,.15);border:1px solid rgba(76,175,130,.3);display:flex;align-items:center;justify-content:center;color:var(--success);font-size:11px}

        /* FORM */
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .form-group{display:flex;flex-direction:column;gap:6px}
        .form-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted)}
        .form-input,.form-select,.form-textarea{background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:var(--radius-inp);padding:10px 14px;color:var(--text);font-family:'Outfit',sans-serif;font-size:13.5px;outline:none;transition:border-color .2s;width:100%}
        .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:rgba(201,168,76,.4)}
        .form-input::placeholder{color:var(--text-muted)}
        .form-select option{background:var(--deep);color:var(--text)}
        .form-textarea{resize:vertical;min-height:80px;grid-column:1/-1}
        .form-full{grid-column:1/-1}

        /* MESAS */
        .mesas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:8px}
        .mesa-card{padding:14px 10px;border-radius:12px;border:1px solid var(--glass-bd);cursor:pointer;text-align:center;transition:all .2s;background:var(--glass-bg)}
        .mesa-card:hover{border-color:rgba(201,168,76,.3)}
        .mesa-card.selected{border-color:rgba(201,168,76,.5);background:var(--gold-dim)}
        .mesa-num{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:var(--gold-lt)}
        .mesa-info{font-size:11px;color:var(--text-muted);margin-top:4px}
        .mesa-opt-label{font-size:11px;color:var(--text-muted);margin-top:3px}
        .mesa-sin{padding:14px 10px;border-radius:12px;border:1px dashed var(--glass-bd);cursor:pointer;text-align:center;transition:all .2s;background:transparent;font-size:12px;color:var(--text-muted)}
        .mesa-sin:hover{border-color:rgba(201,168,76,.2);color:var(--text)}
        .mesa-sin.selected{border-color:rgba(201,168,76,.3);color:var(--gold-lt);background:var(--gold-dim)}

        /* HORAS */
        .horas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:8px;margin-top:8px}
        .hora-btn{padding:8px 6px;border-radius:9px;border:1px solid var(--glass-bd);cursor:pointer;text-align:center;font-size:12.5px;font-family:'Outfit',sans-serif;color:var(--text-mid);background:var(--glass-bg);transition:all .2s}
        .hora-btn:hover{border-color:rgba(201,168,76,.3);color:var(--text)}
        .hora-btn.selected{border-color:rgba(201,168,76,.5);background:var(--gold-dim);color:var(--gold-lt)}

        /* RESUMEN */
=======

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
        .content{max-width:860px;margin:0 auto;padding:40px 24px}

        /* ── STEPS (Optimizados y Compactos para Móviles) ── */
        .steps{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:32px;width:100%;flex-wrap:nowrap}
        .step{display:flex;align-items:center;gap:6px;flex:1;min-width:0}
        .step:last-child{flex:none}
        .step-circle{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;transition:all .3s}
        .step-circle.done{background:rgba(76,175,130,.12);border:1px solid rgba(76,175,130,.25);color:var(--success)}
        .step-circle.active{background:var(--gold-dim);border:1px solid rgba(201,168,76,.5);color:var(--gold-lt);box-shadow:0 0 10px rgba(201,168,76,0.1)}
        .step-circle.pending{background:var(--glass-bg);border:1px solid var(--glass-bd);color:var(--text-muted)}
        .step-label{font-size:12px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .step-label.active{color:var(--gold-lt);font-weight:500}
        .step-line{flex:1;height:1px;background:var(--glass-bd);min-width:15px}
        .step-line.done{background:rgba(76,175,130,.25)}

        /* ── CARDS ── */
        .card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden;margin-bottom:20px}
        .card-header{padding:16px 20px;border-bottom:1px solid var(--glass-bd)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:500}
        .card-sub{font-size:12px;color:var(--text-muted);margin-top:2px}
        .card-body{padding:20px}

        /* ── RESTAURANTES GRID ── */
        .rest-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
        .rest-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:16px;padding:16px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
        .rest-card::before{content:'';position:absolute;top:0;left:0;width:50px;height:1px;background:linear-gradient(90deg,var(--gold),transparent);opacity:0;transition:opacity .2s}
        .rest-card:hover{border-color:rgba(201,168,76,.3);transform:translateY(-2px)}
        .rest-card:hover::before{opacity:1}
        .rest-card.selected{border-color:rgba(201,168,76,.5);background:var(--gold-dim)}
        .rest-card.selected::before{opacity:1}
        .rest-nombre{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;margin-bottom:6px}
        .rest-meta{display:flex;flex-direction:column;gap:4px}
        .rest-meta-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)}
        .rest-meta-item svg{color:var(--gold);flex-shrink:0}
        .rest-check{position:absolute;top:12px;right:12px;width:22px;height:22px;border-radius:50%;background:rgba(76,175,130,.15);border:1px solid rgba(76,175,130,.3);display:flex;align-items:center;justify-content:center;color:var(--success);font-size:11px}

        /* ── FORM ── */
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .form-group{display:flex;flex-direction:column;gap:6px}
        .form-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted)}
        .form-input,.form-select,.form-textarea{background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:var(--radius-inp);padding:10px 12px;color:var(--text);font-family:'Outfit',sans-serif;font-size:13.5px;outline:none;transition:border-color .2s;width:100%}
        .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:rgba(201,168,76,.4)}
        .form-input::placeholder{color:var(--text-muted)}
        .form-textarea{resize:vertical;min-height:80px;grid-column:1/-1}

        /* ── MESAS ── */
        .mesas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:8px;margin-top:8px}
        .mesa-card{padding:12px 8px;border-radius:12px;border:1px solid var(--glass-bd);cursor:pointer;text-align:center;transition:all .2s;background:var(--glass-bg)}
        .mesa-card:hover{border-color:rgba(201,168,76,.3)}
        .mesa-card.selected{border-color:rgba(201,168,76,.5);background:var(--gold-dim)}
        .mesa-num{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;color:var(--gold-lt)}
        .mesa-info{font-size:11px;color:var(--text-muted);margin-top:2px}
        .mesa-sin{padding:12px 8px;border-radius:12px;border:1px dashed var(--glass-bd);cursor:pointer;text-align:center;transition:all .2s;background:transparent;font-size:12px;color:var(--text-muted);display:flex;align-items:center;justify-content:center}
        .mesa-sin:hover{border-color:rgba(201,168,76,.2);color:var(--text)}
        .mesa-sin.selected{border-color:rgba(201,168,76,.3);color:var(--gold-lt);background:var(--gold-dim)}

        /* ── HORAS ── */
        .horas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:6px;margin-top:8px}
        .hora-btn{padding:7px 4px;border-radius:8px;border:1px solid var(--glass-bd);cursor:pointer;text-align:center;font-size:12px;font-family:'Outfit',sans-serif;color:var(--text-mid);background:var(--glass-bg);transition:all .2s}
        .hora-btn:hover{border-color:rgba(201,168,76,.3);color:var(--text)}
        .hora-btn.selected{border-color:rgba(201,168,76,.5);background:var(--gold-dim);color:var(--gold-lt)}

        /* ── RESUMEN ── */
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
        .resumen-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04)}
        .resumen-row:last-child{border-bottom:none}
        .resumen-key{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px}
        .resumen-val{font-size:13px;color:var(--text);text-align:right}
        .resumen-val.gold{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--gold-lt)}

<<<<<<< HEAD
        /* BOTONES */
        .btn-row{display:flex;gap:12px;margin-top:24px}
        .btn-primary{flex:1;padding:13px;border-radius:12px;background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;transition:all .2s}
        .btn-primary:hover{border-color:rgba(201,168,76,.6);transform:translateY(-1px)}
        .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
        .btn-secondary{padding:13px 20px;border-radius:12px;background:none;border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;transition:all .2s}
        .btn-secondary:hover{color:var(--text);border-color:rgba(255,255,255,.2)}

        /* ERROR */
        .error-msg{padding:12px 16px;border-radius:10px;background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.25);color:var(--error);font-size:13px;margin-top:12px}

        /* SKELETON */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        @media(max-width:900px){.nav-links{display:none}.content{padding:24px 16px}.form-grid{grid-template-columns:1fr}.rest-grid{grid-template-columns:1fr}}
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

          {/* STEPS */}
=======
        /* ── BOTONES ── */
        .btn-row{display:flex;gap:12px;margin-top:20px}
        .btn-primary{flex:1;padding:12px;border-radius:12px;background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:500;transition:all .2s}
        .btn-primary:hover{border-color:rgba(201,168,76,.6);transform:translateY(-1px)}
        .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
        .btn-secondary{padding:12px 16px;border-radius:12px;background:none;border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;transition:all .2s}
        .btn-secondary:hover{color:var(--text);border-color:rgba(255,255,255,.2)}

        /* ── ERROR ── */
        .error-msg{padding:12px 16px;border-radius:10px;background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.25);color:var(--error);font-size:13px;margin-top:12px}

        /* ── SKELETON ── */
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* ── RESPONSIVE ADAPTATIONS ── */
        @media(max-width:900px){
          .nav-links{display:none}
          .btn-hamb{display:block}
          .content{padding:20px 12px}
          .navbar{padding:0 16px}
        }
        @media(max-width:600px){
          .form-grid{grid-template-columns:1fr}
          .rest-grid{grid-template-columns:1fr}
          .card-body{padding:16px}
          .card-header{padding:12px 16px}
          .step-label{font-size:11px}
        }
        @media(max-width:380px){
          .step-line{display:none} /* Oculta las líneas conectoras si la pantalla es ultra pequeña */
          .steps{justify-content:space-around;gap:4px}
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
        <div className="drawer-link" onClick={() => { setNavOpen(false); navigate('/cliente/perfil') }}>
          <IconUser /> Mi perfil
        </div>
        <div className="drawer-link" style={{ color: 'var(--error)' }} onClick={() => { setNavOpen(false); logout() }}>
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

          {/* STEPS - Garantiza los tres pasos alineados horizontalmente sin saltos */}
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
          <div className="steps">
            {[
              { n: 1, label: 'Restaurante' },
              { n: 2, label: 'Fecha & Mesa' },
              { n: 3, label: 'Confirmar' },
            ].map((s, i, arr) => (
<<<<<<< HEAD
              <div key={s.n} className="step" style={{ flex: i < arr.length - 1 ? 1 : 'none' }}>
=======
              <div key={s.n} className="step">
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
                <div className={`step-circle ${paso > s.n ? 'done' : paso === s.n ? 'active' : 'pending'}`}>
                  {paso > s.n ? '✓' : s.n}
                </div>
                <div className={`step-label ${paso === s.n ? 'active' : ''}`}>{s.label}</div>
                {i < arr.length - 1 && <div className={`step-line ${paso > s.n ? 'done' : ''}`} />}
              </div>
            ))}
          </div>

          {/* ─── PASO 1: RESTAURANTE ─── */}
          {paso === 1 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">¿En qué restaurante?</div>
                <div className="card-sub">Selecciona la sucursal donde quieres reservar</div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="rest-grid">
                    {[1, 2, 3].map(i => <div key={i} className="skel" style={{ height: 100, borderRadius: 16 }} />)}
                  </div>
                ) : (
                  <div className="rest-grid">
                    {restaurantes.map(r => (
                      <div key={r._id}
                        className={`rest-card ${restaurante?._id === r._id ? 'selected' : ''}`}
                        onClick={() => seleccionarRestaurante(r)}>
                        {restaurante?._id === r._id && <div className="rest-check">✓</div>}
                        <div className="rest-nombre">{r.nombre}</div>
                        <div className="rest-meta">
                          <div className="rest-meta-item"><IconPin /> {r.direccion}</div>
                          {r.telefono && <div className="rest-meta-item"><IconPhone /> {r.telefono}</div>}
                          {r.horarioApertura && <div className="rest-meta-item">🕐 {r.horarioApertura} — {r.horarioCierre}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── PASO 2: FECHA, HORA, MESA ─── */}
          {paso === 2 && (
            <>
<<<<<<< HEAD
              {/* Fecha y personas */}
=======
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Fecha y personas</div>
                  <div className="card-sub">en {restaurante?.nombre}</div>
                </div>
                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Fecha *</label>
                      <input className="form-input" type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={fecha} onChange={e => setFecha(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">N° de personas *</label>
                      <input className="form-input" type="number" min="1" max="20"
                        value={numPersonas} onChange={e => setNumPersonas(e.target.value)} />
                    </div>
<<<<<<< HEAD
                  </div>
                </div>
              </div>

              {/* Hora */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Hora</div>
                  <div className="card-sub">
                    {restaurante?.horarioApertura && restaurante?.horarioCierre
                      ? `Horario: ${restaurante.horarioApertura} — ${restaurante.horarioCierre}`
                      : 'Selecciona el horario'}
                  </div>
                </div>
                <div className="card-body">
                  {horasDisponibles.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '16px 0' }}>
                      ⚠ Este restaurante no tiene horario configurado
                    </div>
                  ) : (
                    <div className="horas-grid">
                      {horasDisponibles.map(h => (
                        <button key={h} className={`hora-btn ${hora === h ? 'selected' : ''}`}
                          onClick={() => setHora(h)}>
                          {h}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mesa */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Mesa</div>
                  <div className="card-sub">
                    {mesas.length > 0 ? `${mesas.length} mesas disponibles` : 'Sin mesas disponibles — se asignará automáticamente'}
                  </div>
                </div>
                <div className="card-body">
                  <div className="mesas-grid">
                    <div className={`mesa-sin ${!mesa ? 'selected' : ''}`} onClick={() => setMesa(null)}>
                      Sin preferencia
                    </div>
                    {mesas.map(m => (
                      <div key={m._id}
                        className={`mesa-card ${mesa?._id === m._id ? 'selected' : ''}`}
                        onClick={() => setMesa(m)}>
                        <div className="mesa-num">#{m.numeroMesa}</div>
                        <div className="mesa-info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                            <IconChair />{m.capacidad} p.
                          </div>
                          <div style={{ marginTop: 2 }}>{m.ubicacion}</div>
                        </div>
                      </div>
                    ))}
=======
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              {/* Observaciones */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Observaciones</div>
                  <div className="card-sub">Opcional — alergias, ocasión especial, etc.</div>
                </div>
                <div className="card-body">
                  <textarea className="form-textarea"
                    placeholder="Ej: Cumpleaños, mesa alejada del ruido, silla para bebé..."
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)} />
                </div>
              </div>

              <div className="btn-row">
                <button className="btn-secondary" onClick={() => setPaso(1)}>← Volver</button>
                <button className="btn-primary"
                  onClick={() => {
                    if (!fecha) return setError('Selecciona una fecha')
                    if (!hora) return setError('Selecciona una hora')
                    setError(null)
                    setPaso(3)
                  }}>
                  Continuar →
                </button>
              </div>
              {error && <div className="error-msg">⚠ {error}</div>}
            </>
          )}

          {/* ─── PASO 3: CONFIRMAR ─── */}
          {paso === 3 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Confirmar reservación</div>
                <div className="card-sub">Revisa los datos antes de confirmar</div>
              </div>
              <div className="card-body">
                <div className="resumen-row">
                  <span className="resumen-key">👤 Cliente</span>
                  <span className="resumen-val gold">{user?.name} {user?.surname || ''}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key"><IconRest /> Restaurante</span>
                  <span className="resumen-val">{restaurante?.nombre}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key"><IconCalendar /> Fecha</span>
                  <span className="resumen-val gold">{fecha}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key">🕐 Hora</span>
                  <span className="resumen-val gold">{hora}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key">👥 Personas</span>
                  <span className="resumen-val">{numPersonas}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key"><IconChair /> Mesa</span>
                  <span className="resumen-val">
                    {mesa ? `Mesa #${mesa.numeroMesa} — ${mesa.ubicacion} (${mesa.capacidad} p.)` : 'Sin preferencia'}
                  </span>
                </div>
                {observaciones && (
                  <div className="resumen-row">
                    <span className="resumen-key">📝 Observaciones</span>
                    <span className="resumen-val" style={{ maxWidth: 240, textAlign: 'right' }}>{observaciones}</span>
                  </div>
                )}
                <div className="resumen-row">
                  <span className="resumen-key">📋 Estado inicial</span>
                  <span className="resumen-val" style={{ color: '#e8c96a' }}>PENDIENTE</span>
                </div>

                {error && <div className="error-msg">⚠ {error}</div>}

                <div className="btn-row">
                  <button className="btn-secondary" onClick={() => setPaso(2)}>← Volver</button>
                  <button className="btn-primary" onClick={handleSubmit} disabled={enviando}>
                    {enviando ? 'Confirmando...' : '✓ Confirmar reservación'}
                  </button>
                </div>
=======
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Hora</div>
                  <div className="card-sub">Selecciona el horario</div>
                </div>
                <div className="card-body">
                  <div className="horas-grid">
                    {HORAS.map(h => (
                      <button key={h} className={`hora-btn ${hora === h ? 'selected' : ''}`}
                        onClick={() => setHora(h)}>
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">Mesa</div>
                  <div className="card-sub">
                    {mesas.length > 0 ? `${mesas.length} mesas disponibles` : 'Sin mesas disponibles — se asignará automáticamente'}
                  </div>
                </div>
                <div className="card-body">
                  <div className="mesas-grid">
                    <div className={`mesa-sin ${!mesa ? 'selected' : ''}`} onClick={() => setMesa(null)}>
                      Sin preferencia
                    </div>
                    {mesas.map(m => (
                      <div key={m._id}
                        className={`mesa-card ${mesa?._id === m._id ? 'selected' : ''}`}
                        onClick={() => setMesa(m)}>
                        <div className="mesa-num">#{m.numeroMesa}</div>
                        <div className="mesa-info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                            <IconChair />{m.capacidad} p.
                          </div>
                          <div style={{ marginTop: 2 }}>{m.ubicacion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">Observaciones</div>
                  <div className="card-sub">Opcional — allergies, ocasión especial, etc.</div>
                </div>
                <div className="card-body">
                  <textarea className="form-textarea"
                    placeholder="Ej: Cumpleaños, mesa alejada del ruido, silla para bebé..."
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)} />
                </div>
              </div>

              <div className="btn-row">
                <button className="btn-secondary" onClick={() => setPaso(1)}>← Volver</button>
                <button className="btn-primary"
                  onClick={() => {
                    if (!fecha) return setError('Selecciona una fecha')
                    if (!hora) return setError('Selecciona una hora')
                    setError(null)
                    setPaso(3)
                  }}>
                  Continuar →
                </button>
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
              </div>
              {error && <div className="error-msg">⚠ {error}</div>}
            </>
          )}
<<<<<<< HEAD
=======

          {/* ─── PASO 3: CONFIRMAR ─── */}
          {paso === 3 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Confirmar reservación</div>
                <div className="card-sub">Revisa los datos antes de confirmar</div>
              </div>
              <div className="card-body">
                <div className="resumen-row">
                  <span className="resumen-key">👤 Cliente</span>
                  <span className="resumen-val gold">{user?.name} {user?.surname || ''}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key"><IconRest /> Restaurante</span>
                  <span className="resumen-val">{restaurante?.nombre}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key"><IconCalendar /> Fecha</span>
                  <span className="resumen-val gold">{fecha}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key">🕐 Hora</span>
                  <span className="resumen-val gold">{hora}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key">👥 Personas</span>
                  <span className="resumen-val">{numPersonas}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-key"><IconChair /> Mesa</span>
                  <span className="resumen-val">
                    {mesa ? `Mesa #${mesa.numeroMesa} — ${mesa.ubicacion} (${mesa.capacidad} p.)` : 'Sin preferencia'}
                  </span>
                </div>
                {observaciones && (
                  <div className="resumen-row">
                    <span className="resumen-key">📝 Observaciones</span>
                    <span className="resumen-val" style={{ maxWidth: 240, textAlign: 'right' }}>{observaciones}</span>
                  </div>
                )}
                <div className="resumen-row">
                  <span className="resumen-key">📋 Estado inicial</span>
                  <span className="resumen-val" style={{ color: 'var(--gold-lt)' }}>PENDIENTE</span>
                </div>

                {error && <div className="error-msg">⚠ {error}</div>}

                <div className="btn-row">
                  <button className="btn-secondary" onClick={() => setPaso(2)}>← Volver</button>
                  <button className="btn-primary" onClick={handleSubmit} disabled={enviando}>
                    {enviando ? 'Confirmando...' : '✓ Confirmar reservación'}
                  </button>
                </div>
              </div>
            </div>
          )}

>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
        </div>
      </div>

      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
    </>
  )
}