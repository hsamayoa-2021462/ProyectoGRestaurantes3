// src/features/client/pedidos/screens/PedidosScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../../shared/constants/theme.js';
import { GCard, GBadge, EmptyState } from '../../../../shared/components/common/UI.jsx';

const estadoBadge = (e) => ({
  CONFIRMADO:'info', PREPARANDO:'warning', EN_CAMINO:'info',
  ENTREGADO:'success', CANCELADO:'error', PENDIENTE:'neutral'
}[e] || 'neutral');

const fmtFecha = (d) => d ? new Date(d).toLocaleDateString('es-GT', { day:'2-digit', month:'short', year:'numeric' }) : '—';

export default function PedidosScreen({ client }) {
  const { misPedidos, fetchMisPedidos, loading } = client;
  const [ocultos, setOcultos] = useState([]);

  useEffect(() => {
    fetchMisPedidos();
    AsyncStorage.getItem('pedidos_ocultos').then(v => { if (v) setOcultos(JSON.parse(v)); }).catch(() => {});
  }, []);

  const ocultarPedido = (id) => {
    const nuevos = [...ocultos, id];
    setOcultos(nuevos);
    AsyncStorage.setItem('pedidos_ocultos', JSON.stringify(nuevos)).catch(() => {});
  };

  const visibles = misPedidos.filter(p => !ocultos.includes(p._id));

  return (
    <ScrollView style={s.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMisPedidos} tintColor={COLORS.emerald} />}>
      <Text style={s.pageTitle}>Mis pedidos</Text>
      {visibles.length === 0 ? (
        <EmptyState title="Sin pedidos" subtitle="Aún no has realizado ningún pedido" />
      ) : visibles.map(p => (
        <GCard key={p._id} style={s.pedidoCard}>
          <View style={s.rowBetween}>
            <Text style={s.pedidoId}>#{String(p._id).slice(-6).toUpperCase()}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <GBadge label={p.estado} type={estadoBadge(p.estado)} />
              {['ENTREGADO', 'CANCELADO'].includes(p.estado) && (
                <TouchableOpacity onPress={() => ocultarPedido(p._id)} style={s.xBtn}>
                  <Text style={s.xBtnText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text style={s.pedidoRest}>{p.restaurante?.nombre || '—'}</Text>
          {(p.detalles || []).map((d, i) => (
            <Text key={i} style={s.pedidoDetalle}>{d.plato?.nombre || '—'} × {d.cantidad}</Text>
          ))}
          <View style={s.rowBetween}>
            <Text style={s.pedidoFecha}>{fmtFecha(p.createdAt)}</Text>
            <Text style={s.pedidoTotal}>Q {Number(p.total || 0).toFixed(2)}</Text>
          </View>
        </GCard>
      ))}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  pageTitle: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, paddingVertical: SPACING.lg },
  pedidoCard: { marginBottom: SPACING.sm },
  pedidoId: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 1 },
  pedidoRest: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 4 },
  pedidoDetalle: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  pedidoFecha: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  pedidoTotal: { fontSize: FONT_SIZE.lg, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xBtn: { width: 24, height: 24, borderRadius: RADIUS.sm, backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center', justifyContent: 'center' },
  xBtnText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted, lineHeight: 22 },
});