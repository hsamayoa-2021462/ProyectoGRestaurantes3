import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'

const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
const IconRestaurant = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2"/></svg>
const IconStar   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
const IconPlus = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEdit = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
const IconClose = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconBox = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
const IconTag = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
const IconLeaf = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 19c0 0 2.18 1 4.68-.5 3-1.83 5.5-6 9.5-7.5 4-1.5 7-1 7-1s-1.5-5-8-2z"/><path d="M3.82 19C3 21 4 22 4 22"/></svg>
const IconWarning = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>

const NAV_ITEMS = [
  { key: 'dashboard',     label: 'Dashboard',    icon: <IconDashboard />,  path: '/admin' },
  { key: 'menu',          label: 'Menú',          icon: <IconMenu />,       path: '/admin/menu' },
  { key: 'pedidos',       label: 'Pedidos',       icon: <IconOrders />,     path: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />,      path: '/admin/reservaciones' },
  { key: 'restaurantes',  label: 'Restaurantes',  icon: <IconRestaurant />, path: '/admin/restaurantes' },
  { key: 'clientes',      label: 'Clientes',      icon: <IconUsers />,      path: '/admin/clientes' },
  { key: 'reportes',      label: 'Reportes',      icon: <IconReport />,     path: '/admin/reportes' },
  { key: 'resenas',       label: 'Reseñas',        icon: <IconStar />,    path: '/admin/resenas' },
]

const UNIDADES = ['UNIDAD', 'GRAMOS', 'KILOS', 'LITROS', 'ML']
const TABS = [
  { key: 'categorias',   label: 'Categorías',  icon: <IconTag /> },
  { key: 'platos',       label: 'Platos',       icon: <IconMenu /> },
  { key: 'ingredientes', label: 'Ingredientes', icon: <IconLeaf /> },
  { key: 'inventario',   label: 'Inventario',   icon: <IconBox /> },
]

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

export default function AdminMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || 'menu'
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

  const [activeTab, setActiveTab]       = useState('categorias')
  const [restCatFiltro, setRestCatFiltro]     = useState('') // restaurante seleccionado en sección categorías
  const [restPlatoFiltro, setRestPlatoFiltro] = useState('') // restaurante seleccionado en sección platos
  const [restInvFiltro, setRestInvFiltro]     = useState('') // restaurante seleccionado en sección inventario
  const [categorias, setCategorias]     = useState([])
  const [platos, setPlatos]             = useState([])
  const [ingredientes, setIngredientes] = useState([])
  const [inventario, setInventario]     = useState([])
  const [restaurantes, setRestaurantes] = useState([])
  const [loading, setLoading]           = useState(false)
  const [search, setSearch]             = useState('')
  const [toast, setToast]               = useState(null)
  const [modal, setModal]               = useState(null)
  const [form, setForm]                 = useState({})
  const [saving, setSaving]             = useState(false)
  const [imgPreview, setImgPreview]     = useState(null)
  const [imgFile, setImgFile]           = useState(null)
  const [subiendo, setSubiendo]         = useState(false)
  const fileInputRef                    = useRef(null)
  const [platoIngredientes, setPlatoIngredientes] = useState([])
  const [loadingPI, setLoadingPI]       = useState(false)
  const [formPI, setFormPI]             = useState({ ingrediente: '', cantidad: '' })
  const loadedRef                       = useRef(false)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const load = async () => {
    setLoading(true)
    try {
      const [catRes, platRes, ingRes, invRes, restRes] = await Promise.all([
        api.get('/menu/categorias-plato'),
        api.get('/menu/platos?disponible=true'),
        api.get('/menu/ingredientes'),
        api.get('/menu/inventario'),
        api.get('/restaurante/restaurantes'),
      ])
      setCategorias(catRes.data.data    || [])
      setPlatos(platRes.data.data       || [])
      setIngredientes(ingRes.data.data  || [])
      setInventario(invRes.data.data    || [])
      setRestaurantes(restRes.data.data || [])
    } catch { showToast('Error al cargar datos', 'error') }
    setLoading(false)
  }

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    load()
  }, [])

  const openCreate = type => {
    let preForm = {}
    if (type === 'categorias'  && restCatFiltro)  preForm = { restaurante: restCatFiltro }
    if (type === 'platos'      && restPlatoFiltro) preForm = { restaurante: restPlatoFiltro }
    if (type === 'inventario'  && restInvFiltro)  preForm = { restaurante: restInvFiltro }
    setForm(preForm)
    setModal({ type: `create-${type}` })
  }
  const openEdit   = (type, item) => {
    setForm({ ...item, restaurante: item.restaurante?._id || item.restaurante, categoria: item.categoria?._id || item.categoria, ingrediente: item.ingrediente?._id || item.ingrediente })
    setModal({ type: `edit-${type}`, item })
    if (type === 'platos') {
      setPlatoIngredientes([])
      setFormPI({ ingrediente: '', cantidad: '' })
      setLoadingPI(true)
      api.get(`/menu/platos/${item._id}/ingredientes`)
        .then(r => setPlatoIngredientes(r.data?.data || []))
        .catch(() => {})
        .finally(() => setLoadingPI(false))
    }
  }
  const closeModal = () => { setModal(null); setForm({}); setImgPreview(null); setImgFile(null); setPlatoIngredientes([]); setFormPI({ ingrediente: '', cantidad: '' }) }
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const t = modal.type
      if      (t === 'create-categorias')    { await api.post('/menu/categorias-plato', { nombre: form.nombre, descripcion: form.descripcion, restaurante: form.restaurante }); showToast('Categoría creada') }
      else if (t === 'edit-categorias')      { await api.put(`/menu/categorias-plato/${modal.item._id}`, { nombre: form.nombre, descripcion: form.descripcion }); showToast('Categoría actualizada') }
      else if (t === 'create-platos')        { await api.post('/menu/platos', { nombre: form.nombre, descripcion: form.descripcion, precio: Number(form.precio), categoria: form.categoria, restaurante: form.restaurante }); showToast('Plato creado') }
      else if (t === 'edit-platos')          { await api.put(`/menu/platos/${modal.item._id}`, { nombre: form.nombre, descripcion: form.descripcion, precio: Number(form.precio), categoria: form.categoria, disponible: form.disponible }); showToast('Plato actualizado') }
      else if (t === 'create-ingredientes')  { await api.post('/menu/ingredientes', { nombre: form.nombre, unidadMedida: form.unidadMedida || 'UNIDAD', costo: form.costo ? Number(form.costo) : undefined }); showToast('Ingrediente creado') }
      else if (t === 'edit-ingredientes')    { await api.put(`/menu/ingredientes/${modal.item._id}`, { nombre: form.nombre, unidadMedida: form.unidadMedida, costo: form.costo ? Number(form.costo) : undefined }); showToast('Ingrediente actualizado') }
      else if (t === 'create-inventario')    { await api.post('/menu/inventario', { ingrediente: form.ingrediente, restaurante: form.restaurante, cantidadActual: Number(form.cantidadActual), cantidadMinima: form.cantidadMinima ? Number(form.cantidadMinima) : 10 }); showToast('Inventario creado') }
      else if (t === 'edit-inventario')      { await api.put(`/menu/inventario/${modal.item._id}`, { cantidadActual: Number(form.cantidadActual), cantidadMinima: Number(form.cantidadMinima) }); showToast('Inventario actualizado') }
      closeModal(); load()
    } catch (err) { showToast(err.response?.data?.message || 'Error al guardar', 'error') }
    setSaving(false)
  }

  // Subir imagen del plato a Cloudinary
  const handleSubirImagen = async (platoId) => {
    if (!imgFile) return
    setSubiendo(true)
    try {
      const formData = new FormData()
      formData.append('imagen', imgFile)
      const res = await api.put(`/menu/platos/${platoId}/imagen`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const url = res.data?.data?.imagen
      if (url) setPlatos(prev => prev.map(p => p._id === platoId ? { ...p, imagen: url } : p))
      showToast('Imagen actualizada')
      setImgFile(null)
      setImgPreview(null)
    } catch { showToast('Error al subir la imagen', 'error') }
    finally { setSubiendo(false) }
  }

  // Agregar ingrediente al plato
  const handleAgregarPI = async () => {
    if (!formPI.ingrediente || !formPI.cantidad) return
    try {
      const res = await api.post(`/menu/platos/${modal.item._id}/ingredientes`, {
        ingrediente: formPI.ingrediente,
        cantidad: Number(formPI.cantidad)
      })
      const nuevo = res.data?.data
      setPlatoIngredientes(prev => {
        const existe = prev.find(p => p.ingrediente?._id === nuevo.ingrediente?._id)
        if (existe) return prev.map(p => p.ingrediente?._id === nuevo.ingrediente?._id ? nuevo : p)
        return [...prev, nuevo]
      })
      setFormPI({ ingrediente: '', cantidad: '' })
      showToast('Ingrediente agregado')
    } catch { showToast('Error al agregar ingrediente', 'error') }
  }

  // Quitar ingrediente del plato
  const handleQuitarPI = async (piId) => {
    try {
      await api.delete(`/menu/platos/${modal.item._id}/ingredientes/${piId}`)
      setPlatoIngredientes(prev => prev.filter(p => p._id !== piId))
      showToast('Ingrediente eliminado')
    } catch { showToast('Error al eliminar ingrediente', 'error') }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Deseas eliminar este registro?')) return
    try { await api.delete(`/menu/${type}/${id}`); showToast('Eliminado correctamente'); load() }
    catch (err) { showToast(err.response?.data?.message || 'No se puede eliminar', 'error') }
  }

  const filtered = (arr, keys) => {
    if (!search) return arr
    const q = search.toLowerCase()
    return arr.filter(i => keys.some(k => String(i[k] || '').toLowerCase().includes(q)))
  }

  const catFilt  = filtered(
    restCatFiltro
      ? categorias.filter(c => {
          const rid = typeof c.restaurante === 'object' ? c.restaurante?._id : c.restaurante
          return rid === restCatFiltro
        })
      : categorias,
    ['nombre', 'descripcion']
  )
  const platFilt = filtered(
    restPlatoFiltro
      ? platos.filter(p => {
          const rid = typeof p.restaurante === 'object' ? p.restaurante?._id : p.restaurante
          return rid === restPlatoFiltro
        })
      : platos,
    ['nombre', 'descripcion']
  )
  const ingFilt  = filtered(ingredientes, ['nombre', 'unidadMedida'])
  const invFilt = restInvFiltro
    ? inventario.filter(i => {
        const rid = typeof i.restaurante === 'object' ? i.restaurante?._id : i.restaurante
        return rid === restInvFiltro
      })
    : inventario

  const totalPlatos = platos.length
  const totalCat    = categorias.length
  const totalIng    = ingredientes.length
  const bajoStock   = inventario.filter(i => i.cantidadActual <= i.cantidadMinima).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--black:#07080a;--deep:#0d0f12;--surface:#12151a;--glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);--gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);--text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;--success:#4caf82;--error:#e05a5a;--radius-card:20px;--radius-inp:11px;--ease-out-expo:cubic-bezier(0.16,1,0.3,1);--sidebar-w:240px;}
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;overflow-x:hidden}
        .admin-layout{display:flex;min-height:100vh}
        .admin-sidebar{width:var(--sidebar-w);background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:width .3s var(--ease-out-expo);overflow:hidden}
        .admin-sidebar.collapsed{width:64px}
        .sidebar-brand{padding:24px 20px 20px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:80px;position:relative}
        .sidebar-brand::after{content:'';position:absolute;bottom:-1px;left:0;width:80px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--gold)}
        .brand-text{overflow:hidden;white-space:nowrap}
        .brand-text-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text);display:block;line-height:1}
        .brand-text-role{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);opacity:.7;display:block;margin-top:3px}
        .sidebar-nav{flex:1;padding:16px 10px;overflow-y:auto;overflow-x:hidden}
        .nav-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);padding:0 10px;margin:16px 0 8px;white-space:nowrap;overflow:hidden;transition:opacity .2s}
        .admin-sidebar.collapsed .nav-label{opacity:0}
        .nav-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;cursor:pointer;color:var(--text-mid);font-size:13.5px;transition:all .2s;position:relative;white-space:nowrap;margin-bottom:2px}
        .nav-item:hover{background:var(--glass-bg);color:var(--text)}
        .nav-item.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.15)}
        .nav-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;border-radius:2px;background:var(--gold)}
        .nav-icon{flex-shrink:0;display:flex}
        .nav-text{overflow:hidden;transition:opacity .2s,width .3s}
        .admin-sidebar.collapsed .nav-text{opacity:0;width:0}
        .sidebar-footer{padding:16px 10px;border-top:1px solid var(--glass-bd)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);margin-bottom:8px;overflow:hidden;cursor:pointer;transition:border-color .2s,background .2s}
        .sb-user:hover{border-color:rgba(201,168,76,.35);background:var(--gold-dim)}
        .sb-av{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold-lt);flex-shrink:0;font-family:'Cormorant Garamond',serif;overflow:hidden}
        .sb-av img{width:100%;height:100%;object-fit:cover;border-radius:7px}
        .sb-uinfo{overflow:hidden}
        .sb-uname{font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-urole{font-size:10px;color:var(--gold);letter-spacing:.5px;text-transform:uppercase}
        .admin-sidebar.collapsed .sb-uinfo{display:none}
        .sb-out{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;width:100%;transition:all .2s;white-space:nowrap}
        .sb-out:hover{background:rgba(224,90,90,.08);color:var(--error)}
        .admin-sidebar.collapsed .sb-out span{display:none}
        .sidebar-toggle{position:absolute;top:50%;right:-12px;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:var(--deep);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s;z-index:101}
        .sidebar-toggle:hover{color:var(--gold);border-color:rgba(201,168,76,.3)}
        .sidebar-toggle svg{transition:transform .3s}
        .admin-sidebar.collapsed .sidebar-toggle svg{transform:rotate(180deg)}
        .admin-main{flex:1;margin-left:var(--sidebar-w);transition:margin-left .3s var(--ease-out-expo);min-height:100vh;display:flex;flex-direction:column}
        .admin-main.collapsed{margin-left:64px}
        .admin-topbar{height:64px;background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:50}
        .topbar-left{display:flex;flex-direction:column}
        .topbar-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.5px;color:var(--text)}
        .topbar-breadcrumb{font-size:11px;color:var(--text-muted)}
        .topbar-right{display:flex;align-items:center;gap:12px}
        .topbar-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .topbar-btn:hover{color:var(--gold)}
        .topbar-date{font-size:12px;color:var(--text-muted);background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:8px;padding:6px 12px}
        .admin-content{padding:32px;flex:1}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
        .stat-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:22px;position:relative;overflow:hidden;transition:border-color .25s,transform .2s}
        .stat-card::before{content:'';position:absolute;top:0;left:0;width:60px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
        .stat-card::after{content:'';position:absolute;top:0;left:0;width:1px;height:60px;background:linear-gradient(180deg,var(--gold),transparent)}
        .stat-card:hover{border-color:rgba(201,168,76,.2);transform:translateY(-2px)}
        .stat-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .stat-icon{font-size:22px}
        .stat-value{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:500;color:var(--text);line-height:1;margin-bottom:4px}
        .stat-label{font-size:11.5px;color:var(--text-muted)}
        .stat-warn{display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:3px 8px;border-radius:20px;background:rgba(224,90,90,.1);color:var(--error)}
        .menu-tabs{display:flex;gap:4px;margin-bottom:24px;background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:14px;padding:6px;overflow-x:auto}
        .menu-tab{display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;cursor:pointer;font-size:13px;color:var(--text-muted);background:none;border:none;font-family:'Outfit',sans-serif;transition:all .2s;white-space:nowrap}
        .menu-tab:hover{color:var(--text);background:var(--glass-bg)}
        .menu-tab.active{background:var(--gold-dim);color:var(--gold-lt);border:1px solid rgba(201,168,76,.2)}
        .table-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden}
        .table-card-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--glass-bd);gap:12px;flex-wrap:wrap}
        .table-card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;color:var(--text);letter-spacing:.3px}
        .table-card-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
        .header-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .search-wrap{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:10px;padding:7px 12px}
        .search-wrap input{background:none;border:none;outline:none;color:var(--text);font-family:'Outfit',sans-serif;font-size:13px;width:180px}
        .search-wrap input::placeholder{color:var(--text-muted)}
        .search-icon{color:var(--text-muted);display:flex}
        .btn-primary{display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.3);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s;white-space:nowrap}
        .btn-primary:hover{background:linear-gradient(135deg,rgba(201,168,76,.35),rgba(201,168,76,.18));border-color:rgba(201,168,76,.5);transform:translateY(-1px)}
        .data-table{width:100%;border-collapse:collapse}
        .data-table th{padding:10px 24px;text-align:left;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid var(--glass-bd);background:rgba(255,255,255,.015)}
        .data-table td{padding:14px 24px;font-size:13px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--text);vertical-align:middle}
        .data-table tr:last-child td{border-bottom:none}
        .data-table tr:hover td{background:rgba(255,255,255,.02)}
        .cell-main{font-size:13.5px;color:var(--text)}
        .cell-sub{font-size:11.5px;color:var(--text-muted);margin-top:2px}
        .cell-mono{font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-lt)}
        .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;border:1px solid;white-space:nowrap}
        .badge-green{background:rgba(76,175,130,.1);border-color:rgba(76,175,130,.25);color:var(--success)}
        .badge-gold{background:rgba(201,168,76,.08);border-color:rgba(201,168,76,.2);color:var(--gold)}
        .badge-red{background:rgba(224,90,90,.1);border-color:rgba(224,90,90,.25);color:var(--error)}
        .action-btns{display:flex;gap:6px}
        .action-btn{width:30px;height:30px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .action-btn:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3);background:var(--gold-dim)}
        .action-btn.danger:hover{color:var(--error);border-color:rgba(224,90,90,.3);background:rgba(224,90,90,.08)}
        .loading-row td,.empty-row td{text-align:center;padding:40px;color:var(--text-muted);font-size:13px}
        .empty-icon{font-size:28px;margin-bottom:8px;opacity:.4}
        .modal-overlay{position:fixed;inset:0;background:rgba(7,8,10,.8);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px;overflow-y:auto}
        .modal-box{background:var(--deep);border:1px solid var(--glass-bd);border-radius:20px;width:100%;max-width:480px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden}
        .modal-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--glass-bd)}
        .modal-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:var(--text)}
        .modal-close{width:32px;height:32px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .2s}
        .modal-close:hover{color:var(--error)}
        .modal-body{padding:24px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;max-height:calc(90vh - 70px)}
        .form-group{display:flex;flex-direction:column;gap:6px}
        .form-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted)}
        .form-input,.form-select,.form-textarea{background:rgba(255,255,255,.04);border:1px solid var(--glass-bd);border-radius:var(--radius-inp);padding:10px 14px;color:var(--text);font-family:'Outfit',sans-serif;font-size:13.5px;outline:none;transition:border-color .2s;width:100%}
        .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:rgba(201,168,76,.4)}
        .form-select option{background:var(--deep)}
        .form-textarea{resize:vertical;min-height:80px}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:4px}
        .btn-cancel{padding:9px 18px;border-radius:10px;background:none;border:1px solid var(--glass-bd);color:var(--text-muted);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;transition:all .2s}
        .btn-cancel:hover{color:var(--text)}
        .btn-save{padding:9px 22px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.12));border:1px solid rgba(201,168,76,.35);color:var(--gold-lt);cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s}
        .btn-save:disabled{opacity:.5;cursor:not-allowed}
        .stock-bar-wrap{width:80px;height:4px;background:rgba(255,255,255,.06);border-radius:2px}
        .stock-bar{height:100%;border-radius:2px}
        .stock-bar.ok{background:linear-gradient(90deg,var(--success),#6de0ac)}
        .stock-bar.low{background:linear-gradient(90deg,var(--error),#f07070)}
        .toast{position:fixed;bottom:28px;right:28px;padding:12px 20px;border-radius:12px;font-size:13.5px;font-family:'Outfit',sans-serif;z-index:300;animation:slideUp .3s var(--ease-out-expo);border:1px solid}
        .toast-success{background:rgba(76,175,130,.15);border-color:rgba(76,175,130,.3);color:var(--success)}
        .toast-error{background:rgba(224,90,90,.15);border-color:rgba(224,90,90,.3);color:var(--error)}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:1200px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <div className="admin-layout">
        <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(p => !p)}><IconChevron /></button>
          <div className="sidebar-brand">
            <div className="brand-icon"><IconRestaurant /></div>
            <div className="brand-text">
              <span className="brand-text-name">Gastro</span>
              <span className="brand-text-role">Admin Panel</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Principal</div>
            {NAV_ITEMS.map(item => (
              <div key={item.key} className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path, item.key)}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
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

        <main className={`admin-main ${sidebarOpen ? '' : 'collapsed'}`}>
          <header className="admin-topbar">
            <div className="topbar-left">
              <span className="topbar-title">Gestión de Menú</span>
              <span className="topbar-breadcrumb">Panel de control · Menú del restaurante</span>
            </div>
            <div className="topbar-right">
              <div className="topbar-date">{new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
              <button className="topbar-btn"><IconBell /></button>
            </div>
          </header>

          <div className="admin-content">
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-header"><span className="stat-icon">🍽️</span></div><div className="stat-value">{totalPlatos}</div><div className="stat-label">Platos Disponibles</div></div>
              <div className="stat-card"><div className="stat-header"><span className="stat-icon">🏷️</span></div><div className="stat-value">{totalCat}</div><div className="stat-label">Categorías</div></div>
              <div className="stat-card"><div className="stat-header"><span className="stat-icon">🌿</span></div><div className="stat-value">{totalIng}</div><div className="stat-label">Ingredientes</div></div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-icon">📦</span>{bajoStock > 0 && <span className="stat-warn"><IconWarning /> {bajoStock} bajo stock</span>}</div>
                <div className="stat-value">{inventario.length}</div><div className="stat-label">Registros de Inventario</div>
              </div>
            </div>

            <div className="menu-tabs">
              {TABS.map(t => (
                <button key={t.key} className={`menu-tab ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => { setActiveTab(t.key); setSearch('') }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'categorias' && (
              <div className="table-card">
                <div className="table-card-header">
                  <div>
                    <div className="table-card-title">Categorías de Platos</div>
                    <div className="table-card-sub">{catFilt.length} categorías{restCatFiltro ? ` en ${restaurantes.find(r => r._id === restCatFiltro)?.nombre}` : ' registradas'}</div>
                  </div>
                  <div className="header-actions">
                    <div className="search-wrap"><span className="search-icon"><IconSearch /></span><input placeholder="Buscar categoría..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                    {/* Selector de restaurante — filtra la lista Y preselecciona al crear */}
                    <select
                      value={restCatFiltro}
                      onChange={e => setRestCatFiltro(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)',
                        borderRadius: 10, padding: '8px 14px', color: restCatFiltro ? 'var(--gold-lt)' : 'var(--text-muted)',
                        fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: 'pointer', outline: 'none',
                        borderColor: restCatFiltro ? 'rgba(201,168,76,.35)' : 'rgba(255,255,255,.09)',
                      }}>
                      <option value="">Todos los restaurantes</option>
                      {restaurantes.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
                    </select>
                    <button className="btn-primary"
                      onClick={() => openCreate('categorias')}
                      title={restCatFiltro ? `Agregar categoría en ${restaurantes.find(r=>r._id===restCatFiltro)?.nombre}` : 'Selecciona un restaurante primero'}>
                      <IconPlus /> Nueva Categoría
                    </button>
                  </div>
                </div>
                <table className="data-table">
                  <thead><tr><th>Nombre</th><th>Descripción</th><th>Restaurante</th><th>Creado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {loading ? <tr className="loading-row"><td colSpan={5}>Cargando...</td></tr>
                      : catFilt.length === 0 ? <tr className="empty-row"><td colSpan={5}><div className="empty-icon">🏷️</div><div>Sin categorías</div></td></tr>
                      : catFilt.map(c => (
                        <tr key={c._id}>
                          <td><div className="cell-main">{c.nombre}</div></td>
                          <td><div className="cell-sub">{c.descripcion || '—'}</div></td>
                          <td><span className="badge badge-gold">{c.restaurante?.nombre || '—'}</span></td>
                          <td><div className="cell-sub">{new Date(c.createdAt).toLocaleDateString('es-GT')}</div></td>
                          <td><div className="action-btns"><button className="action-btn" onClick={() => openEdit('categorias', c)}><IconEdit /></button><button className="action-btn danger" onClick={() => handleDelete('categorias-plato', c._id)}><IconTrash /></button></div></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'platos' && (
              <div className="table-card">
                <div className="table-card-header">
                  <div>
                    <div className="table-card-title">Platos del Menú</div>
                    <div className="table-card-sub">{platFilt.length} platos{restPlatoFiltro ? ` en ${restaurantes.find(r => r._id === restPlatoFiltro)?.nombre}` : ' disponibles'}</div>
                  </div>
                  <div className="header-actions">
                    <div className="search-wrap"><span className="search-icon"><IconSearch /></span><input placeholder="Buscar plato..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <select
                      value={restPlatoFiltro}
                      onChange={e => setRestPlatoFiltro(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)',
                        borderRadius: 10, padding: '8px 14px', color: restPlatoFiltro ? 'var(--gold-lt)' : 'var(--text-muted)',
                        fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: 'pointer', outline: 'none',
                        borderColor: restPlatoFiltro ? 'rgba(201,168,76,.35)' : 'rgba(255,255,255,.09)',
                      }}>
                      <option value="">Todos los restaurantes</option>
                      {restaurantes.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
                    </select>
                    <button className="btn-primary" onClick={() => openCreate('platos')}
                      title={restPlatoFiltro ? `Agregar plato en ${restaurantes.find(r=>r._id===restPlatoFiltro)?.nombre}` : 'Selecciona un restaurante primero'}>
                      <IconPlus /> Nuevo Plato
                    </button>
                  </div>
                </div>
                <table className="data-table">
                  <thead><tr><th>Nombre</th><th>Categoría</th><th>Restaurante</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {loading ? <tr className="loading-row"><td colSpan={6}>Cargando...</td></tr>
                      : platFilt.length === 0 ? <tr className="empty-row"><td colSpan={6}><div className="empty-icon">🍽️</div><div>Sin platos</div></td></tr>
                      : platFilt.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {p.imagen
                                ? <img src={p.imagen} alt={p.nombre} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--glass-bd)' }} />
                                : <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--glass-bg)', border: '1px solid var(--glass-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🍽️</div>
                              }
                              <div>
                                <div className="cell-main">{p.nombre}</div>
                                <div className="cell-sub">{p.descripcion?.substring(0, 40) || '—'}{p.descripcion?.length > 40 ? '…' : ''}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge badge-gold">{p.categoria?.nombre || '—'}</span></td>
                          <td><div className="cell-sub">{p.restaurante?.nombre || '—'}</div></td>
                          <td><div className="cell-mono">Q {Number(p.precio).toFixed(2)}</div></td>
                          <td><span className={`badge ${p.disponible ? 'badge-green' : 'badge-red'}`}>{p.disponible ? 'Disponible' : 'No disponible'}</span></td>
                          <td><div className="action-btns"><button className="action-btn" onClick={() => openEdit('platos', p)}><IconEdit /></button><button className="action-btn danger" onClick={() => handleDelete('platos', p._id)}><IconTrash /></button></div></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'ingredientes' && (
              <div className="table-card">
                <div className="table-card-header">
                  <div>
                    <div className="table-card-title">Ingredientes</div>
                    <div className="table-card-sub">{ingFilt.length} ingredientes registrados</div>
                  </div>
                  <div className="header-actions">
                    <div className="search-wrap"><span className="search-icon"><IconSearch /></span><input placeholder="Buscar ingrediente..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <button className="btn-primary" onClick={() => openCreate('ingredientes')}><IconPlus /> Nuevo Ingrediente</button>
                  </div>
                </div>
                <table className="data-table">
                  <thead><tr><th>Nombre</th><th>Unidad de Medida</th><th>Costo</th><th>Registrado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {loading ? <tr className="loading-row"><td colSpan={5}>Cargando...</td></tr>
                      : ingFilt.length === 0 ? <tr className="empty-row"><td colSpan={5}><div className="empty-icon">🌿</div><div>Sin ingredientes</div></td></tr>
                      : ingFilt.map(i => (
                        <tr key={i._id}>
                          <td><div className="cell-main">{i.nombre}</div></td>
                          <td><span className="badge badge-gold">{i.unidadMedida}</span></td>
                          <td><div className="cell-mono">{i.costo != null ? `Q ${Number(i.costo).toFixed(2)}` : '—'}</div></td>
                          <td><div className="cell-sub">{new Date(i.createdAt).toLocaleDateString('es-GT')}</div></td>
                          <td><div className="action-btns"><button className="action-btn" onClick={() => openEdit('ingredientes', i)}><IconEdit /></button><button className="action-btn danger" onClick={() => handleDelete('ingredientes', i._id)}><IconTrash /></button></div></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'inventario' && (
              <div className="table-card">
                <div className="table-card-header">
                  <div>
                    <div className="table-card-title">Inventario</div>
                    <div className="table-card-sub">
                      {invFilt.length} registros · {bajoStock} bajo stock
                      {restInvFiltro ? ` · ${restaurantes.find(r => r._id === restInvFiltro)?.nombre}` : ''}
                    </div>
                  </div>
                  <div className="header-actions">
                    <div className="search-wrap"><span className="search-icon"><IconSearch /></span><input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <select
                      value={restInvFiltro}
                      onChange={e => setRestInvFiltro(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)',
                        borderRadius: 10, padding: '8px 14px', color: restInvFiltro ? 'var(--gold-lt)' : 'var(--text-muted)',
                        fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: 'pointer', outline: 'none',
                        borderColor: restInvFiltro ? 'rgba(201,168,76,.35)' : 'rgba(255,255,255,.09)',
                      }}>
                      <option value="">Todos los restaurantes</option>
                      {restaurantes.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
                    </select>
                    <button className="btn-primary" onClick={() => openCreate('inventario')}>
                      <IconPlus /> Nuevo Registro
                    </button>
                  </div>
                </div>
                <table className="data-table">
                  <thead><tr><th>Ingrediente</th><th>Restaurante</th><th>Cantidad Actual</th><th>Cantidad Mínima</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {loading ? <tr className="loading-row"><td colSpan={6}>Cargando...</td></tr>
                      : invFilt.length === 0 ? <tr className="empty-row"><td colSpan={6}><div className="empty-icon">📦</div><div>Sin registros</div></td></tr>
                      : invFilt.map(inv => {
                        const isLow = inv.cantidadActual <= inv.cantidadMinima
                        const pct = Math.min(100, Math.round((inv.cantidadActual / Math.max(inv.cantidadMinima * 2, 1)) * 100))
                        return (
                          <tr key={inv._id}>
                            <td><div className="cell-main">{inv.ingrediente?.nombre || '—'}</div><div className="cell-sub">{inv.ingrediente?.unidadMedida || ''}</div></td>
                            <td><span className="badge badge-gold">{inv.restaurante?.nombre || '—'}</span></td>
                            <td><div className="cell-mono">{inv.cantidadActual}</div><div className="stock-bar-wrap" style={{ marginTop: 4 }}><div className={`stock-bar ${isLow ? 'low' : 'ok'}`} style={{ width: `${pct}%` }} /></div></td>
                            <td><div className="cell-sub">{inv.cantidadMinima}</div></td>
                            <td><span className={`badge ${isLow ? 'badge-red' : 'badge-green'}`}>{isLow ? 'Bajo stock' : 'OK'}</span></td>
                            <td><div className="action-btns"><button className="action-btn" onClick={() => openEdit('inventario', inv)}><IconEdit /></button><button className="action-btn danger" onClick={() => handleDelete('inventario', inv._id)}><IconTrash /></button></div></td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {(modal?.type === 'create-categorias' || modal?.type === 'edit-categorias') && (
        <Modal title={modal.type === 'create-categorias' ? 'Nueva Categoría' : 'Editar Categoría'} onClose={closeModal}>

          {/* Si viene preseleccionado del filtro, mostrar como info — sino como selector */}
          {modal.type === 'create-categorias' && (
            <div className="form-group">
              <label className="form-label">Restaurante *</label>
              {form.restaurante
                ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.25)', borderRadius: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--gold-lt)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      ✓ {restaurantes.find(r => r._id === form.restaurante)?.nombre}
                    </span>
                    <button type="button" onClick={() => sf('restaurante', '')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11 }}>
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <select className="form-select" value={form.restaurante || ''}
                    onChange={e => sf('restaurante', e.target.value)}>
                    <option value="">Seleccionar restaurante...</option>
                    {restaurantes.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
                  </select>
                )
              }
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre de la categoría *</label>
            <input className="form-input"
              value={form.nombre || ''}
              onChange={e => sf('nombre', e.target.value)}
              placeholder="Ej: Entradas, Bebidas, Postres..."
              disabled={modal.type === 'create-categorias' && !form.restaurante}
              style={{ opacity: modal.type === 'create-categorias' && !form.restaurante ? .4 : 1 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-textarea"
              value={form.descripcion || ''}
              onChange={e => sf('descripcion', e.target.value)}
              placeholder="Descripción opcional..."
              disabled={modal.type === 'create-categorias' && !form.restaurante}
              style={{ opacity: modal.type === 'create-categorias' && !form.restaurante ? .4 : 1 }}
            />
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
            <button className="btn-save" onClick={handleSave}
              disabled={saving || (modal.type === 'create-categorias' && (!form.restaurante || !form.nombre))}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </Modal>
      )}

      {(modal?.type === 'create-platos' || modal?.type === 'edit-platos') && (
        <Modal title={modal.type === 'create-platos' ? 'Nuevo Plato' : 'Editar Plato'} onClose={closeModal}>
          <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" value={form.nombre || ''} onChange={e => sf('nombre', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Descripción</label><textarea className="form-textarea" value={form.descripcion || ''} onChange={e => sf('descripcion', e.target.value)} /></div>

          {/* Restaurante — solo en crear */}
          {modal.type === 'create-platos' && (
            <div className="form-group">
              <label className="form-label">Restaurante *</label>
              {form.restaurante
                ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.25)', borderRadius: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--gold-lt)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      ✓ {restaurantes.find(r => r._id === form.restaurante)?.nombre}
                    </span>
                    <button type="button" onClick={() => { sf('restaurante', ''); sf('categoria', '') }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11 }}>
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <select className="form-select" value={form.restaurante || ''}
                    onChange={e => { sf('restaurante', e.target.value); sf('categoria', '') }}>
                    <option value="">Seleccionar restaurante...</option>
                    {restaurantes.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
                  </select>
                )
              }
            </div>
          )}

          <div className="form-row">
            <div className="form-group"><label className="form-label">Precio (Q) *</label><input className="form-input" type="number" min="0" step="0.01" value={form.precio || ''} onChange={e => sf('precio', e.target.value)} /></div>
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select className="form-select" value={form.categoria || ''}
                onChange={e => sf('categoria', e.target.value)}
                disabled={modal.type === 'create-platos' && !form.restaurante}>
                <option value="">
                  {modal.type === 'create-platos' && !form.restaurante
                    ? 'Primero selecciona un restaurante'
                    : 'Seleccionar categoría...'}
                </option>
                {categorias
                  .filter(c => {
                    if (!form.restaurante) return false
                    const rid = typeof c.restaurante === 'object' ? c.restaurante?._id : c.restaurante
                    return rid === form.restaurante
                  })
                  .map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)
                }
              </select>
              {modal.type === 'create-platos' && form.restaurante && categorias.filter(c => {
                const rid = typeof c.restaurante === 'object' ? c.restaurante?._id : c.restaurante
                return rid === form.restaurante
              }).length === 0 && (
                <span style={{ fontSize: 11, color: 'var(--error)', marginTop: 4 }}>
                  Este restaurante no tiene categorías. Crea una primero.
                </span>
              )}
            </div>
          </div>

          {modal.type === 'edit-platos' && <div className="form-group"><label className="form-label">Disponible</label><select className="form-select" value={form.disponible ? 'true' : 'false'} onChange={e => sf('disponible', e.target.value === 'true')}><option value="true">Disponible</option><option value="false">No disponible</option></select></div>}
          {modal.type === 'edit-platos' && (
            <div className="form-group">
              <label className="form-label">Imagen del plato</label>
              {(imgPreview || form.imagen) && (
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <img src={imgPreview || form.imagen} alt="preview"
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--glass-bd)' }} />
                  {imgPreview && (
                    <button type="button" onClick={() => { setImgPreview(null); setImgFile(null) }}
                      style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(7,8,10,.7)', border: '1px solid var(--glass-bd)', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 8px', fontSize: 11 }}>
                      ✕ Quitar
                    </button>
                  )}
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid var(--glass-bd)', borderRadius: 10, padding: '8px 14px', color: 'var(--text-muted)', width: '100%', cursor: 'pointer' }}
                onChange={e => {
                  const file = e.target.files[0]
                  if (!file) return
                  setImgFile(file)
                  setImgPreview(URL.createObjectURL(file))
                }} />
              {imgFile && (
                <button type="button"
                  onClick={() => handleSubirImagen(modal.item._id)}
                  disabled={subiendo}
                  style={{ marginTop: 8, padding: '8px 16px', borderRadius: 9, background: 'linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.08))', border: '1px solid rgba(201,168,76,.3)', color: 'var(--gold-lt)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: 12, width: '100%' }}>
                  {subiendo ? 'Subiendo...' : '📸 Subir imagen'}
                </button>
              )}
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>JPG, PNG o WEBP · Máx 5MB</span>
            </div>
          )}
          {/* ── SECCIÓN INGREDIENTES / RECETA ── */}
          {modal.type === 'edit-platos' && (
            <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 16 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                🧂 Ingredientes de la receta
              </label>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                Define qué ingredientes y qué cantidad se necesita para preparar este plato. El inventario se descontará automáticamente con cada pedido.
              </div>

              {/* Lista de ingredientes actuales */}
              {loadingPI ? (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>Cargando ingredientes...</div>
              ) : platoIngredientes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                  {platoIngredientes.map(pi => (
                    <div key={pi._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,.03)', border: '1px solid var(--glass-bd)', borderRadius: 9 }}>
                      <div>
                        <span style={{ fontSize: 13, color: 'var(--text)' }}>{pi.ingrediente?.nombre || '—'}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                          {pi.cantidad} {pi.ingrediente?.unidadMedida || 'u.'}
                        </span>
                      </div>
                      <button type="button" onClick={() => handleQuitarPI(pi._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontStyle: 'italic' }}>
                  Sin ingredientes asignados aún
                </div>
              )}

              {/* Agregar nuevo ingrediente */}
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={formPI.ingrediente}
                  onChange={e => setFormPI(p => ({ ...p, ingrediente: e.target.value }))}
                  className="form-select"
                  style={{ flex: 2 }}>
                  <option value="">Ingrediente...</option>
                  {ingredientes.map(i => <option key={i._id} value={i._id}>{i.nombre} ({i.unidadMedida})</option>)}
                </select>
                <input type="number" min="0.01" step="0.01" placeholder="Cant."
                  value={formPI.cantidad}
                  onChange={e => setFormPI(p => ({ ...p, cantidad: e.target.value }))}
                  style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid var(--glass-bd)', borderRadius: 9, padding: '8px 12px', color: 'var(--text)', fontFamily: "'Outfit',sans-serif", fontSize: 13, outline: 'none' }} />
                <button type="button" onClick={handleAgregarPI}
                  disabled={!formPI.ingrediente || !formPI.cantidad}
                  style={{ padding: '8px 14px', borderRadius: 9, background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,.3)', color: 'var(--gold-lt)', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>
                  + Agregar
                </button>
              </div>
            </div>
          )}

          <div className="form-actions"><button className="btn-cancel" onClick={closeModal}>Cancelar</button><button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button></div>
        </Modal>
      )}

      {(modal?.type === 'create-ingredientes' || modal?.type === 'edit-ingredientes') && (
        <Modal title={modal.type === 'create-ingredientes' ? 'Nuevo Ingrediente' : 'Editar Ingrediente'} onClose={closeModal}>

          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" value={form.nombre || ''} onChange={e => sf('nombre', e.target.value)} placeholder="Ej: Harina, Pepperoni, Tomate..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Unidad de Medida</label>
              <select className="form-select" value={form.unidadMedida || 'UNIDAD'} onChange={e => sf('unidadMedida', e.target.value)}>
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Costo (Q)</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.costo || ''} onChange={e => sf('costo', e.target.value)} placeholder="0.00" />
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.03)', border: '1px solid var(--glass-bd)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            🌐 Los ingredientes son globales y están disponibles para todos los restaurantes. Para asignar stock por restaurante, usa la sección <strong style={{ color: 'var(--text-mid)' }}>Inventario</strong>.
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
            <button className="btn-save" onClick={handleSave} disabled={saving || !form.nombre}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </Modal>
      )}

      {(modal?.type === 'create-inventario' || modal?.type === 'edit-inventario') && (
        <Modal title={modal.type === 'create-inventario' ? 'Nuevo Registro de Inventario' : 'Actualizar Inventario'} onClose={closeModal}>
          {modal.type === 'create-inventario' && <>
            {/* Restaurante — preseleccionado si viene del filtro */}
            <div className="form-group">
              <label className="form-label">Restaurante *</label>
              {form.restaurante
                ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.25)', borderRadius: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--gold-lt)' }}>
                      ✓ {restaurantes.find(r => r._id === form.restaurante)?.nombre}
                    </span>
                    <button type="button" onClick={() => sf('restaurante', '')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11 }}>
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <select className="form-select" value={form.restaurante || ''} onChange={e => sf('restaurante', e.target.value)}>
                    <option value="">Seleccionar restaurante...</option>
                    {restaurantes.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
                  </select>
                )
              }
            </div>
            <div className="form-group">
              <label className="form-label">Ingrediente *</label>
              <select className="form-select" value={form.ingrediente || ''} onChange={e => sf('ingrediente', e.target.value)}>
                <option value="">Seleccionar ingrediente...</option>
                {ingredientes.map(i => <option key={i._id} value={i._id}>{i.nombre} ({i.unidadMedida})</option>)}
              </select>
            </div>
          </>}
          <div className="form-row">
            <div className="form-group"><label className="form-label">Cantidad Actual *</label><input className="form-input" type="number" min="0" value={form.cantidadActual ?? ''} onChange={e => sf('cantidadActual', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Cantidad Mínima</label><input className="form-input" type="number" min="0" value={form.cantidadMinima ?? ''} onChange={e => sf('cantidadMinima', e.target.value)} placeholder="10" /></div>
          </div>
          <div className="form-actions"><button className="btn-cancel" onClick={closeModal}>Cancelar</button><button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button></div>
        </Modal>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  )
}