// src/features/cliente/pages/ClienteInicio.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'

/* ─── ICONS ─── */
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7"/>
  </svg>
)
const IconTable = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
)
const IconBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconHamburger = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

// Rutas reales del router
const NAV_LINKS = [
  { key: 'inicio',   label: 'Inicio',        path: '/cliente/inicio' },
  { key: 'menu',     label: 'Menú',           path: '/cliente/menu' },
  { key: 'reservar', label: 'Reservar Mesa',  path: '/cliente/reservar' },
  { key: 'pedidos',  label: 'Mis Pedidos',    path: '/cliente/mis-pedidos' },
  { key: 'perfil',   label: 'Mi Perfil',      path: '/cliente/perfil' },
]

const FEATURED_DISHES = [
  { name: 'Filete a la Parrilla', desc: 'Corte premium con reducción de vino tinto y papas al romero', price: 'Q 280', tag: "Chef's Pick", emoji: '🥩' },
  { name: 'Risotto de Mariscos',  desc: 'Arroz cremoso con camarones, mejillones y azafrán español',   price: 'Q 245', tag: 'Popular',     emoji: '🦐' },
  { name: 'Pasta Carbonara',      desc: 'Linguini artesanal con panceta, parmesano y yema de huevo',   price: 'Q 180', tag: 'Clásico',    emoji: '🍝' },
]

const REVIEWS = [
  { name: 'Carlos M.', rating: 5, text: 'La mejor experiencia gastronómica de la ciudad. El ambiente es incomparable.', date: 'Hace 2 días' },
  { name: 'Ana G.',    rating: 5, text: 'El filete estuvo perfecto. El servicio fue excelente de principio a fin.', date: 'Hace 1 semana' },
  { name: 'Luis P.',   rating: 4, text: 'Muy buena comida y ambiente elegante. Definitivamente volvería.', date: 'Hace 2 semanas' },
]

export default function ClienteInicio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Activo según la ruta real
  const activeKey = NAV_LINKS.find(l => l.path === location.pathname)?.key || 'inicio'

  const avatarSrc = user?.profilePicture
  const initials = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black:      #07080a;
          --deep:       #0d0f12;
          --surface:    #12151a;
          --glass-bg:   rgba(255,255,255,0.045);
          --glass-bd:   rgba(255,255,255,0.09);
          --gold:       #c9a84c;
          --gold-lt:    #e8c96a;
          --gold-glow:  rgba(201,168,76,.22);
          --gold-dim:   rgba(201,168,76,.08);
          --text:       #f0ead8;
          --text-mid:   #9a9385;
          --text-muted: #5a554d;
          --success:    #4caf82;
          --radius-card: 20px;
          --blur:        blur(24px) saturate(180%);
          --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
        }

        body { font-family: 'Outfit', sans-serif; background: var(--black); color: var(--text); min-height: 100vh; overflow-x: hidden; }

        /* ── NAVBAR ── */
        .cliente-nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          height: 70px;
          background: rgba(7,8,10,.88);
          backdrop-filter: blur(24px) saturate(180%);
          border-bottom: 1px solid var(--glass-bd);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
        }

        .nav-brand {
          display: flex; align-items: center; gap: 12px;
          cursor: pointer;
        }
        .nav-brand-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(201,168,76,.2), rgba(201,168,76,.05));
          border: 1px solid rgba(201,168,76,.25);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
        }
        .nav-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--text);
        }

        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-link {
          padding: 7px 14px; border-radius: 8px;
          font-size: 13px; color: var(--text-mid);
          cursor: pointer; transition: all .2s;
          font-weight: 400; letter-spacing: .2px;
          border: none; background: none;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
        }
        .nav-link:hover { color: var(--text); background: var(--glass-bg); }
        .nav-link.active { color: var(--gold-lt); background: var(--gold-dim); }

        .nav-right { display: flex; align-items: center; gap: 10px; }

        /* Avatar con foto o inicial */
        .nav-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(201,168,76,.25), rgba(201,168,76,.08));
          border: 2px solid rgba(201,168,76,.25);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 500;
          color: var(--gold-lt); cursor: pointer;
          overflow: hidden;
          transition: border-color .2s, transform .15s;
        }
        .nav-avatar:hover {
          border-color: rgba(201,168,76,.6);
          transform: scale(1.05);
        }
        .nav-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .nav-logout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 12px; border-radius: 8px;
          background: none; border: 1px solid rgba(255,255,255,.08);
          color: var(--text-muted); cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 12.5px;
          transition: all .2s;
        }
        .nav-logout-btn:hover { border-color: rgba(224,90,90,.3); color: #e05a5a; background: rgba(224,90,90,.06); }

        .nav-mobile-btn {
          display: none; width: 36px; height: 36px; border-radius: 8px;
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          color: var(--text-mid); cursor: pointer;
          align-items: center; justify-content: center;
        }

        /* Mobile dropdown */
        .mobile-menu {
          position: fixed; top: 70px; left: 0; right: 0; z-index: 99;
          background: rgba(7,8,10,.97); backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--glass-bd);
          padding: 12px 16px 16px;
          display: none; flex-direction: column; gap: 4px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-nav-link {
          padding: 11px 14px; border-radius: 8px; color: var(--text-mid);
          cursor: pointer; transition: all .2s; font-size: 14px;
          border: none; background: none;
          font-family: 'Outfit', sans-serif; width: 100%; text-align: left;
        }
        .mobile-nav-link:hover { color: var(--text); background: var(--glass-bg); }
        .mobile-nav-link.active { color: var(--gold-lt); background: var(--gold-dim); }

        /* ── PAGE ── */
        .cliente-page { padding-top: 70px; min-height: 100vh; }

        /* ── HERO ── */
        .hero {
          position: relative; min-height: 92vh;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 90%, rgba(201,168,76,.04) 0%, transparent 55%),
            linear-gradient(180deg, var(--deep) 0%, var(--black) 100%);
        }
        .hero-grain {
          position: absolute; inset: 0; z-index: 0; opacity: .03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .hero-line {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 80px;
          background: linear-gradient(180deg, transparent, var(--gold));
          opacity: .4;
        }
        .hero-content {
          position: relative; z-index: 10; text-align: center;
          max-width: 800px; padding: 0 24px;
        }
        .hero-eyebrow {
          font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
          color: var(--gold); opacity: .8; margin-bottom: 24px;
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .hero-eyebrow::before, .hero-eyebrow::after {
          content: ''; width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold));
        }
        .hero-eyebrow::after { transform: scaleX(-1); }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 8vw, 88px);
          font-weight: 400; line-height: .95;
          color: var(--text); letter-spacing: -1px; margin-bottom: 24px;
        }
        .hero-title span { color: var(--gold-lt); font-style: italic; }
        .hero-subtitle {
          font-size: 16px; color: var(--text-mid); line-height: 1.7;
          font-weight: 300; max-width: 520px; margin: 0 auto 40px; letter-spacing: .3px;
        }
        .hero-actions { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }

        .btn-primary {
          position: relative; padding: 14px 32px;
          background: linear-gradient(135deg, rgba(201,168,76,.18) 0%, rgba(201,168,76,.06) 100%);
          border: 1px solid rgba(201,168,76,.35); border-radius: 11px;
          font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--gold-lt); cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          overflow: hidden; transition: border-color .25s, transform .15s, box-shadow .25s;
        }
        .btn-primary::before {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,.15), transparent);
          transition: left .55s;
        }
        .btn-primary:hover::before { left: 100%; }
        .btn-primary:hover {
          border-color: rgba(201,168,76,.6);
          box-shadow: 0 0 24px rgba(201,168,76,.16);
          transform: translateY(-1px);
        }
        .btn-ghost {
          padding: 13px 28px; background: transparent;
          border: 1px solid rgba(255,255,255,.1); border-radius: 11px;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 400;
          color: var(--text-mid); cursor: pointer; transition: all .2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,.2); color: var(--text); background: rgba(255,255,255,.04); }

        .info-strip {
          display: flex; align-items: center; justify-content: center; gap: 32px;
          margin-top: 60px; padding-top: 40px;
          border-top: 1px solid var(--glass-bd); flex-wrap: wrap;
        }
        .info-item { display: flex; align-items: center; gap: 8px; color: var(--text-mid); font-size: 13px; }
        .info-icon { color: var(--gold); }

        /* ── SECTION ── */
        section { padding: 80px 48px; }
        .section-eyebrow {
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: var(--gold); opacity: .8; margin-bottom: 12px; text-align: center;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 52px); font-weight: 400;
          color: var(--text); text-align: center; letter-spacing: -.5px;
          margin-bottom: 48px; line-height: 1.1;
        }
        .section-title em { color: var(--gold-lt); font-style: italic; }

        /* ── FEATURED ── */
        .featured-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .dish-card {
          background: var(--glass-bg); border: 1px solid var(--glass-bd);
          border-radius: var(--radius-card); padding: 28px;
          position: relative; overflow: hidden;
          transition: border-color .25s, transform .2s; cursor: pointer;
        }
        .dish-card::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }
        .dish-card::after  { content: ''; position: absolute; top: 0; left: 0; width: 1px; height: 80px; background: linear-gradient(180deg, var(--gold), transparent); }
        .dish-card:hover { border-color: rgba(201,168,76,.25); transform: translateY(-4px); }
        .dish-tag {
          display: inline-flex; font-size: 10px; letter-spacing: 1.5px;
          text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-bottom: 16px;
          background: rgba(201,168,76,.1); border: 1px solid rgba(201,168,76,.2); color: var(--gold);
        }
        .dish-emoji { font-size: 40px; display: block; margin-bottom: 16px; }
        .dish-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; color: var(--text); margin-bottom: 8px; letter-spacing: .3px; }
        .dish-desc { font-size: 12.5px; color: var(--text-mid); line-height: 1.6; font-weight: 300; margin-bottom: 20px; }
        .dish-footer { display: flex; align-items: center; justify-content: space-between; }
        .dish-price { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 500; color: var(--gold-lt); }
        .dish-add-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(201,168,76,.1); border: 1px solid rgba(201,168,76,.2);
          color: var(--gold); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 300; transition: all .2s;
        }
        .dish-add-btn:hover { background: rgba(201,168,76,.2); border-color: rgba(201,168,76,.4); }

        /* ── CTA ── */
        .cta-section {
          background: var(--glass-bg);
          border-top: 1px solid var(--glass-bd); border-bottom: 1px solid var(--glass-bd);
          padding: 80px 48px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;
        }
        .cta-text .section-eyebrow { text-align: left; }
        .cta-text .section-title { text-align: left; font-size: 40px; margin-bottom: 16px; }
        .cta-desc { font-size: 15px; color: var(--text-mid); line-height: 1.7; font-weight: 300; margin-bottom: 28px; }
        .reserv-card {
          background: var(--deep); border: 1px solid var(--glass-bd);
          border-radius: var(--radius-card); padding: 32px;
          position: relative; overflow: hidden;
        }
        .reserv-card::before { content: ''; position: absolute; top: 0; left: 0; width: 120px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }
        .reserv-card::after  { content: ''; position: absolute; top: 0; left: 0; width: 1px; height: 120px; background: linear-gradient(180deg, var(--gold), transparent); }
        .reserv-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: var(--text); margin-bottom: 20px; }
        .reserv-field { margin-bottom: 14px; }
        .reserv-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; display: block; }
        .reserv-input {
          width: 100%; padding: 10px 14px;
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--text); outline: none; transition: border-color .25s;
        }
        .reserv-input:focus { border-color: rgba(201,168,76,.35); }
        .reserv-input option { background: var(--deep); }

        /* ── REVIEWS ── */
        .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .review-card { background: var(--glass-bg); border: 1px solid var(--glass-bd); border-radius: var(--radius-card); padding: 24px; }
        .review-stars { display: flex; gap: 3px; color: var(--gold); margin-bottom: 12px; }
        .review-text { font-size: 13.5px; color: var(--text-mid); line-height: 1.7; font-weight: 300; font-style: italic; margin-bottom: 16px; }
        .review-author { display: flex; align-items: center; gap: 10px; }
        .review-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(201,168,76,.2), rgba(201,168,76,.05));
          border: 1px solid rgba(201,168,76,.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: var(--gold-lt); font-family: 'Cormorant Garamond', serif;
        }
        .review-name { font-size: 13px; color: var(--text); }
        .review-date { font-size: 11px; color: var(--text-muted); }

        /* ── FOOTER ── */
        .cliente-footer {
          border-top: 1px solid var(--glass-bd); padding: 32px 48px;
          display: flex; align-items: center; justify-content: space-between;
          color: var(--text-muted); font-size: 12px;
        }
        .footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--text-mid); letter-spacing: 1.5px; }
        .footer-gold { color: var(--gold); }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .nav-mobile-btn { display: flex; }
          .featured-grid { grid-template-columns: 1fr; }
          .reviews-grid { grid-template-columns: 1fr; }
          .cta-section { grid-template-columns: 1fr; }
          section { padding: 60px 24px; }
          .cliente-nav { padding: 0 24px; }
          .info-strip { gap: 16px; }
        }
      `}</style>

      <div className="cliente-page">
        {/* ── NAVBAR ── */}
        <nav className="cliente-nav">
          <div className="nav-brand" onClick={() => navigate('/cliente/inicio')}>
            <div className="nav-brand-icon"><IconMenu /></div>
            <span className="nav-brand-name">Restaurante</span>
          </div>

          <div className="nav-links">
            {NAV_LINKS.map(link => (
              <button
                key={link.key}
                className={`nav-link ${activeKey === link.key ? 'active' : ''}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="nav-right">
            {/* Avatar → navega al perfil */}
            <div
              className="nav-avatar"
              title={`${user?.name || 'Mi perfil'} — ver perfil`}
              onClick={() => navigate('/cliente/perfil')}
            >
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" />
                : initials
              }
            </div>
            <button className="nav-logout-btn" onClick={logout}>
              <IconLogout /> Salir
            </button>
            <button
              className="nav-mobile-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <IconHamburger />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(link => (
            <button
              key={link.key}
              className={`mobile-nav-link ${activeKey === link.key ? 'active' : ''}`}
              onClick={() => { navigate(link.path); setMobileMenuOpen(false) }}
            >
              {link.label}
            </button>
          ))}
          <button
            className="mobile-nav-link"
            style={{ color: '#e05a5a', marginTop: 8, borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 12 }}
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>

        {/* ── HERO ── */}
        <div className="hero">
          <div className="hero-bg" />
          <div className="hero-grain" />
          <div className="hero-line" />

          <div style={{ position: 'absolute', width: 500, height: 500, top: -180, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, bottom: -100, left: -60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <div className="hero-content">
            <div className="hero-eyebrow">Gastronomía de Autor</div>
            <h1 className="hero-title">
              Una experiencia<br />
              <span>gastronómica</span><br />
              sin igual
            </h1>
            <p className="hero-subtitle">
              Bienvenido{user?.name ? `, ${user.name}` : ''}. Descubre nuestra cocina de autor,
              reserva tu mesa o haz un pedido a domicilio.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/cliente/menu')}>
                Ver el Menú <IconArrow />
              </button>
              <button className="btn-ghost" onClick={() => navigate('/cliente/reservar')}>
                Reservar Mesa
              </button>
            </div>

            <div className="info-strip">
              <div className="info-item"><span className="info-icon"><IconMapPin /></span>Ciudad de Guatemala, Zona 10</div>
              <div className="info-item"><span className="info-icon"><IconClock /></span>Lun–Dom · 12:00 – 23:00</div>
              <div className="info-item"><span className="info-icon"><IconStar /></span>4.9 · Más de 1,200 reseñas</div>
            </div>
          </div>
        </div>

        {/* ── FEATURED DISHES ── */}
        <section>
          <div className="section-eyebrow">Nuestras Especialidades</div>
          <h2 className="section-title">Lo mejor de<br /><em>nuestra cocina</em></h2>
          <div className="featured-grid">
            {FEATURED_DISHES.map((d, i) => (
              <div className="dish-card" key={i} onClick={() => navigate('/cliente/menu')}>
                <span className="dish-tag">{d.tag}</span>
                <span className="dish-emoji">{d.emoji}</span>
                <div className="dish-name">{d.name}</div>
                <div className="dish-desc">{d.desc}</div>
                <div className="dish-footer">
                  <div className="dish-price">{d.price}</div>
                  <button className="dish-add-btn" onClick={e => { e.stopPropagation(); navigate('/cliente/menu') }}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button className="btn-primary" onClick={() => navigate('/cliente/menu')}>
              Ver menú completo <IconArrow />
            </button>
          </div>
        </section>

        {/* ── CTA RESERVAR ── */}
        <div className="cta-section">
          <div className="cta-text">
            <div className="section-eyebrow">Reservaciones</div>
            <h2 className="section-title">Reserva tu<br /><em>mesa ahora</em></h2>
            <p className="cta-desc">
              Garantiza tu espacio en el restaurante. Recibe confirmación inmediata
              y recordatorio por correo electrónico.
            </p>
            <button className="btn-primary" onClick={() => navigate('/cliente/reservar')}>
              Reservar ahora <IconArrow />
            </button>
          </div>

          <div className="reserv-card">
            <div className="reserv-title">Reserva Rápida</div>
            <div className="reserv-field">
              <label className="reserv-label">Fecha</label>
              <input className="reserv-input" type="date" />
            </div>
            <div className="reserv-field">
              <label className="reserv-label">Hora</label>
              <select className="reserv-input">
                <option>12:00 PM</option><option>13:00 PM</option>
                <option>14:00 PM</option><option>19:00 PM</option>
                <option>20:00 PM</option><option>21:00 PM</option>
              </select>
            </div>
            <div className="reserv-field">
              <label className="reserv-label">Número de personas</label>
              <select className="reserv-input">
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n}>{n} persona{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
              onClick={() => navigate('/cliente/reservar')}
            >
              Confirmar reserva <IconArrow />
            </button>
          </div>
        </div>

        {/* ── RESEÑAS ── */}
        <section>
          <div className="section-eyebrow">Lo que dicen nuestros clientes</div>
          <h2 className="section-title">Experiencias<br /><em>memorables</em></h2>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="review-stars">
                  {Array.from({ length: r.rating }).map((_, j) => <IconStar key={j} />)}
                </div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{r.name[0]}</div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-date">{r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="cliente-footer">
          <div className="footer-brand">
            Restaurante <span className="footer-gold">·</span> Guatemala
          </div>
          <div>© {new Date().getFullYear()} · Todos los derechos reservados</div>
        </footer>
      </div>
    </>
  )
}
