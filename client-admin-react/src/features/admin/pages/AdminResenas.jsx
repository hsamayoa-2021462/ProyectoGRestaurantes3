import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import api, { authApi } from '../../../shared/api/api'

/* ─── ICONS ─── */
const IconDash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
const IconRest = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconStar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>

const NAV = [
    { key: 'dashboard', label: 'Dashboard', icon: <IconDash />, path: '/admin/dashboard' },
    { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/admin/menu' },
    { key: 'pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/admin/pedidos' },
    { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />, path: '/admin/reservaciones' },
    { key: 'restaurantes', label: 'Restaurantes', icon: <IconRest />, path: '/admin/restaurantes' },
    { key: 'clientes', label: 'Clientes', icon: <IconUsers />, path: '/admin/clientes' },
    { key: 'reportes', label: 'Reportes', icon: <IconReport />, path: '/admin/reportes' },
    { key: 'resenas', label: 'Reseñas', icon: <IconStar />, path: '/admin/resenas' },
]

function StarDisplay({ value }) {
    return (
        <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ fontSize: 14, color: n <= value ? '#c9a84c' : 'rgba(255,255,255,.12)' }}>★</span>
            ))}
        </div>
    )
}

export default function AdminResenas() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const getActiveKey = () => NAV.find(i => i.path === location.pathname)?.key || 'resenas'
    const [activeNav, setActiveNav] = useState(getActiveKey())
    useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture || null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        authApi.get('/auth/profile').then(r => {
            const url = r.data?.data?.profilePicture
            if (url) setAvatarSrc(url)
        }).catch(() => { })
    }, [])

    const [restaurantes, setRestaurantes] = useState([])
    const [restSelec, setRestSelec] = useState(null)
    const [resenas, setResenas] = useState([])
    const [promedio, setPromedio] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingRes, setLoadingRes] = useState(false)
    const loadedRef = useRef(false)

    const load = async () => {
        setLoading(true)
        try {
            const res = await api.get('/restaurante/restaurantes')
            const rests = res.data?.data || []
            setRestaurantes(rests)
            if (rests.length > 0) cargarResenas(rests[0]._id)
        } catch { }
        finally { setLoading(false) }
    }

    const cargarResenas = async (restId) => {
        setRestSelec(restId)
        setLoadingRes(true)
        try {
            const res = await api.get(`/resenas/restaurante/${restId}`)
            setResenas(res.data?.data || [])
            setPromedio(res.data?.promedio || 0)
        } catch { setResenas([]); setPromedio(0) }
        finally { setLoadingRes(false) }
    }

    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        load()
    }, [])

    const initials = (user?.name?.[0] || 'A').toUpperCase()
    const restActual = restaurantes.find(r => r._id === restSelec)

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--black:#07080a;--deep:#0d0f12;--surface:#12151a;--glass-bg:rgba(255,255,255,.045);--glass-bd:rgba(255,255,255,.09);--gold:#c9a84c;--gold-lt:#e8c96a;--gold-dim:rgba(201,168,76,.08);--text:#f0ead8;--text-mid:#9a9385;--text-muted:#5a554d;--success:#4caf82;--error:#e05a5a;--sb-w:220px;--radius-card:20px;}
        html{overflow-x:hidden;width:100%}
        body{font-family:'Outfit',sans-serif;background:var(--black);color:var(--text);min-height:100vh;width:100%;overflow-x:hidden}
        .layout{display:flex;min-height:100vh;width:100%;max-width:100vw;overflow-x:hidden;position:relative}
        .sidebar{width:var(--sb-w);flex-shrink:0;background:var(--deep);border-right:1px solid var(--glass-bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:110;transition:transform .3s}
        .sidebar-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:105;display:none}
        .sb-logo{padding:24px 20px 16px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;gap:10px}
        .sb-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;color:var(--gold);flex-shrink:0}
        .sb-logo-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase}
        .sb-nav{flex:1;padding:12px 8px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
        .sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s;border:1px solid transparent}
        .sb-item:hover{background:var(--glass-bg);color:var(--text)}
        .sb-item.active{background:var(--gold-dim);color:var(--gold-lt);border-color:rgba(201,168,76,.2)}
        .sb-footer{padding:16px 8px;border-top:1px solid var(--glass-bd)}
        .sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:background .2s}
        .sb-user:hover{background:var(--glass-bg)}
        .sb-av{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold-lt);font-family:'Cormorant Garamond',serif;flex-shrink:0;overflow:hidden}
        .sb-av img{width:100%;height:100%;object-fit:cover}
        .sb-uname{font-size:12px;font-weight:500;color:var(--text)}
        .sb-role{font-size:10px;color:var(--text-muted)}
        .sb-out{width:100%;margin-top:6px;padding:8px;border-radius:10px;background:none;border:1px solid rgba(224,90,90,.2);color:var(--error);cursor:pointer;font-size:12px;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
        .sb-out:hover{background:rgba(224,90,90,.08)}
        .main{flex:1;margin-left:var(--sb-w);display:flex;flex-direction:column;min-height:100vh;min-width:0;max-width:100%;transition:margin .3s}
        .topbar{padding:20px 32px;border-bottom:1px solid var(--glass-bd);display:flex;align-items:center;justify-content:space-between;background:var(--deep);position:sticky;top:0;z-index:40;gap:12px}
        .topbar-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .topbar-sub{font-size:12px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .topbar-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .menu-btn{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:10px;color:var(--text-mid);cursor:pointer;display:none;align-items:center;justify-content:center;width:36px;height:36px;flex-shrink:0;transition:all .2s}
        .menu-btn:hover{color:var(--gold-lt);border-color:rgba(201,168,76,.3)}
        .av-wrap{position:relative}
        .av-btn{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--gold-lt);cursor:pointer;overflow:hidden}
        .av-btn img{width:100%;height:100%;object-fit:cover}
        .av-drop{position:absolute;top:calc(100%+8px);right:0;background:var(--deep);border:1px solid var(--glass-bd);border-radius:14px;padding:8px;min-width:180px;z-index:200;animation:fadeIn .15s ease}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .av-drop-user{padding:10px 12px;border-bottom:1px solid var(--glass-bd);margin-bottom:6px}
        .av-drop-name{font-size:13px;font-weight:500}
        .av-drop-email{font-size:11px;color:var(--text-muted)}
        .av-drop-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;color:var(--text-mid);font-size:13px;transition:all .2s}
        .av-drop-item:hover{background:var(--glass-bg);color:var(--text)}
        .av-drop-item.danger:hover{background:rgba(224,90,90,.08);color:var(--error)}
        .content{padding:28px 32px;display:grid;grid-template-columns:260px 1fr;gap:24px;align-items:start;min-width:0;max-width:100%;overflow-x:hidden}
        /* RESTAURANTES LIST */
        .rest-list{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);overflow:hidden;position:sticky;top:100px;min-width:0}
        .rest-list-header{padding:16px 20px;border-bottom:1px solid var(--glass-bd)}
        .rest-list-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500}
        .rest-item{display:flex;align-items:center;gap:10px;padding:13px 20px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;transition:background .15s}
        .rest-item:last-child{border-bottom:none}
        .rest-item:hover{background:rgba(255,255,255,.02)}
        .rest-item.active{background:var(--gold-dim)}
        .rest-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);flex-shrink:0;opacity:.5}
        .rest-item.active .rest-dot{opacity:1}
        .rest-nombre{font-size:13px;color:var(--text-mid);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
        .rest-item.active .rest-nombre{color:var(--gold-lt)}
        /* RESENAS PANEL */
        .resenas-panel{display:flex;flex-direction:column;gap:20px;min-width:0}
        .panel-header{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:24px;min-width:0}
        .panel-rest-nombre{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:500;margin-bottom:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .promedio-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
        .promedio-num{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:500;color:var(--gold-lt);line-height:1}
        .promedio-info{display:flex;flex-direction:column;gap:4px}
        .promedio-stars{display:flex;gap:4px}
        .promedio-total{font-size:12px;color:var(--text-muted)}
        /* Barras de distribución */
        .dist-grid{display:flex;flex-direction:column;gap:6px;margin-top:16px}
        .dist-row{display:flex;align-items:center;gap:10px}
        .dist-label{font-size:12px;color:var(--text-muted);width:20px;text-align:right}
        .dist-bar-bg{flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
        .dist-bar-fill{height:100%;background:var(--gold);border-radius:3px;transition:width .4s ease}
        .dist-count{font-size:11px;color:var(--text-muted);width:20px}
        /* Cards reseñas */
        .resena-card{background:var(--glass-bg);border:1px solid var(--glass-bd);border-radius:var(--radius-card);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0}
        .resena-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
        .resena-user{font-size:13px;font-weight:500;color:var(--text);overflow:hidden;text-overflow:ellipsis}
        .resena-fecha{font-size:11px;color:var(--text-muted);margin-top:2px}
        .resena-comentario{font-size:13px;color:var(--text-mid);line-height:1.6;font-style:italic}
        .empty{text-align:center;padding:48px;color:var(--text-muted)}
        .empty-icon{font-size:40px;margin-bottom:12px;opacity:.3}
        .skel{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:skel 1.5s infinite;border-radius:8px}
        @keyframes skel{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @media(max-width:992px){
          .sidebar{transform:translateX(-100%)}
          .sidebar.open{transform:translateX(0) !important}
          .sidebar-backdrop{display:block}
          .main{margin-left:0}
          .menu-btn{display:flex}
        }
        @media(max-width:900px){.content{grid-template-columns:1fr}.rest-list{position:static}}
        @media(max-width:768px){
          .topbar{padding:16px 20px}
          .content{padding:20px}
          .topbar-title{font-size:19px}
        }
        @media(max-width:576px){
          .topbar{padding:14px 16px}
          .topbar-sub{display:none}
          .topbar-title{font-size:17px}
          .content{padding:16px;gap:16px}
          .panel-header{padding:16px}
          .panel-rest-nombre{font-size:19px}
          .promedio-num{font-size:36px}
          .resena-card{padding:16px}
          .rest-list-header{padding:14px 16px}
          .rest-item{padding:12px 16px}
        }
      `}</style>

            <div className="layout">
            {/* Backdrop para cerrar el sidebar en móviles */}
            {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

            {/* SIDEBAR */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sb-logo">
                    <div className="sb-logo-icon"><IconRest /></div>
                    <span className="sb-logo-name">Gastro</span>
                </div>
                <nav className="sb-nav">
                    {NAV.map(item => (
                        <div key={item.key} className={`sb-item ${activeNav === item.key ? 'active' : ''}`}
                            onClick={() => { setActiveNav(item.key); navigate(item.path); if (window.innerWidth <= 992) setSidebarOpen(false) }}>
                            {item.icon}{item.label}
                        </div>
                    ))}
                </nav>
                <div className="sb-footer">
                    <div className="sb-user" onClick={() => navigate('/admin/perfil')}>
                        <div className="sb-av">
                            {avatarSrc ? <img src={avatarSrc} alt="av" onError={() => setAvatarSrc(null)} /> : initials}
                        </div>
                        <div><div className="sb-uname">{user?.name || 'Admin'}</div><div className="sb-role">Administrador</div></div>
                    </div>
                    <button className="sb-out" onClick={logout}><IconLogout /> Cerrar sesión</button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="main">
                <div className="topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, overflow: 'hidden' }}>
                        <button className="menu-btn" onClick={() => setSidebarOpen(p => !p)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        </button>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <div className="topbar-title">Reseñas</div>
                            <div className="topbar-sub">Opiniones de clientes por restaurante</div>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <div className="av-wrap">
                            <div className="av-btn" onClick={() => setMenuOpen(p => !p)}>
                                {avatarSrc ? <img src={avatarSrc} alt="av" onError={() => setAvatarSrc(null)} /> : initials}
                            </div>
                            {menuOpen && (
                                <div className="av-drop">
                                    <div className="av-drop-user">
                                        <div className="av-drop-name">{user?.name}</div>
                                        <div className="av-drop-email">{user?.email}</div>
                                    </div>
                                    <div className="av-drop-item" onClick={() => { setMenuOpen(false); navigate('/admin/perfil') }}><IconUser /> Mi perfil</div>
                                    <div className="av-drop-item danger" onClick={() => { setMenuOpen(false); logout() }}><IconLogout /> Cerrar sesión</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="content">

                    {/* LISTA RESTAURANTES */}
                    <div className="rest-list">
                        <div className="rest-list-header">
                            <div className="rest-list-title">Restaurantes</div>
                        </div>
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="skel" style={{ height: 44, margin: '8px 16px', borderRadius: 8 }} />)
                        ) : restaurantes.map(r => (
                            <div key={r._id} className={`rest-item ${restSelec === r._id ? 'active' : ''}`}
                                onClick={() => cargarResenas(r._id)}>
                                <div className="rest-dot" />
                                <div className="rest-nombre">{r.nombre}</div>
                            </div>
                        ))}
                    </div>

                    {/* PANEL RESEÑAS */}
                    <div className="resenas-panel">

                        {/* Resumen */}
                        <div className="panel-header">
                            <div className="panel-rest-nombre">{restActual?.nombre || '—'}</div>
                            {loadingRes ? (
                                <div className="skel" style={{ height: 60 }} />
                            ) : (
                                <>
                                    <div className="promedio-row">
                                        <div className="promedio-num">{promedio || '—'}</div>
                                        <div className="promedio-info">
                                            <div className="promedio-stars">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <span key={n} style={{ fontSize: 20, color: n <= Math.round(promedio) ? '#c9a84c' : 'rgba(255,255,255,.12)' }}>★</span>
                                                ))}
                                            </div>
                                            <div className="promedio-total">{resenas.length} reseña(s)</div>
                                        </div>
                                    </div>
                                    {/* Distribución por estrellas */}
                                    {resenas.length > 0 && (
                                        <div className="dist-grid">
                                            {[5, 4, 3, 2, 1].map(n => {
                                                const cnt = resenas.filter(r => r.estrellas === n).length
                                                const pct = resenas.length ? Math.round((cnt / resenas.length) * 100) : 0
                                                return (
                                                    <div key={n} className="dist-row">
                                                        <span className="dist-label">{n}★</span>
                                                        <div className="dist-bar-bg">
                                                            <div className="dist-bar-fill" style={{ width: `${pct}%` }} />
                                                        </div>
                                                        <span className="dist-count">{cnt}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Lista reseñas */}
                        {loadingRes ? (
                            [1, 2, 3].map(i => <div key={i} className="skel" style={{ height: 100, borderRadius: 20 }} />)
                        ) : resenas.length === 0 ? (
                            <div className="empty">
                                <div className="empty-icon">⭐</div>
                                <div style={{ fontSize: 14, color: 'var(--text-mid)' }}>Sin reseñas aún</div>
                                <div style={{ fontSize: 12, marginTop: 6 }}>Los clientes aún no han calificado este restaurante</div>
                            </div>
                        ) : resenas.map(r => (
                            <div key={r._id} className="resena-card">
                                <div className="resena-header">
                                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                        <div className="resena-user">{r.nombreUsuario || 'Cliente'}</div>
                                        <div className="resena-fecha">
                                            {new Date(r.createdAt).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <StarDisplay value={r.estrellas} />
                                </div>
                                {r.comentario && (
                                    <div className="resena-comentario">"{r.comentario}"</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>

            {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />}
        </>
    )
}