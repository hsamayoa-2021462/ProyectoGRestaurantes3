// src/features/client/resenas/screens/ResenasScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../../shared/constants/theme.js';
import { GCard, GButton, GInput, LoadingSpinner, EmptyState } from '../../../../shared/components/common/UI.jsx';

const fmtFecha = (d) => d ? new Date(d).toLocaleDateString('es-GT', { day:'2-digit', month:'short', year:'numeric' }) : '—';

export default function ResenasScreen({ client, setToast }) {
  const { restaurantes, fetchRestaurantes, misResenas, fetchMisResenas, crearResena, eliminarResena, loading } = client;
  const [restId, setRestId]       = useState('');
  const [estrellas, setEst]       = useState(0);
  const [comentario, setComent]   = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { fetchRestaurantes(); fetchMisResenas(); }, []);

  const enviar = async () => {
    if (!restId)    return setToast({ msg: 'Selecciona un restaurante', type: 'error' });
    if (!estrellas) return setToast({ msg: 'Selecciona una calificación', type: 'error' });
    setGuardando(true);
    const result = await crearResena({ restaurante: restId, estrellas, comentario: comentario.trim() });
    setGuardando(false);
    if (result.success) {
      setToast({ msg: 'Reseña enviada', type: 'success' });
      setRestId(''); setEst(0); setComent('');
      fetchMisResenas();
    } else {
      setToast({ msg: result.error, type: 'error' });
    }
  };

  return (
    <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.pageTitle}>Reseñas</Text>

      <GCard style={s.formCard}>
        <Text style={s.formTitle}>Escribe una reseña</Text>
        <Text style={s.formLabel}>Restaurante</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
          {restaurantes.map(r => (
            <TouchableOpacity key={r._id} onPress={() => setRestId(r._id)}
              style={[s.restChip, restId === r._id && s.restChipActive]} activeOpacity={0.8}>
              <Text style={[s.restChipText, restId === r._id && s.restChipTextActive]}>{r.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={s.formLabel}>Calificación</Text>
        <View style={s.starsRow}>
          {[1,2,3,4,5].map(n => (
            <TouchableOpacity key={n} onPress={() => setEst(n)}>
              <Text style={[s.star, n <= estrellas && s.starActive]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        <GInput label="Comentario (opcional)" value={comentario} onChangeText={setComent} placeholder="Cuéntanos tu experiencia..." multiline />
        <GButton label="Enviar reseña" onPress={enviar} loading={guardando} disabled={!restId || !estrellas} />
      </GCard>

      <Text style={s.sectionTitle}>Mis reseñas</Text>
      {loading ? <LoadingSpinner /> : misResenas.length === 0 ? (
        <EmptyState title="Sin reseñas" subtitle="Aún no has escrito ninguna reseña" />
      ) : misResenas.map(r => (
        <GCard key={r._id} style={s.resenaCard}>
          <View style={s.rowBetween}>
            <Text style={s.resenaNombre}>{r.restaurante?.nombre || '—'}</Text>
            <TouchableOpacity onPress={async () => {
              const result = await eliminarResena(r._id);
              setToast({ msg: result.success ? 'Reseña eliminada' : result.error, type: result.success ? 'success' : 'error' });
            }} style={s.xBtn}>
              <Text style={s.xBtnText}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={s.starsRow}>
            {[1,2,3,4,5].map(n => <Text key={n} style={[s.starSm, n <= r.estrellas && s.starSmActive]}>★</Text>)}
          </View>
          {r.comentario && <Text style={s.resenaComment}>"{r.comentario}"</Text>}
          <Text style={s.resenaFecha}>{fmtFecha(r.createdAt)}</Text>
        </GCard>
      ))}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  pageTitle: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, paddingVertical: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZE.lg, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.sm, marginTop: SPACING.md },
  formCard: { marginBottom: SPACING.lg },
  formTitle: { fontSize: FONT_SIZE.lg, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.md },
  formLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.sm },
  restChip: { backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginRight: SPACING.sm },
  restChipActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  restChipText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  restChipTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  starsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  star: { fontSize: 32, color: COLORS.textMuted },
  starActive: { color: COLORS.emerald },
  resenaCard: { marginBottom: SPACING.sm },
  resenaNombre: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  starSm: { fontSize: 16, color: COLORS.textMuted },
  starSmActive: { color: COLORS.emerald },
  resenaComment: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 4 },
  resenaFecha: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xBtn: { width: 24, height: 24, borderRadius: RADIUS.sm, backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center', justifyContent: 'center' },
  xBtnText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted, lineHeight: 22 },
});