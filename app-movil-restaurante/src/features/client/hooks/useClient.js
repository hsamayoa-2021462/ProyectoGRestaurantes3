// src/features/client/hooks/useClient.js
import { useState, useCallback } from 'react';
import restClient from '../../../shared/api/restClient.js';
import authClient from '../../../shared/api/authClient.js';
import { ENDPOINTS } from '../../../shared/constants/endpoints.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

const parseError = (err) => {
  const d = err?.response?.data;
  if (d?.message) return d.message;
  if (typeof d === 'string') return d;
  return err?.message || 'Error inesperado';
};

export default function useClient() {
  const user    = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [restaurantes, setRestaurantes]         = useState([]);
  const [mesas, setMesas]                       = useState([]);
  const [platos, setPlatos]                     = useState([]);
  const [stockMap, setStockMap]                 = useState({}); // platoId -> tieneStock
  const [misPedidos, setMisPedidos]             = useState([]);
  const [misReservaciones, setMisReservaciones] = useState([]);
  const [misResenas, setMisResenas]             = useState([]);
  const [estadosRes, setEstadosRes]             = useState([]);
  const [notificaciones, setNotificaciones]     = useState([]);
  const [perfil, setPerfil]                     = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState(null);

  const run = async (fn) => {
    setLoading(true); setError(null);
    try { return await fn(); }
    catch (e) { const msg = parseError(e); setError(msg); return { success: false, error: msg }; }
    finally { setLoading(false); }
  };

  // ── Restaurantes ──
  const fetchRestaurantes = useCallback(() => run(async () => {
    const { data } = await restClient.get(ENDPOINTS.RESTAURANTES.LIST);
    setRestaurantes(data?.data || []);
    return { success: true };
  }), []);

  const fetchMesasDisponibles = useCallback((restId) => run(async () => {
    const { data } = await restClient.get(`${ENDPOINTS.RESTAURANTES.MESAS}?restaurante=${restId}`);
    const lista = Array.isArray(data) ? data : (data?.mesas || data?.data || []);
    setMesas(lista.filter(m => m.estado === 'DISPONIBLE'));
    return { success: true };
  }), []);

  // ── Menú con stock ──
  const fetchPlatos = useCallback((restId) => run(async () => {
    const url = restId ? `${ENDPOINTS.MENU.PLATOS}?restaurante=${restId}` : ENDPOINTS.MENU.PLATOS;
    const [platosRes, stockRes] = await Promise.all([
      restClient.get(url),
      restClient.get(`${ENDPOINTS.MENU.DISPONIBILIDAD}${restId ? `?restaurante=${restId}` : ''}`).catch(() => ({ data: { data: [] } })),
    ]);
    const lista = platosRes.data?.data || [];
    const stockData = stockRes.data?.data || [];
    // Construir mapa: platoId -> { tieneStock, maximo }
    const map = {};
    stockData.forEach(s => {
      const pid = (s.platoId || s.platoId?._id)?.toString();
      if (!pid) return;
      const maxRaw = s.maximoDisponible;
      const maximo = (maxRaw === null || maxRaw === undefined || maxRaw > 9000) ? 9999 : Number(maxRaw);
      // tieneStock: usar maximoDisponible como fuente de verdad (> 0 = hay stock)
      map[pid] = { tieneStock: maximo > 0, maximo };
    });
    setPlatos(lista);
    setStockMap(map);
    return { success: true };
  }), []);

  // ── Pedidos ──
  const fetchMisPedidos = useCallback(() => run(async () => {
    const { data } = await restClient.get(ENDPOINTS.PEDIDOS.MIS_PEDIDOS);
    setMisPedidos(data?.data || []);
    return { success: true };
  }), []);

  const crearPedido = useCallback((payload) => run(async () => {
    const { data } = await restClient.post(ENDPOINTS.PEDIDOS.CREATE, payload);
    return { success: true, data: data?.data || data };
  }), []);

  // ── Reservaciones ──
  const fetchEstadosReservacion = useCallback(() => run(async () => {
    const { data } = await restClient.get(ENDPOINTS.RESERVACIONES.ESTADOS);
    setEstadosRes(data?.data || []);
    return { success: true };
  }), []);

  const fetchMisReservaciones = useCallback(() => run(async () => {
    const { data } = await restClient.get(ENDPOINTS.RESERVACIONES.MIS_RESERVACIONES);
    setMisReservaciones(data?.data || []);
    return { success: true };
  }), []);

  const crearReservacion = useCallback((payload) => run(async () => {
    const { data } = await restClient.post(ENDPOINTS.RESERVACIONES.CREATE, payload);
    return { success: true, data: data?.data || data };
  }), []);

  const cancelarReservacion = useCallback((id) => run(async () => {
    await restClient.put(ENDPOINTS.RESERVACIONES.CANCELAR(id));
    setMisReservaciones(prev => prev.map(r =>
      r._id === id ? { ...r, estado: { ...r.estado, nombre: 'CANCELADA' } } : r
    ));
    return { success: true };
  }), []);

  // ── Reseñas ──
  const fetchMisResenas = useCallback(() => run(async () => {
    const { data } = await restClient.get(ENDPOINTS.RESENAS.MIS_RESENAS);
    setMisResenas(data?.data || []);
    return { success: true };
  }), []);

  const crearResena = useCallback((payload) => run(async () => {
    const { data } = await restClient.post(ENDPOINTS.RESENAS.CREATE, {
      ...payload, nombreUsuario: user?.name || 'Cliente',
    });
    return { success: true, data: data?.data || data };
  }), [user]);

  const eliminarResena = useCallback((id) => run(async () => {
    await restClient.delete(ENDPOINTS.RESENAS.DELETE(id));
    setMisResenas(prev => prev.filter(r => r._id !== id));
    return { success: true };
  }), []);

  // ── Notificaciones ──
  const fetchNotificaciones = useCallback(() => run(async () => {
    const { data } = await restClient.get(ENDPOINTS.NOTIFICACIONES.MIS);
    setNotificaciones(data?.data || []);
    return { success: true };
  }), []);

  const marcarLeida = useCallback(async (id) => {
    try {
      await restClient.put(ENDPOINTS.NOTIFICACIONES.LEER(id));
      setNotificaciones(prev => prev.map(n => n._id === id ? { ...n, leida: true } : n));
    } catch (_) {}
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    try {
      await restClient.put(ENDPOINTS.NOTIFICACIONES.LEER_TODAS);
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch (_) {}
  }, []);

  // ── Perfil completo ──
  const fetchPerfil = useCallback(() => run(async () => {
    const { data } = await authClient.get(ENDPOINTS.AUTH.PROFILE);
    const p = data?.data || data;
    setPerfil(p);
    if (p) updateUser(p);
    return { success: true, data: p };
  }), []);

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return {
    user, perfil, fetchPerfil,
    restaurantes, fetchRestaurantes,
    mesas, fetchMesasDisponibles,
    platos, stockMap, fetchPlatos,
    misPedidos, fetchMisPedidos, crearPedido,
    misReservaciones, fetchMisReservaciones, crearReservacion, cancelarReservacion,
    estadosRes, fetchEstadosReservacion,
    misResenas, fetchMisResenas, crearResena, eliminarResena,
    notificaciones, noLeidas, fetchNotificaciones, marcarLeida, marcarTodasLeidas,
    loading, error, setError,
  };
}