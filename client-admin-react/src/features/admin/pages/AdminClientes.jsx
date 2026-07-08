// src/features/admin/pages/AdminClientes.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'

/* ─── ICONS ─── */
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconRest = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconStar   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const IconDash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
const IconClose = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IconEye = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
const IconTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
const IconToggleOn = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="5" width="22" height="14" rx="7" /><circle cx="16" cy="12" r="3" fill="currentColor" /></svg>
const IconToggleOff = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="5" width="22" height="14" rx="7" /><circle cx="8" cy="12" r="3" fill="currentColor" /></svg>
const IconMail = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
const IconPhone = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
const IconShield = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const IconBurger = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>)
const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: <IconDash />, path: '/admin' },
    { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/admin/menu' },
    { key: 'pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/admin/pedidos' },
    { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />, path: '/admin/reservaciones' },
    { key: 'restaurantes', label: 'Restaurantes', icon: <IconRest />, path: '/admin/restaurantes' },
    { key: 'clientes', label: 'Clientes', icon: <IconUsers />, path: '/admin/clientes' },
    { key: 'reportes', label: 'Reportes', icon: <IconReport />, path: '/admin/reportes' },
  { key: 'resenas',       label: 'Reseñas',        icon: <IconStar />,    path: '/admin/resenas' },
]

const AV_COLORS = [
    'rgba(201,168,76,.25)', 'rgba(76,175,130,.2)', 'rgba(91,155,213,.2)',
    'rgba(200,100,180,.2)', 'rgba(224,140,90,.2)',
]

function Toast({ msg, type, onDone }) {
    useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [])
    return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function AdminClientes() {
<<<<<<< HEAD
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { user, logout, setUser } = useAuthStore()
=======
    const [mobileOpen, setMobileOpen] = useState(false)
    const { user, logout } = useAuthStore()
>>>>>>> a25b5b72d59fe4678a4f5d79da0e2c856b0c0184
    const navigate = useNavigate()
    const location = useLocation()

    const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'clientes'
    const [activeNav, setActiveNav] = useState(getActiveKey())
    useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])
    const handleNavClick = (path, key) => { setActiveNav(key); navigate(path); setMobileOpen(false) }

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

    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(false)
   
    const [search, setSearch] = useState('')
    const [filtroActivo, setFiltroActivo] = useState('TODOS')
    const [detalle, setDetalle] = useState(null)
    const [toast, setToast] = useState(null)
    const [toggling, setToggling] = useState(null)


    const loadedRef = useRef(false)
    const showToast = (msg, type = 'success') => setToast({ msg, type })

    const load = async () => {
        setLoading(true)
        try {
            const res = await authApi.get('/users')
            setClientes(res.data?.users || [])
        } catch {
            showToast('Error al cargar los clientes', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        load()
    }, [])

    const toggleActivo = async (cliente) => {
        setToggling(cliente.id)
        try {
            await authApi.put(`/users/${cliente.id}`, { status: !cliente.status })
            setClientes(prev => prev.map(c =>
                c.id === cliente.id ? { ...c, status: !c.status } : c
            ))
            if (detalle?.id === cliente.id)
                setDetalle(prev => ({ ...prev, status: !prev.status }))
            showToast(`Cliente ${!cliente.status ? 'activado' : 'desactivado'}`)
        } catch {
            showToast('Error al actualizar el cliente', 'error')
        } finally {
            setToggling(null)
        }
    }

    const cambiarRol = async (cliente) => {
        const esAdmin = (cliente.role || '').toUpperCase() === 'ADMIN_ROLE'
        const nuevoRol = esAdmin ? 'USER_ROLE' : 'ADMIN_ROLE'

        if (esAdmin) {
            if (!window.confirm(`¿Quitar permisos de administrador a ${cliente.name}?`)) return
        } else {
            if (!window.confirm(`¿Dar permisos de administrador a ${cliente.name}? El usuario tendrá acceso al panel de administración.`)) return
        }

        try {
            const res = await authApi.put(`/users/${cliente.id}/role`, { roleName: nuevoRol })
            const updatedData = res.data

            setClientes(prev => prev.map(c =>
                c.id === cliente.id ? { ...c, role: nuevoRol } : c
            ))
            if (detalle?.id === cliente.id)
                setDetalle(prev => ({ ...prev, role: nuevoRol }))

            showToast(`Rol actualizado: ${cliente.name} ahora es ${nuevoRol === 'ADMIN_ROLE' ? 'Administrador' : 'Cliente'}`)

            // Si el usuario cambiado es el propio usuario logueado, actualizar sesión y redirigir
            if (cliente.id === user?.id) {
                const updatedUser = {
                    ...(updatedData || {}),
                    role: nuevoRol,
                    id: cliente.id,
                    name: cliente.name,
                    email: cliente.email,
                    username: cliente.username,
                }
                if (typeof setUser === 'function') setUser(updatedUser)
                setTimeout(() => {
                    window.location.href = nuevoRol === 'ADMIN_ROLE' ? '/admin' : '/cliente/inicio'
                }, 1200)
                return
            }

            // Si se le dio ADMIN_ROLE a otro usuario, notificar que deberá reloguearse
            if (nuevoRol === 'ADMIN_ROLE') {
                showToast(`${cliente.name} ahora es administrador. Deberá cerrar sesión y volver a entrar para ver los cambios.`)
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cambiar el rol'
            showToast(msg, 'error')
        }
    }

    const eliminar = async (id) => {
        if (!window.confirm('¿Eliminar este cliente permanentemente?')) return
        try {
            await authApi.delete(`/users/${id}`)
            setClientes(prev => prev.filter(c => c.id !== id))
            if (detalle?.id === id) setDetalle(null)
            showToast('Cliente eliminado')
        } catch {
            showToast('Error al eliminar el cliente', 'error')
        }
    }

    const filtered = clientes.filter(c => {
        const matchActivo =
            filtroActivo === 'TODOS' ||
            (filtroActivo === 'ACTIVOS' && c.status) ||
            (filtroActivo === 'INACTIVOS' && !c.status)
        const q = search.toLowerCase()
        const matchBusq = !q ||
            (c.name || '').toLowerCase().includes(q) ||
            (c.surname || '').toLowerCase().includes(q) ||
            (c.username || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q) ||
            (c.phone || '').includes(q)
        return matchActivo && matchBusq
    })

    const total = clientes.length
    const activos = clientes.filter(c => c.status).length
    const inactivos = clientes.filter(c => !c.status).length

    const initiales = (c) => ((c.name || 'C')[0]).toUpperCase()
    const avColor = (c) => AV_COLORS[(c.name?.charCodeAt(0) || 0) % AV_COLORS.length]

    return (
        <>
            <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --black:#07080a;--deep:#0d0f12;--surface:#12151a;
  --glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);--glass-hi:rgba(255,255,255,.13);
  --gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);
  --text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;
  --success:#4caf82;--error:#e05a5a;
  --radius-card:20px;--radius-inp:11px;
  --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
  --sidebar-w:240px;
  --topbar-h:64px;
}

html{overflow-x:hidden;width:100%}

body{
  font-family:'Outfit',sans-serif;
  background:var(--black);
  color:var(--text);
  min-height:100vh;
  overflow-x:hidden;
  width:100%;
}

/* ─── LAYOUT ─────────────────────────────────────────── */

.layout{display:flex;min-height:100vh;width:100%;max-width:100vw;overflow-x:hidden}

/* ─── SIDEBAR ─────────────────────────────────────────── */
/* Estático en desktop: ancho fijo, sin colapsar */

.sidebar{
  width:var(--sidebar-w);
  background:var(--deep);
  border-right:1px solid var(--glass-bd);
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;
  z-index:100;
  transition:transform .3s var(--ease-out-expo);
  overflow:hidden;
}

/* Overlay para cerrar sidebar en mobile */
.sb-overlay{
  display:none;
  position:fixed;inset:0;
  background:rgba(7,8,10,.7);
  backdrop-filter:blur(4px);
  z-index:99;
}

.sb-brand{
  padding:24px 20px 20px;
  border-bottom:1px solid var(--glass-bd);
  display:flex;align-items:center;gap:12px;
  flex-shrink:0;min-height:80px;position:relative;
}

.sb-brand::after{
  content:'';position:absolute;bottom:-1px;left:0;
  width:80px;height:1px;
  background:linear-gradient(90deg,var(--gold),transparent);
}

.sb-icon{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));
  border:1px solid rgba(201,168,76,.25);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;color:var(--gold);
}

.sb-text{overflow:hidden;white-space:nowrap}

.sb-name{
  font-family:'Cormorant Garamond',serif;
  font-size:18px;font-weight:500;
  letter-spacing:1.5px;text-transform:uppercase;
  color:var(--text);display:block;line-height:1;
}

.sb-role{
  font-size:9px;letter-spacing:2.5px;
  text-transform:uppercase;color:var(--gold);
  opacity:.7;display:block;margin-top:3px;
}

.sb-nav{flex:1;padding:16px 10px;overflow-y:auto;overflow-x:hidden}

.nav-lbl{
  font-size:9px;letter-spacing:2px;text-transform:uppercase;
  color:var(--text-muted);padding:0 10px;
  margin:16px 0 8px;white-space:nowrap;
}

.ni{
  display:flex;align-items:center;gap:12px;
  padding:10px;border-radius:10px;
  cursor:pointer;color:var(--text-mid);
  font-size:13.5px;transition:all .2s;
  position:relative;white-space:nowrap;margin-bottom:2px;
  border:1px solid transparent;
}

.ni:hover{background:var(--glass-bg);color:var(--text)}

.ni.active{
  background:var(--gold-dim);
  color:var(--gold-lt);
  border-color:rgba(201,168,76,.15);
}

.ni.active::before{
  content:'';position:absolute;
  left:0;top:20%;bottom:20%;
  width:2px;border-radius:2px;
  background:var(--gold);
}

.ni-icon{flex-shrink:0;display:flex}

.ni-text{overflow:hidden}

/* ─── SIDEBAR FOOTER ──────────────────────────────────── */

.sb-footer{padding:16px 10px;border-top:1px solid var(--glass-bd)}

.sb-user{
  display:flex;align-items:center;gap:10px;
  padding:10px;border-radius:10px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  margin-bottom:8px;overflow:hidden;
  cursor:pointer;transition:border-color .2s,background .2s;
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

.sb-uname{
  font-size:13px;font-weight:500;color:var(--text);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}

.sb-urole{font-size:10px;color:var(--gold);letter-spacing:.5px;text-transform:uppercase}

.sb-out{
  display:flex;align-items:center;gap:10px;
  padding:9px 10px;border-radius:10px;
  background:none;border:none;
  color:var(--text-muted);cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:13px;
  width:100%;transition:all .2s;white-space:nowrap;
}

.sb-out:hover{background:rgba(224,90,90,.08);color:var(--error)}

/* ─── MAIN ────────────────────────────────────────────── */
/* Siempre con margen fijo en desktop (sidebar estática) */

.main{
  flex:1;
  min-width:0;
  max-width:100%;
  margin-left:var(--sidebar-w);
  min-height:100vh;
  display:flex;flex-direction:column;
}

/* ─── TOPBAR ──────────────────────────────────────────── */

.topbar{
  height:var(--topbar-h);
  background:var(--deep);
  border-bottom:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 32px;
  position:sticky;top:0;z-index:50;
  gap:12px;
}

/* Botón hamburguesa (oculto en desktop) */
.topbar-menu{
  display:none;
  width:36px;height:36px;border-radius:10px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  align-items:center;justify-content:center;
  color:var(--text-muted);cursor:pointer;
  transition:all .2s;flex-shrink:0;
}

.topbar-menu:hover{color:var(--gold)}

.topbar-info{min-width:0;flex:1;overflow:hidden}

.topbar-title{
  font-family:'Cormorant Garamond',serif;
  font-size:20px;font-weight:500;letter-spacing:.5px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}

.topbar-sub{font-size:11px;color:var(--text-muted)}

.topbar-r{display:flex;align-items:center;gap:10px;flex-shrink:0}

.topbar-btn{
  width:36px;height:36px;border-radius:10px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:center;
  color:var(--text-muted);cursor:pointer;transition:all .2s;
}

.topbar-btn:hover{color:var(--gold)}

/* ─── CONTENT ─────────────────────────────────────────── */

.content{padding:32px;flex:1;width:100%;max-width:100%;overflow-x:hidden}

/* ─── STATS GRID: 2x2 en mobile, 3 cols en desktop ──── */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
  width: 100%;
}

.sc{
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  border-radius:var(--radius-card);
  padding:22px;position:relative;overflow:hidden;
  transition:border-color .25s,transform .2s;
  min-width:0;
}

.sc::before{
  content:'';position:absolute;top:0;left:0;
  width:60px;height:1px;
  background:linear-gradient(90deg,var(--gold),transparent);
}

.sc::after{
  content:'';position:absolute;top:0;left:0;
  width:1px;height:60px;
  background:linear-gradient(180deg,var(--gold),transparent);
}

.sc:hover{border-color:rgba(201,168,76,.2);transform:translateY(-2px)}

.sc-icon{font-size:22px;margin-bottom:10px}

.sc-val{
  font-family:'Cormorant Garamond',serif;
  font-size:32px;font-weight:500;
  line-height:1;margin-bottom:4px;
}

.sc-lbl{font-size:11.5px;color:var(--text-muted)}

/* ─── TABLE CARD ──────────────────────────────────────── */

.tcard{
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  border-radius:var(--radius-card);
  width:100%;max-width:100%;min-width:0;
  position:relative;
  overflow-x:auto;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:thin;
  scrollbar-color:rgba(201,168,76,.45) rgba(255,255,255,.04);
}

.tcard::-webkit-scrollbar{
  height:8px;
}

.tcard::-webkit-scrollbar-track{
  background:rgba(255,255,255,.04);
}

.tcard::-webkit-scrollbar-thumb{
  background:rgba(201,168,76,.45);
  border-radius:8px;
}

.tcard::-webkit-scrollbar-thumb:hover{
  background:rgba(201,168,76,.7);
}

/* Como .tcard usa overflow-x:auto en vez de hidden, redondeamos
   las esquinas manualmente en los elementos internos que las necesitan */
.tcard > .thead-row{
  border-radius:var(--radius-card) var(--radius-card) 0 0;
}

table thead tr:first-child th:first-child{
  border-top-left-radius:0;
}

table tbody tr:last-child td:first-child{
  border-bottom-left-radius:var(--radius-card);
}

table tbody tr:last-child td:last-child{
  border-bottom-right-radius:var(--radius-card);
}

.thead-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:20px 24px;border-bottom:1px solid var(--glass-bd);
  gap:12px;flex-wrap:wrap;
  min-width:760px;
}

.thead-title{
  font-family:'Cormorant Garamond',serif;
  font-size:17px;font-weight:500;letter-spacing:.3px;
}

.thead-sub{font-size:11px;color:var(--text-muted);margin-top:2px}

.thead-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}

.filters{display:flex;gap:6px;flex-wrap:wrap}

.fbtn{
  padding:6px 14px;border-radius:7px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  color:var(--text-muted);cursor:pointer;
  font-size:12px;font-family:'Outfit',sans-serif;
  transition:all .2s;white-space:nowrap;
}

.fbtn:hover{color:var(--text)}

.fbtn.act{
  background:var(--gold-dim);
  border-color:rgba(201,168,76,.3);
  color:var(--gold-lt);
}

.sbox{
  display:flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.04);
  border:1px solid var(--glass-bd);
  border-radius:10px;padding:7px 12px;
}

.sbox input{
  background:none;border:none;outline:none;
  color:var(--text);font-family:'Outfit',sans-serif;
  font-size:13px;width:200px;
}

.sbox input::placeholder{color:var(--text-muted)}

.si{color:var(--text-muted);display:flex}

table{
  width:100%;
  min-width:760px;
  border-collapse:collapse;
}

th{
  padding:10px 20px;text-align:left;
  font-size:10px;font-weight:500;
  letter-spacing:1.5px;text-transform:uppercase;
  color:var(--text-muted);
  border-bottom:1px solid var(--glass-bd);
  background:rgba(255,255,255,.015);
  white-space:nowrap;
}

td{
  padding:14px 20px;font-size:13px;
  border-bottom:1px solid rgba(255,255,255,.04);
  vertical-align:middle;
}

tr:last-child td{border-bottom:none}

tr:hover td{background:rgba(255,255,255,.02)}

/* ─── TABLE CELL COMPONENTS ───────────────────────────── */

.cav{
  width:36px;height:36px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Cormorant Garamond',serif;
  font-size:16px;font-weight:500;flex-shrink:0;
}

.cname{font-size:13.5px;color:var(--text)}

.csub{font-size:11.5px;color:var(--text-muted);margin-top:2px}

.badge-status{
  display:inline-flex;padding:3px 10px;
  border-radius:20px;font-size:11px;border:1px solid;
  white-space:nowrap;
}

.badge-on{
  background:rgba(76,175,130,.1);
  border-color:rgba(76,175,130,.25);
  color:var(--success);
}

.badge-off{
  background:rgba(224,90,90,.1);
  border-color:rgba(224,90,90,.25);
  color:var(--error);
}

.badge-verified{
  display:inline-flex;padding:2px 8px;border-radius:6px;
  font-size:10px;
  background:rgba(91,155,213,.1);
  border:1px solid rgba(91,155,213,.2);
  color:#90c0e8;
}

.abtns{display:flex;gap:6px}

.abtn{
  width:30px;height:30px;border-radius:8px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--text-muted);transition:all .2s;
}

.abtn:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3);background:var(--gold-dim)}

.abtn.danger:hover{color:var(--error);border-color:rgba(224,90,90,.3);background:rgba(224,90,90,.08)}

.abtn:disabled{opacity:.4;cursor:not-allowed}

.empty-td{text-align:center;padding:56px;color:var(--text-muted)}

.empty-icon{font-size:32px;margin-bottom:10px;opacity:.35}

/* ─── PANEL / DRAWER ──────────────────────────────────── */

.panel-ov{
  position:fixed;inset:0;
  background:rgba(7,8,10,.82);
  backdrop-filter:blur(8px);
  z-index:200;
  display:flex;align-items:flex-start;justify-content:flex-end;
}

.panel{
  width:100%;max-width:420px;
  height:100vh;
  background:var(--deep);
  border-left:1px solid var(--glass-bd);
  overflow-y:auto;
  display:flex;flex-direction:column;
  animation:slideIn .3s var(--ease-out-expo);
}

@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}

.ph{
  padding:24px;border-bottom:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;background:var(--deep);z-index:1;
}

.ph-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500}

.ph-close{
  width:32px;height:32px;border-radius:8px;
  background:var(--glass-bg);border:1px solid var(--glass-bd);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--text-muted);transition:all .2s;
}

.ph-close:hover{color:var(--error)}

.pb{padding:24px;flex:1;display:flex;flex-direction:column;gap:20px}

.p-av-wrap{
  display:flex;flex-direction:column;align-items:center;
  gap:10px;padding:8px 0;
}

.p-av{
  width:72px;height:72px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Cormorant Garamond',serif;
  font-size:32px;font-weight:500;
}

.p-img{
  width:72px;height:72px;border-radius:16px;
  object-fit:cover;border:1px solid var(--glass-bd);
}

.p-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;text-align:center}

.p-username{font-size:12px;color:var(--text-muted);text-align:center}

.p-badges{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}

.ds{display:flex;flex-direction:column;gap:8px}

.ds-title{
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--gold);opacity:.7;
  border-bottom:1px solid rgba(201,168,76,.15);padding-bottom:4px;
}

.dr{
  display:flex;justify-content:space-between;
  align-items:center;padding:6px 0;
}

.dk{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px}

.dv{font-size:13px;color:var(--text);text-align:right;max-width:220px;word-break:break-word}

.panel-actions{
  display:flex;gap:10px;flex-wrap:wrap;
  padding:20px 24px;border-top:1px solid var(--glass-bd);
}

.btn-on{
  flex:1;min-width:100px;
  padding:10px;border-radius:10px;
  background:rgba(76,175,130,.1);
  border:1px solid rgba(76,175,130,.3);
  color:var(--success);cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:13px;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .2s;
}

.btn-on:hover{background:rgba(76,175,130,.18)}

.btn-off{
  flex:1;min-width:100px;
  padding:10px;border-radius:10px;
  background:rgba(224,90,90,.08);
  border:1px solid rgba(224,90,90,.25);
  color:var(--error);cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:13px;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .2s;
}

.btn-off:hover{background:rgba(224,90,90,.15)}

.btn-del{
  padding:10px 16px;border-radius:10px;
  background:rgba(224,90,90,.06);
  border:1px solid rgba(224,90,90,.2);
  color:var(--error);cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:13px;
  display:flex;align-items:center;gap:6px;
  transition:all .2s;
}

.btn-del:hover{background:rgba(224,90,90,.15)}

/* ─── TOAST ───────────────────────────────────────────── */

.toast{
  position:fixed;bottom:28px;right:28px;
  padding:12px 20px;border-radius:12px;
  font-size:13px;font-family:'Outfit',sans-serif;
  z-index:999;
  animation:slideUp .3s var(--ease-out-expo);
  border:1px solid;
  max-width:calc(100vw - 56px);
}

.toast-success{background:rgba(76,175,130,.15);border-color:rgba(76,175,130,.3);color:var(--success)}

.toast-error{background:rgba(224,90,90,.15);border-color:rgba(224,90,90,.3);color:var(--error)}

@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* ─── BREAKPOINTS ─────────────────────────────────────── */

/* Tablet grande */
@media(max-width:1100px){
  .stats{grid-template-columns:1fr 1fr}
}

/* Tablet: búsqueda más corta */
@media(max-width:900px){
  .content{padding:20px}

  .sbox input{width:140px;min-width:0}

  .topbar{padding:0 20px}
}

/* Mobile landscape / tablet pequeña: sidebar se vuelve drawer */
@media(max-width:768px){
  /* Indicador visual: degradado a la derecha de la tarjeta, sugiere scroll disponible */
  .tcard::after{
    content:'';
    position:absolute;
    top:0;bottom:0;right:0;
    width:28px;
    background:linear-gradient(90deg,transparent,rgba(13,15,18,.6));
    pointer-events:none;
  }

  /* Sidebar se convierte en drawer deslizable */
  .sidebar{
    transform:translateX(-100%);
    width:var(--sidebar-w);
    box-shadow:4px 0 32px rgba(0,0,0,.5);
  }

  /* Clase .open abre el drawer */
  .sidebar.open{transform:translateX(0)}
  .sb-overlay.open{display:block}

  /* Main ocupa todo el ancho (sidebar oculta) */
  .main{margin-left:0}

  /* Topbar muestra hamburguesa */
  .topbar-menu{display:flex}

  .topbar{padding:0 16px}

  .topbar-title{font-size:17px}

  /* Stats: 2 columnas (2x2) */
  .stats{grid-template-columns:1fr 1fr;gap:12px}

  /* Search box más compacto */
  .sbox input{width:110px}

  /* Panel ocupa todo el ancho */
  .panel{max-width:100%;border-left:none;border-top:1px solid var(--glass-bd)}

  .panel-ov{align-items:flex-end;justify-content:stretch}

  @keyframes slideIn{from{transform:translateY(100%)}to{transform:translateY(0)}}
}

/* Mobile pequeño */
@media(max-width:480px){
  /* Stats: se mantiene 2x2 */
  .stats{grid-template-columns:1fr 1fr;gap:12px}

  .content{padding:16px}

  .thead-row{padding:16px}

  .thead-right{width:100%}

  .sbox{flex:1}
  .sbox input{width:100%;flex:1}

  /* Ocultar columnas menos importantes en tabla */
  .col-hide-xs{display:none}

  th,td{padding:10px 12px}

  .sc-val{font-size:26px}

  .topbar{padding:0 12px;gap:8px}

  .topbar-title{font-size:15px}

  .toast{bottom:16px;right:16px;left:16px;max-width:none}

  .panel-actions{flex-direction:column}
  .btn-on,.btn-off,.btn-del{width:100%}
}

/* ─── ACCESIBILIDAD: reducción de movimiento ──────────── */
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms !important;
    transition-duration:.01ms !important;
  }
}
        
      `}</style>

            <div className="layout">
                {/* SIDEBAR */}
{mobileOpen && (
    <div className="sb-overlay open" onClick={() => setMobileOpen(false)} />
)}

<aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
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

                {/* MAIN */}
                <main className="main">
                    <header className="topbar">
                      <button className="topbar-menu" onClick={() => setMobileOpen(!mobileOpen)}>
    <IconBurger />
  </button>
                        <div className="topbar-info">
                            <div className="topbar-title">Gestión de Clientes</div>
                            <div className="topbar-sub">Panel de control · Clientes</div>
                        </div>
                        <div className="topbar-r">
                            <button className="topbar-btn"><IconBell /></button>
                        </div>
                    </header>

                    <div className="content">
                        <div className="stats">
                            <div className="sc">
                                <div className="sc-icon">👥</div>
                                <div className="sc-val">{total}</div>
                                <div className="sc-lbl">Total Clientes</div>
                            </div>
                            <div className="sc">
                                <div className="sc-icon">✅</div>
                                <div className="sc-val" style={{ color: 'var(--success)' }}>{activos}</div>
                                <div className="sc-lbl">Activos</div>
                            </div>
                            <div className="sc">
                                <div className="sc-icon">🚫</div>
                                <div className="sc-val" style={{ color: 'var(--error)' }}>{inactivos}</div>
                                <div className="sc-lbl">Inactivos</div>
                            </div>
                        </div>

                        <div className="tcard">
                            <div className="thead-row">
                                <div>
                                    <div className="thead-title">Clientes registrados</div>
                                    <div className="thead-sub">{filtered.length} registros</div>
                                </div>
                                <div className="thead-right">
                                    <div className="filters">
                                        {['TODOS', 'ACTIVOS', 'INACTIVOS'].map(f => (
                                            <button key={f} className={`fbtn ${filtroActivo === f ? 'act' : ''}`}
                                                onClick={() => setFiltroActivo(f)}>
                                                {f.charAt(0) + f.slice(1).toLowerCase()}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="sbox">
                                        <span className="si"><IconSearch /></span>
                                        <input placeholder="Buscar nombre, email, usuario..."
                                            value={search} onChange={e => setSearch(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Contacto</th>
                                        <th>Usuario</th>
                                        <th>Rol</th>
                                        <th>Email verificado</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={7} className="empty-td">
                                            <div className="empty-icon">⏳</div>
                                            <div>Cargando clientes...</div>
                                        </td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={7} className="empty-td">
                                            <div className="empty-icon">👥</div>
                                            <div>{search ? 'Sin resultados para tu búsqueda' : 'Sin clientes registrados'}</div>
                                        </td></tr>
                                    ) : filtered.map(c => (
                                        <tr key={c.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    {c.profilePicture
                                                        ? <img src={c.profilePicture} alt={c.name}
                                                            style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                                                        : <div className="cav" style={{ background: avColor(c) }}>{initiales(c)}</div>
                                                    }
                                                    <div>
                                                        <div className="cname">{c.name} {c.surname || ''}</div>
                                                        <div className="csub">{c.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                                                        <IconMail /> {c.email}
                                                    </div>
                                                    {c.phone && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                                                            <IconPhone /> {c.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td><div className="cname">@{c.username}</div></td>
                                            <td>
                                                <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--glass-bg)', border: '1px solid var(--glass-bd)', padding: '2px 8px', borderRadius: 6 }}>
                                                    {c.role}
                                                </span>
                                            </td>
                                            <td>
                                                {c.isEmailVerified
                                                    ? <span className="badge-verified">✓ Verificado</span>
                                                    : <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pendiente</span>
                                                }
                                            </td>
                                            <td>
                                                <span className={`badge-status ${c.status ? 'badge-on' : 'badge-off'}`}>
                                                    {c.status ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="abtns">
                                                    <button className="abtn" title="Ver detalle" onClick={() => setDetalle(c)}><IconEye /></button>
                                                    <button className="abtn" title={c.status ? 'Desactivar' : 'Activar'}
                                                        disabled={toggling === c.id}
                                                        onClick={() => toggleActivo(c)}
                                                        style={c.status
                                                            ? { color: 'var(--success)', borderColor: 'rgba(76,175,130,.3)' }
                                                            : { color: 'var(--error)', borderColor: 'rgba(224,90,90,.3)' }}>
                                                        {c.status ? <IconToggleOn /> : <IconToggleOff />}
                                                    </button>
                                                    <button className="abtn"
                                                        title={(c.role || '').toUpperCase() === 'ADMIN_ROLE' ? 'Quitar admin' : 'Hacer admin'}
                                                        onClick={() => cambiarRol(c)}
                                                        style={(c.role || '').toUpperCase() === 'ADMIN_ROLE'
                                                            ? { color: '#e8c96a', borderColor: 'rgba(201,168,76,.3)' }
                                                            : { color: '#9a9385' }}>
                                                        <IconShield />
                                                    </button>
                                                    <button className="abtn danger" title="Eliminar" onClick={() => eliminar(c.id)}><IconTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {detalle && (
                <div className="panel-ov" onClick={e => e.target === e.currentTarget && setDetalle(null)}>
                    <div className="panel">
                        <div className="ph">
                            <div className="ph-title">Perfil del cliente</div>
                            <button className="ph-close" onClick={() => setDetalle(null)}><IconClose /></button>
                        </div>
                        <div className="pb">
                            <div className="p-av-wrap">
                                {detalle.profilePicture
                                    ? <img src={detalle.profilePicture} alt={detalle.name} className="p-img" />
                                    : <div className="p-av" style={{ background: avColor(detalle) }}>{initiales(detalle)}</div>
                                }
                                <div className="p-name">{detalle.name} {detalle.surname || ''}</div>
                                <div className="p-username">@{detalle.username}</div>
                                <div className="p-badges">
                                    <span className={`badge-status ${detalle.status ? 'badge-on' : 'badge-off'}`}>
                                        {detalle.status ? 'Activo' : 'Inactivo'}
                                    </span>
                                    {detalle.isEmailVerified && <span className="badge-verified">✓ Email verificado</span>}
                                </div>
                            </div>
                            <div className="ds">
                                <div className="ds-title">Información de contacto</div>
                                <div className="dr"><span className="dk"><IconMail /> Email</span><span className="dv">{detalle.email}</span></div>
                                {detalle.phone && <div className="dr"><span className="dk"><IconPhone /> Teléfono</span><span className="dv">{detalle.phone}</span></div>}
                            </div>
                            <div className="ds">
                                <div className="ds-title">Información de cuenta</div>
                                <div className="dr"><span className="dk">ID</span><span className="dv" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{detalle.id}</span></div>
                                <div className="dr"><span className="dk"><IconShield /> Rol</span><span className="dv">{detalle.role}</span></div>
                                <div className="dr"><span className="dk">Registrado</span><span className="dv">{detalle.createdAt ? new Date(detalle.createdAt).toLocaleDateString('es-GT') : '—'}</span></div>
                                <div className="dr"><span className="dk">Última actualización</span><span className="dv">{detalle.updatedAt ? new Date(detalle.updatedAt).toLocaleDateString('es-GT') : '—'}</span></div>
                            </div>
                        </div>
                        <div className="panel-actions">
                            <button className={detalle.status ? 'btn-off' : 'btn-on'} disabled={toggling === detalle.id} onClick={() => toggleActivo(detalle)}>
                                {detalle.status ? <><IconToggleOff /> Desactivar</> : <><IconToggleOn /> Activar</>}
                            </button>
                            <button
                                onClick={() => cambiarRol(detalle)}
                                style={{
                                    flex: 1, padding: 10, borderRadius: 10, cursor: 'pointer',
                                    fontFamily: "'Outfit',sans-serif", fontSize: 13,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    transition: 'all .2s', border: '1px solid',
                                    background: (detalle.role || '').toUpperCase() === 'ADMIN_ROLE'
                                        ? 'rgba(201,168,76,.08)' : 'rgba(91,155,213,.08)',
                                    borderColor: (detalle.role || '').toUpperCase() === 'ADMIN_ROLE'
                                        ? 'rgba(201,168,76,.3)' : 'rgba(91,155,213,.3)',
                                    color: (detalle.role || '').toUpperCase() === 'ADMIN_ROLE'
                                        ? 'var(--gold-lt)' : '#90c0e8',
                                }}>
                                <IconShield />
                                {(detalle.role || '').toUpperCase() === 'ADMIN_ROLE' ? 'Quitar Admin' : 'Hacer Admin'}
                            </button>
                            <button className="btn-del" onClick={() => eliminar(detalle.id)}><IconTrash /> Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        </>
    )
}