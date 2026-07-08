// src/features/auth/screens/ForgotPasswordScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../hooks/useAuth.js';
import { GInput, GButton, Toast } from '../../../shared/components/common/UI.jsx';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../shared/constants/theme.js';

export default function ForgotPasswordScreen({ navigation }) {
    const { handleForgotPassword, loading, clearError } = useAuth();
    const [sent, setSent] = useState(false);
    const [toast, setToast] = useState(null);
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '' } });

    const onSubmit = async ({ email }) => {
        clearError();
        const result = await handleForgotPassword(email);
        if (result.success) setSent(true);
        else setToast({ msg: result.error, type: 'error' });
    };

    if (sent) return (
        <SafeAreaView style={s.safe}>
            <View style={s.center}>
                <View style={s.iconBox}><Text style={s.iconText}>@</Text></View>
                <Text style={s.doneTitle}>Correo enviado</Text>
                <Text style={s.doneSub}>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</Text>
                <GButton label="Volver al inicio" onPress={() => navigation.navigate('Login')} style={{ marginTop: SPACING.lg }} />
            </View>
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scroll}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: SPACING.lg }}>
                    <Text style={s.backText}>Volver</Text>
                </TouchableOpacity>
                <Text style={s.title}>Restablecer contraseña</Text>
                <Text style={s.sub}>Ingresa tu correo y te enviaremos un enlace de recuperación.</Text>
                <View style={s.card}>
                    <Controller control={control} name="email" rules={{ required: 'El correo es obligatorio', pattern: { value: /\S+@\S+\.\S+/, message: 'Correo inválido' } }}
                        render={({ field: { onChange, value } }) => (
                            <GInput label="Correo electrónico" placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} error={errors.email?.message} />
                        )}
                    />
                    <GButton label="Enviar instrucciones" onPress={handleSubmit(onSubmit)} loading={loading} />
                </View>
            </ScrollView>
            {toast && <Toast message={toast.msg} type={toast.type} visible onHide={() => setToast(null)} />}
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    scroll: { flexGrow: 1, padding: SPACING.lg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
    iconBox: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.emeraldDim, borderWidth: 1, borderColor: COLORS.emeraldBorder, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
    iconText: { fontSize: 32, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },
    doneTitle: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: 4 },
    doneSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, textAlign: 'center' },
    title: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: 4 },
    sub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginBottom: SPACING.lg },
    card: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.xl, padding: SPACING.lg },
    backText: { fontSize: FONT_SIZE.sm, color: COLORS.emerald },
});