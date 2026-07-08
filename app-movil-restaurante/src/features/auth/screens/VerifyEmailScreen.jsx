// src/features/auth/screens/VerifyEmailScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../hooks/useAuth.js';
import { GInput, GButton, Toast } from '../../../shared/components/common/UI.jsx';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../shared/constants/theme.js';

export default function VerifyEmailScreen({ navigation, route }) {
    const { handleVerifyEmail, handleResendVerification, loading, clearError } = useAuth();
    const email = route?.params?.email ?? '';
    const autoToken = route?.params?.token ?? null;
    const [toast, setToast] = useState(null);
    const [verified, setVerified] = useState(false);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({ defaultValues: { token: '' } });

    useEffect(() => {
        if (autoToken) { setValue('token', autoToken); doVerify({ token: autoToken }); }
    }, [autoToken]);

    const doVerify = async ({ token }) => {
        clearError();
        const result = await handleVerifyEmail(token);
        if (result.success) setVerified(true);
        else setToast({ msg: result.error, type: 'error' });
    };

    const resend = async () => {
        if (!email) return;
        const result = await handleResendVerification(email);
        setToast({ msg: result.success ? 'Correo reenviado' : result.error, type: result.success ? 'success' : 'error' });
    };

    if (verified) return (
        <SafeAreaView style={s.safe}>
            <View style={s.center}>
                <View style={s.checkCircle}><Text style={s.checkText}>✓</Text></View>
                <Text style={s.doneTitle}>Correo verificado</Text>
                <Text style={s.doneSub}>Tu cuenta está activa. Inicia sesión para continuar.</Text>
                <GButton label="Ir al inicio" onPress={() => navigation.navigate('Login', { message: 'Cuenta verificada correctamente' })} style={{ marginTop: SPACING.lg, paddingHorizontal: SPACING.xxl }} />
            </View>
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scroll}>
                <Text style={s.title}>Verifica tu correo</Text>
                <Text style={s.sub}>Ingresa el código que enviamos a{email ? ` ${email}` : ' tu correo'}</Text>
                <View style={s.card}>
                    <Controller control={control} name="token" rules={{ required: 'El código es obligatorio' }}
                        render={({ field: { onChange, value } }) => (
                            <GInput label="Código de verificación" placeholder="Pega aquí el código" value={value} onChangeText={onChange} autoCapitalize="none" error={errors.token?.message} />
                        )}
                    />
                    <GButton label="Verificar" onPress={handleSubmit(doVerify)} loading={loading} />
                    <TouchableOpacity onPress={resend} style={s.resendBtn}>
                        <Text style={s.resendText}>Reenviar código</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={s.backBtn}>
                    <Text style={s.backText}>Volver al inicio de sesión</Text>
                </TouchableOpacity>
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
    card: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg },
    resendBtn: { alignItems: 'center', marginTop: SPACING.md },
    resendText: { fontSize: FONT_SIZE.sm, color: COLORS.emerald },
    backBtn: { alignItems: 'center' },
    backText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
});