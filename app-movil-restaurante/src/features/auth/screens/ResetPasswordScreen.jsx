// src/features/auth/screens/ResetPasswordScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../hooks/useAuth.js';
import { GInput, GButton, Toast } from '../../../shared/components/common/UI.jsx';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../shared/constants/theme.js';

export default function ResetPasswordScreen({ navigation, route }) {
    const { handleResetPassword, loading, clearError } = useAuth();
    const token = route?.params?.token ?? '';
    const [done, setDone] = useState(false);
    const [toast, setToast] = useState(null);
    const { control, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { newPassword: '', confirmPassword: '' } });
    const newPassword = watch('newPassword');

    const onSubmit = async ({ newPassword }) => {
        clearError();
        const result = await handleResetPassword({ token, newPassword });
        if (result.success) setDone(true);
        else setToast({ msg: result.error, type: 'error' });
    };

    if (done) return (
        <SafeAreaView style={s.safe}>
            <View style={s.center}>
                <View style={s.checkCircle}><Text style={s.checkText}>✓</Text></View>
                <Text style={s.doneTitle}>Contraseña restablecida</Text>
                <Text style={s.doneSub}>Ahora puedes iniciar sesión con tu nueva contraseña.</Text>
                <GButton label="Iniciar sesión" onPress={() => navigation.navigate('Login')} style={{ marginTop: SPACING.lg }} />
            </View>
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scroll}>
                <Text style={s.title}>Nueva contraseña</Text>
                <Text style={s.sub}>Elige una contraseña segura para tu cuenta.</Text>
                <View style={s.card}>
                    <Controller control={control} name="newPassword" rules={{ required: 'Campo obligatorio', minLength: { value: 8, message: 'Mínimo 8 caracteres' } }}
                        render={({ field: { onChange, value } }) => (
                            <GInput label="Nueva contraseña" placeholder="Mínimo 8 caracteres" secureTextEntry value={value} onChangeText={onChange} error={errors.newPassword?.message} />
                        )}
                    />
                    <Controller control={control} name="confirmPassword" rules={{ required: 'Campo obligatorio', validate: (v) => v === newPassword || 'Las contraseñas no coinciden' }}
                        render={({ field: { onChange, value } }) => (
                            <GInput label="Confirmar contraseña" placeholder="Repite la contraseña" secureTextEntry value={value} onChangeText={onChange} error={errors.confirmPassword?.message} />
                        )}
                    />
                    <GButton label="Restablecer contraseña" onPress={handleSubmit(onSubmit)} loading={loading} />
                </View>
            </ScrollView>
            {toast && <Toast message={toast.msg} type={toast.type} visible onHide={() => setToast(null)} />}
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    scroll: { flexGrow: 1, padding: SPACING.lg, justifyContent: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
    checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.emeraldDim, borderWidth: 1, borderColor: COLORS.emeraldBorder, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
    checkText: { fontSize: 36, color: COLORS.emerald },
    doneTitle: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: 4 },
    doneSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, textAlign: 'center' },
    title: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: 4 },
    sub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginBottom: SPACING.lg },
    card: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.xl, padding: SPACING.lg },
});