import { useState, useRef, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'

/* ─── ICONS ─── */
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconAt = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"/>
  </svg>
)
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
)
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)
const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
  </svg>
)
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)

/* ─── PASSWORD STRENGTH ─── */
const getStrength = (pw) => {
  let score = 0
  if (pw.length >= 6)  score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { level: 1, label: 'Débil', cls: 'active-weak' }
  if (score <= 3) return { level: 2, label: 'Media', cls: 'active-medium' }
  return { level: 3, label: 'Fuerte', cls: 'active-strong' }
}

/* ─── EMAIL VALIDATOR ─── */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function RegisterForm({ onSwitchToLogin, onRegistered }) {
  const [form, setForm] = useState({
    name: '', surname: '', username: '', email: '',
    password: '', confirmPassword: '', phone: '',
  })
  const [profilePicture, setProfilePicture] = useState(null)
  const [preview, setPreview]               = useState(null)
  const [showPw, setShowPw]                 = useState(false)
  const [showConfirm, setShowConfirm]       = useState(false)
  const [touched, setTouched]               = useState({})
  const [toast, setToast]                   = useState(null)
  const fileRef = useRef()
  const { register, isLoading } = useAuthStore()

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setTouched({ ...touched, [e.target.name]: true })
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProfilePicture(file)
    setPreview(URL.createObjectURL(file))
  }

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 5000)
  }

  /* Real-time validation */
  const v = {
    name:     form.name.trim().length >= 2,
    surname:  form.surname.trim().length >= 2,
    username: form.username.trim().length >= 3,
    email:    isValidEmail(form.email),
    phone:    form.phone.trim().length >= 6,
    password: form.password.length >= 6,
    confirm:  form.password === form.confirmPassword && form.confirmPassword.length > 0,
  }

  const inputClass = (field) => {
    if (!touched[field]) return 'field-input'
    return `field-input ${v[field] ? 'is-valid' : 'is-error'}`
  }

  const strength = getStrength(form.password)

  const submit = async (e) => {
    e.preventDefault()
    // Mark all touched
    const allTouched = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    const { name, surname, username, email, password, confirmPassword, phone } = form
    if (!name || !surname || !username || !email || !password || !phone)
      return showToast('Completa todos los campos obligatorios')
    if (!isValidEmail(email))
      return showToast('Ingresa un correo electrónico válido')
    if (password !== confirmPassword)
      return showToast('Las contraseñas no coinciden')
    if (password.length < 6)
      return showToast('La contraseña debe tener mínimo 6 caracteres')

    const res = await register({ name, surname, username, email, password, phone, profilePicture })
    if (res.success) {
      onRegistered(email)
    } else {
      showToast(res.message)
    }
  }

  return (
    <div className="auth-card">
      {/* Brand */}
      <div className="auth-brand stagger-item s-0" style={{ marginBottom: '20px' }}>
        <div className="brand-logo-wrap" style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="20" height="20">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/>
          </svg>
        </div>
        <span className="brand-name" style={{ fontSize: 22 }}>Grestaurante</span>
      </div>

      {/* Heading */}
      <div className="form-heading stagger-item s-1" style={{ marginBottom: 18 }}>
        <h2 className="form-title">Crear cuenta</h2>
        <p className="form-subtitle">Completa tus datos para registrarte</p>
      </div>

      {/* Toast */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      {/* Avatar */}
      <div className="avatar-wrap stagger-item s-2">
        <div className="avatar-upload" onClick={() => fileRef.current.click()}>
          <div className="avatar-ring" />
          <div className="avatar-inner">
            {preview
              ? <img src={preview} alt="perfil" className="avatar-img" />
              : <>
                  <span className="avatar-icon">📷</span>
                  <span className="avatar-hint">FOTO</span>
                </>
            }
          </div>
          <div className="avatar-badge">+</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
        </div>
      </div>

      <form onSubmit={submit} className="auth-form" noValidate>

        {/* Nombre + Apellido */}
        <div className="field-row stagger-item s-3">
          <div className="field-group">
            <label className="field-label">Nombre *</label>
            <div className="input-wrap">
              <span className="input-icon"><IconUser /></span>
              <input className={inputClass('name')} type="text" name="name"
                placeholder="Juan" value={form.name} onChange={handle} />
            </div>
            {touched.name && (
              <span className={`field-hint ${v.name ? 'hint-valid' : 'hint-error'}`}>
                {v.name ? <><IconCheck /> Correcto</> : <><IconX /> Mínimo 2 caracteres</>}
              </span>
            )}
          </div>
          <div className="field-group">
            <label className="field-label">Apellido *</label>
            <div className="input-wrap">
              <span className="input-icon"><IconUser /></span>
              <input className={inputClass('surname')} type="text" name="surname"
                placeholder="Pérez" value={form.surname} onChange={handle} />
            </div>
            {touched.surname && (
              <span className={`field-hint ${v.surname ? 'hint-valid' : 'hint-error'}`}>
                {v.surname ? <><IconCheck /> Correcto</> : <><IconX /> Mínimo 2 caracteres</>}
              </span>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="field-group stagger-item s-4">
          <label className="field-label">Nombre de usuario *</label>
          <div className="input-wrap">
            <span className="input-icon"><IconAt /></span>
            <input className={inputClass('username')} type="text" name="username"
              placeholder="juanp123" value={form.username} onChange={handle} />
          </div>
          {touched.username && (
            <span className={`field-hint ${v.username ? 'hint-valid' : 'hint-error'}`}>
              {v.username ? <><IconCheck /> Disponible</> : <><IconX /> Mínimo 3 caracteres</>}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="field-group stagger-item s-5">
          <label className="field-label">Correo electrónico *</label>
          <div className="input-wrap">
            <span className="input-icon"><IconMail /></span>
            <input className={inputClass('email')} type="email" name="email"
              placeholder="juan@correo.com" value={form.email} onChange={handle} />
          </div>
          {touched.email && (
            <span className={`field-hint ${v.email ? 'hint-valid' : 'hint-error'}`}>
              {v.email ? <><IconCheck /> Válido</> : <><IconX /> Correo inválido</>}
            </span>
          )}
        </div>

        {/* Teléfono */}
        <div className="field-group stagger-item s-6">
          <label className="field-label">Teléfono *</label>
          <div className="input-wrap">
            <span className="input-icon"><IconPhone /></span>
            <input className={inputClass('phone') + ' no-icon'} type="text" name="phone"
              placeholder="42653798" value={form.phone} onChange={handle}
              style={{ paddingLeft: '38px' }} />
          </div>
        </div>

        {/* Password + Confirm */}
        <div className="field-row stagger-item s-7">
          <div className="field-group">
            <label className="field-label">Contraseña *</label>
            <div className="input-wrap">
              <span className="input-icon"><IconLock /></span>
              <input className={inputClass('password')} type={showPw ? 'text' : 'password'}
                name="password" placeholder="Min. 6 car." value={form.password}
                onChange={handle} style={{ paddingRight: '36px' }} />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {form.password.length > 0 && (
              <>
                <div className="strength-bar">
                  {[1,2,3].map(i => (
                    <div key={i} className={`strength-seg ${i <= strength.level ? strength.cls : ''}`} />
                  ))}
                </div>
                <span className="field-hint" style={{
                  color: strength.level === 1 ? 'var(--error)' : strength.level === 2 ? '#e0a44a' : 'var(--success)'
                }}>
                  {strength.label}
                </span>
              </>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">Confirmar *</label>
            <div className="input-wrap">
              <span className="input-icon"><IconLock /></span>
              <input className={inputClass('confirm')} type={showConfirm ? 'text' : 'password'}
                name="confirmPassword" placeholder="Repite" value={form.confirmPassword}
                onChange={handle} style={{ paddingRight: '36px' }} />
              <button type="button" className="pw-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {touched.confirmPassword && form.confirmPassword.length > 0 && (
              <span className={`field-hint ${v.confirm ? 'hint-valid' : 'hint-error'}`}>
                {v.confirm ? <><IconCheck /> Coinciden</> : <><IconX /> No coinciden</>}
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary stagger-item s-8" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : <>Crear cuenta <IconArrow /></>}
        </button>

        {/* Back to login */}
        <button type="button" className="btn-ghost stagger-item s-9" onClick={onSwitchToLogin}>
          <IconBack /> Volver al inicio de sesión
        </button>

      </form>
    </div>
  )
}