// src/features/client/reservaciones/screens/ReservacionesScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../../shared/constants/theme.js';
import { GCard, GBadge, GButton, GInput, LoadingSpinner, EmptyState } from '../../../../shared/components/common/UI.jsx';

const estadoBadge = (e) => ({ PENDIENTE:'neutral', CONFIRMADA:'success', CANCELADA:'error', COMPLETADA:'info' }[e] || 'neutral');

const generarHoras = (apertura, cierre) => {
  const [hA, mA] = (apertura || '09:00').split(':').map(Number);
  const [hC, mC] = (cierre   || '22:00').split(':').map(Number);
  const inicio = hA * 60 + (mA || 0), fin = hC * 60 + (mC || 0);
  const horas = [];
  for (let m = inicio; m < fin; m += 30)
    horas.push(`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`);
  return horas;
};

export default function ReservacionesScreen({ client, setToast }) {
  const { restaurantes, fetchRestaurantes, mesas, fetchMesasDisponibles, misReservaciones, fetchMisReservaciones, crearReservacion, cancelarReservacion, estadosRes, fetchEstadosReservacion, user, loading } = client;
  const [subTab, setSubTab]       = useState('nueva');
  const [paso, setPaso]           = useState(1);
  const [rest, setRest]           = useState(null);
  const [fecha, setFecha]         = useState('');
  const [hora, setHora]           = useState('');
  const [mesa, setMesa]           = useState(null);
  const [numPersonas, setNumPersonas] = useState('2');
  const [obs, setObs]             = useState('');
  const [horas, setHoras]         = useState([]);
  const [enviando, setEnviando]   = useState(false);
  const [ocultas, setOcultas]     = useState([]);

  useEffect(() => {
    fetchRestaurantes();
    fetchEstadosReservacion();
    fetchMisReservaciones();
    AsyncStorage.getItem('reservaciones_ocultas').then(v => { if (v) setOcultas(JSON.parse(v)); }).catch(() => {});
  }, []);

  const ocultarReservacion = (id) => {
    const nuevas = [...ocultas, id];
    setOcultas(nuevas);
    AsyncStorage.setItem('reservaciones_ocultas', JSON.stringify(nuevas)).catch(() => {});
  };

  const seleccionarRest = (r) => {
    setRest(r); setMesa(null);
    setHoras(generarHoras(r.horarioApertura, r.horarioCierre));
    fetchMesasDisponibles(r._id);
    setPaso(2);
  };

  const hacerReservacion = async () => {
    if (!fecha) return setToast({ msg: 'Selecciona una fecha', type: 'error' });
    if (!hora)  return setToast({ msg: 'Selecciona una hora', type: 'error' });
    const estadoPendiente = estadosRes.find(e => e.nombre === 'PENDIENTE') || estadosRes[0];
    if (!estadoPendiente) return setToast({ msg: 'Estados no configurados', type: 'error' });
    setEnviando(true);
    const result = await crearReservacion({
      usuario: user?.id, restaurante: rest._id, fecha, hora,
      numPersonas: Number(numPersonas), estado: estadoPendiente._id,
      ...(mesa ? { mesa: mesa._id } : {}),
      ...(obs.trim() ? { observaciones: obs.trim() } : {}),
    });
    setEnviando(false);
    if (result.success) {
      setToast({ msg: 'Reservación creada', type: 'success' });
      setRest(null); setFecha(''); setHora(''); setMesa(null); setObs(''); setPaso(1);
      fetchMisReservaciones();
    } else {
      setToast({ msg: result.error || 'Error al reservar', type: 'error' });
    }
  };

  const visiblesRes = misReservaciones.filter(r => !ocultas.includes(r._id));

  return (
    <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.pageTitle}>Reservaciones</Text>

      <View style={s.subTabRow}>
        {[{ id:'nueva', label:'Nueva reserva' }, { id:'mis', label:'Mis reservas' }].map(t => (
          <TouchableOpacity key={t.id} onPress={() => setSubTab(t.id)}
            style={[s.subTab, subTab === t.id && s.subTabActive]} activeOpacity={0.8}>
            <Text style={[s.subTabText, subTab === t.id && s.subTabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {subTab === 'nueva' ? (
        <>
          {paso >= 1 && (
            <View style={s.pasoBox}>
              <Text style={s.pasoTitle}>1. Restaurante</Text>
              {restaurantes.map(r => (
                <TouchableOpacity key={r._id} onPress={() => seleccionarRest(r)}
                  style={[s.restItemBtn, rest?._id === r._id && s.restItemBtnActive]} activeOpacity={0.8}>
                  <Text style={[s.restItemText, rest?._id === r._id && { color: COLORS.emerald }]}>{r.nombre}</Text>
                  {r.horarioApertura && <Text style={s.restItemHorario}>{r.horarioApertura} — {r.horarioCierre}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {paso >= 2 && rest && (
            <View style={s.pasoBox}>
              <Text style={s.pasoTitle}>2. Fecha y hora</Text>
              <GInput label="Fecha (AAAA-MM-DD)" value={fecha} onChangeText={setFecha} placeholder="2025-12-31" />
              <GInput label="Personas" value={numPersonas} onChangeText={setNumPersonas} keyboardType="number-pad" />

              <Text style={s.horasLabel}>Hora — {rest.horarioApertura} a {rest.horarioCierre}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {horas.map(h => (
                  <TouchableOpacity key={h} onPress={() => setHora(h)}
                    style={[s.horaChip, hora === h && s.horaChipActive]} activeOpacity={0.8}>
                    <Text style={[s.horaChipText, hora === h && s.horaChipTextActive]}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={s.horasLabel}>Mesa (opcional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity onPress={() => setMesa(null)} style={[s.mesaChip, !mesa && s.mesaChipActive]}>
                  <Text style={[s.mesaChipText, !mesa && s.mesaChipTextActive]}>Sin preferencia</Text>
                </TouchableOpacity>
                {mesas.map(m => (
                  <TouchableOpacity key={m._id} onPress={() => setMesa(m)}
                    style={[s.mesaChip, mesa?._id === m._id && s.mesaChipActive]} activeOpacity={0.8}>
                    <Text style={[s.mesaChipText, mesa?._id === m._id && s.mesaChipTextActive]}>Mesa #{m.numeroMesa}</Text>
                    <Text style={s.mesaCapacidad}>{m.capacidad} p.</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <GInput label="Observaciones (opcional)" value={obs} onChangeText={setObs} placeholder="Ej: cumpleaños..." multiline />
              <GButton label="Confirmar reservación" onPress={hacerReservacion} loading={enviando} style={{ marginTop: SPACING.sm }} />
              <GButton label="Volver" onPress={() => setPaso(1)} variant="secondary" style={{ marginTop: SPACING.sm }} />
            </View>
          )}
        </>
      ) : (
        <>
          {loading ? <LoadingSpinner /> : visiblesRes.length === 0 ? (
            <EmptyState title="Sin reservaciones" subtitle="No tienes reservaciones registradas" />
          ) : visiblesRes.map(r => {
            const en = r.estado?.nombre || r.estado || '';
            return (
              <GCard key={r._id} style={s.resCard}>
                <View style={s.rowBetween}>
                  <Text style={s.resRest}>{r.restaurante?.nombre || '—'}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <GBadge label={en} type={estadoBadge(en)} />
                    {['CANCELADA', 'COMPLETADA'].includes(en) && (
                      <TouchableOpacity onPress={() => ocultarReservacion(r._id)} style={s.xBtn}>
                        <Text style={s.xBtnText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Text style={s.resFecha}>{r.fecha} a las {r.hora}</Text>
                <Text style={s.resMeta}>{r.numPersonas} persona(s){r.mesa ? ` · Mesa #${r.mesa?.numeroMesa}` : ''}</Text>
                {['PENDIENTE', 'CONFIRMADA'].includes(en) && (
                  <GButton label="Cancelar reservación" onPress={async () => {
                    const result = await cancelarReservacion(r._id);
                    if (!result.success) Alert.alert('Error', result.error);
                  }} variant="secondary" style={{ marginTop: SPACING.sm }} />
                )}
              </GCard>
            );
          })}
        </>
      )}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  pageTitle: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, paddingVertical: SPACING.lg },
  subTabRow: { flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.glassBorder, marginBottom: SPACING.lg },
  subTab: { flex: 1, padding: SPACING.sm, alignItems: 'center', borderRadius: RADIUS.md },
  subTabActive: { backgroundColor: COLORS.emeraldDim },
  subTabText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  subTabTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold },
  pasoBox: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md },
  pasoTitle: { fontSize: FONT_SIZE.md, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.md },
  restItemBtn: { padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.glassBorder, marginBottom: SPACING.sm, backgroundColor: COLORS.glass },
  restItemBtnActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  restItemText: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary },
  restItemHorario: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  horasLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  horaChip: { backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginRight: SPACING.sm },
  horaChipActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  horaChipText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  horaChipTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  mesaChip: { backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginRight: SPACING.sm, alignItems: 'center' },
  mesaChipActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  mesaChipText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  mesaChipTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  mesaCapacidad: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  resCard: { marginBottom: SPACING.sm },
  resRest: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  resFecha: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, marginTop: 4 },
  resMeta: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xBtn: { width: 24, height: 24, borderRadius: RADIUS.sm, backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center', justifyContent: 'center' },
  xBtnText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted, lineHeight: 22 },
});