// src/features/admin/components/AdminSidebar.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import { authApi } from '../../../shared/api/api'

/* ─── ICONS ─── */
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2l-3 6h-2l-1.5-3L13 8V2M13 22v-7h8v7" /></svg>
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
const IconTable = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconRest = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20" /><path d="M20.84 2.18a1 1 0 00-1.41.19L15 7.5V2M15 2v9.5l2.5 2.5 3-3V2" /></svg>
const IconReport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const IconDash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const IconUsers = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: <IconDash />, path: '/admin' },
    { key: 'menu', label: 'Menú', icon: <IconMenu />, path: '/admin/menu' },
    { key: 'pedidos', label: 'Pedidos', icon: <IconOrders />, path: '/admin/pedidos' },
    { key: 'reservaciones', label: 'Reservaciones', icon: <IconTable />, path: '/admin/reservaciones' },
    { key: 'restaurantes', label: 'Restaurantes', icon: <IconRest />, path: '/admin/restaurantes' },
    { key: 'clientes', label: 'Clientes', icon: <IconUsers />, path: '/admin/clientes' },
    { key: 'reportes', label: 'Reportes', icon: <IconReport />, path: '/admin/reportes' },
]

export default function AdminSidebar({ collapsed, onToggle }) {
    const { user, logout, setUser } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const getActiveKey = () => NAV_ITEMS.find(i => i.path === location.pathname)?.key || ''
    const [activeNav, setActiveNav] = useState(getActiveKey())
    useEffect(() => { setActiveNav(getActiveKey()) }, [location.pathname])

    // Foto fresca desde el store — se actualiza cuando el perfil cambia
    const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture || null)

    // Refresca el perfil desde ms-auth para tener la foto actualizada
    useEffect(() => {
        const fetchFoto = async () => {
            try {
                const res = await authApi.get('/auth/profile')
                const data = res.data?.data || res.data
                const url = data?.profilePicture
                if (url) {
                    setAvatarSrc(url)
                    // Actualizar el store para que persista
                    if (setUser && user) setUser({ ...user, profilePicture: url })
                }
            } catch {
                // Si falla, usa la foto del store
                setAvatarSrc(user?.profilePicture || null)
            }
        }
        fetchFoto()
    }, [location.pathname]) // Refresca cada vez que se navega

    const initials = (user?.name || 'A')[0].toUpperCase()
    const fullName = `${user?.name || ''} ${user?.surname || ''}`.trim() || 'Administrador'

    const handleNav = (path, key) => {
        setActiveNav(key)
        navigate(path)
    }

    return (
        <>
            <style>{`
        .adm-sb{width:240px;background:#0d0f12;border-right:1px solid rgba(255,255,255,.09);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:width .3s cubic-bezier(0.16,1,0.3,1);overflow:hidden}
        .adm-sb.col{width:64px}
        .sb-brand{padding:24px 20px 20px;border-bottom:1px solid rgba(255,255,255,.09);display:flex;align-items:center;gap:12px;flex-shrink:0;min-height:80px;position:relative}
        .sb-brand::after{content:'';position:absolute;bottom:-1px;left:0;width:80px;height:1px;background:linear-gradient(90deg,#c9a84c,transparent)}
        .sb-logo{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#c9a84c}
        .sb-txt{overflow:hidden;white-space:nowrap}
        .sb-txt-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#f0ead8;display:block;line-height:1}
        .sb-txt-role{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:#c9a84c;opacity:.7;display:block;margin-top:3px}
        .adm-sb.col .sb-txt{opacity:0;width:0}
        .sb-nav{flex:1;padding:16px 10px;overflow-y:auto;overflow-x:hidden}
        .sb-nav-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#5a554d;padding:0 10px;margin:16px 0 8px;white-space:nowrap;transition:opacity .2s}
        .adm-sb.col .sb-nav-lbl{opacity:0}
        .sb-ni{display:flex;align-items:center;gap:12px;padding:10px;border-radius:10px;cursor:pointer;color:#9a9385;font-size:13.5px;transition:all .2s;position:relative;white-space:nowrap;margin-bottom:2px}
        .sb-ni:hover{background:rgba(255,255,255,.045);color:#f0ead8}
        .sb-ni.active{background:rgba(201,168,76,.08);color:#e8c96a;border:1px solid rgba(201,168,76,.15)}
        .sb-ni.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;border-radius:2px;background:#c9a84c}
        .sb-ni-icon{flex-shrink:0;display:flex}
        .sb-ni-txt{overflow:hidden;transition:opacity .2s,width .3s}
        .adm-sb.col .sb-ni-txt{opacity:0;width:0}
        .sb-footer{padding:16px 10px;border-top:1px solid rgba(255,255,255,.09)}

        /* USER CARD — clickeable para ir al perfil */
        .sb-ucard{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);margin-bottom:8px;overflow:hidden;cursor:pointer;transition:border-color .2s,background .2s}
        .sb-ucard:hover{border-color:rgba(201,168,76,.4);background:rgba(201,168,76,.08)}
        .sb-av{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(201,168,76,.1));border:2px solid rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:#e8c96a;flex-shrink:0;font-family:'Cormorant Garamond',serif;overflow:hidden;transition:border-color .2s}
        .sb-av img{width:100%;height:100%;object-fit:cover}
        .sb-ucard:hover .sb-av{border-color:rgba(201,168,76,.6)}
        .sb-uinfo{overflow:hidden;flex:1}
        .sb-uname{font-size:13px;font-weight:500;color:#f0ead8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-urole{font-size:10px;color:#c9a84c;letter-spacing:.5px;text-transform:uppercase}
        .sb-uperfil{font-size:10px;color:#9a9385;margin-top:1px}
        .adm-sb.col .sb-uinfo{display:none}

        .sb-logout{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;background:none;border:none;color:#5a554d;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;width:100%;transition:all .2s;white-space:nowrap}
        .sb-logout:hover{background:rgba(224,90,90,.08);color:#e05a5a}
        .adm-sb.col .sb-logout span{display:none}

        .sb-toggle{position:absolute;top:50%;right:-12px;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:#0d0f12;border:1px solid rgba(255,255,255,.09);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#5a554d;transition:all .2s;z-index:101}
        .sb-toggle:hover{color:#c9a84c;border-color:rgba(201,168,76,.3)}
        .sb-toggle svg{transition:transform .3s}
        .adm-sb.col .sb-toggle svg{transform:rotate(180deg)}
      `}</style>

            <aside className={`adm-sb ${collapsed ? 'col' : ''}`}>
                <button className="sb-toggle" onClick={onToggle}><IconChevron /></button>

                {/* BRAND */}
                <div className="sb-brand">
                    <div className="sb-logo"><IconRest /></div>
                    <div className="sb-txt">
                        <span className="sb-txt-name">Gastro</span>
                        <span className="sb-txt-role">Admin Panel</span>
                    </div>
                </div>

                {/* NAV */}
                <nav className="sb-nav">
                    <div className="sb-nav-lbl">Navegación</div>
                    {NAV_ITEMS.map(item => (
                        <div key={item.key}
                            className={`sb-ni ${activeNav === item.key ? 'active' : ''}`}
                            onClick={() => handleNav(item.path, item.key)}>
                            <span className="sb-ni-icon">{item.icon}</span>
                            <span className="sb-ni-txt">{item.label}</span>
                        </div>
                    ))}
                </nav>

                {/* FOOTER — USER CARD con foto real */}
                <div className="sb-footer">
                    <div className="sb-ucard" onClick={() => navigate('/admin/perfil')}
                        title="Ver mi perfil">
                        <div className="sb-av">
                            {avatarSrc
                                ? <img src={avatarSrc} alt="avatar"
                                    onError={() => setAvatarSrc(null)} />
                                : initials
                            }
                        </div>
                        <div className="sb-uinfo">
                            <div className="sb-uname">{fullName}</div>
                            <div className="sb-urole">Administrador</div>
                            <div className="sb-uperfil">Ver perfil →</div>
                        </div>
                    </div>

                    <button className="sb-logout" onClick={logout}>
                        <IconLogout /><span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>
        </>
    )
}