import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
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
const IconSend = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
)

export default function ForgotPasswordForm({ onSwitchToLogin }) {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [toast, setToast]   = useState(null)
  const { forgotPassword, isLoading } = useAuthStore()

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 5000)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!email) return showToast('Ingresa tu correo electrónico')
    const res = await forgotPassword(email)
    if (res.success) setSent(true)
    else showToast(res.message)
  }

  if (sent) {
    return (
      <div className="auth-card">
        <div className="verify-state" style={{ paddingTop: 8 }}>
          <div className="verify-icon-wrap success stagger-item s-0">
            <IconSend />
          </div>
          <h2 className="verify-title stagger-item s-1">Correo enviado</h2>
          <p className="verify-msg stagger-item s-2">
            Enviamos un enlace de recuperación a
          </p>
          <div className="email-display stagger-item s-3">{email}</div>
          <p className="verify-msg stagger-item s-4" style={{ fontSize: 12 }}>
            Revisa tu bandeja de entrada y tu carpeta de spam.
            El enlace expira en 15 minutos.
          </p>
          <button className="btn-primary stagger-item s-5" onClick={onSwitchToLogin}
            style={{ marginTop: 8 }}>
            <IconBack /> Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-card">
      {/* Brand minimal */}
      <div className="auth-brand stagger-item s-0" style={{ marginBottom: 24 }}>
        <div className="brand-logo-wrap" style={{ width: 44, height: 44, borderRadius: 12 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="22" height="22">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/>
          </svg>
        </div>
        <span className="brand-name" style={{ fontSize: 22 }}>Grestaurante</span>
      </div>

      <div className="form-heading stagger-item s-1">
        <h2 className="form-title">Recuperar acceso</h2>
        <p className="form-subtitle">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <form onSubmit={submit} className="auth-form" noValidate>
        <div className="field-group stagger-item s-2">
          <label className="field-label">Correo electrónico</label>
          <div className="input-wrap">
            <span className="input-icon"><IconMail /></span>
            <input
              className="field-input"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary stagger-item s-3" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : <>Enviar enlace <IconArrow /></>}
        </button>

        <button type="button" className="btn-ghost stagger-item s-4" onClick={onSwitchToLogin}>
          <IconBack /> Volver al inicio de sesión
        </button>
      </form>
    </div>
  )
}