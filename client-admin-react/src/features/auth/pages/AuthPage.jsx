import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import PendingVerificationPage from './PendingVerificationPage'
import '../../../styles/auth.css'

import videoCocina from '../../../img/videococina.mp4'
/**
 * VIDEO DE FONDO — CÓMO IMPLEMENTARLO:
 *
 * Opción A (video propio):
 *   1. Coloca tu archivo de video en /public/videos/bg.mp4
 *   2. Descomenta <video> y comenta <div className="bg-fallback">
 *
 * Opción B (URL externa gratuita):
 *   Usa videos CC0 de Pexels/Pixabay en formato MP4:
 *   - https://www.pexels.com/search/videos/restaurant%20abstract/
 *   - Descarga → copia a public/videos/bg.mp4
 *
 * El video ideal: 15-30s, slow motion, abstracto (cocina, fuego, vapor,
 * ingredientes, arquitectura dark). Resolucion 1080p o superior.
 * SIEMPRE usa muted + autoPlay + loop + playsInline.
 */

export default function AuthPage() {
  const [view, setView] = useState('login')
  const [registeredEmail, setRegisteredEmail] = useState('')

  const handleRegistered = (email) => {
    setRegisteredEmail(email)
    setView('pending')
  }

  return (
    <div className="auth-page">

      {/* ── VIDEO BACKGROUND ── */}
      <div className="bg-video-wrap">

<video
          className="bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={videoCocina} type="video/mp4" />
        </video>

        {/* OPCIÓN B: fallback gradient (activo por defecto) */}
        {/*<div className="bg-fallback" />*/}

        {/* Vignette y grain — siempre presentes */}
        <div className="bg-overlay" />
        <div className="bg-grain" />
      </div>

      {/* ── ORBS ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── FORM CONTAINER ── */}
      <div className="auth-container">
        {view === 'login' && (
          <LoginForm
            onSwitchToRegister={() => setView('register')}
            onSwitchToForgot={() => setView('forgot')}
          />
        )}
        {view === 'register' && (
          <RegisterForm
            onSwitchToLogin={() => setView('login')}
            onRegistered={handleRegistered}
          />
        )}
        {view === 'forgot' && (
          <ForgotPasswordForm onSwitchToLogin={() => setView('login')} />
        )}
        {view === 'pending' && (
          <PendingVerificationPage
            email={registeredEmail}
            onSwitchToLogin={() => setView('login')}
          />
        )}
      </div>
    </div>
  )
}