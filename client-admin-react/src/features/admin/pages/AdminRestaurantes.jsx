// src/features/admin/pages/AdminRestaurantes.jsx
import { useState } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import api from '../../../shared/api/api'

/* ─── ICONS ─── */
const IconMenu    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/></svg>
const IconOrders  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const IconTable   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
const IconRest    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2"/></svg>
const IconReport  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IconDash    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const IconUsers   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const IconLogout  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
const IconPlus    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEdit    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>
const IconSearch  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconX       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconClock   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconPin     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconPhone   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const IconBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>

const NAV_ITEMS = [
  { key: 'dashboard',     label: 'Dashboard',     icon: <IconDash />,   href: '/admin' },
  { key: 'menu',          label: 'Menú',           icon: <IconMenu />,   href: '/admin/menu' },
  { key: 'pedidos',       label: 'Pedidos',        icon: <IconOrders />, href: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones',  icon: <IconTable />,  href: '/admin/reservaciones' },
  { key: 'restaurantes',  label: 'Restaurantes',   icon: <IconRest />,   href: '/admin/restaurantes' },
  { key: 'clientes',      label: 'Clientes',       icon: <IconUsers />,  href: '/admin/clientes' },
  { key: 'reportes',      label: 'Reportes',       icon: <IconReport />, href: '/admin/reportes' },
]

const MOCK = [
  { _id:'1', nombre:"McDonald's", direccion:'Zona 10, Ciudad de Guatemala', telefono:'23680000', email:'gt@mcdonalds.com', horarioApertura:'07:00', horarioCierre:'23:00', estado:true, categoria:'Comida Rápida',
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/120px-McDonald%27s_Golden_Arches.svg.png',
    banner:'https://images.unsplash.com/photo-1619881585016-5f54e08e1c72?w=600&q=80' },
  { _id:'2', nombre:'Taco Bell', direccion:'Zona 4, Ciudad de Guatemala', telefono:'23990011', email:'gt@tacobell.com', horarioApertura:'10:00', horarioCierre:'23:30', estado:true, categoria:'Mexicana',
    img:'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Taco_Bell_2016.svg/120px-Taco_Bell_2016.svg.png',
    banner:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80' },
  { _id:'3', nombre:'KFC', direccion:'Zona 14, Ciudad de Guatemala', telefono:'24520022', email:'gt@kfc.com', horarioApertura:'10:00', horarioCierre:'22:00', estado:true, categoria:'Comida Rápida',
    img:'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/120px-KFC_logo.svg.png',
    banner:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80' },
  { _id:'4', nombre:'Subway', direccion:'Zona 1, Ciudad de Guatemala', telefono:'22100033', email:'gt@subway.com', horarioApertura:'08:00', horarioCierre:'22:00', estado:true, categoria:'Sándwiches',
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subway_2016_logo.svg/120px-Subway_2016_logo.svg.png',
    banner:'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80' },
  { _id:'5', nombre:'Pizza Hut', direccion:'Zona 12, Ciudad de Guatemala', telefono:'23445544', email:'gt@pizzahut.com', horarioApertura:'11:00', horarioCierre:'23:00', estado:true, categoria:'Italiana',
    img:'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Pizza_Hut_logo.svg/120px-Pizza_Hut_logo.svg.png',
    banner:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80' },
  { _id:'6', nombre:'Burger King', direccion:'Zona 9, Ciudad de Guatemala', telefono:'22998800', email:'gt@burgerking.com', horarioApertura:'09:00', horarioCierre:'23:00', estado:true, categoria:'Comida Rápida',
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/120px-Burger_King_logo_%281999%29.svg.png',
    banner:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80' },
  { _id:'7', nombre:"Domino's Pizza", direccion:'Zona 15, Ciudad de Guatemala', telefono:'24556677', email:'gt@dominos.com', horarioApertura:'11:00', horarioCierre:'00:00', estado:true, categoria:'Italiana',
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/120px-Domino%27s_pizza_logo.svg.png',
    banner:'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&q=80' },
  { _id:'8', nombre:'Starbucks', direccion:'Zona 10, Oakland Mall', telefono:'23334455', email:'gt@starbucks.com', horarioApertura:'06:00', horarioCierre:'22:00', estado:true, categoria:'Cafetería',
    img:'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/120px-Starbucks_Corporation_Logo_2011.svg.png',
    banner:'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80' },
  { _id:'9', nombre:'La Cabaña Steakhouse', direccion:'Zona 10, Ciudad de Guatemala', telefono:'23680099', email:'info@lacabana.com', horarioApertura:'12:00', horarioCierre:'22:00', estado:true, categoria:'Parrilla',
    img:'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&q=80',
    banner:'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80' },
  { _id:'10', nombre:'Sushi Itto', direccion:'Zona 14, Ciudad de Guatemala', telefono:'24781234', email:'gt@sushiitto.com', horarioApertura:'12:00', horarioCierre:'22:30', estado:false, categoria:'Japonesa',
    img:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=120&q=80',
    banner:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80' },
]

const EMPTY = { nombre:'', direccion:'', telefono:'', email:'', horarioApertura:'', horarioCierre:'' }

export default function AdminRestaurantes() {
  const [sidebarOpen, setSidebarOpen]   = useState(true)
  const [restaurantes, setRestaurantes] = useState(MOCK)
  const [search, setSearch]             = useState('')
  const [modal, setModal]               = useState(null)
  const [selected, setSelected]         = useState(null)
  const [form, setForm]                 = useState(EMPTY)
  const [imgPreview, setImgPreview]     = useState('')
  const [toast, setToast]               = useState(null)
  const [loading, setLoading]           = useState(false)
  const { user, logout } = useAuthStore()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const filtered = restaurantes.filter(r =>
    r.nombre.toLowerCase().includes(search.toLowerCase()) ||
    r.direccion.toLowerCase().includes(search.toLowerCase()) ||
    (r.categoria || '').toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setForm(EMPTY); setImgPreview(''); setSelected(null); setModal('create') }
  const openEdit   = (r) => { setSelected(r); setForm({ nombre:r.nombre, direccion:r.direccion, telefono:r.telefono, email:r.email, horarioApertura:r.horarioApertura, horarioCierre:r.horarioCierre }); setImgPreview(r.banner||''); setModal('edit') }
  const openDelete = (r) => { setSelected(r); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.direccion || !form.telefono || !form.email)
      return showToast('Completa todos los campos obligatorios', 'error')
    setLoading(true)
    try { await api.post('/restaurante/restaurantes', form) } catch {}
    const nuevo = { ...form, _id: Date.now().toString(), estado:true, categoria:'General', img:imgPreview||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&q=80', banner:imgPreview||'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80' }
    setRestaurantes(p => [nuevo, ...p])
    showToast('Restaurante creado exitosamente')
    closeModal()
    setLoading(false)
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await api.put(`/restaurante/restaurantes/${selected._id}`, form) } catch {}
    setRestaurantes(p => p.map(r => r._id === selected._id ? { ...r, ...form, banner:imgPreview||r.banner } : r))
    showToast('Restaurante actualizado exitosamente')
    closeModal()
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    try { await api.delete(`/restaurante/restaurantes/${selected._id}`) } catch {}
    setRestaurantes(p => p.map(r => r._id === selected._id ? { ...r, estado:false } : r))
    showToast('Restaurante desactivado')
    closeModal()
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --black:#07080a;--deep:#0d0f12;--surface:#12151a;
          --glass-bg:rgba(255,255,255,0.045);--glass-bd:rgba(255,255,255,0.09);
          --gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);
          --text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;
          --success:#4caf82;--error:#e05a5a;
          --radius-card:20px;--radius-inp:11px;
          --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
          --sidebar-w:240px;
        }
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh}
        .a-layout{display:flex;min-height:100vh}
        /* SIDEBAR */
        .a-sidebar{width:var(--sidebar-w);background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:width .3s var(--ease-out-expo);overflow:hidden}
        .a-sidebar.col{width:64px}
        .sb-brand{padding:24px 20px 20px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:80px;position:relative}
        .sb-brand::after{content:'';position:absolute;bottom:-1px;left:0;width:80px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .sb-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--gold)}
        .sb-text{overflow:hidden;white-space:nowrap}
        .sb-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text);display:block;line-height:1}
        .sb-role{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);opacity:.7;display:block;margin-top:3px}
        .sb-nav{flex:1;padding:16px 10px;overflow-y:auto;overflow-x:hidden}
        .sb-nav-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);padding:0 10px;margin:16px 0 8px;white-space:nowrap;transition:opacity .2s}
        .a-sidebar.col .sb-nav-label{opacity:0}
        .ni{display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13.5px;transition:all .2s;position:relative;white-space:nowrap;margin-bottom:2px}
        .ni:hover{background:var(--glass-bg);color:var(--text)}
        .ni.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.15)}
        .ni.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;border-radius:2px;background:var(--gold)}
        .ni-icon{flex-shrink:0;display:flex}
        .ni-text{overflow:hidden;transition:opacity .2s,width .3s}
        .a-sidebar.col .ni-text{opacity:0;width:0}
        .sb-footer{padding:16px 10px;border-top:1px solid var(--glass-bd)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);margin-bottom:8px;overflow:hidden}
        .sb-av{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold-lt);flex-shrink:0;font-family:'Cormorant Garamond',serif}
        .sb-uinfo{overflow:hidden}
        .sb-uname{font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-urole{font-size:10px;color:var(--gold);letter-spacing:.5px;text-transform:uppercase}
        .a-sidebar.col .sb-uinfo{display:none}
        .sb-out{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;width:100%;transition:all .2s;white-space:nowrap}
        .sb-out:hover{background:rgba(224,90,90,.08);color:var(--error)}
        .a-sidebar.col .sb-out span{display:none}
        .sb-toggle{position:absolute;top:50%;right:-12px;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:var(--deep);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s;z-index:101;flex-shrink:0}
        .sb-toggle:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}
        .sb-toggle svg{transition:transform .3s}
        .a-sidebar.col .sb-toggle svg{transform:rotate(180deg)}
        /* MAIN */
        .a-main{flex:1;margin-left:var(--sidebar-w);transition:margin-left .3s var(--ease-out-expo);min-height:100vh;display:flex;flex-direction:column}
        .a-main.col{margin-left:64px}
        .a-top{height:64px;background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:50}
        .top-ttl{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.5px}
        .top-sub{font-size:11px;color:var(--text-muted)}
        .top-r{display:flex;align-items:center;gap:12px}
        .top-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .top-btn:hover{color:var(--gold)}
        .a-cnt{padding:32px;flex:1}
        /* STATS ROW */
        .sr{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}
        .sp{display:flex;align-items:center;gap:10px;padding:10px 20px;background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:12px}
        .sp-v{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:500;color:var(--gold-lt)}
        .sp-l{font-size:11px;color:var(--text-muted)}
        /* TOOLBAR */
        .tb{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;gap:12px;flex-wrap:wrap}
        .sw{position:relative;flex:1;max-width:360px}
        .si{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--text-muted);pointer-events:none;display:flex}
        .sinp{width:100%;padding:10px 14px 10px 38px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:var(--radius-inp);font-family:'Outfit',sans-serif;font-size:13.5px;color:var(--text);outline:none;transition:border-color .25s}
        .sinp::placeholder{color:var(--text-muted)}
        .sinp:focus{border-color:rgba(201,168,76,.35)}
        .btn-p{position:relative;padding:10px 20px;background:linear-gradient(135deg,rgba(201,168,76,.18),rgba(201,168,76,.06));border:1px solid rgba(201,168,76,.35);border-radius:var(--radius-inp);font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:var(--gold-lt);cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .25s;overflow:hidden;white-space:nowrap}
        .btn-p::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(201,168,76,.15),transparent);transition:left .55s}
        .btn-p:hover::before{left:100%}
        .btn-p:hover{border-color:rgba(201,168,76,.6);box-shadow:0 0 24px rgba(201,168,76,.16);transform:translateY(-1px)}
        .btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none}
        /* GRID */
        .rg{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
        .rc{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden;transition:border-color .25s,transform .2s;position:relative}
        .rc:hover{border-color:rgba(201,168,76,.2);transform:translateY(-3px)}
        .rc.off{opacity:.55}
        .rbn{position:relative;height:160px;overflow:hidden}
        .rbn img{width:100%;height:100%;object-fit:cover;filter:brightness(.65) saturate(.75);transition:transform .4s}
        .rc:hover .rbn img{transform:scale(1.05)}
        .rbn-ov{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(7,8,10,.92))}
        .rlogo{position:absolute;bottom:-20px;left:20px;width:52px;height:52px;border-radius:12px;background:var(--deep);border:2px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;overflow:hidden}
        .rlogo img{width:38px;height:38px;object-fit:contain}
        .rbadge{position:absolute;top:12px;right:12px;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:500;letter-spacing:.5px}
        .rbadge.on{background:rgba(76,175,130,.15);border:1px solid rgba(76,175,130,.3);color:var(--success)}
        .rbadge.off{background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.25);color:var(--error)}
        .rb{padding:28px 20px 20px}
        .rcat{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);opacity:.8;margin-bottom:6px}
        .rname{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;color:var(--text);margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .rmeta{display:flex;flex-direction:column;gap:5px;margin-bottom:16px}
        .rmi{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)}
        .rmi svg{color:var(--gold);flex-shrink:0}
        .ract{display:flex;gap:8px;border-top:1px solid var(--glass-bd);padding-top:14px}
        .ba{flex:1;padding:8px;border-radius:9px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;border:1px solid transparent}
        .be{background:rgba(201,168,76,.08);color:var(--gold-lt);border-color:rgba(201,168,76,.18)}
        .be:hover{background:rgba(201,168,76,.16);border-color:rgba(201,168,76,.35)}
        .bd{background:rgba(224,90,90,.07);color:#f09090;border-color:rgba(224,90,90,.18)}
        .bd:hover{background:rgba(224,90,90,.14);border-color:rgba(224,90,90,.35)}
        .ba:disabled{opacity:.4;cursor:not-allowed}
        /* EMPTY */
        .es{text-align:center;padding:80px 24px;color:var(--text-muted)}
        .es-i{font-size:48px;margin-bottom:16px}
        .es-t{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--text-mid);margin-bottom:8px}
        /* MODAL */
        .mo{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(7,8,10,.78);backdrop-filter:blur(8px)}
        .mc{background:var(--deep);border:1px solid var(--glass-bd);border-radius:var(--radius-card);width:100%;max-width:520px;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 32px 80px rgba(0,0,0,.65)}
        .mc::before{content:'';position:absolute;top:0;left:0;width:120px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .mc::after{content:'';position:absolute;top:0;left:0;width:1px;height:120px;background:linear-gradient(180deg,var(--gold),transparent)}
        .mh{padding:28px 28px 0;display:flex;align-items:flex-start;justify-content:space-between}
        .mt{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:var(--text)}
        .ms{font-size:12px;color:var(--text-muted);margin-top:4px}
        .mcl{background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;border-radius:6px;transition:all .2s;display:flex}
        .mcl:hover{color:var(--error);background:rgba(224,90,90,.08)}
        .mb{padding:24px 28px 28px}
        .fg{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .ff{grid-column:1/-1}
        .fl{display:flex;flex-direction:column;gap:6px}
        .flb{font-size:10.5px;font-weight:500;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-muted);transition:color .2s}
        .fl:focus-within .flb{color:var(--gold)}
        .fi{width:100%;padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:var(--radius-inp);font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:300;color:var(--text);outline:none;transition:border-color .25s,box-shadow .25s}
        .fi::placeholder{color:var(--text-muted)}
        .fi:focus{border-color:rgba(201,168,76,.4);box-shadow:0 0 0 3px rgba(201,168,76,.08)}
        .ip{width:100%;height:140px;border-radius:12px;border:1px solid var(--glass-bd);margin-top:8px;background:var(--surface);overflow:hidden;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px}
        .ip img{width:100%;height:100%;object-fit:cover}
        .mf{display:flex;gap:10px;margin-top:20px}
        .btn-g{padding:10px 18px;background:transparent;border:1px solid rgba(255,255,255,.1);border-radius:var(--radius-inp);font-family:'Outfit',sans-serif;font-size:13px;color:var(--text-mid);cursor:pointer;transition:all .2s}
        .btn-g:hover{border-color:rgba(255,255,255,.2);color:var(--text)}
        .btn-d{padding:10px 18px;background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.3);border-radius:var(--radius-inp);font-family:'Outfit',sans-serif;font-size:13px;color:#f09090;cursor:pointer;transition:all .2s}
        .btn-d:hover{background:rgba(224,90,90,.18)}
        /* TOAST */
        .tw{position:fixed;top:24px;right:24px;z-index:999}
        .tt{padding:12px 18px;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;backdrop-filter:blur(12px);animation:tIn .3s ease both}
        .tt-s{background:rgba(76,175,130,.12);border:1px solid rgba(76,175,130,.3);color:#7dd9ae}
        .tt-e{background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.3);color:#f09090}
        @keyframes tIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        .spn{display:inline-block;width:15px;height:15px;border:1.5px solid rgba(201,168,76,.25);border-top-color:var(--gold);border-radius:50%;animation:sp .7s linear infinite}
        @keyframes sp{to{transform:rotate(360deg)}}
        @media(max-width:900px){.fg{grid-template-columns:1fr}.rg{grid-template-columns:1fr}.a-top{padding:0 16px}.a-cnt{padding:20px}}
      `}</style>

      {toast && <div className="tw"><div className={`tt tt-${toast.type}`}>{toast.msg}</div></div>}

      <div className="a-layout">
        {/* SIDEBAR */}
        <aside className={`a-sidebar ${sidebarOpen ? '' : 'col'}`}>
          <button className="sb-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><IconChevron /></button>
          <div className="sb-brand">
            <div className="sb-icon"><IconRest /></div>
            <div className="sb-text">
              <span className="sb-name">Restaurante</span>
              <span className="sb-role">Admin Panel</span>
            </div>
          </div>
          <nav className="sb-nav">
            <div className="sb-nav-label">Principal</div>
            {NAV_ITEMS.map(item => (
              <div key={item.key} className={`ni ${item.key === 'restaurantes' ? 'active' : ''}`}
                onClick={() => { if (item.href) window.location.href = item.href }}>
                <span className="ni-icon">{item.icon}</span>
                <span className="ni-text">{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="sb-user">
              <div className="sb-av">{user?.name?.[0]?.toUpperCase() || 'A'}</div>
              <div className="sb-uinfo">
                <div className="sb-uname">{user?.name || 'Admin'}</div>
                <div className="sb-urole">Administrador</div>
              </div>
            </div>
            <button className="sb-out" onClick={logout}><IconLogout /><span>Cerrar sesión</span></button>
          </div>
        </aside>

        {/* MAIN */}
        <main className={`a-main ${sidebarOpen ? '' : 'col'}`}>
          <header className="a-top">
            <div>
              <div className="top-ttl">Restaurantes</div>
              <div className="top-sub">Gestión de sucursales y locales</div>
            </div>
            <div className="top-r">
              <button className="top-btn"><IconBell /></button>
              <button className="btn-p" onClick={openCreate}><IconPlus /> Nuevo Restaurante</button>
            </div>
          </header>

          <div className="a-cnt">
            {/* STATS */}
            <div className="sr">
              <div className="sp"><span className="sp-v">{restaurantes.length}</span><span className="sp-l">Total</span></div>
              <div className="sp"><span className="sp-v" style={{color:'var(--success)'}}>{restaurantes.filter(r=>r.estado).length}</span><span className="sp-l">Activos</span></div>
              <div className="sp"><span className="sp-v" style={{color:'var(--error)'}}>{restaurantes.filter(r=>!r.estado).length}</span><span className="sp-l">Inactivos</span></div>
            </div>

            {/* TOOLBAR */}
            <div className="tb">
              <div className="sw">
                <span className="si"><IconSearch /></span>
                <input className="sinp" placeholder="Buscar restaurante, zona, categoría..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <span style={{fontSize:12,color:'var(--text-muted)'}}>{filtered.length} resultado{filtered.length!==1?'s':''}</span>
            </div>

            {/* GRID */}
            {filtered.length === 0 ? (
              <div className="es">
                <div className="es-i">🍽️</div>
                <div className="es-t">No se encontraron restaurantes</div>
                <p style={{fontSize:13}}>Intenta con otra búsqueda o agrega uno nuevo.</p>
              </div>
            ) : (
              <div className="rg">
                {filtered.map(r => (
                  <div className={`rc ${r.estado ? '' : 'off'}`} key={r._id}>
                    <div className="rbn">
                      <img src={r.banner} alt={r.nombre} onError={e => { e.target.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80' }} />
                      <div className="rbn-ov" />
                      <div className="rlogo">
                        <img src={r.img} alt="" onError={e => { e.target.style.display='none' }} />
                      </div>
                      <span className={`rbadge ${r.estado ? 'on' : 'off'}`}>{r.estado ? 'Activo' : 'Inactivo'}</span>
                    </div>
                    <div className="rb">
                      <div className="rcat">{r.categoria || 'Restaurante'}</div>
                      <div className="rname">{r.nombre}</div>
                      <div className="rmeta">
                        <div className="rmi"><IconPin />{r.direccion}</div>
                        <div className="rmi"><IconPhone />{r.telefono}</div>
                        <div className="rmi"><IconClock />{r.horarioApertura} – {r.horarioCierre}</div>
                      </div>
                      <div className="ract">
                        <button className="ba be" onClick={() => openEdit(r)}><IconEdit /> Editar</button>
                        <button className="ba bd" onClick={() => openDelete(r)} disabled={!r.estado}><IconTrash /> {r.estado ? 'Desactivar' : 'Inactivo'}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="mo" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="mc">
            <div className="mh">
              <div>
                <div className="mt">{modal === 'create' ? 'Nuevo Restaurante' : 'Editar Restaurante'}</div>
                <div className="ms">{modal === 'create' ? 'Completa la información del local' : `Editando: ${selected?.nombre}`}</div>
              </div>
              <button className="mcl" onClick={closeModal}><IconX /></button>
            </div>
            <div className="mb">
              <form onSubmit={modal === 'create' ? handleCreate : handleEdit} noValidate>
                <div className="fg">
                  <div className="fl ff">
                    <label className="flb">Nombre *</label>
                    <input className="fi" name="nombre" placeholder="Ej: La Cabaña Steakhouse" value={form.nombre} onChange={handleForm} />
                  </div>
                  <div className="fl ff">
                    <label className="flb">Dirección *</label>
                    <input className="fi" name="direccion" placeholder="Zona 10, Ciudad de Guatemala" value={form.direccion} onChange={handleForm} />
                  </div>
                  <div className="fl">
                    <label className="flb">Teléfono *</label>
                    <input className="fi" name="telefono" placeholder="23456789" value={form.telefono} onChange={handleForm} />
                  </div>
                  <div className="fl">
                    <label className="flb">Email *</label>
                    <input className="fi" type="email" name="email" placeholder="info@local.com" value={form.email} onChange={handleForm} />
                  </div>
                  <div className="fl">
                    <label className="flb">Hora Apertura</label>
                    <input className="fi" type="time" name="horarioApertura" value={form.horarioApertura} onChange={handleForm} />
                  </div>
                  <div className="fl">
                    <label className="flb">Hora Cierre</label>
                    <input className="fi" type="time" name="horarioCierre" value={form.horarioCierre} onChange={handleForm} />
                  </div>
                  <div className="fl ff">
                    <label className="flb">URL Imagen (banner)</label>
                    <input className="fi" placeholder="https://images.unsplash.com/..." value={imgPreview} onChange={e => setImgPreview(e.target.value)} />
                    <div className="ip">
                      {imgPreview
                        ? <img src={imgPreview} alt="preview" onError={e => { e.target.style.display='none' }} />
                        : <span>Vista previa del banner</span>
                      }
                    </div>
                  </div>
                </div>
                <div className="mf">
                  <button type="button" className="btn-g" onClick={closeModal}>Cancelar</button>
                  <button type="submit" className="btn-p" disabled={loading}>
                    {loading ? <span className="spn" /> : modal === 'create' ? 'Crear Restaurante' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {modal === 'delete' && selected && (
        <div className="mo" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="mc" style={{maxWidth:400}}>
            <div className="mh">
              <div>
                <div className="mt">Desactivar Restaurante</div>
                <div className="ms">Esta acción es reversible</div>
              </div>
              <button className="mcl" onClick={closeModal}><IconX /></button>
            </div>
            <div className="mb">
              <p style={{fontSize:14,color:'var(--text-mid)',lineHeight:1.6,marginBottom:12}}>
                ¿Deseas desactivar <strong style={{color:'var(--text)'}}>{selected.nombre}</strong>?
                Quedará inactivo pero no se eliminará de la base de datos.
              </p>
              <div style={{background:'rgba(224,90,90,.07)',border:'1px solid rgba(224,90,90,.2)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#f09090'}}>
                ⚠️ Los pedidos y reservaciones activas no se verán afectados.
              </div>
              <div className="mf">
                <button className="btn-g" onClick={closeModal}>Cancelar</button>
                <button className="btn-d" onClick={handleDelete} disabled={loading}>
                  {loading ? <span className="spn" /> : 'Sí, desactivar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}