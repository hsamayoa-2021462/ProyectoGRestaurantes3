// src/features/client/notificaciones/screens/NotificacionesScreen.jsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../../shared/constants/theme.js';
import { GCard, GButton, LoadingSpinner, EmptyState } from '../../../../shared/components/common/UI.jsx';

const fmtFecha = (d) => d ? new Date(d).toLocaleDateString('es-GT', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';

const tipoBadgeColor = (tipo) => {
  if (!tipo) return COLORS.textMuted;
  if (tipo.includes('PEDIDO')) return COLORS.emerald;
  if (tipo.includes('RESERVA')) return '#64a0dc';
  if (tipo.includes('CANCELAD')) return COLORS.error;
  return COLORS.warning;
};

export default function NotificacionesScreen({ client }) {
  const { notificaciones, fetchNotificaciones, marcarLeida, marcarTodasLeidas, noLeidas, loading } = client;

  useEffect(() => { fetchNotificaciones(); }, []);

  return (
    <ScrollView
      style={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchNotificaciones} tintColor={COLORS.emerald} />}>

      <View style={s.headerRow}>
        <Text style={s.pageTitle}>Notificaciones</Text>
        {noLeidas > 0 && (
          <TouchableOpacity onPress={marcarTodasLeidas} style={s.markAllBtn}>
            <Text style={s.markAllText}>Marcar todas como leídas</Text>
          </TouchableOpacity>
        )}
      </View>

      {notificaciones.length === 0 ? (
        <EmptyState title="Sin notificaciones" subtitle="No tienes notificaciones por el momento" />
      ) : notificaciones.map(n => (
        <TouchableOpacity key={n._id} onPress={() => { if (!n.leida) marcarLeida(n._id); }} activeOpacity={0.8}>
          <GCard style={[s.notifCard, !n.leida && s.notifNoLeida]}>
            <View style={s.notifHeader}>
              <View style={[s.tipoDot, { backgroundColor: tipoBadgeColor(n.tipo) }]} />
              <Text style={s.notifTitulo}>{n.titulo}</Text>
              {!n.leida && <View style={s.nuevaBadge}><Text style={s.nuevaText}>Nueva</Text></View>}
            </View>
            <Text style={s.notifMensaje}>{n.mensaje}</Text>
            <Text style={s.notifFecha}>{fmtFecha(n.createdAt)}</Text>
          </GCard>
        </TouchableOpacity>
      ))}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.lg },
  pageTitle: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  markAllBtn: { padding: SPACING.xs },
  markAllText: { fontSize: FONT_SIZE.xs, color: COLORS.emerald },
  notifCard: { marginBottom: SPACING.sm },
  notifNoLeida: { borderColor: COLORS.emeraldBorder, backgroundColor: COLORS.emeraldDim },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 6 },
  tipoDot: { width: 8, height: 8, borderRadius: 4 },
  notifTitulo: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, flex: 1 },
  nuevaBadge: { backgroundColor: COLORS.emeraldDim, borderWidth: 1, borderColor: COLORS.emeraldBorder, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 2 },
  nuevaText: { fontSize: FONT_SIZE.xs, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold },
  notifMensaje: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginBottom: 4 },
  notifFecha: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
});