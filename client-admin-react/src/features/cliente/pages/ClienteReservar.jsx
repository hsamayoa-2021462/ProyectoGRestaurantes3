// src/features/cliente/pages/ClienteReservar.jsx
import { useState } from 'react'
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
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)
const IconHamburger = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconExperience = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const NAV_LINKS = [
  { key: 'inicio',      label: 'Inicio' },
  { key: 'menu',        label: 'Menú' },
  { key: 'reservar',    label: 'Reservar Mesa' },
  { key: 'pedidos',     label: 'Mis Pedidos' },
  { key: 'experiencia', label: 'Experiencia' },
  { key: 'perfil',      label: 'Mi Perfil' },
]

const HORARIOS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
]

const MESAS_MOCK = [
  { id: 1, numero: 'Mesa 1', capacidad: 2, zona: 'Terraza',   disponible: true,  imagen: '🌿' },
  { id: 2, numero: 'Mesa 2', capacidad: 4, zona: 'Interior',  disponible: true,  imagen: '🕯️' },
  { id: 3, numero: 'Mesa 3', capacidad: 4, zona: 'Ventana',   disponible: false, imagen: '🌆' },
  { id: 4, numero: 'Mesa 4', capacidad: 6, zona: 'Privado',   disponible: true,  imagen: '🔒' },
  { id: 5, numero: 'Mesa 5', capacidad: 2, zona: 'Bar',       disponible: true,  imagen: '🍷' },
  { id: 6, numero: 'Mesa 6', capacidad: 8, zona: 'Salón',     disponible: false, imagen: '✨' },
  { id: 7, numero: 'Mesa 7', capacidad: 4, zona: 'Terraza',   disponible: true,  imagen: '🌿' },
  { id: 8, numero: 'Mesa 8', capacidad: 2, zona: 'Interior',  disponible: true,  imagen: '🕯️' },
]

const PASOS = [
  { num: 1, label: 'Fecha & Hora' },
  { num: 2, label: 'Mesa' },
  { num: 3, label: 'Confirmación' },
]

export default function ClienteReservar() {
  const [activeNav, setActiveNav] = useState('reservar')
  const { user, logout } = useAuthStore()

  const [paso, setPaso]           = useState(1)
  const [fecha, setFecha]         = useState('')
  const [hora, setHora]           = useState('')
  const [personas, setPersonas]   = useState(2)
  const [mesaSelec, setMesaSelec] = useState(null)
  const [notas, setNotas]         = useState('')
  const [confirmado, setConfirmado] = useState(false)
  const [saving, setSaving]       = useState(false)

  const hoy = new Date().toISOString().split('T')[0]

  const mesasFiltradas = MESAS_MOCK.filter(m => m.capacidad >= personas)

  const handleConfirmar = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1400))
    setSaving(false)
    setConfirmado(true)
  }

  const handleReset = () => {
    setPaso(1); setFecha(''); setHora(''); setPersonas(2)
    setMesaSelec(null); setNotas(''); setConfirmado(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black:     #07080a;
          --deep:      #0d0f12;
          --surface:   #12151a;
          --glass-bg:  rgba(255,255,255,0.045);
          --glass-bd:  rgba(255,255,255,0.09);
          --glass-hi:  rgba(255,255,255,0.13);
          --gold:      #c9a84c;
          --gold-lt:   #e8c96a;
          --gold-dim:  rgba(201,168,76,.08);
          --text:      #f0ead8;
          --text-mid:  #9a9385;
          --text-muted:#5a554d;
          --success:   #4caf82;
          --error:     #e05a5a;
          --radius-card: 20px;
          --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
        }
        body { font-family:'Outfit',sans-serif; background:var(--black); color:var(--text); min-height:100vh; overflow-x:hidden; }

        /* NAVBAR */
        .cliente-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          height:70px;
          background:rgba(7,8,10,.85);
          backdrop-filter:blur(24px) saturate(180%);
          border-bottom:1px solid var(--glass-bd);
          display:flex; align-items:center; justify-content:space-between;
          padding:0 48px;
        }
        .nav-brand { display:flex; align-items:center; gap:12px; }
        .nav-brand-icon {
          width:38px; height:38px; border-radius:10px;
          background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));
          border:1px solid rgba(201,168,76,.25);
          display:flex; align-items:center; justify-content:center; color:var(--gold);
        }
        .nav-brand-name {
          font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500;
          letter-spacing:2px; text-transform:uppercase; color:var(--text);
        }
        .nav-links { display:flex; align-items:center; gap:2px; }
        .nav-link {
          padding:7px 14px; border-radius:8px; font-size:13px; color:var(--text-mid);
          cursor:pointer; transition:all .2s; background:none; border:none;
          font-family:'Outfit',sans-serif;
        }
        .nav-link:hover { color:var(--text); background:var(--glass-bg); }
        .nav-link.active { color:var(--gold-lt); background:var(--gold-dim); }
        .nav-right { display:flex; align-items:center; gap:10px; }
        .nav-avatar {
          width:36px; height:36px; border-radius:10px;
          background:linear-gradient(135deg,rgba(201,168,76,.25),rgba(201,168,76,.08));
          border:1px solid rgba(201,168,76,.2);
          display:flex; align-items:center; justify-content:center;
          font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:500;
          color:var(--gold-lt); cursor:pointer;
        }
        .nav-logout-btn {
          display:flex; align-items:center; gap:6px; padding:7px 12px;
          border-radius:8px; background:none; border:1px solid rgba(255,255,255,.08);
          color:var(--text-muted); cursor:pointer;
          font-family:'Outfit',sans-serif; font-size:12.5px; transition:all .2s;
        }
        .nav-logout-btn:hover { border-color:rgba(224,90,90,.3); color:#e05a5a; background:rgba(224,90,90,.06); }

        /* PAGE */
        .cliente-page { padding-top:70px; min-height:100vh; }

        /* HERO */
        .page-hero {
          padding:52px 48px 40px;
          background:linear-gradient(180deg,var(--deep) 0%,var(--black) 100%);
          border-bottom:1px solid var(--glass-bd);
          position:relative; overflow:hidden;
        }
        .page-hero::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,var(--gold),transparent);
          opacity:.3;
        }
        .page-hero-bg {
          position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse 60% 100% at 80% 50%,rgba(201,168,76,.04) 0%,transparent 60%);
        }
        .page-hero-inner { position:relative; z-index:1; }
        .page-eyebrow {
          font-size:10px; letter-spacing:4px; text-transform:uppercase;
          color:var(--gold); opacity:.8; margin-bottom:10px;
          display:flex; align-items:center; gap:12px;
        }
        .page-eyebrow::before {
          content:''; width:30px; height:1px;
          background:linear-gradient(90deg,transparent,var(--gold));
        }
        .page-title {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(32px,4vw,48px); font-weight:400;
          color:var(--text); letter-spacing:-.5px; line-height:1.1;
        }
        .page-title span { color:var(--gold-lt); font-style:italic; }
        .page-subtitle {
          font-size:14px; color:var(--text-mid); margin-top:8px;
          font-weight:300; letter-spacing:.2px;
        }

        /* CONTENT */
        .reservar-content { padding:40px 48px; max-width:860px; margin:0 auto; }

        /* STEPPER */
        .stepper {
          display:flex; align-items:center; gap:0; margin-bottom:40px;
        }
        .step-item { display:flex; align-items:center; flex:1; }
        .step-dot-wrap {
          display:flex; flex-direction:column; align-items:center; gap:6px; flex-shrink:0;
        }
        .step-dot {
          width:36px; height:36px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          border:2px solid var(--glass-bd); background:var(--deep);
          font-size:13px; font-weight:500; color:var(--text-muted);
          transition:all .35s var(--ease-out-expo);
        }
        .step-dot.active {
          border-color:var(--gold); background:rgba(201,168,76,.15);
          color:var(--gold-lt); box-shadow:0 0 16px rgba(201,168,76,.25);
        }
        .step-dot.done {
          border-color:var(--gold); background:var(--gold);
          color:var(--black);
        }
        .step-label {
          font-size:11px; color:var(--text-muted); white-space:nowrap;
          letter-spacing:.3px;
        }
        .step-label.active { color:var(--gold-lt); }
        .step-label.done { color:var(--text-mid); }
        .step-line {
          flex:1; height:1px;
          background:var(--glass-bd);
          margin:0 8px; margin-bottom:22px;
          transition:background .4s;
        }
        .step-line.done { background:linear-gradient(90deg,var(--gold),rgba(201,168,76,.3)); }

        /* STEP CARDS */
        .step-card {
          background:var(--glass-bg); border:1px solid var(--glass-bd);
          border-radius:var(--radius-card); padding:32px;
          animation:fadeUp .35s var(--ease-out-expo);
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .step-card-title {
          font-family:'Cormorant Garamond',serif; font-size:22px;
          font-weight:500; color:var(--text); margin-bottom:4px;
        }
        .step-card-sub {
          font-size:13px; color:var(--text-muted); margin-bottom:28px;
        }

        /* FORM ELEMENTS */
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:18px; }
        .form-group { display:flex; flex-direction:column; gap:6px; }
        .form-label {
          font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
          color:var(--text-muted); display:flex; align-items:center; gap:6px;
        }
        .form-label svg { color:var(--gold); opacity:.7; }
        .form-input, .form-select, .form-textarea {
          background:rgba(255,255,255,.04); border:1px solid var(--glass-bd);
          border-radius:11px; padding:11px 14px; color:var(--text);
          font-family:'Outfit',sans-serif; font-size:13.5px; outline:none;
          transition:border-color .2s; width:100%;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color:rgba(201,168,76,.4);
        }
        .form-select option { background:var(--deep); }
        .form-textarea { resize:vertical; min-height:90px; }
        .form-input[type="date"]::-webkit-calendar-picker-indicator {
          filter:invert(.6) sepia(1) hue-rotate(5deg) saturate(.5);
          cursor:pointer;
        }

        /* HORARIOS GRID */
        .horarios-title {
          font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
          color:var(--text-muted); margin-bottom:12px; display:flex; align-items:center; gap:6px;
        }
        .horarios-title svg { color:var(--gold); opacity:.7; }
        .horarios-grid {
          display:grid; grid-template-columns:repeat(6,1fr); gap:8px; margin-bottom:24px;
        }
        .horario-btn {
          padding:9px 0; border-radius:9px; text-align:center;
          background:rgba(255,255,255,.04); border:1px solid var(--glass-bd);
          color:var(--text-mid); cursor:pointer; font-size:13px;
          font-family:'Outfit',sans-serif; transition:all .2s;
        }
        .horario-btn:hover { border-color:rgba(201,168,76,.3); color:var(--gold-lt); background:var(--gold-dim); }
        .horario-btn.selected {
          border-color:var(--gold); background:rgba(201,168,76,.15);
          color:var(--gold-lt);
        }

        /* PERSONAS COUNTER */
        .personas-wrap {
          display:flex; align-items:center; gap:14px; margin-bottom:28px;
        }
        .personas-label {
          font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
          color:var(--text-muted); display:flex; align-items:center; gap:6px;
        }
        .personas-label svg { color:var(--gold); opacity:.7; }
        .counter-btn {
          width:34px; height:34px; border-radius:8px;
          background:var(--glass-bg); border:1px solid var(--glass-bd);
          display:flex; align-items:center; justify-content:center;
          color:var(--text-mid); cursor:pointer; font-size:18px;
          font-family:'Outfit',sans-serif; transition:all .2s; user-select:none;
        }
        .counter-btn:hover { color:var(--gold-lt); border-color:rgba(201,168,76,.3); background:var(--gold-dim); }
        .counter-val {
          font-family:'Cormorant Garamond',serif; font-size:26px;
          color:var(--gold-lt); min-width:30px; text-align:center;
        }

        /* MESAS GRID */
        .mesas-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px;
        }
        .mesa-card {
          background:var(--glass-bg); border:1px solid var(--glass-bd);
          border-radius:14px; padding:16px 12px; text-align:center;
          cursor:pointer; transition:all .2s; position:relative; overflow:hidden;
        }
        .mesa-card:hover:not(.disabled) {
          border-color:rgba(201,168,76,.3); background:rgba(255,255,255,.06);
          transform:translateY(-2px);
        }
        .mesa-card.selected {
          border-color:var(--gold); background:rgba(201,168,76,.12);
          box-shadow:0 0 20px rgba(201,168,76,.12);
        }
        .mesa-card.selected::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,transparent,var(--gold),transparent);
        }
        .mesa-card.disabled {
          opacity:.4; cursor:not-allowed;
        }
        .mesa-emoji { font-size:22px; margin-bottom:8px; }
        .mesa-numero {
          font-family:'Cormorant Garamond',serif; font-size:16px;
          font-weight:500; color:var(--text); margin-bottom:2px;
        }
        .mesa-zona { font-size:11px; color:var(--text-muted); margin-bottom:6px; }
        .mesa-cap {
          font-size:11.5px; color:var(--text-muted);
          display:flex; align-items:center; justify-content:center; gap:4px;
        }
        .mesa-cap-num { color:var(--gold); font-weight:500; }
        .badge-no-disp {
          font-size:10px; padding:2px 7px; border-radius:20px;
          background:rgba(224,90,90,.1); border:1px solid rgba(224,90,90,.2);
          color:var(--error); margin-top:4px; display:inline-block;
        }
        .badge-sel {
          font-size:10px; padding:2px 7px; border-radius:20px;
          background:rgba(201,168,76,.15); border:1px solid rgba(201,168,76,.3);
          color:var(--gold-lt); margin-top:4px; display:inline-block;
        }

        /* RESUMEN */
        .resumen-card {
          background:var(--glass-bg); border:1px solid rgba(201,168,76,.2);
          border-radius:14px; padding:22px 24px; margin-bottom:24px;
          position:relative; overflow:hidden;
        }
        .resumen-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,var(--gold),rgba(201,168,76,.2),transparent);
        }
        .resumen-title {
          font-size:9px; letter-spacing:3px; text-transform:uppercase;
          color:var(--gold); margin-bottom:16px;
        }
        .resumen-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:9px 0; border-bottom:1px solid rgba(255,255,255,.04);
        }
        .resumen-row:last-child { border-bottom:none; }
        .resumen-key { font-size:12px; color:var(--text-muted); }
        .resumen-val {
          font-size:13.5px; color:var(--text); font-weight:400;
        }
        .resumen-val.gold {
          font-family:'Cormorant Garamond',serif; font-size:16px;
          color:var(--gold-lt);
        }

        /* CONFIRMACION */
        .confirm-wrap {
          text-align:center; padding:32px 24px;
          animation:fadeUp .5s var(--ease-out-expo);
        }
        .confirm-icon-circle {
          width:72px; height:72px; border-radius:50%;
          background:rgba(76,175,130,.12); border:2px solid rgba(76,175,130,.3);
          display:flex; align-items:center; justify-content:center;
          color:var(--success); margin:0 auto 20px;
          box-shadow:0 0 30px rgba(76,175,130,.1);
        }
        .confirm-title {
          font-family:'Cormorant Garamond',serif; font-size:30px;
          color:var(--text); margin-bottom:8px; font-weight:400;
        }
        .confirm-sub { font-size:14px; color:var(--text-mid); margin-bottom:28px; font-weight:300; }
        .confirm-id {
          font-family:'Cormorant Garamond',serif; font-size:22px;
          color:var(--gold-lt); background:var(--gold-dim);
          border:1px solid rgba(201,168,76,.25); border-radius:10px;
          padding:10px 22px; display:inline-block; margin-bottom:28px; letter-spacing:1px;
        }

        /* NAV BTNS */
        .nav-btns { display:flex; gap:10px; justify-content:flex-end; margin-top:8px; }
        .btn-back {
          padding:10px 20px; border-radius:10px; background:none;
          border:1px solid var(--glass-bd); color:var(--text-muted);
          cursor:pointer; font-family:'Outfit',sans-serif; font-size:13px;
          transition:all .2s;
        }
        .btn-back:hover { border-color:var(--glass-hi); color:var(--text); }
        .btn-next {
          padding:10px 24px; border-radius:10px;
          background:linear-gradient(135deg,rgba(201,168,76,.28),rgba(201,168,76,.1));
          border:1px solid rgba(201,168,76,.35); color:var(--gold-lt);
          cursor:pointer; font-family:'Outfit',sans-serif; font-size:13px;
          font-weight:500; transition:all .2s;
          display:flex; align-items:center; gap:8px;
        }
        .btn-next:hover { background:linear-gradient(135deg,rgba(201,168,76,.42),rgba(201,168,76,.18)); border-color:rgba(201,168,76,.55); transform:translateY(-1px); }
        .btn-next:disabled { opacity:.4; cursor:not-allowed; transform:none; }

        /* FOOTER */
        .cliente-footer {
          border-top:1px solid var(--glass-bd); padding:28px 48px;
          display:flex; align-items:center; justify-content:space-between;
          color:var(--text-muted); font-size:12px; margin-top:40px;
        }
        .footer-brand { font-family:'Cormorant Garamond',serif; font-size:17px; color:var(--text-mid); letter-spacing:1.5px; }
        .footer-gold { color:var(--gold); }

        @media (max-width:900px) {
          .nav-links { display:none; }
          .cliente-nav { padding:0 24px; }
          .page-hero { padding:40px 24px 30px; }
          .reservar-content { padding:24px; }
          .mesas-grid { grid-template-columns:repeat(2,1fr); }
          .horarios-grid { grid-template-columns:repeat(4,1fr); }
          .form-grid { grid-template-columns:1fr; }
          .cliente-footer { padding:24px; flex-direction:column; gap:8px; }
        }
      `}</style>

      <div className="cliente-page">

        {/* NAVBAR */}
        <nav className="cliente-nav">
          <div className="nav-brand">
            <div className="nav-brand-icon"><IconMenu /></div>
            <span className="nav-brand-name">Restaurante</span>
          </div>
          <div className="nav-links">
            {NAV_LINKS.filter(n => n.key !== 'perfil').map(link => (
              <button key={link.key} className={`nav-link ${activeNav === link.key ? 'active' : ''}`} onClick={() => setActiveNav(link.key)}>
                {link.label}
              </button>
            ))}
          </div>
          <div className="nav-right">
            <div className="nav-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <button className="nav-logout-btn" onClick={logout}><IconLogout /> Salir</button>
          </div>
        </nav>

        {/* HERO */}
        <div className="page-hero">
          <div className="page-hero-bg" />
          <div className="page-hero-inner">
            <div className="page-eyebrow">Reservaciones</div>
            <h1 className="page-title">Reserva tu <span>mesa perfecta</span></h1>
            <p className="page-subtitle">Elige la fecha, hora y mesa. Nosotros hacemos el resto.</p>
          </div>
        </div>

        <div className="reservar-content">

          {/* STEPPER */}
          {!confirmado && (
            <div className="stepper">
              {PASOS.map((p, i) => (
                <div className="step-item" key={p.num}>
                  <div className="step-dot-wrap">
                    <div className={`step-dot ${paso === p.num ? 'active' : paso > p.num ? 'done' : ''}`}>
                      {paso > p.num ? <IconCheck /> : p.num}
                    </div>
                    <span className={`step-label ${paso === p.num ? 'active' : paso > p.num ? 'done' : ''}`}>{p.label}</span>
                  </div>
                  {i < PASOS.length - 1 && (
                    <div className={`step-line ${paso > p.num ? 'done' : ''}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── PASO 1 ── */}
          {!confirmado && paso === 1 && (
            <div className="step-card">
              <div className="step-card-title">¿Cuándo deseas visitarnos?</div>
              <div className="step-card-sub">Selecciona fecha, hora y número de personas</div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label"><IconCalendar /> Fecha</label>
                  <input className="form-input" type="date" min={hoy} value={fecha} onChange={e => setFecha(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="personas-label"><IconUsers /> Personas</div>
                  <div className="personas-wrap" style={{ marginBottom: 0 }}>
                    <button className="counter-btn" onClick={() => setPersonas(p => Math.max(1, p - 1))}>−</button>
                    <span className="counter-val">{personas}</span>
                    <button className="counter-btn" onClick={() => setPersonas(p => Math.min(12, p + 1))}>+</button>
                  </div>
                </div>
              </div>

              <div className="horarios-title"><IconClock /> Horario disponible</div>
              <div className="horarios-grid">
                {HORARIOS.map(h => (
                  <button key={h} className={`horario-btn ${hora === h ? 'selected' : ''}`} onClick={() => setHora(h)}>{h}</button>
                ))}
              </div>

              <div className="nav-btns">
                <button className="btn-next" disabled={!fecha || !hora} onClick={() => setPaso(2)}>
                  Elegir Mesa <IconArrow />
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 2 ── */}
          {!confirmado && paso === 2 && (
            <div className="step-card">
              <div className="step-card-title">Elige tu mesa</div>
              <div className="step-card-sub">Mostrando mesas disponibles para {personas} personas · {fecha} · {hora}</div>

              <div className="mesas-grid">
                {mesasFiltradas.map(m => (
                  <div
                    key={m.id}
                    className={`mesa-card ${!m.disponible ? 'disabled' : ''} ${mesaSelec?.id === m.id ? 'selected' : ''}`}
                    onClick={() => m.disponible && setMesaSelec(m)}
                  >
                    <div className="mesa-emoji">{m.imagen}</div>
                    <div className="mesa-numero">{m.numero}</div>
                    <div className="mesa-zona">{m.zona}</div>
                    <div className="mesa-cap">Hasta <span className="mesa-cap-num">&nbsp;{m.capacidad}&nbsp;</span> personas</div>
                    {!m.disponible && <div className="badge-no-disp">Ocupada</div>}
                    {mesaSelec?.id === m.id && <div className="badge-sel">Seleccionada</div>}
                  </div>
                ))}
              </div>

              <div className="nav-btns">
                <button className="btn-back" onClick={() => { setPaso(1); setMesaSelec(null) }}>Atrás</button>
                <button className="btn-next" disabled={!mesaSelec} onClick={() => setPaso(3)}>
                  Confirmar <IconArrow />
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 3 ── */}
          {!confirmado && paso === 3 && (
            <div className="step-card">
              <div className="step-card-title">Confirma tu reservación</div>
              <div className="step-card-sub">Revisa los detalles antes de finalizar</div>

              <div className="resumen-card">
                <div className="resumen-title">Detalles de la reservación</div>
                <div className="resumen-row"><span className="resumen-key">Fecha</span><span className="resumen-val">{fecha}</span></div>
                <div className="resumen-row"><span className="resumen-key">Hora</span><span className="resumen-val gold">{hora}</span></div>
                <div className="resumen-row"><span className="resumen-key">Personas</span><span className="resumen-val">{personas} personas</span></div>
                <div className="resumen-row"><span className="resumen-key">Mesa</span><span className="resumen-val gold">{mesaSelec?.numero} — {mesaSelec?.zona}</span></div>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Notas especiales (opcional)</label>
                <textarea className="form-textarea" value={notas} onChange={e => setNotas(e.target.value)} placeholder="Alergias, celebración especial, silla para bebé..." />
              </div>

              <div className="nav-btns">
                <button className="btn-back" onClick={() => setPaso(2)}>Atrás</button>
                <button className="btn-next" disabled={saving} onClick={handleConfirmar}>
                  {saving ? 'Reservando...' : 'Confirmar Reservación'} {!saving && <IconArrow />}
                </button>
              </div>
            </div>
          )}

          {/* ── CONFIRMADO ── */}
          {confirmado && (
            <div className="step-card">
              <div className="confirm-wrap">
                <div className="confirm-icon-circle"><IconCheck /></div>
                <div className="confirm-title">¡Reservación confirmada!</div>
                <div className="confirm-sub">Te esperamos el {fecha} a las {hora} en {mesaSelec?.numero}</div>
                <div className="confirm-id">#RES-{Math.floor(10000 + Math.random() * 90000)}</div>
                <button className="btn-next" style={{ margin: '0 auto', display: 'flex' }} onClick={handleReset}>
                  Nueva Reservación <IconArrow />
                </button>
              </div>
            </div>
          )}

        </div>

        <footer className="cliente-footer">
          <div className="footer-brand">Restaurante <span className="footer-gold">·</span> Guatemala</div>
          <div>© {new Date().getFullYear()} · Todos los derechos reservados</div>
        </footer>
      </div>
    </>
  )
}
