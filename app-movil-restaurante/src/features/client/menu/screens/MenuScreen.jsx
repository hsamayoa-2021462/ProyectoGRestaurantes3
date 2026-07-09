// src/features/client/menu/screens/MenuScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal, Image,
} from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING, SHADOWS } from '../../../../shared/constants/theme.js';
import { GCard, GButton, GInput, LoadingSpinner, EmptyState } from '../../../../shared/components/common/UI.jsx';

export default function MenuScreen({ client, setToast }) {
  const { restaurantes, fetchRestaurantes, platos, stockMap, fetchPlatos, crearPedido, loading, user } = client;
  const [paso, setPaso]               = useState(1);
  const [restSelec, setRestSelec]     = useState(null);
  const [carrito, setCarrito]         = useState([]);
  const [modalCarrito, setModalCarrito] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState('RECOGER');
  const [direccion, setDireccion]     = useState('');
  const [enviando, setEnviando]       = useState(false);

  useEffect(() => { fetchRestaurantes(); }, []);

  const seleccionarRest = (r) => {
    setRestSelec(r);
    setCarrito([]);
    fetchPlatos(r._id);
    setPaso(2);
  };

  const getStock = (plato) => {
    const val = stockMap[plato._id?.toString()];
    if (!val) return { tieneStock: true, maximo: 9999 };
    return { tieneStock: val.tieneStock, maximo: val.maximo ?? 9999 };
  };

  const agregarAlCarrito = (plato) => {
    const { tieneStock, maximo } = getStock(plato);
    if (!tieneStock) return;
    setCarrito(prev => {
      const ex = prev.find(i => i.plato._id === plato._id);
      if (ex) {
        if (ex.cantidad >= maximo) return prev;
        return prev.map(i => i.plato._id === plato._id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      if (maximo <= 0) return prev;
      return [...prev, { plato, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (platoId) => {
    setCarrito(prev => {
      const ex = prev.find(i => i.plato._id === platoId);
      if (ex?.cantidad > 1) return prev.map(i => i.plato._id === platoId ? { ...i, cantidad: i.cantidad - 1 } : i);
      return prev.filter(i => i.plato._id !== platoId);
    });
  };

  const totalCarrito = carrito.reduce((s, i) => s + (i.plato.precio * i.cantidad), 0);
  const cantCarrito  = carrito.reduce((s, i) => s + i.cantidad, 0);

  const confirmarPedido = async () => {
    if (carrito.length === 0) return setToast({ msg: 'El carrito está vacío', type: 'error' });
    if (tipoEntrega === 'DOMICILIO' && !direccion.trim()) return setToast({ msg: 'Ingresa la dirección', type: 'error' });
    const payload = {
      usuario: user?.id, restaurante: restSelec._id, tipoEntrega, total: totalCarrito,
      detalles: carrito.map(i => ({ plato: i.plato._id, cantidad: i.cantidad, precioUnitario: i.plato.precio, subtotal: i.plato.precio * i.cantidad })),
      ...(tipoEntrega === 'DOMICILIO' ? { direccionEntrega: { calle: direccion, ciudad: 'Guatemala' } } : {}),
    };
    setEnviando(true);
    const result = await crearPedido(payload);
    setEnviando(false);
    if (result.success) { setCarrito([]); setModalCarrito(false); setToast({ msg: 'Pedido realizado', type: 'success' }); }
    else setToast({ msg: result.error || 'Error al crear pedido', type: 'error' });
  };

  // PASO 1 — elegir restaurante
  if (paso === 1) return (
    <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.pageTitle}>Menú</Text>
      <Text style={s.pageSub}>¿En qué restaurante deseas ordenar?</Text>
      {loading ? <LoadingSpinner /> : restaurantes.map(r => (
        <TouchableOpacity key={r._id} onPress={() => seleccionarRest(r)} style={s.restItemBtn} activeOpacity={0.8}>
          <Text style={s.restItemText}>{r.nombre}</Text>
          <Text style={s.restItemDir}>{r.direccion}</Text>
          {r.horarioApertura && <Text style={s.restItemHorario}>{r.horarioApertura} — {r.horarioCierre}</Text>}
        </TouchableOpacity>
      ))}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );

  // PASO 2 — ver menú
  const platosDisp = platos.filter(p => p.disponible !== false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.menuHeader}>
          <TouchableOpacity onPress={() => setPaso(1)} style={s.backBtn}>
            <Text style={s.backBtnText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={s.menuRestNombre}>{restSelec?.nombre}</Text>
          <Text style={s.menuRestDir}>{restSelec?.direccion}</Text>
        </View>

        {loading ? <LoadingSpinner /> : platosDisp.length === 0 ? (
          <EmptyState title="Sin platos disponibles" subtitle="Este restaurante no tiene platos activos" />
        ) : platosDisp.map(p => {
          const enCarrito = carrito.find(i => i.plato._id === p._id);
          const { tieneStock: conStock, maximo } = getStock(p);
          const llegóAlMax = enCarrito && enCarrito.cantidad >= maximo;
          return (
            <GCard key={p._id} style={[s.platoCard, !conStock && s.platoAgotado]}>
              {p.imagen ? (
                <Image source={{ uri: p.imagen }} style={s.platoImg} resizeMode="cover" />
              ) : (
                <View style={s.platoImgPlaceholder}>
                  <Text style={s.platoImgPlaceholderText}>Sin imagen</Text>
                </View>
              )}
              <View style={s.platoInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={s.platoNombre}>{p.nombre}</Text>
                  {p.descripcion && <Text style={s.platoDesc} numberOfLines={2}>{p.descripcion}</Text>}
                  <Text style={s.platoPrecio}>Q {Number(p.precio || 0).toFixed(2)}</Text>
                  {!conStock && <Text style={s.agotadoText}>Agotado</Text>}
                  {conStock && maximo < 9999 && <Text style={s.stockText}>Disponibles: {maximo}</Text>}
                </View>
                <View style={s.cantRow}>
                  {!conStock ? (
                    <View style={s.agotadoBadge}><Text style={s.agotadoBadgeText}>Sin stock</Text></View>
                  ) : enCarrito ? (
                    <>
                      <TouchableOpacity onPress={() => quitarDelCarrito(p._id)} style={s.cantBtn}><Text style={s.cantBtnText}>−</Text></TouchableOpacity>
                      <Text style={s.cantNum}>{enCarrito.cantidad}</Text>
                      <TouchableOpacity onPress={() => agregarAlCarrito(p)} style={[s.cantBtn, llegóAlMax && { opacity: 0.35 }]} disabled={llegóAlMax}>
                        <Text style={s.cantBtnText}>+</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity onPress={() => agregarAlCarrito(p)} style={s.addBtn}>
                      <Text style={s.addBtnText}>Agregar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </GCard>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      {cantCarrito > 0 && (
        <TouchableOpacity style={s.carritoFloating} onPress={() => setModalCarrito(true)} activeOpacity={0.9}>
          <View style={s.carritoBadge}><Text style={s.carritoBadgeText}>{cantCarrito}</Text></View>
          <Text style={s.carritoText}>Ver carrito — Q {totalCarrito.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalCarrito} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Tu pedido</Text>
            <ScrollView style={{ maxHeight: 260 }}>
              {carrito.map(i => (
                <View key={i.plato._id} style={s.carritoItem}>
                  {i.plato.imagen && <Image source={{ uri: i.plato.imagen }} style={s.carritoImg} resizeMode="cover" />}
                  <View style={{ flex: 1 }}>
                    <Text style={s.carritoNombre}>{i.plato.nombre}</Text>
                    <Text style={s.carritoSub}>Q {i.plato.precio.toFixed(2)} c/u</Text>
                  </View>
                  <View style={s.cantRow}>
                    <TouchableOpacity onPress={() => quitarDelCarrito(i.plato._id)} style={s.cantBtn}><Text style={s.cantBtnText}>−</Text></TouchableOpacity>
                    <Text style={s.cantNum}>{i.cantidad}</Text>
                    <TouchableOpacity onPress={() => agregarAlCarrito(i.plato)} style={s.cantBtn}><Text style={s.cantBtnText}>+</Text></TouchableOpacity>
                  </View>
                  <Text style={s.carritoSubtotal}>Q {(i.plato.precio * i.cantidad).toFixed(2)}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={s.modalDivider} />
            <Text style={s.modalLabel}>Tipo de entrega</Text>
            <View style={s.tipoRow}>
              {['RECOGER', 'DOMICILIO'].map(t => (
                <TouchableOpacity key={t} onPress={() => setTipoEntrega(t)} style={[s.tipoBtn, tipoEntrega === t && s.tipoBtnActive]} activeOpacity={0.8}>
                  <Text style={[s.tipoBtnText, tipoEntrega === t && s.tipoBtnTextActive]}>{t === 'RECOGER' ? 'Para recoger' : 'A domicilio'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {tipoEntrega === 'DOMICILIO' && <GInput label="Dirección" placeholder="Calle, zona, referencia..." value={direccion} onChangeText={setDireccion} />}
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalVal}>Q {totalCarrito.toFixed(2)}</Text>
            </View>
            <GButton label="Confirmar pedido" onPress={confirmarPedido} loading={enviando} />
            <GButton label="Cancelar" onPress={() => setModalCarrito(false)} variant="secondary" style={{ marginTop: SPACING.sm }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  pageTitle: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, paddingVertical: SPACING.lg },
  pageSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginBottom: SPACING.lg, marginTop: -SPACING.md },
  restItemBtn: { padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.glassBorder, marginBottom: SPACING.sm, backgroundColor: COLORS.glass },
  restItemText: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  restItemDir: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
  restItemHorario: { fontSize: FONT_SIZE.xs, color: COLORS.emerald, marginTop: 2 },
  menuHeader: { paddingVertical: SPACING.md, marginBottom: SPACING.sm },
  backBtn: { marginBottom: SPACING.sm },
  backBtnText: { fontSize: FONT_SIZE.sm, color: COLORS.emerald },
  menuRestNombre: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  menuRestDir: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
  platoCard: { marginBottom: SPACING.sm, overflow: 'hidden' },
  platoAgotado: { opacity: 0.55 },
  platoImg: { width: '100%', height: 160, borderRadius: RADIUS.md, marginBottom: SPACING.sm },
  platoImgPlaceholder: { width: '100%', height: 100, borderRadius: RADIUS.md, backgroundColor: COLORS.glass, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  platoImgPlaceholderText: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  platoInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  platoNombre: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  platoDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2 },
  platoPrecio: { fontSize: FONT_SIZE.lg, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, marginTop: 4 },
  agotadoText: { fontSize: FONT_SIZE.xs, color: COLORS.error, marginTop: 2 },
  stockText: { fontSize: FONT_SIZE.xs, color: COLORS.warning, marginTop: 2 },
  agotadoBadge: { backgroundColor: COLORS.errorDim, borderWidth: 1, borderColor: 'rgba(224,84,84,0.3)', borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  agotadoBadgeText: { fontSize: FONT_SIZE.xs, color: COLORS.error },
  cantRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  cantBtn: { width: 28, height: 28, borderRadius: RADIUS.sm, backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center', justifyContent: 'center' },
  cantBtnText: { fontSize: FONT_SIZE.lg, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.bold },
  cantNum: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, minWidth: 20, textAlign: 'center' },
  addBtn: { backgroundColor: COLORS.emeraldDim, borderWidth: 1, borderColor: COLORS.emeraldBorder, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 6 },
  addBtnText: { fontSize: FONT_SIZE.xs, color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  carritoFloating: { position: 'absolute', bottom: 16, left: SPACING.lg, right: SPACING.lg, backgroundColor: COLORS.emerald, borderRadius: RADIUS.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md, ...SHADOWS.emerald },
  carritoBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  carritoBadgeText: { fontSize: 9, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },
  carritoText: { fontSize: FONT_SIZE.md, color: COLORS.bg, fontWeight: FONT_WEIGHT.semibold },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: COLORS.overlay },
  modalSheet: { backgroundColor: COLORS.bgCard, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, maxHeight: '85%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.glassBorder, alignSelf: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.md },
  modalDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  modalLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.sm },
  carritoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: SPACING.sm },
  carritoImg: { width: 48, height: 48, borderRadius: RADIUS.sm },
  carritoNombre: { fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  carritoSub: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  carritoSubtotal: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, minWidth: 60, textAlign: 'right' },
  tipoRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  tipoBtn: { flex: 1, padding: SPACING.sm, borderRadius: RADIUS.md, backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center' },
  tipoBtnActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  tipoBtnText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  tipoBtnTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: SPACING.md },
  totalLabel: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  totalVal: { fontSize: FONT_SIZE.xxl, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },
});