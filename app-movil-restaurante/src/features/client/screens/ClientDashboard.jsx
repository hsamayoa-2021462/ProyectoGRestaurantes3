// src/features/client/screens/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, RefreshControl, Modal, Alert, Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import useClient from '../hooks/useClient.js';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING, SHADOWS } from '../../../shared/constants/theme.js';
import { GCard, GBadge, GButton, GInput, LoadingSpinner, Toast, SectionHeader, EmptyState } from '../../../shared/components/common/UI.jsx';

const TABS = [
  { id: 'inicio',        label: 'Inicio' },
  { id: 'menu',          label: 'Menú' },
  { id: 'pedidos',       label: 'Pedidos' },
  { id: 'reservaciones', label: 'Reservas' },
  { id: 'resenas',       label: 'Reseñas' },
  { id: 'perfil',        label: 'Perfil' },
];

const estadoPedidoBadge = (e) => ({ CONFIRMADO:'info', PREPARANDO:'warning', EN_CAMINO:'info', ENTREGADO:'success', CANCELADO:'error', PENDIENTE:'neutral' }[e] || 'neutral');
const estadoResBadge    = (e) => ({ PENDIENTE:'neutral', CONFIRMADA:'success', CANCELADA:'error', COMPLETADA:'info' }[e] || 'neutral');
const fmtFecha = (d) => d ? new Date(d).toLocaleDateString('es-GT', { day:'2-digit', month:'short', year:'numeric' }) : '—';

// ═══════════════════ INICIO ═══════════════════
function InicioTab({ client, setTab }) {
  const { user, restaurantes, fetchRestaurantes, misPedidos, fetchMisPedidos, loading } = client;
  useEffect(() => { fetchRestaurantes(); fetchMisPedidos(); }, []);

  return (
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
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

      {misPedidos.slice(0, 3).length > 0 && (
        <>
          <SectionHeader title="Pedidos recientes" action="Ver todos" onAction={() => setTab('pedidos')} />
          {misPedidos.slice(0, 3).map(p => (
            <GCard key={p._id} style={s.pedidoMiniCard}>
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

// ═══════════════════ MENÚ ═══════════════════
function MenuTab({ client, setToast }) {
  const { restaurantes, fetchRestaurantes, platos, stockMap, fetchPlatos, crearPedido, loading, user } = client;
  const [paso, setPaso]             = useState(1); // 1=elegir restaurante, 2=ver menú
  const [restSelec, setRestSelec]   = useState(null);
  const [carrito, setCarrito]       = useState([]);
  const [modalCarrito, setModalCarrito] = useState(false);
  const [tipoEntrega, setTipoEntrega]   = useState('RECOGER');
  const [direccion, setDireccion]       = useState('');
  const [enviando, setEnviando]         = useState(false);

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

  const tieneStock = (plato) => getStock(plato).tieneStock;

  const agregarAlCarrito = (plato) => {
    const { tieneStock: hayStock, maximo } = getStock(plato);
    if (!hayStock) return;
    setCarrito(prev => {
      const ex = prev.find(i => i.plato._id === plato._id);
      if (ex) {
        if (ex.cantidad >= maximo) return prev; // bloquear al llegar al máximo
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

  const totalCarrito  = carrito.reduce((s, i) => s + (i.plato.precio * i.cantidad), 0);
  const cantCarrito   = carrito.reduce((s, i) => s + i.cantidad, 0);

  const confirmarPedido = async () => {
    if (carrito.length === 0) return setToast({ msg: 'El carrito está vacío', type: 'error' });
    if (tipoEntrega === 'DOMICILIO' && !direccion.trim()) return setToast({ msg: 'Ingresa la dirección', type: 'error' });

    const payload = {
      usuario: user?.id,
      restaurante: restSelec._id,
      detalles: carrito.map(i => ({
        plato: i.plato._id,
        cantidad: i.cantidad,
        precioUnitario: i.plato.precio,
        subtotal: i.plato.precio * i.cantidad,
      })),
      tipoEntrega,
      total: totalCarrito,
      ...(tipoEntrega === 'DOMICILIO' ? { direccionEntrega: { calle: direccion, ciudad: 'Guatemala' } } : {}),
    };

    setEnviando(true);
    const result = await crearPedido(payload);
    setEnviando(false);
    if (result.success) {
      setCarrito([]); setModalCarrito(false);
      setToast({ msg: 'Pedido realizado correctamente', type: 'success' });
    } else {
      setToast({ msg: result.error || 'Error al crear pedido', type: 'error' });
    }
  };

  // PASO 1 — Elegir restaurante
  if (paso === 1) {
    return (
      <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
        <Text style={s.pageTitle}>Menú</Text>
        <Text style={s.pageSubtitle}>¿En qué restaurante deseas ordenar?</Text>
        {loading ? <LoadingSpinner /> : restaurantes.map(r => (
          <TouchableOpacity key={r._id} onPress={() => seleccionarRest(r)}
            style={s.restItemBtn} activeOpacity={0.8}>
            <Text style={s.restItemText}>{r.nombre}</Text>
            <Text style={s.restItemDir}>{r.direccion}</Text>
            {r.horarioApertura && <Text style={s.restItemHorario}>{r.horarioApertura} — {r.horarioCierre}</Text>}
          </TouchableOpacity>
        ))}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    );
  }

  // PASO 2 — Ver menú del restaurante
  const platosDisp = platos.filter(p => p.disponible !== false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
        {/* Header restaurante */}
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
          const enCarrito  = carrito.find(i => i.plato._id === p._id);
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
                  {conStock && maximo < 999 && <Text style={s.stockText}>Disponibles: {maximo}</Text>}
                </View>
                <View style={s.cantRow}>
                  {!conStock ? (
                    <View style={s.agotadoBadge}>
                      <Text style={s.agotadoBadgeText}>Sin stock</Text>
                    </View>
                  ) : enCarrito ? (
                    <>
                      <TouchableOpacity onPress={() => quitarDelCarrito(p._id)} style={s.cantBtn}>
                        <Text style={s.cantBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={s.cantNum}>{enCarrito.cantidad}</Text>
                      <TouchableOpacity onPress={() => agregarAlCarrito(p)}
                        style={[s.cantBtn, llegóAlMax && { opacity: 0.35 }]}
                        disabled={llegóAlMax}>
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
                    <TouchableOpacity onPress={() => quitarDelCarrito(i.plato._id)} style={s.cantBtn}>
                      <Text style={s.cantBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={s.cantNum}>{i.cantidad}</Text>
                    <TouchableOpacity onPress={() => agregarAlCarrito(i.plato)} style={s.cantBtn}>
                      <Text style={s.cantBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={s.carritoSubtotal}>Q {(i.plato.precio * i.cantidad).toFixed(2)}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={s.modalDivider} />
            <Text style={s.modalLabel}>Tipo de entrega</Text>
            <View style={s.tipoRow}>
              {['RECOGER', 'DOMICILIO'].map(t => (
                <TouchableOpacity key={t} onPress={() => setTipoEntrega(t)}
                  style={[s.tipoBtn, tipoEntrega === t && s.tipoBtnActive]} activeOpacity={0.8}>
                  <Text style={[s.tipoBtnText, tipoEntrega === t && s.tipoBtnTextActive]}>
                    {t === 'RECOGER' ? 'Para recoger' : 'A domicilio'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {tipoEntrega === 'DOMICILIO' && (
              <GInput label="Dirección" placeholder="Calle, zona, referencia..." value={direccion} onChangeText={setDireccion} />
            )}
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

// ═══════════════════ PEDIDOS ═══════════════════
function PedidosTab({ client }) {
  const { misPedidos, fetchMisPedidos, loading } = client;
  const [ocultos, setOcultos] = useState([]);
  useEffect(() => { fetchMisPedidos(); }, []);

  return (
    <ScrollView style={s.tabContent} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMisPedidos} tintColor={COLORS.emerald} />}>
      <Text style={s.pageTitle}>Mis pedidos</Text>
      {misPedidos.filter(p => !ocultos.includes(p._id)).length === 0 ? (
        <EmptyState title="Sin pedidos" subtitle="Aún no has realizado ningún pedido" />
      ) : misPedidos.filter(p => !ocultos.includes(p._id)).map(p => (
        <GCard key={p._id} style={s.pedidoCard}>
          <View style={s.rowBetween}>
            <Text style={s.pedidoId}>#{String(p._id).slice(-6).toUpperCase()}</Text>
            <View style={{ flexDirection:'row', alignItems:'center', gap: SPACING.sm }}>
              <GBadge label={p.estado} type={estadoPedidoBadge(p.estado)} />
              {['ENTREGADO','CANCELADO'].includes(p.estado) && (
                <TouchableOpacity onPress={() => setOcultos(prev => [...prev, p._id])} style={s.xBtn}>
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
            <Text style={s.pedidoTotalBig}>Q {Number(p.total || 0).toFixed(2)}</Text>
          </View>
        </GCard>
      ))}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

// ═══════════════════ RESERVACIONES ═══════════════════
const generarHoras = (apertura, cierre) => {
  const [hA, mA] = (apertura || '09:00').split(':').map(Number);
  const [hC, mC] = (cierre   || '22:00').split(':').map(Number);
  const inicio = hA * 60 + (mA || 0), fin = hC * 60 + (mC || 0);
  const horas = [];
  for (let m = inicio; m < fin; m += 30)
    horas.push(`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`);
  return horas;
};

function ReservacionesTab({ client, setToast }) {
  const { restaurantes, fetchRestaurantes, mesas, fetchMesasDisponibles, misReservaciones, fetchMisReservaciones, crearReservacion, cancelarReservacion, estadosRes, fetchEstadosReservacion, user, loading } = client;
  const [subTab, setSubTab]     = useState('nueva');
  const [paso, setPaso]         = useState(1);
  const [rest, setRest]         = useState(null);
  const [fecha, setFecha]       = useState('');
  const [hora, setHora]         = useState('');
  const [mesa, setMesa]         = useState(null);
  const [numPersonas, setNumPersonas] = useState('2');
  const [obs, setObs]           = useState('');
  const [horas, setHoras]       = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [ocultas, setOcultas]   = useState([]);

  useEffect(() => { fetchRestaurantes(); fetchEstadosReservacion(); fetchMisReservaciones(); }, []);

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
      usuario: user?.id, restaurante: rest._id,
      fecha, hora, numPersonas: Number(numPersonas),
      estado: estadoPendiente._id,
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

  return (
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
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
          {loading ? <LoadingSpinner /> : misReservaciones.filter(r => !ocultas.includes(r._id)).length === 0 ? (
            <EmptyState title="Sin reservaciones" subtitle="No tienes reservaciones registradas" />
          ) : misReservaciones.filter(r => !ocultas.includes(r._id)).map(r => {
            const en = r.estado?.nombre || r.estado || '';
            return (
              <GCard key={r._id} style={s.resCard}>
                <View style={s.rowBetween}>
                  <Text style={s.resRest}>{r.restaurante?.nombre || '—'}</Text>
                  <View style={{ flexDirection:'row', alignItems:'center', gap: 6 }}>
                    <GBadge label={en} type={estadoResBadge(en)} />
                    {['CANCELADA','COMPLETADA'].includes(en) && (
                      <TouchableOpacity onPress={() => setOcultas(prev => [...prev, r._id])} style={s.xBtn}>
                        <Text style={s.xBtnText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Text style={s.resFecha}>{r.fecha} a las {r.hora}</Text>
                <Text style={s.resMeta}>{r.numPersonas} persona(s){r.mesa ? ` · Mesa #${r.mesa?.numeroMesa}` : ''}</Text>
                {['PENDIENTE','CONFIRMADA'].includes(en) && (
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

// ═══════════════════ RESEÑAS ═══════════════════
function ResenasTab({ client, setToast }) {
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
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={s.pageTitle}>Reseñas</Text>
      <GCard style={s.resenaFormCard}>
        <Text style={s.resenaFormTitle}>Escribe una reseña</Text>
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
            }} style={s.xBtn}><Text style={s.xBtnText}>×</Text></TouchableOpacity>
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

// ═══════════════════ PERFIL ═══════════════════

function PerfilTab({ client, logout }) {
  const { perfil, fetchPerfil, user } = client;
  useEffect(() => { fetchPerfil(); }, []);

  const datos = perfil || user || {};
  const inicial = (datos?.name?.[0] || 'U').toUpperCase();

  return (
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={s.pageTitle}>Mi perfil</Text>
      <GCard style={s.perfilCard}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>{inicial}</Text>
        </View>
        <Text style={s.perfilNombre}>{datos?.name} {datos?.surname || ''}</Text>
        <Text style={s.perfilSub}>@{datos?.username || ''}</Text>
      </GCard>

      <GCard style={{ marginTop: SPACING.md }}>
        {[
          { label: 'Correo',    value: datos?.email    || '—' },
          { label: 'Teléfono', value: datos?.phone     || '—' },
          { label: 'Usuario',  value: datos?.username  || '—' },
          { label: 'Rol',      value: datos?.role      || datos?.roleName || '—' },
        ].map(row => (
          <View key={row.label} style={s.infoRow}>
            <Text style={s.infoKey}>{row.label}</Text>
            <Text style={s.infoVal}>{row.value}</Text>
          </View>
        ))}
      </GCard>

      <GButton label="Cerrar sesión" onPress={logout} variant="secondary"
        style={{ marginTop: SPACING.xl, borderColor: COLORS.error }} />
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

// ═══════════════════ DASHBOARD PRINCIPAL ═══════════════════
export default function ClientDashboard({ user, logout }) {
  const client = useClient();
  const [tab, setTab]     = useState('inicio');
  const [toast, setToast] = useState(null);

  const renderTab = () => {
    switch (tab) {
      case 'inicio':        return <InicioTab client={client} setTab={setTab} />;
      case 'menu':          return <MenuTab client={client} setToast={setToast} />;
      case 'pedidos':       return <PedidosTab client={client} />;
      case 'reservaciones': return <ReservacionesTab client={client} setToast={setToast} />;
      case 'resenas':       return <ResenasTab client={client} setToast={setToast} />;
      case 'perfil':        return <PerfilTab client={client} logout={logout} />;
      default:              return null;
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <Text style={s.topBarBrand}>Gastro</Text>
        <View style={s.notifBtn}>
          {client.noLeidas > 0 && (
            <View style={s.notifDot}>
              <Text style={s.notifDotText}>{client.noLeidas}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={{ flex: 1 }}>{renderTab()}</View>
      <View style={s.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={s.tabItem} activeOpacity={0.7}>
            <View style={[s.tabIndicator, tab === t.id && s.tabIndicatorActive]} />
            <Text style={[s.tabLabel, tab === t.id && s.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {toast && <Toast message={toast.msg} type={toast.type} visible onHide={() => setToast(null)} />}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
  topBarBrand: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 2 },
  notifBtn: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems:'center', justifyContent:'center' },
  notifDot: { position:'absolute', top:-4, right:-4, width:16, height:16, borderRadius:8, backgroundColor: COLORS.emerald, alignItems:'center', justifyContent:'center' },
  notifDotText: { fontSize: 9, color: COLORS.bg, fontWeight: FONT_WEIGHT.bold },

  tabBar: { flexDirection:'row', borderTopWidth:1, borderTopColor: COLORS.glassBorder, backgroundColor: COLORS.bgCard, paddingBottom: SPACING.sm },
  tabItem: { flex:1, alignItems:'center', paddingTop: SPACING.sm },
  tabIndicator: { width:24, height:2, borderRadius:1, backgroundColor:'transparent', marginBottom:4 },
  tabIndicatorActive: { backgroundColor: COLORS.emerald },
  tabLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  tabLabelActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  tabContent: { flex:1, paddingHorizontal: SPACING.lg },

  welcomeBox: { paddingVertical: SPACING.xl, marginBottom: SPACING.md },
  welcomeLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, letterSpacing:1 },
  welcomeName: { fontSize: FONT_SIZE.xxxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.bold, lineHeight:40 },
  welcomeSub: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop:4 },

  quickGrid: { flexDirection:'row', flexWrap:'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  quickCard: { width:'47%', backgroundColor: COLORS.bgCard, borderWidth:1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems:'center' },
  quickLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium },

  sectionTitle: { fontSize: FONT_SIZE.lg, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.sm, marginTop: SPACING.md },
  pageTitle: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, paddingVertical: SPACING.lg },
  pageSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginBottom: SPACING.lg, marginTop: -SPACING.md },

  restCard: { marginBottom: SPACING.sm },
  restNombre: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  restDir: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop:2 },
  restHorario: { fontSize: FONT_SIZE.xs, color: COLORS.emerald, marginTop:4 },

  // Menú
  menuHeader: { paddingVertical: SPACING.md, marginBottom: SPACING.sm },
  backBtn: { marginBottom: SPACING.sm },
  backBtnText: { fontSize: FONT_SIZE.sm, color: COLORS.emerald },
  menuRestNombre: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  menuRestDir: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop:2 },

  restItemBtn: { padding: SPACING.md, borderRadius: RADIUS.md, borderWidth:1, borderColor: COLORS.glassBorder, marginBottom: SPACING.sm, backgroundColor: COLORS.glass },
  restItemBtnActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  restItemText: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  restItemDir: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop:2 },
  restItemHorario: { fontSize: FONT_SIZE.xs, color: COLORS.emerald, marginTop:2 },

  platoCard: { marginBottom: SPACING.sm, overflow:'hidden' },
  platoAgotado: { opacity: 0.55 },
  platoImg: { width:'100%', height:160, borderRadius: RADIUS.md, marginBottom: SPACING.sm },
  platoImgPlaceholder: { width:'100%', height:100, borderRadius: RADIUS.md, backgroundColor: COLORS.glass, alignItems:'center', justifyContent:'center', marginBottom: SPACING.sm },
  platoImgPlaceholderText: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  platoInfo: { flexDirection:'row', alignItems:'flex-start', gap: SPACING.sm },
  platoNombre: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  platoDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop:2 },
  platoPrecio: { fontSize: FONT_SIZE.lg, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, marginTop:4 },
  agotadoText: { fontSize: FONT_SIZE.xs, color: COLORS.error, marginTop:2 },
  stockText: { fontSize: FONT_SIZE.xs, color: COLORS.warning, marginTop:2 },
  agotadoBadge: { backgroundColor: COLORS.errorDim, borderWidth:1, borderColor: 'rgba(224,84,84,0.3)', borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical:4 },
  agotadoBadgeText: { fontSize: FONT_SIZE.xs, color: COLORS.error },

  cantRow: { flexDirection:'row', alignItems:'center', gap: SPACING.xs },
  cantBtn: { width:28, height:28, borderRadius: RADIUS.sm, backgroundColor: COLORS.glass, borderWidth:1, borderColor: COLORS.glassBorder, alignItems:'center', justifyContent:'center' },
  cantBtnText: { fontSize: FONT_SIZE.lg, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.bold },
  cantNum: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, minWidth:20, textAlign:'center' },
  addBtn: { backgroundColor: COLORS.emeraldDim, borderWidth:1, borderColor: COLORS.emeraldBorder, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical:6 },
  addBtnText: { fontSize: FONT_SIZE.xs, color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },

  carritoFloating: { position:'absolute', bottom:16, left: SPACING.lg, right: SPACING.lg, backgroundColor: COLORS.emerald, borderRadius: RADIUS.lg, flexDirection:'row', alignItems:'center', justifyContent:'center', padding: SPACING.md, ...SHADOWS.emerald },
  carritoBadge: { width:22, height:22, borderRadius:11, backgroundColor: COLORS.bg, alignItems:'center', justifyContent:'center', marginRight: SPACING.sm },
  carritoBadgeText: { fontSize:9, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },
  carritoText: { fontSize: FONT_SIZE.md, color: COLORS.bg, fontWeight: FONT_WEIGHT.semibold },

  modalOverlay: { flex:1, justifyContent:'flex-end', backgroundColor: COLORS.overlay },
  modalSheet: { backgroundColor: COLORS.bgCard, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, maxHeight:'85%' },
  modalHandle: { width:40, height:4, borderRadius:2, backgroundColor: COLORS.glassBorder, alignSelf:'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.md },
  modalDivider: { height:1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  modalLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, textTransform:'uppercase', letterSpacing:0.8, marginBottom: SPACING.sm },

  carritoItem: { flexDirection:'row', alignItems:'center', paddingVertical: SPACING.sm, borderBottomWidth:1, borderBottomColor: COLORS.border, gap: SPACING.sm },
  carritoImg: { width:48, height:48, borderRadius: RADIUS.sm },
  carritoNombre: { fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  carritoSub: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  carritoSubtotal: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, minWidth:60, textAlign:'right' },

  tipoRow: { flexDirection:'row', gap: SPACING.sm, marginBottom: SPACING.md },
  tipoBtn: { flex:1, padding: SPACING.sm, borderRadius: RADIUS.md, backgroundColor: COLORS.glass, borderWidth:1, borderColor: COLORS.glassBorder, alignItems:'center' },
  tipoBtnActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  tipoBtnText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  tipoBtnTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  totalRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical: SPACING.md },
  totalLabel: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  totalVal: { fontSize: FONT_SIZE.xxl, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },

  pedidoMiniCard: { marginBottom: SPACING.sm },
  pedidoCard: { marginBottom: SPACING.sm },
  pedidoId: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, letterSpacing:1 },
  pedidoRest: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop:4 },
  pedidoDetalle: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop:2 },
  pedidoTotal: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginTop:4 },
  pedidoFecha: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  pedidoTotalBig: { fontSize: FONT_SIZE.lg, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },

  subTabRow: { flexDirection:'row', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth:1, borderColor: COLORS.glassBorder, marginBottom: SPACING.lg },
  subTab: { flex:1, padding: SPACING.sm, alignItems:'center', borderRadius: RADIUS.md },
  subTabActive: { backgroundColor: COLORS.emeraldDim },
  subTabText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  subTabTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold },

  pasoBox: { backgroundColor: COLORS.bgCard, borderWidth:1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md },
  pasoTitle: { fontSize: FONT_SIZE.md, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.md },

  horasLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, textTransform:'uppercase', letterSpacing:0.8, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  horaChip: { backgroundColor: COLORS.glass, borderWidth:1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginRight: SPACING.sm },
  horaChipActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  horaChipText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  horaChipTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },

  mesaChip: { backgroundColor: COLORS.glass, borderWidth:1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginRight: SPACING.sm, alignItems:'center' },
  mesaChipActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  mesaChipText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  mesaChipTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  mesaCapacidad: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop:2 },

  resCard: { marginBottom: SPACING.sm },
  resRest: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  resFecha: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, marginTop:4 },
  resMeta: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop:2 },

  resenaFormCard: { marginBottom: SPACING.lg },
  resenaFormTitle: { fontSize: FONT_SIZE.lg, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.md },
  formLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, textTransform:'uppercase', letterSpacing:0.8, marginBottom: SPACING.sm },
  restChip: { backgroundColor: COLORS.glass, borderWidth:1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginRight: SPACING.sm },
  restChipActive: { backgroundColor: COLORS.emeraldDim, borderColor: COLORS.emeraldBorder },
  restChipText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  restChipTextActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  starsRow: { flexDirection:'row', gap: SPACING.sm, marginBottom: SPACING.md },
  star: { fontSize:32, color: COLORS.textMuted },
  starActive: { color: COLORS.emerald },
  resenaCard: { marginBottom: SPACING.sm },
  resenaNombre: { fontSize: FONT_SIZE.md, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium },
  starSm: { fontSize:16, color: COLORS.textMuted },
  starSmActive: { color: COLORS.emerald },
  resenaComment: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontStyle:'italic', marginTop:4 },
  resenaFecha: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop:4 },

  perfilCard: { alignItems:'center', paddingVertical: SPACING.xl },
  avatarCircle: { width:90, height:90, borderRadius:45, backgroundColor: COLORS.emeraldDim, borderWidth:1, borderColor: COLORS.emeraldBorder, alignItems:'center', justifyContent:'center', marginBottom: SPACING.md },
  avatarText: { fontSize: FONT_SIZE.xxxl, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },
  perfilNombre: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  perfilSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop:4 },
  infoRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical: SPACING.sm, borderBottomWidth:1, borderBottomColor: COLORS.border },
  infoKey: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  infoVal: { fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium, flex:1, textAlign:'right' },

  rowBetween: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  xBtn: { width:24, height:24, borderRadius: RADIUS.sm, backgroundColor: COLORS.glass, borderWidth:1, borderColor: COLORS.glassBorder, alignItems:'center', justifyContent:'center' },
  xBtnText: { fontSize: FONT_SIZE.md, color: COLORS.textMuted, lineHeight:22 },
});