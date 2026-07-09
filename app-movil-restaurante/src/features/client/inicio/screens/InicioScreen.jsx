// src/features/client/inicio/screens/InicioScreen.jsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../../shared/constants/theme.js';
import { GCard, GBadge, LoadingSpinner, SectionHeader } from '../../../../shared/components/common/UI.jsx';

const estadoPedidoBadge = (e) => ({
  CONFIRMADO:'info', PREPARANDO:'warning', EN_CAMINO:'info',
  ENTREGADO:'success', CANCELADO:'error', PENDIENTE:'neutral'
}[e] || 'neutral');

export default function InicioScreen({ client, setTab }) {
  const { user, restaurantes, fetchRestaurantes, misPedidos, fetchMisPedidos, loading } = client;

  useEffect(() => {
    fetchRestaurantes();
    fetchMisPedidos();
  }, []);

  const pedidosRecientes = misPedidos.slice(0, 3);

  return (
    <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.welcomeBox}>
        <Text style={s.welcomeLabel}>Bienvenido</Text>
        <Text style={s.welcomeName}>{user?.name || 'Cliente'}</Text>
        <Text style={s.welcomeSub}>Encuentra tu experiencia gastronómica</Text>
      </View>

      <View style={s.quickGrid}>
        {[
          { label: 'Ver menú',    tab: 'menu' },
          { label: 'Mis pedidos', tab: 'pedidos' },
          { label: 'Reservar',    tab: 'reservaciones' },
          { label: 'Mis reseñas', tab: 'resenas' },
        ].map(a => (
          <TouchableOpacity key={a.tab} style={s.quickCard} onPress={() => setTab(a.tab)} activeOpacity={0.8}>
            <Text style={s.quickLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionHeader title="Restaurantes" action="Ver menú" onAction={() => setTab('menu')} />
      {loading ? <LoadingSpinner /> : restaurantes.slice(0, 3).map(r => (
        <GCard key={r._id} style={s.restCard} onPress={() => setTab('menu')}>
          <Text style={s.restNombre}>{r.nombre}</Text>
          <Text style={s.restDir}>{r.direccion}</Text>
          {r.horarioApertura && <Text style={s.restHorario}>{r.horarioApertura} — {r.horarioCierre}</Text>}
        </GCard>
      ))}

      {pedidosRecientes.length > 0 && (
        <>
          <SectionHeader title="Pedidos recientes" action="Ver todos" onAction={() => setTab('pedidos')} />
          {pedidosRecientes.map(p => (
            <GCard key={p._id} style={s.pedidoCard}>
              <View style={s.rowBetween}>
                <Text style={s.pedidoId}>#{String(p._id).slice(-6).toUpperCase()}</Text>
                <GBadge label={p.estado} type={estadoPedidoBadge(p.estado)} />
              </View>
              <Text style={s.pedidoRest}>{p.restaurante?.nombre || '—'}</Text>
              <Text style={s.pedidoTotal}>Q {Number(p.total || 0).toFixed(2)}</Text>
            </GCard>
          ))}
        </>
      )}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  welcomeBox: { paddingVertical: SPACING.xl, marginBottom: SPACING.md },
  welcomeLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, letterSpacing: 1 },
  welcomeName: { fontSize: FONT_SIZE.xxxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.bold, lineHeight: 40 },
  welcomeSub: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 4 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  quickCard: { width: '47%', backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  quickLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium },
  restCard: { marginBottom: SPACING.sm },
  restNombre: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  restDir: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  restHorario: { fontSize: FONT_SIZE.xs, color: COLORS.emerald, marginTop: 4 },
  pedidoCard: { marginBottom: SPACING.sm },
  pedidoId: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 1 },
  pedidoRest: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 4 },
  pedidoTotal: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginTop: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});