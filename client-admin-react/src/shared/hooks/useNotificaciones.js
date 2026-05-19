// src/shared/hooks/useNotificaciones.js
import { useState, useEffect, useCallback } from 'react'
import api from '../api/api'
import { useSocket } from './useSocket'
import { useAuthStore } from '../../features/auth/store/authStore'

/**
 * useNotificaciones
 * @param {boolean} isAdmin — true para admins, false para clientes
 */
export const useNotificaciones = (isAdmin = false) => {
    const { user } = useAuthStore()
    const [notificaciones, setNotificaciones] = useState([])
    const [noLeidas, setNoLeidas] = useState(0)
    const [loading, setLoading] = useState(false)

    // Conectar socket a la sala correcta
    const socket = useSocket(isAdmin ? 'admin' : user?.id, isAdmin)

    // ── Cargar notificaciones iniciales ──
    const cargar = useCallback(async () => {
        setLoading(true)
        try {
            const endpoint = isAdmin
                ? '/notificaciones/admin'
                : '/notificaciones/mis-notificaciones'
            const res = await api.get(endpoint)
            setNotificaciones(res.data?.data || [])
            setNoLeidas(res.data?.totalNoLeidas || 0)
        } catch { }
        finally { setLoading(false) }
    }, [isAdmin])

    useEffect(() => {
        if (!user?.id && !isAdmin) return
        cargar()
    }, [cargar, user?.id])

    // ── Escuchar notificaciones en tiempo real ──
    useEffect(() => {
        if (!socket) return

        const handleNotificacion = (notif) => {
            // Agregar al inicio de la lista
            setNotificaciones(prev => [notif, ...prev])
            setNoLeidas(prev => prev + 1)

            // Vibración leve en móvil (si está disponible)
            if (navigator.vibrate) navigator.vibrate(100)
        }

        socket.on('notificacion', handleNotificacion)
        return () => socket.off('notificacion', handleNotificacion)
    }, [socket])

    // ── Marcar una como leída ──
    const marcarLeida = async (id) => {
        try {
            await api.put(`/notificaciones/${id}/leer`)
            setNotificaciones(prev =>
                prev.map(n => n._id === id ? { ...n, leida: true } : n)
            )
            setNoLeidas(prev => Math.max(0, prev - 1))
        } catch { }
    }

    // ── Marcar todas como leídas ──
    const marcarTodasLeidas = async () => {
        try {
            await api.put(`/notificaciones/leer-todas${isAdmin ? '?admin=true' : ''}`)
            setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
            setNoLeidas(0)
        } catch { }
    }

    return { notificaciones, noLeidas, loading, cargar, marcarLeida, marcarTodasLeidas }
}