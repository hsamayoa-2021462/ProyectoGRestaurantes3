import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
  </svg>
)

export default function PendingVerificationPage({ email, onSwitchToLogin }) {
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const { resendVerification } = useAuthStore()

  const handleResend = async () => {
    setLoading(true)
    const res = await resendVerification(email)
    setLoading(false)
    if (res.success) setSent(true)
  }

  return (
    <div className="auth-card">
      <div className="verify-state" style={{ paddingTop: 8 }}>

        {/* Animated envelope */}
        <div className="verify-icon-wrap success stagger-item s-0"
          style={{ width: 72, height: 72, marginBottom: 8 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
          </svg>
        </div>

        <h2 className="verify-title stagger-item s-1">Verifica tu correo</h2>

        <p className="verify-msg stagger-item s-2">
          Enviamos un correo de verificación a:
        </p>

        <div className="email-display stagger-item s-3">{email}</div>

        <p className="verify-msg stagger-item s-4" style={{ fontSize: 12, marginTop: 4 }}>
          Haz clic en el enlace del correo para activar tu cuenta.
          Puede tardar unos minutos. Revisa tu carpeta de spam.
        </p>

        {sent ? (
          <div className="toast toast-success stagger-item s-5" style={{ width: '100%' }}>
            ✓ Correo reenviado exitosamente
          </div>
        ) : (
          <button
            className="btn-ghost stagger-item s-5"
            onClick={handleResend}
            disabled={loading}
            style={{ marginTop: 4, width: '100%' }}
          >
            {loading ? <span className="spinner" /> : <><IconRefresh /> Reenviar correo</>}
          </button>
        )}

        <button
          className="link-btn stagger-item s-6"
          onClick={onSwitchToLogin}
          style={{ marginTop: 12 }}
        >
          <IconBack /> Volver al inicio de sesión
        </button>

      </div>
    </div>
  )
}