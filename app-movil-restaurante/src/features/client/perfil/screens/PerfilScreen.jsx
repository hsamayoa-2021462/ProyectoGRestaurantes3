// src/features/client/perfil/screens/PerfilScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useProfile from '../hooks/useProfile.js';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../../shared/constants/theme.js';
import { GCard, GButton } from '../../../../shared/components/common/UI.jsx';

export default function PerfilScreen({ client, logout }) {
  const {
    user, submitting, error, success,
    clearMsg, fetchProfile, changePhoto,
  } = useProfile();

  const [imgError, setImgError] = useState(false);

  useEffect(() => { fetchProfile().catch(() => {}); }, []);

  const inicial = user?.name
    ? `${user.name[0]}${user.surname?.[0] ?? ''}`.toUpperCase()
    : (user?.username?.[0] ?? 'U').toUpperCase();

  const nombreCompleto = user?.name
    ? `${user.name}${user.surname ? ' ' + user.surname : ''}`.trim()
    : user?.username ?? 'Usuario';

  const photoUri = user?.profilePicture ?? null;
  const tienePhoto = photoUri
    && !imgError
    && !photoUri.includes('default-avatar')
    && (
      photoUri.startsWith('file://')  ||
      photoUri.startsWith('data:')    ||
      photoUri.startsWith('blob:')    ||
      photoUri.startsWith('http')
    );

  const handlePhoto = async () => {
    try {
      // Expo 51 — usar MediaTypeOptions en vez de array
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Permiso requerido',
          'Ve a Configuración > Aplicaciones > Expo Go > Permisos y activa el acceso a fotos.',
          [{ text: 'Entendido' }]
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      });
      if (result.canceled) return;
      setImgError(false);
      await changePhoto(result.assets[0]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo abrir la galería: ' + (e?.message || ''));
    }
  };

  return (
    <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.pageTitle}>Mi perfil</Text>

      <GCard style={s.perfilCard}>
        <TouchableOpacity onPress={handlePhoto} activeOpacity={0.8} style={s.avatarWrap}>
          {tienePhoto ? (
            <Image source={{ uri: photoUri }} style={s.avatarImg} onError={() => setImgError(true)} />
          ) : (
            <View style={s.avatarCircle}>
              <Text style={s.avatarText}>{inicial}</Text>
            </View>
          )}
          <View style={s.cameraBtn}>
            {submitting
              ? <ActivityIndicator size="small" color={COLORS.bg} />
              : <Text style={s.cameraBtnText}>+</Text>
            }
          </View>
        </TouchableOpacity>

        <Text style={s.perfilNombre}>{nombreCompleto}</Text>
        <Text style={s.perfilSub}>@{user?.username || ''}</Text>
        <Text style={s.fotoHint}>Toca la foto para cambiarla</Text>

        {success && (
          <View style={s.successMsg}>
            <Text style={s.successText}>{success}</Text>
            <TouchableOpacity onPress={clearMsg}><Text style={s.successClose}>×</Text></TouchableOpacity>
          </View>
        )}
        {error && (
          <View style={s.errorMsg}>
            <Text style={s.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearMsg}><Text style={s.errorClose}>×</Text></TouchableOpacity>
          </View>
        )}
      </GCard>

      <GCard style={{ marginTop: SPACING.md }}>
        {[
          { label: 'Correo',    value: user?.email    || '—' },
          { label: 'Teléfono', value: user?.phone     || '—' },
          { label: 'Usuario',  value: user?.username  || '—' },
          { label: 'Rol',      value: user?.role === 'ADMIN_ROLE' ? 'Administrador' : 'Cliente' },
        ].map(row => (
          <View key={row.label} style={s.infoRow}>
            <Text style={s.infoKey}>{row.label}</Text>
            <Text style={s.infoVal}>{row.value}</Text>
          </View>
        ))}
      </GCard>

      <GButton
        label="Cerrar sesión"
        onPress={logout}
        variant="secondary"
        style={{ marginTop: SPACING.xl, borderColor: COLORS.error }}
      />
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: SPACING.lg },
  pageTitle: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, paddingVertical: SPACING.lg },
  perfilCard: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatarWrap: { position: 'relative', marginBottom: SPACING.md },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.emeraldDim, borderWidth: 2, borderColor: COLORS.emeraldBorder, alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: COLORS.emeraldBorder },
  avatarText: { fontSize: 38, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.emerald, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.bg },
  cameraBtnText: { fontSize: 20, color: COLORS.bg, fontWeight: FONT_WEIGHT.bold, lineHeight: 24 },
  perfilNombre: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
  perfilSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 4 },
  fotoHint: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 8 },
  successMsg: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.emeraldDim, borderWidth: 1, borderColor: COLORS.emeraldBorder, borderRadius: RADIUS.md, padding: SPACING.sm, marginTop: SPACING.md, gap: SPACING.sm },
  successText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.emerald },
  successClose: { fontSize: 18, color: COLORS.emerald },
  errorMsg: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.errorDim, borderWidth: 1, borderColor: 'rgba(224,84,84,0.3)', borderRadius: RADIUS.md, padding: SPACING.sm, marginTop: SPACING.md, gap: SPACING.sm },
  errorText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.error },
  errorClose: { fontSize: 18, color: COLORS.error },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoKey: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  infoVal: { fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.medium, flex: 1, textAlign: 'right' },
});