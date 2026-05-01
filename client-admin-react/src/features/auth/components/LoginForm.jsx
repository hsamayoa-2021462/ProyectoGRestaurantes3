// src/features/auth/components/LoginForm.jsx
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const IconRestaurant = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/>
  </svg>
)

const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
)

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
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

export default function LoginForm({ onSwitchToRegister, onSwitchToForgot }) {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [toast, setToast] = useState(null)
  const { login, isLoading } = useAuthStore()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4500)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.emailOrUsername || !form.password)
      return showToast('Completa todos los campos')
    
    console.log('Intentando login con:', form.emailOrUsername)
    const res = await login(form)
    console.log('Resultado login:', res)
    
    if (res.success && res.user) {
      console.log('Redirigiendo a:', res.user.rol === 'admin' ? '/admin' : '/cliente/inicio')
      // Usar window.location.href para forzar la redirección
      if (res.user.rol === 'admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/cliente/inicio'
      }
    } else if (!res.success) {
      showToast(res.message)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-brand stagger-item s-0">
        <div className="brand-logo-wrap">
          <IconRestaurant />
        </div>
        <span className="brand-name">Restaurante</span>
        <span className="brand-tagline">Panel Administrativo</span>
      </div>

      <div className="form-heading stagger-item s-1">
        <h2 className="form-title">Bienvenido de vuelta</h2>
        <p className="form-subtitle">Ingresa tus credenciales para continuar</p>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type} stagger-item s-0`}>
          {toast.msg}
        </div>
      )}

      <form onSubmit={submit} className="auth-form" noValidate>
        <div className="field-group stagger-item s-2">
          <label className="field-label">Correo o usuario</label>
          <div className="input-wrap">
            <span className="input-icon"><IconMail /></span>
            <input
              className="field-input"
              type="text"
              name="emailOrUsername"
              placeholder="usuario o correo@email.com"
              value={form.emailOrUsername}
              onChange={handle}
              autoComplete="username"
            />
          </div>
        </div>

        <div className="field-group stagger-item s-3">
          <label className="field-label">Contraseña</label>
          <div className="input-wrap">
            <span className="input-icon"><IconLock /></span>
            <input
              className="field-input"
              type={showPw ? 'text' : 'password'}
              name="password"
              placeholder="••••••••••"
              value={form.password}
              onChange={handle}
              autoComplete="current-password"
              style={{ paddingRight: '42px' }}
            />
            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
              {showPw ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <div className="forgot-row stagger-item s-4">
          <button type="button" className="link-btn" onClick={onSwitchToForgot}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="submit" className="btn-primary stagger-item s-5" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : <>Entrar <IconArrow /></>}
        </button>
      </form>

      <div className="divider stagger-item s-6">
        <div className="divider-line" />
        <span className="divider-text">o</span>
        <div className="divider-line" />
      </div>

      <button className="btn-ghost stagger-item s-7" onClick={onSwitchToRegister}>
        Crear nueva cuenta
      </button>
    </div>
  )
}