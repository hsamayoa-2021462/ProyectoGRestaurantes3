import { useState, useEffect } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import api from '../../../shared/api/api'
import NotificacionesPanel from '../../../shared/components/NotificacionesPanel'

/* ─── ICONS ─── */
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconStar   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconRest = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const IconDash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
const IconEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></svg>
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IconClock = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const IconPin = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
const IconPhone = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
const IconChair = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 7V4a2 2 0 012-2h12a2 2 0 012 2v3" /><path d="M4 7h16v4H4z" /><path d="M8 11v9M16 11v9M8 20h8" /></svg>
const IconArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
const IconImage = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: <IconDash />, href: '/admin' },
  { key: 'menu', label: 'Menú', icon: <IconMenu />, href: '/admin/menu' },
  { key: 'pedidos', label: 'Pedidos', icon: <IconOrders />, href: '/admin/pedidos' },
  { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />, href: '/admin/reservaciones' },
  { key: 'restaurantes', label: 'Restaurantes', icon: <IconRest />, href: '/admin/restaurantes' },
  { key: 'clientes', label: 'Clientes', icon: <IconUsers />, href: '/admin/clientes' },
  { key: 'reportes', label: 'Reportes', icon: <IconReport />, href: '/admin/reportes' },
  { key: 'resenas',       label: 'Reseñas',        icon: <IconStar />,    path: '/admin/resenas' },
]

const EMPTY_REST = { nombre: '', direccion: '', telefono: '', email: '', horarioApertura: '', horarioCierre: '' }
const EMPTY_MESA = { numeroMesa: '', capacidad: '', ubicacion: 'INTERIOR', estado: 'DISPONIBLE' }

const UBICACIONES = ['INTERIOR', 'TERRAZA', 'VIP']
const ESTADOS_MESA = ['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO']

const ESTADO_MESA_COLOR = {
  DISPONIBLE: { bg: 'rgba(76,175,130,.12)', bd: 'rgba(76,175,130,.3)', tx: '#7dd9ae' },
  OCUPADA: { bg: 'rgba(224,90,90,.1)', bd: 'rgba(224,90,90,.3)', tx: '#f09090' },
  RESERVADA: { bg: 'rgba(201,168,76,.08)', bd: 'rgba(201,168,76,.3)', tx: '#e8c96a' },
  MANTENIMIENTO: { bg: 'rgba(120,120,140,.12)', bd: 'rgba(120,120,140,.3)', tx: '#aaa' },
}

/* ─── SIDEBAR ─── */
function Sidebar({ collapsed, onToggle, user, onLogout }) {
  return (
    <aside className={`a-sidebar${collapsed ? ' col' : ''}`}>
      <div className="sb-brand">
        <div className="sb-icon"><IconRest /></div>
        <div className="sb-text">
          <span className="sb-name">Gastro</span>
          <span className="sb-role">Admin Panel</span>
        </div>
        <button className="sb-toggle" onClick={onToggle}><IconChevron /></button>
      </div>
      <nav className="sb-nav">
        <div className="sb-nav-label">Navegación</div>
        {NAV_ITEMS.map(n => (
          <div key={n.key} className={`ni${n.key === 'restaurantes' ? ' active' : ''}`}
            onClick={() => window.location.href = n.href}>
            <span className="ni-icon">{n.icon}</span>
            <span className="ni-text">{n.label}</span>
          </div>
        ))}
      </nav>
      <div className="sb-footer">
        <div className="sb-user" style={{ cursor: 'pointer' }}
          onClick={() => navigate('/admin/perfil')}>
          <div className="sb-av">{(user?.nombre || 'A')[0].toUpperCase()}</div>
          <div className="sb-uinfo">
            <div className="sb-uname">{user?.nombre || 'Administrador'}</div>
            <div className="sb-urole">Admin</div>
          </div>
        </div>
        <button className="sb-out" onClick={onLogout}>
          <IconLogout /><span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

/* ─── MODAL ─── */
function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="mo" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mc">
        <div className="mh">
          <div>
            <div className="mt">{title}</div>
            {subtitle && <div className="ms">{subtitle}</div>}
          </div>
          <button className="mcl" onClick={onClose}><IconX /></button>
        </div>
        <div className="mb">{children}</div>
      </div>
    </div>
  )
}

/* ─── TOAST ─── */
function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className="tw">
      <div className={`tt ${toast.type === 'error' ? 'tt-e' : 'tt-s'}`}>{toast.msg}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   VISTA: GESTIÓN DE MESAS (sub-vista)
═══════════════════════════════════════════════ */
function MesasView({ restaurante, onBack, showToast }) {
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_MESA)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/restaurante/mesas?restaurante=${restaurante._id}`)
        const data = res.data
        setMesas(Array.isArray(data) ? data : (data.mesas || data.data || []))
      } catch {
        showToast('Error al cargar las mesas', 'error')
        setMesas([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [restaurante._id])

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value })
  const openCreate = () => { setForm(EMPTY_MESA); setSelected(null); setModal('create') }
  const openEdit = m => { setSelected(m); setForm({ numeroMesa: m.numeroMesa, capacidad: m.capacidad, ubicacion: m.ubicacion, estado: m.estado }); setModal('edit') }
  const openDelete = m => { setSelected(m); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const handleCreate = async e => {
    e.preventDefault()
    if (!form.numeroMesa || !form.capacidad) return showToast('Número y capacidad son requeridos', 'error')
    setSaving(true)
    try {
      const res = await api.post('/restaurante/mesas', {
        restaurante: restaurante._id,
        numeroMesa: Number(form.numeroMesa),
        capacidad: Number(form.capacidad),
        ubicacion: form.ubicacion,
        estado: form.estado,
      })
      const nueva = res.data?.mesa || res.data?.data || res.data
      setMesas(p => [nueva, ...p])
      showToast('Mesa creada exitosamente')
      closeModal()
    } catch (err) {
      showToast(err?.response?.data?.msg || 'Error al crear la mesa', 'error')
    } finally { setSaving(false) }
  }

  const handleEdit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put(`/restaurante/mesas/${selected._id}`, {
        numeroMesa: Number(form.numeroMesa),
        capacidad: Number(form.capacidad),
        ubicacion: form.ubicacion,
        estado: form.estado,
      })
      const actualizada = res.data?.mesa || res.data?.data || { ...selected, ...form }
      setMesas(p => p.map(m => m._id === selected._id ? actualizada : m))
      showToast('Mesa actualizada')
      closeModal()
    } catch (err) {
      showToast(err?.response?.data?.msg || 'Error al actualizar', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/restaurante/mesas/${selected._id}`)
      setMesas(p => p.filter(m => m._id !== selected._id))
      showToast('Mesa eliminada')
      closeModal()
    } catch (err) {
      showToast(err?.response?.data?.msg || 'Error al eliminar', 'error')
    } finally { setSaving(false) }
  }

  const disponibles = mesas.filter(m => m.estado === 'DISPONIBLE').length
  const ocupadas = mesas.filter(m => m.estado === 'OCUPADA').length
  const reservadas = mesas.filter(m => m.estado === 'RESERVADA').length

  return (
    <>
      <div className="mesa-header">
        <button className="btn-back" onClick={onBack}>
          <IconArrowLeft /> Volver a restaurantes
        </button>
        <div className="mesa-title-row">
          <div>
            <h2 className="mesa-title">Mesas — <span style={{ color: 'var(--gold)' }}>{restaurante.nombre}</span></h2>
            <p className="mesa-subtitle">{restaurante.direccion}</p>
          </div>
          <button className="btn-p" onClick={openCreate}><IconPlus /> Nueva Mesa</button>
        </div>
      </div>

      <div className="sr" style={{ marginBottom: 24 }}>
        <div className="sp"><div><div className="sp-v">{mesas.length}</div><div className="sp-l">Total Mesas</div></div></div>
        <div className="sp"><div><div className="sp-v" style={{ color: '#7dd9ae' }}>{disponibles}</div><div className="sp-l">Disponibles</div></div></div>
        <div className="sp"><div><div className="sp-v" style={{ color: '#f09090' }}>{ocupadas}</div><div className="sp-l">Ocupadas</div></div></div>
        <div className="sp"><div><div className="sp-v" style={{ color: '#e8c96a' }}>{reservadas}</div><div className="sp-l">Reservadas</div></div></div>
      </div>

      {loading ? (
        <div className="es"><div className="spn" style={{ width: 32, height: 32, borderWidth: 2 }} /><p style={{ marginTop: 16 }}>Cargando mesas...</p></div>
      ) : mesas.length === 0 ? (
        <div className="es">
          <div className="es-i">🪑</div>
          <div className="es-t">Sin mesas registradas</div>
          <p style={{ fontSize: 13, marginTop: 6 }}>Crea la primera mesa para este restaurante</p>
          <button className="btn-p" style={{ margin: '20px auto 0', display: 'flex' }} onClick={openCreate}><IconPlus /> Nueva Mesa</button>
        </div>
      ) : (
        <div className="mesa-grid">
          {mesas.map(m => {
            const col = ESTADO_MESA_COLOR[m.estado] || ESTADO_MESA_COLOR.DISPONIBLE
            return (
              <div key={m._id} className="mesa-card">
                <div className="mesa-card-top">
                  <div className="mesa-num">#{m.numeroMesa}</div>
                  <div className="mesa-badge" style={{ background: col.bg, border: `1px solid ${col.bd}`, color: col.tx }}>
                    {m.estado}
                  </div>
                </div>
                <div className="mesa-info">
                  <div className="mesa-info-row"><IconChair /><span>{m.capacidad} personas</span></div>
                  <div className="mesa-info-row"><IconPin /><span>{m.ubicacion}</span></div>
                </div>
                <div className="ract" style={{ marginTop: 12 }}>
                  <button className="ba be" onClick={() => openEdit(m)}><IconEdit /> Editar</button>
                  <button className="ba bd" onClick={() => openDelete(m)}><IconTrash /> Eliminar</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Nueva Mesa" subtitle={`Para ${restaurante.nombre}`} onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <div className="fg">
              <div className="fl">
                <label className="flb">Número de Mesa *</label>
                <input className="fi" name="numeroMesa" type="number" min="1" value={form.numeroMesa}
                  onChange={handleForm} placeholder="Ej: 1" required />
              </div>
              <div className="fl">
                <label className="flb">Capacidad (personas) *</label>
                <input className="fi" name="capacidad" type="number" min="1" value={form.capacidad}
                  onChange={handleForm} placeholder="Ej: 4" required />
              </div>
              <div className="fl">
                <label className="flb">Ubicación</label>
                <select className="fi" name="ubicacion" value={form.ubicacion} onChange={handleForm}>
                  {UBICACIONES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="fl">
                <label className="flb">Estado inicial</label>
                <select className="fi" name="estado" value={form.estado} onChange={handleForm}>
                  {ESTADOS_MESA.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="mf">
              <button type="button" className="btn-g" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn-p" disabled={saving}>
                {saving ? <span className="spn" /> : <IconPlus />} Crear Mesa
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && selected && (
        <Modal title="Editar Mesa" subtitle={`Mesa #${selected.numeroMesa} — ${restaurante.nombre}`} onClose={closeModal}>
          <form onSubmit={handleEdit}>
            <div className="fg">
              <div className="fl">
                <label className="flb">Número de Mesa *</label>
                <input className="fi" name="numeroMesa" type="number" min="1" value={form.numeroMesa} onChange={handleForm} required />
              </div>
              <div className="fl">
                <label className="flb">Capacidad (personas) *</label>
                <input className="fi" name="capacidad" type="number" min="1" value={form.capacidad} onChange={handleForm} required />
              </div>
              <div className="fl">
                <label className="flb">Ubicación</label>
                <select className="fi" name="ubicacion" value={form.ubicacion} onChange={handleForm}>
                  {UBICACIONES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="fl">
                <label className="flb">Estado</label>
                <select className="fi" name="estado" value={form.estado} onChange={handleForm}>
                  {ESTADOS_MESA.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="mf">
              <button type="button" className="btn-g" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn-p" disabled={saving}>
                {saving ? <span className="spn" /> : <IconEdit />} Guardar Cambios
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && selected && (
        <Modal title="Eliminar Mesa" subtitle="Esta acción no se puede deshacer" onClose={closeModal}>
          <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 20 }}>
            ¿Eliminar la <strong style={{ color: 'var(--text)' }}>Mesa #{selected.numeroMesa}</strong> ({selected.ubicacion}, {selected.capacidad} personas)?
          </p>
          <div className="mf">
            <button className="btn-g" onClick={closeModal}>Cancelar</button>
            <button className="btn-d" onClick={handleDelete} disabled={saving}>
              {saving ? <span className="spn" /> : null} Eliminar Mesa
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════
   VISTA PRINCIPAL: RESTAURANTES
═══════════════════════════════════════════════ */
export default function AdminRestaurantes() {
  const [collapsed, setCollapsed] = useState(false)
  const [restaurantes, setRestaurantes] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_REST)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mesaView, setMesaView] = useState(null)
  // ── Imagen ──
  const [pendingFile, setPendingFile] = useState(null)   // archivo a subir
  const [imgPreview, setImgPreview] = useState(null)   // URL local para preview
  const [fotosPrincipales, setFotosPrincipales] = useState({}) // { [restauranteId]: url }
  const { user, logout } = useAuthStore()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Cargar restaurantes ──
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await api.get('/restaurante/restaurantes')
        const data = res.data
        setRestaurantes(Array.isArray(data) ? data : (data.restaurantes || data.data || []))
      } catch {
        showToast('Error al cargar los restaurantes', 'error')
        setRestaurantes([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ── Cargar foto principal de cada restaurante ──
  useEffect(() => {
    if (restaurantes.length === 0) return
    restaurantes.forEach(async r => {
      try {
        const res = await api.get(`/restaurante/restaurantes/${r._id}/fotos`)
        const fotos = res.data?.data || []
        const principal = fotos.find(f => f.principal) || fotos[0]
        if (principal?.url) {
          setFotosPrincipales(prev => ({ ...prev, [r._id]: principal.url }))
        }
      } catch { /* sin foto, no pasa nada */ }
    })
  }, [restaurantes])

  // ── Subir foto al endpoint FotoRestaurante ──
  const subirFoto = async (file, restauranteId) => {
    const formData = new FormData()
    formData.append('imagen', file)
    formData.append('principal', 'true')
    try {
      const res = await api.post(
        `/restaurante/restaurantes/${restauranteId}/fotos`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return res.data?.data?.url || null
    } catch {
      showToast('Restaurante guardado pero no se pudo subir la imagen', 'error')
      return null
    }
  }

  const filtered = restaurantes.filter(r =>
    (r.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.direccion || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.email || '').toLowerCase().includes(search.toLowerCase())
  )
  const activos = restaurantes.filter(r => r.estado !== false).length
  const inactivos = restaurantes.filter(r => r.estado === false).length

  const openCreate = () => {
    setForm(EMPTY_REST)
    setSelected(null)
    setPendingFile(null)
    setImgPreview(null)
    setModal('create')
  }

  const openEdit = async r => {
    setSelected(r)
    setForm({ nombre: r.nombre, direccion: r.direccion, telefono: r.telefono, email: r.email, horarioApertura: r.horarioApertura || '', horarioCierre: r.horarioCierre || '' })
    setPendingFile(null)
    // Cargar foto principal existente como preview
    const fotoExistente = fotosPrincipales[r._id] || null
    setImgPreview(fotoExistente)
    setModal('edit')
  }

  const openDelete = r => { setSelected(r); setModal('delete') }

  const closeModal = () => {
    setModal(null)
    setSelected(null)
    setPendingFile(null)
    setImgPreview(null)
  }

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setPendingFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const handleCreate = async e => {
    e.preventDefault()
    if (!form.nombre || !form.direccion || !form.telefono || !form.email)
      return showToast('Completa todos los campos obligatorios', 'error')
    setSaving(true)
    try {
      const res = await api.post('/restaurante/restaurantes', form)
      const nuevo = res.data?.restaurante || res.data?.data || res.data
      // Si hay imagen pendiente, subirla
      if (pendingFile && nuevo?._id) {
        const url = await subirFoto(pendingFile, nuevo._id)
        if (url) setFotosPrincipales(prev => ({ ...prev, [nuevo._id]: url }))
      }
      setRestaurantes(p => [nuevo, ...p])
      showToast('Restaurante creado exitosamente')
      closeModal()
    } catch (err) {
      showToast(err?.response?.data?.message || err?.response?.data?.msg || 'Error al crear el restaurante', 'error')
    } finally { setSaving(false) }
  }

  const handleEdit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put(`/restaurante/restaurantes/${selected._id}`, form)
      const actualizado = res.data?.restaurante || res.data?.data || { ...selected, ...form }
      // Si hay nueva imagen pendiente, subirla
      if (pendingFile) {
        const url = await subirFoto(pendingFile, selected._id)
        if (url) setFotosPrincipales(prev => ({ ...prev, [selected._id]: url }))
      }
      setRestaurantes(p => p.map(r => r._id === selected._id ? actualizado : r))
      showToast('Restaurante actualizado')
      closeModal()
    } catch (err) {
      showToast(err?.response?.data?.message || err?.response?.data?.msg || 'Error al actualizar', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/restaurante/restaurantes/${selected._id}`)
      setRestaurantes(p => p.map(r => r._id === selected._id ? { ...r, estado: false } : r))
      showToast('Restaurante desactivado')
      closeModal()
    } catch (err) {
      showToast(err?.response?.data?.message || err?.response?.data?.msg || 'Error al desactivar', 'error')
    } finally { setSaving(false) }
  }

  /* ── Bloque de imagen para los modales ── */
  const ImagenField = () => (
    <div className="fl ff" style={{ marginTop: 4 }}>
      <label className="flb">Imagen del restaurante</label>
      {imgPreview ? (
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <img src={imgPreview} alt="preview"
            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--glass-bd)', display: 'block' }} />
          <button type="button"
            onClick={() => { setPendingFile(null); setImgPreview(null) }}
            style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(7,8,10,.7)', border: '1px solid var(--glass-bd)', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 6px', fontSize: 11 }}>
            ✕ Quitar
          </button>
        </div>
      ) : (
        <div className="img-drop-zone">
          <IconImage />
          <span>Selecciona una imagen</span>
        </div>
      )}
      <input type="file" accept="image/jpeg,image/png,image/webp" className="fi"
        style={{ padding: '8px 14px', cursor: 'pointer', marginTop: imgPreview ? 0 : 8 }}
        onChange={handleFileChange}
      />
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>JPG, PNG o WEBP · Máx 5MB</p>
    </div>
  )

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
        .a-main{flex:1;margin-left:var(--sidebar-w);transition:margin-left .3s var(--ease-out-expo);min-height:100vh;display:flex;flex-direction:column}
        .a-main.col{margin-left:64px}
        .a-top{height:64px;background:var(--deep);border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:50}
        .top-ttl{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:.5px}
        .top-sub{font-size:11px;color:var(--text-muted)}
        .top-r{display:flex;align-items:center;gap:12px}
        .top-btn{width:36px;height:36px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .top-btn:hover{color:var(--gold)}
        .a-cnt{padding:32px;flex:1}
        .sr{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}
        .sp{display:flex;align-items:center;gap:10px;padding:10px 20px;background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:12px}
        .sp-v{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:500;color:var(--gold-lt)}
        .sp-l{font-size:11px;color:var(--text-muted)}
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
        .rg{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
        .rc{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden;transition:border-color .25s,transform .2s;position:relative}
        .rc:hover{border-color:rgba(201,168,76,.2);transform:translateY(-3px)}
        .rc.off{opacity:.55}
        .rbn{position:relative;height:130px;overflow:hidden;background:var(--surface);display:flex;align-items:center;justify-content:center}
        .rbn-placeholder{font-size:40px;opacity:.18}
        .rbn img{width:100%;height:100%;object-fit:cover;filter:brightness(.75);transition:transform .4s}
        .rc:hover .rbn img{transform:scale(1.05)}
        .rbn-ov{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(7,8,10,.92))}
        .rbadge{position:absolute;top:12px;right:12px;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:500;letter-spacing:.5px}
        .rbadge.on{background:rgba(76,175,130,.15);border:1px solid rgba(76,175,130,.3);color:var(--success)}
        .rbadge.off{background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.25);color:var(--error)}
        .rb{padding:18px 20px 0}
        .rname{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:500;color:var(--text);margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .rmeta{display:flex;flex-direction:column;gap:5px}
        .rmi{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)}
        .rmi svg{color:var(--gold);flex-shrink:0}
        .ract{display:flex;gap:8px;border-top:1px solid var(--glass-bd);padding:12px 20px;margin-top:14px}
        .ba{flex:1;padding:8px;border-radius:9px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;border:1px solid transparent}
        .be{background:rgba(201,168,76,.08);color:var(--gold-lt);border-color:rgba(201,168,76,.18)}
        .be:hover{background:rgba(201,168,76,.16);border-color:rgba(201,168,76,.35)}
        .bd{background:rgba(224,90,90,.07);color:#f09090;border-color:rgba(224,90,90,.18)}
        .bd:hover{background:rgba(224,90,90,.14);border-color:rgba(224,90,90,.35)}
        .bm{background:rgba(100,140,255,.07);color:#9ab5ff;border-color:rgba(100,140,255,.2)}
        .bm:hover{background:rgba(100,140,255,.14);border-color:rgba(100,140,255,.35)}
        .ba:disabled{opacity:.4;cursor:not-allowed}
        .es{text-align:center;padding:80px 24px;color:var(--text-muted)}
        .es-i{font-size:48px;margin-bottom:16px}
        .es-t{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--text-mid);margin-bottom:8px}
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
        select.fi option{background:var(--deep);color:var(--text)}
        .mf{display:flex;gap:10px;margin-top:20px}
        .btn-g{padding:10px 18px;background:transparent;border:1px solid rgba(255,255,255,.1);border-radius:var(--radius-inp);font-family:'Outfit',sans-serif;font-size:13px;color:var(--text-mid);cursor:pointer;transition:all .2s}
        .btn-g:hover{border-color:rgba(255,255,255,.2);color:var(--text)}
        .btn-d{padding:10px 18px;background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.3);border-radius:var(--radius-inp);font-family:'Outfit',sans-serif;font-size:13px;color:#f09090;cursor:pointer;transition:all .2s}
        .btn-d:hover{background:rgba(224,90,90,.18)}
        .tw{position:fixed;top:24px;right:24px;z-index:999}
        .tt{padding:12px 18px;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;backdrop-filter:blur(12px);animation:tIn .3s ease both}
        .tt-s{background:rgba(76,175,130,.12);border:1px solid rgba(76,175,130,.3);color:#7dd9ae}
        .tt-e{background:rgba(224,90,90,.1);border:1px solid rgba(224,90,90,.3);color:#f09090}
        @keyframes tIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        .spn{display:inline-block;width:15px;height:15px;border:1.5px solid rgba(201,168,76,.25);border-top-color:var(--gold);border-radius:50%;animation:sp .7s linear infinite}
        @keyframes sp{to{transform:rotate(360deg)}}
        /* IMAGEN DROP ZONE */
        .img-drop-zone{width:100%;height:90px;border:1px dashed rgba(255,255,255,.12);border-radius:var(--radius-inp);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--text-muted);font-size:13px;background:rgba(255,255,255,.02)}
        .img-drop-zone svg{opacity:.4}
        /* MESAS */
        .mesa-header{margin-bottom:24px}
        .btn-back{display:flex;align-items:center;gap:8px;background:none;border:none;color:var(--text-muted);font-family:'Outfit',sans-serif;font-size:13px;cursor:pointer;margin-bottom:16px;padding:0;transition:color .2s}
        .btn-back:hover{color:var(--gold-lt)}
        .mesa-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .mesa-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:500;color:var(--text)}
        .mesa-subtitle{font-size:12px;color:var(--text-muted);margin-top:4px}
        .mesa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
        .mesa-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:16px;padding:18px;transition:border-color .2s,transform .2s}
        .mesa-card:hover{border-color:rgba(201,168,76,.2);transform:translateY(-2px)}
        .mesa-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .mesa-num{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--gold-lt)}
        .mesa-badge{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:500;letter-spacing:.5px}
        .mesa-info{display:flex;flex-direction:column;gap:6px;margin-bottom:4px}
        .mesa-info-row{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text-muted)}
        .mesa-info-row svg{color:var(--gold)}
        @media(max-width:900px){.fg{grid-template-columns:1fr}.rg{grid-template-columns:1fr}.a-top{padding:0 16px}.a-cnt{padding:20px}.mesa-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}}
      `}</style>

      <div className="a-layout">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} user={user} onLogout={logout} />

        <main className={`a-main${collapsed ? ' col' : ''}`}>
          <div className="a-top">
            <div>
              <div className="top-ttl">{mesaView ? `Mesas — ${mesaView.nombre}` : 'Restaurantes'}</div>
              <div className="top-sub">{mesaView ? 'Gestión de mesas por restaurante' : 'Gestión de sucursales y mesas'}</div>
            </div>
            <div className="top-r">
              <NotificacionesPanel isAdmin={true} />
            </div>
          </div>

          <div className="a-cnt">
            {mesaView ? (
              <MesasView restaurante={mesaView} onBack={() => setMesaView(null)} showToast={showToast} />
            ) : (
              <>
                <div className="sr">
                  <div className="sp"><div><div className="sp-v">{restaurantes.length}</div><div className="sp-l">Total Restaurantes</div></div></div>
                  <div className="sp"><div><div className="sp-v" style={{ color: '#7dd9ae' }}>{activos}</div><div className="sp-l">Activos</div></div></div>
                  <div className="sp"><div><div className="sp-v" style={{ color: '#f09090' }}>{inactivos}</div><div className="sp-l">Inactivos</div></div></div>
                </div>

                <div className="tb">
                  <div className="sw">
                    <span className="si"><IconSearch /></span>
                    <input className="sinp" placeholder="Buscar por nombre, dirección o email..."
                      value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <button className="btn-p" onClick={openCreate}><IconPlus /> Nuevo Restaurante</button>
                </div>

                {loading ? (
                  <div className="es">
                    <div className="spn" style={{ width: 32, height: 32, borderWidth: 2 }} />
                    <p style={{ marginTop: 16 }}>Cargando restaurantes...</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="es">
                    <div className="es-i">🍽️</div>
                    <div className="es-t">{search ? 'Sin resultados' : 'Sin restaurantes registrados'}</div>
                    <p style={{ fontSize: 13, marginTop: 6 }}>{search ? 'Intenta con otro término' : 'Crea el primer restaurante'}</p>
                    {!search && <button className="btn-p" style={{ margin: '20px auto 0', display: 'flex' }} onClick={openCreate}><IconPlus /> Nuevo Restaurante</button>}
                  </div>
                ) : (
                  <div className="rg">
                    {filtered.map(r => (
                      <div key={r._id} className={`rc${r.estado === false ? ' off' : ''}`}>
                        {/* Imagen real si existe, placeholder si no */}
                        <div className="rbn">
                          {fotosPrincipales[r._id]
                            ? <img src={fotosPrincipales[r._id]} alt={r.nombre} />
                            : <div className="rbn-placeholder">🍽️</div>
                          }
                          <div className="rbn-ov" />
                          <div className={`rbadge ${r.estado === false ? 'off' : 'on'}`}>
                            {r.estado === false ? 'Inactivo' : 'Activo'}
                          </div>
                        </div>
                        <div className="rb">
                          <div className="rname">{r.nombre}</div>
                          <div className="rmeta">
                            <div className="rmi"><IconPin />{r.direccion}</div>
                            <div className="rmi"><IconPhone />{r.telefono}</div>
                            {(r.horarioApertura || r.horarioCierre) && (
                              <div className="rmi"><IconClock />{r.horarioApertura} — {r.horarioCierre}</div>
                            )}
                          </div>
                        </div>
                        <div className="ract">
                          <button className="ba bm" onClick={() => setMesaView(r)}><IconChair /> Mesas</button>
                          <button className="ba be" onClick={() => openEdit(r)}><IconEdit /> Editar</button>
                          <button className="ba bd" onClick={() => openDelete(r)}><IconTrash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* ── MODAL CREAR ── */}
      {modal === 'create' && (
        <Modal title="Nuevo Restaurante" subtitle="Completa la información del restaurante" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <div className="fg">
              <div className="fl ff">
                <label className="flb">Nombre *</label>
                <input className="fi" name="nombre" value={form.nombre} onChange={handleForm} placeholder="Nombre del restaurante" required />
              </div>
              <div className="fl ff">
                <label className="flb">Dirección *</label>
                <input className="fi" name="direccion" value={form.direccion} onChange={handleForm} placeholder="Dirección completa" required />
              </div>
              <div className="fl">
                <label className="flb">Teléfono *</label>
                <input className="fi" name="telefono" value={form.telefono} onChange={handleForm} placeholder="Número de teléfono" required />
              </div>
              <div className="fl">
                <label className="flb">Email *</label>
                <input className="fi" name="email" type="email" value={form.email} onChange={handleForm} placeholder="correo@restaurante.com" required />
              </div>
              <div className="fl">
                <label className="flb">Horario Apertura</label>
                <input className="fi" name="horarioApertura" type="time" value={form.horarioApertura} onChange={handleForm} />
              </div>
              <div className="fl">
                <label className="flb">Horario Cierre</label>
                <input className="fi" name="horarioCierre" type="time" value={form.horarioCierre} onChange={handleForm} />
              </div>
              {/* ── IMAGEN ── */}
              <ImagenField />
            </div>
            <div className="mf">
              <button type="button" className="btn-g" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn-p" disabled={saving}>
                {saving ? <span className="spn" /> : <IconPlus />} Crear Restaurante
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL EDITAR ── */}
      {modal === 'edit' && selected && (
        <Modal title="Editar Restaurante" subtitle={selected.nombre} onClose={closeModal}>
          <form onSubmit={handleEdit}>
            <div className="fg">
              <div className="fl ff">
                <label className="flb">Nombre *</label>
                <input className="fi" name="nombre" value={form.nombre} onChange={handleForm} required />
              </div>
              <div className="fl ff">
                <label className="flb">Dirección *</label>
                <input className="fi" name="direccion" value={form.direccion} onChange={handleForm} required />
              </div>
              <div className="fl">
                <label className="flb">Teléfono *</label>
                <input className="fi" name="telefono" value={form.telefono} onChange={handleForm} required />
              </div>
              <div className="fl">
                <label className="flb">Email *</label>
                <input className="fi" name="email" type="email" value={form.email} onChange={handleForm} required />
              </div>
              <div className="fl">
                <label className="flb">Horario Apertura</label>
                <input className="fi" name="horarioApertura" type="time" value={form.horarioApertura} onChange={handleForm} />
              </div>
              <div className="fl">
                <label className="flb">Horario Cierre</label>
                <input className="fi" name="horarioCierre" type="time" value={form.horarioCierre} onChange={handleForm} />
              </div>
              {/* ── IMAGEN ── */}
              <ImagenField />
            </div>
            <div className="mf">
              <button type="button" className="btn-g" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn-p" disabled={saving}>
                {saving ? <span className="spn" /> : <IconEdit />} Guardar Cambios
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MODAL ELIMINAR ── */}
      {modal === 'delete' && selected && (
        <Modal title="Desactivar Restaurante" subtitle="El restaurante quedará inactivo" onClose={closeModal}>
          <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 20 }}>
            ¿Desactivar <strong style={{ color: 'var(--text)' }}>{selected.nombre}</strong>? Sus datos se conservarán y podrás reactivarlo después.
          </p>
          <div className="mf">
            <button className="btn-g" onClick={closeModal}>Cancelar</button>
            <button className="btn-d" onClick={handleDelete} disabled={saving}>
              {saving ? <span className="spn" /> : null} Desactivar
            </button>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </>
  )
}