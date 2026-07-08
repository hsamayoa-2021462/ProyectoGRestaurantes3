// src/shared/constants/endpoints.js

const AUTH_BASE = process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:3005/api/v1';
const REST_BASE = process.env.EXPO_PUBLIC_REST_URL || 'http://localhost:3006/api/v1';

export const ENDPOINTS = {
  AUTH: {
    BASE:                AUTH_BASE,
    LOGIN:              `${AUTH_BASE}/auth/login`,
    REGISTER:           `${AUTH_BASE}/auth/register`,
    VERIFY_EMAIL:       `${AUTH_BASE}/auth/verify-email`,
    RESEND_VERIFICATION:`${AUTH_BASE}/auth/resend-verification`,
    FORGOT_PASSWORD:    `${AUTH_BASE}/auth/forgot-password`,
    RESET_PASSWORD:     `${AUTH_BASE}/auth/reset-password`,
    PROFILE:            `${AUTH_BASE}/auth/profile`,
    UPDATE_PICTURE:     `${AUTH_BASE}/auth/profile/picture`,
  },
  RESTAURANTES: {
    LIST:    `${REST_BASE}/restaurante/restaurantes`,
    MESAS:   `${REST_BASE}/restaurante/mesas`,
  },
  MENU: {
    CATEGORIAS:    `${REST_BASE}/menu/categorias-plato`,
    PLATOS:        `${REST_BASE}/menu/platos`,
    DISPONIBILIDAD:`${REST_BASE}/menu/platos/disponibilidad`,
  },
  PEDIDOS: {
    CREATE:      `${REST_BASE}/pedidos/pedidos`,
    MIS_PEDIDOS: `${REST_BASE}/pedidos/mis-pedidos`,
  },
  RESERVACIONES: {
    CREATE:            `${REST_BASE}/reservaciones/reservaciones`,
    MIS_RESERVACIONES: `${REST_BASE}/reservaciones/mis-reservaciones`,
    CANCELAR:          (id) => `${REST_BASE}/reservaciones/${id}/cancelar`,
    ESTADOS:           `${REST_BASE}/reservaciones/estados-reservacion`,
  },
  RESENAS: {
    MIS_RESENAS:     `${REST_BASE}/resenas/mis-resenas`,
    POR_RESTAURANTE: (id) => `${REST_BASE}/resenas/restaurante/${id}`,
    CREATE:          `${REST_BASE}/resenas`,
    DELETE:          (id) => `${REST_BASE}/resenas/${id}`,
  },
  NOTIFICACIONES: {
    MIS:        `${REST_BASE}/notificaciones/mis-notificaciones`,
    LEER:       (id) => `${REST_BASE}/notificaciones/${id}/leer`,
    LEER_TODAS: `${REST_BASE}/notificaciones/leer-todas`,
  },
};