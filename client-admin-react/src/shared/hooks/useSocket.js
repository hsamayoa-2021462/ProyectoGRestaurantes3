// src/shared/hooks/useSocket.js
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

// URL del ms-restaurante (mismo puerto que la API)
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3006'

let socketInstance = null

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    })
  }
  return socketInstance
}

/**
 * useSocket — conecta al socket y se une a la sala del usuario
 * @param {string} userId  — ID del usuario ('admin' para admins, user.id para clientes)
 * @param {boolean} isAdmin — si es admin se une a la sala 'admin'
 */
export const useSocket = (userId, isAdmin = false) => {
  const socket = getSocket()

  useEffect(() => {
    if (!userId) return

    if (!socket.connected) socket.connect()

    if (isAdmin) {
      socket.emit('join-admin')
    } else {
      socket.emit('join', userId)
    }

    return () => {
      // No desconectar al desmontar (otros componentes pueden usarlo)
    }
  }, [userId, isAdmin])

  return socket
}

export default getSocket