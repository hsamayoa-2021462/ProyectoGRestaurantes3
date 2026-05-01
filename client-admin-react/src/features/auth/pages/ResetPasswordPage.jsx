import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

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
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IconCheck = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

const getStrength = (pw) => {
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { level: 1, label: 'Débil', cls: 'active-weak' }
  if (s <= 3) return { level: 2, label: 'Media', cls: 'active-medium' }
  return { level: 3, label: 'Fuerte', cls: 'active-strong' }
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { resetPassword, isLoading } = useAuthStore()

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [showPw, setShowPw]           = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast]             = useState(null)
  const [done, setDone]               = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const strength = getStrength(form.newPassword)

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 5000)
  }

  const submit = async (e) => {
    e.preventDefault()
    const token = searchParams.get('token')
    if (!token)  return showToast('Token no encontrado en la URL')
    if (form.newPassword !== form.confirmPassword) return showToast('Las contraseñas no coinciden')
    if (form.newPassword.length < 6) return showToast('Mínimo 6 caracteres')
    const res = await resetPassword({ token, newPassword: form.newPassword })
    if (res.success) setDone(true)
    else showToast(res.message)
  }

  if (done) return (
    <div className="verify-page" style={{ background: 'var(--black)', fontFamily: "'Outfit', sans-serif" }}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="verify-state">
            <div className="verify-icon-wrap success stagger-item s-0"
              style={{ width: 72, height: 72 }}>
              <IconCheck />
            </div>
            <h2 className="verify-title stagger-item s-1">Contraseña actualizada</h2>
            <p className="verify-msg stagger-item s-2">
              Tu contraseña fue restablecida correctamente. Ya puedes iniciar sesión.
            </p>
            <button className="btn-primary stagger-item s-3"
              style={{ marginTop: 8 }} onClick={() => navigate('/auth')}>
              Ir al inicio de sesión <IconArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="verify-page" style={{ background: 'var(--black)', fontFamily: "'Outfit', sans-serif" }}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand stagger-item s-0" style={{ marginBottom: 24 }}>
            <div className="brand-logo-wrap" style={{ width: 44, height: 44, borderRadius: 12 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="22" height="22">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/>
              </svg>
            </div>
            <span className="brand-name" style={{ fontSize: 22 }}>Grestaurante</span>
          </div>

          <div className="form-heading stagger-item s-1">
            <h2 className="form-title">Nueva contraseña</h2>
            <p className="form-subtitle">Elige una contraseña segura para tu cuenta</p>
          </div>

          {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

          <form onSubmit={submit} className="auth-form" noValidate>
            <div className="field-group stagger-item s-2">
              <label className="field-label">Nueva contraseña</label>
              <div className="input-wrap">
                <span className="input-icon"><IconLock /></span>
                <input className="field-input" type={showPw ? 'text' : 'password'}
                  name="newPassword" placeholder="Mínimo 6 caracteres"
                  value={form.newPassword} onChange={handle}
                  style={{ paddingRight: '42px' }} />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {form.newPassword.length > 0 && (
                <>
                  <div className="strength-bar">
                    {[1,2,3].map(i => (
                      <div key={i} className={`strength-seg ${i <= strength.level ? strength.cls : ''}`} />
                    ))}
                  </div>
                  <span className="field-hint" style={{
                    color: strength.level === 1 ? 'var(--error)' : strength.level === 2 ? '#e0a44a' : 'var(--success)'
                  }}>{strength.label}</span>
                </>
              )}
            </div>

            <div className="field-group stagger-item s-3">
              <label className="field-label">Confirmar contraseña</label>
              <div className="input-wrap">
                <span className="input-icon"><IconLock /></span>
                <input className="field-input" type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword" placeholder="Repite tu contraseña"
                  value={form.confirmPassword} onChange={handle}
                  style={{ paddingRight: '42px' }} />
                <button type="button" className="pw-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary stagger-item s-4" disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : <>Guardar contraseña <IconArrow /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}