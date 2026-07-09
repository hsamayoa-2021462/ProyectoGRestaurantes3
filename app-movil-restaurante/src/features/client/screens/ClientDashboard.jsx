// src/features/client/screens/ClientDashboard.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../shared/constants/theme.js';
import { Toast } from '../../../shared/components/common/UI.jsx';
import useClient from '../hooks/useClient.js';

import InicioScreen           from '../inicio/screens/InicioScreen.jsx';
import MenuScreen             from '../menu/screens/MenuScreen.jsx';
import PedidosScreen          from '../pedidos/screens/PedidosScreen.jsx';
import ReservacionesScreen    from '../reservaciones/screens/ReservacionesScreen.jsx';
import ResenasScreen          from '../resenas/screens/ResenasScreen.jsx';
import NotificacionesScreen   from '../notificaciones/screens/NotificacionesScreen.jsx';
import PerfilScreen           from '../perfil/screens/PerfilScreen.jsx';

const TABS = [
  { id: 'inicio',          label: 'Inicio' },
  { id: 'menu',            label: 'Menú' },
  { id: 'pedidos',         label: 'Pedidos' },
  { id: 'reservaciones',   label: 'Reservas' },
  { id: 'resenas',         label: 'Reseñas' },
  { id: 'notificaciones',  label: 'Avisos' },
  { id: 'perfil',          label: 'Perfil' },
];

export default function ClientDashboard({ user, logout }) {
  const client        = useClient();
  const [tab, setTab] = useState('inicio');
  const [toast, setToast] = useState(null);

  const renderTab = () => {
    switch (tab) {
      case 'inicio':         return <InicioScreen client={client} setTab={setTab} />;
      case 'menu':           return <MenuScreen client={client} setToast={setToast} />;
      case 'pedidos':        return <PedidosScreen client={client} />;
      case 'reservaciones':  return <ReservacionesScreen client={client} setToast={setToast} />;
      case 'resenas':        return <ResenasScreen client={client} setToast={setToast} />;
      case 'notificaciones': return <NotificacionesScreen client={client} />;
      case 'perfil':         return <PerfilScreen client={client} logout={logout} />;
      default:               return null;
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <Text style={s.brand}>Gastro</Text>
        {client.noLeidas > 0 && (
          <TouchableOpacity onPress={() => setTab('notificaciones')} style={s.notifBtn}>
            <View style={s.notifDot}>
              <Text style={s.notifDotText}>{client.noLeidas}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1 }}>
        {renderTab()}
      </View>

      <View style={s.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={s.tabItem} activeOpacity={0.7}>
            <View style={[s.tabIndicator, tab === t.id && s.tabIndicatorActive]} />
            <Text style={[s.tabLabel, tab === t.id && s.tabLabelActive]}>{t.label}</Text>
            {t.id === 'notificaciones' && client.noLeidas > 0 && (
              <View style={s.tabBadge}>
                <Text style={s.tabBadgeText}>{client.noLeidas}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {toast && <Toast message={toast.msg} type={toast.type} visible onHide={() => setToast(null)} />}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
  brand: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 2 },
  notifBtn: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.emeraldDim, borderWidth: 1, borderColor: COLORS.emeraldBorder, alignItems: 'center', justifyContent: 'center' },
  notifDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.emerald, alignItems: 'center', justifyContent: 'center' },
  notifDotText: { fontSize: 9, color: COLORS.bg, fontWeight: FONT_WEIGHT.bold },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.glassBorder, backgroundColor: COLORS.bgCard, paddingBottom: SPACING.sm },
  tabItem: { flex: 1, alignItems: 'center', paddingTop: SPACING.sm, position: 'relative' },
  tabIndicator: { width: 24, height: 2, borderRadius: 1, backgroundColor: 'transparent', marginBottom: 4 },
  tabIndicatorActive: { backgroundColor: COLORS.emerald },
  tabLabel: { fontSize: 9, color: COLORS.textMuted },
  tabLabelActive: { color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },
  tabBadge: { position: 'absolute', top: 2, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.emerald, alignItems: 'center', justifyContent: 'center' },
  tabBadgeText: { fontSize: 8, color: COLORS.bg, fontWeight: FONT_WEIGHT.bold },
});