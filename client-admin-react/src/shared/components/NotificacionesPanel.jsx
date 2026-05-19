// src/shared/components/NotificacionesPanel.jsx
import { useState, useRef, useEffect } from 'react'
import { useNotificaciones } from '../hooks/useNotificaciones'

const TIPO_ICON = {
    PEDIDO_NUEVO: '🧾',
    PEDIDO_CONFIRMADO: '✅',
    PEDIDO_PREPARANDO: '🍳',
    PEDIDO_EN_CAMINO: '🛵',
    PEDIDO_ENTREGADO: '🎉',
    PEDIDO_CANCELADO: '❌',
    RESERVA_NUEVA: '📅',
    RESERVA_CONFIRMADA: '✅',
    RESERVA_CANCELADA: '❌',
}

const timeAgo = (iso) => {
    if (!iso) return ''
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
    if (diff < 1) return 'ahora'
    if (diff < 60) return `${diff} min`
    if (diff < 1440) return `${Math.floor(diff / 60)}h`
    return `${Math.floor(diff / 1440)}d`
}

/**
 * @param {boolean} isAdmin — true para admins
 * @param {string}  className — clase extra para el botón
 */
export default function NotificacionesPanel({ isAdmin = false, className = '' }) {
    const [open, setOpen] = useState(false)
    const panelRef = useRef(null)
    const { notificaciones, noLeidas, loading, marcarLeida, marcarTodasLeidas } = useNotificaciones(isAdmin)

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={panelRef} style={{ position: 'relative' }}>
            {/* Botón campana */}
            <button
                className={className || 'notif-btn'}
                onClick={() => setOpen(p => !p)}
                style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(255,255,255,.045)',
                    border: '1px solid rgba(255,255,255,.09)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: open ? '#c9a84c' : '#9a9385',
                    cursor: 'pointer', transition: 'all .2s',
                    position: 'relative',
                }}>
                {/* Icono campana */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {/* Badge de no leídas */}
                {noLeidas > 0 && (
                    <span style={{
                        position: 'absolute', top: -5, right: -5,
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#c9a84c', color: '#07080a',
                        fontSize: 10, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid #07080a',
                    }}>
                        {noLeidas > 9 ? '9+' : noLeidas}
                    </span>
                )}
            </button>

            {/* Panel dropdown */}
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    width: 340, maxHeight: 460, background: '#0d0f12',
                    border: '1px solid rgba(255,255,255,.09)', borderRadius: 16,
                    zIndex: 300, display: 'flex', flexDirection: 'column',
                    boxShadow: '0 24px 48px rgba(0,0,0,.5)',
                    animation: 'notifFadeIn .15s ease',
                }}>
                    <style>{`
            @keyframes notifFadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
            .notif-item:hover{background:rgba(255,255,255,.03)!important}
          `}</style>

                    {/* Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.07)',
                    }}>
                        <div>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, color: '#f0ead8' }}>
                                Notificaciones
                            </div>
                            {noLeidas > 0 && (
                                <div style={{ fontSize: 11, color: '#9a9385', marginTop: 2 }}>
                                    {noLeidas} sin leer
                                </div>
                            )}
                        </div>
                        {noLeidas > 0 && (
                            <button
                                onClick={marcarTodasLeidas}
                                style={{
                                    background: 'none', border: 'none', color: '#c9a84c',
                                    fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
                                    padding: '4px 8px', borderRadius: 6,
                                    transition: 'background .2s',
                                }}>
                                Marcar todas leídas
                            </button>
                        )}
                    </div>

                    {/* Lista */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {loading ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#5a554d', fontSize: 13 }}>
                                Cargando...
                            </div>
                        ) : notificaciones.length === 0 ? (
                            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: 32, marginBottom: 10, opacity: .3 }}>🔔</div>
                                <div style={{ fontSize: 13, color: '#5a554d' }}>Sin notificaciones</div>
                            </div>
                        ) : (
                            notificaciones.map(n => (
                                <div
                                    key={n._id}
                                    className="notif-item"
                                    onClick={() => { if (!n.leida) marcarLeida(n._id) }}
                                    style={{
                                        display: 'flex', gap: 12, padding: '13px 18px',
                                        borderBottom: '1px solid rgba(255,255,255,.04)',
                                        cursor: n.leida ? 'default' : 'pointer',
                                        background: n.leida ? 'transparent' : 'rgba(201,168,76,.04)',
                                        transition: 'background .15s',
                                        position: 'relative',
                                    }}>
                                    {/* Dot no leída */}
                                    {!n.leida && (
                                        <div style={{
                                            position: 'absolute', top: 16, left: 6,
                                            width: 6, height: 6, borderRadius: '50%', background: '#c9a84c',
                                        }} />
                                    )}
                                    {/* Icono tipo */}
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 9,
                                        background: 'rgba(255,255,255,.04)',
                                        border: '1px solid rgba(255,255,255,.07)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 16, flexShrink: 0,
                                    }}>
                                        {TIPO_ICON[n.tipo] || '🔔'}
                                    </div>
                                    {/* Texto */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: 13, fontWeight: n.leida ? 400 : 500,
                                            color: n.leida ? '#9a9385' : '#f0ead8',
                                            marginBottom: 3, lineHeight: 1.3,
                                        }}>
                                            {n.titulo}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#5a554d', lineHeight: 1.4, marginBottom: 4 }}>
                                            {n.mensaje}
                                        </div>
                                        <div style={{ fontSize: 10, color: '#5a554d' }}>
                                            {timeAgo(n.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}