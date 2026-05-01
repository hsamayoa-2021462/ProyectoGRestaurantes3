/* VerifyEmailPage.jsx */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const IconCheck = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const IconX = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyEmail, resendVerification } = useAuthStore()

  const [status, setStatus]         = useState('loading')
  const [message, setMessage]       = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('error'); setMessage('No se encontró el token de verificación.'); return }
    verifyEmail(token).then(res => {
      if (res.success) { setStatus('success'); setMessage(res.message || '¡Tu cuenta está activa!') }
      else             { setStatus('error');   setMessage(res.message || 'Token inválido o expirado.') }
    })
  }, [])

  const handleResend = async (e) => {
    e.preventDefault()
    if (!resendEmail) return
    setResendLoading(true)
    const res = await resendVerification(resendEmail)
    setResendLoading(false)
    if (res.success) setResendSent(true)
  }

  return (
    <div className="verify-page" style={{ background: 'var(--black)', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Outfit:wght@300;400;500&display=swap');`}</style>
      <div className="auth-container">
        <div className="auth-card">
          {status === 'loading' && (
            <div className="verify-state">
              <div className="spinner spinner-lg stagger-item s-0" />
              <p className="verify-msg stagger-item s-1">Verificando tu correo...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="verify-state">
              <div className="verify-icon-wrap success stagger-item s-0"
                style={{ width: 72, height: 72 }}>
                <IconCheck />
              </div>
              <h2 className="verify-title stagger-item s-1">¡Correo verificado!</h2>
              <p className="verify-msg stagger-item s-2">{message}</p>
              <button className="btn-primary stagger-item s-3"
                style={{ marginTop: 8 }} onClick={() => navigate('/auth')}>
                Ir al inicio de sesión <IconArrow />
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="verify-state">
              <div className="verify-icon-wrap error stagger-item s-0"
                style={{ width: 72, height: 72 }}>
                <IconX />
              </div>
              <h2 className="verify-title stagger-item s-1">Verificación fallida</h2>
              <p className="verify-msg stagger-item s-2">{message}</p>

              {!resendSent ? (
                <form onSubmit={handleResend} className="auth-form stagger-item s-3"
                  style={{ width: '100%', marginTop: 8 }}>
                  <p className="form-subtitle" style={{ textAlign: 'center' }}>
                    ¿Quieres reenviar el correo de verificación?
                  </p>
                  <div className="field-group">
                    <div className="input-wrap">
                      <input className="field-input no-icon" type="email"
                        placeholder="tu@correo.com" value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)} />
                    </div>
                  </div>
                  <button type="submit" className="btn-ghost" disabled={resendLoading}>
                    {resendLoading ? <span className="spinner" /> : 'Reenviar verificación'}
                  </button>
                </form>
              ) : (
                <div className="toast toast-success stagger-item s-3" style={{ width: '100%' }}>
                  ✓ ¡Correo reenviado! Revisa tu bandeja.
                </div>
              )}

              <button className="link-btn stagger-item s-4"
                style={{ marginTop: 12 }} onClick={() => navigate('/auth')}>
                ← Volver al inicio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}