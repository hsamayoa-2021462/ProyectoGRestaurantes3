// src/features/auth/screens/LoginScreen.jsx
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../hooks/useAuth.js';
import { GInput, GButton, Toast } from '../../../shared/components/common/UI.jsx';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../shared/constants/theme.js';

export default function LoginScreen({ navigation, route }) {
    const { handleLogin, loading, error, clearError } = useAuth();
    const successMsg = route?.params?.message ?? null;
    const [showPass, setShowPass] = useState(false);
    const [toast, setToast] = useState(null);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { emailOrUsername: '', password: '' },
    });

    const onSubmit = async (values) => {
        clearError();
        const result = await handleLogin(values);
        if (!result.success) setToast({ msg: result.error, type: 'error' });
    };

    return (
        <SafeAreaView style={s.safe}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <View style={s.header}>
                        <View style={s.logoBox}>
                            <Text style={s.logoText}>G</Text>
                        </View>
                        <Text style={s.brand}>Gastro</Text>
                        <Text style={s.brandSub}>Mesa. Menú. Experiencia.</Text>
                    </View>

                    {/* Card de login */}
                    <View style={s.card}>
                        <Text style={s.cardTitle}>Iniciar sesión</Text>
                        <Text style={s.cardSub}>Accede con tu cuenta registrada</Text>

                        {successMsg && (
                            <View style={s.successBanner}>
                                <Text style={s.successText}>{successMsg}</Text>
                            </View>
                        )}

                        <Controller
                            control={control}
                            name="emailOrUsername"
                            rules={{ required: 'Este campo es obligatorio' }}
                            render={({ field: { onChange, value } }) => (
                                <GInput
                                    label="Correo o usuario"
                                    placeholder="correo@ejemplo.com"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.emailOrUsername?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            rules={{ required: 'La contraseña es obligatoria' }}
                            render={({ field: { onChange, value } }) => (
                                <GInput
                                    label="Contraseña"
                                    placeholder="••••••••"
                                    secureTextEntry={!showPass}
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.password?.message}
                                />
                            )}
                        />

                        <TouchableOpacity onPress={() => setShowPass(p => !p)} style={s.showPassBtn}>
                            <Text style={s.showPassText}>{showPass ? 'Ocultar' : 'Mostrar'} contraseña</Text>
                        </TouchableOpacity>

                        <GButton label="Ingresar" onPress={handleSubmit(onSubmit)} loading={loading} style={s.btn} />

                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={s.linkRow}>
                            <Text style={s.link}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Pie */}
                    <View style={s.footer}>
                        <Text style={s.footerText}>¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={s.footerLink}>Regístrate</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {toast && (
                <Toast message={toast.msg} type={toast.type} visible onHide={() => setToast(null)} />
            )}
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    scroll: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl, justifyContent: 'center' },

    header: { alignItems: 'center', marginBottom: SPACING.xl, paddingTop: SPACING.xxl },
    logoBox: { width: 72, height: 72, borderRadius: RADIUS.lg, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.emeraldBorder, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
    logoText: { fontSize: 36, color: COLORS.emerald, fontWeight: FONT_WEIGHT.bold },
    brand: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 3 },
    brandSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 },

    card: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg },
    cardTitle: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: 4 },
    cardSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginBottom: SPACING.lg },

    successBanner: { backgroundColor: COLORS.emeraldDim, borderWidth: 1, borderColor: COLORS.emeraldBorder, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.md },
    successText: { fontSize: FONT_SIZE.sm, color: COLORS.emerald },

    showPassBtn: { alignSelf: 'flex-end', marginTop: -8, marginBottom: SPACING.md },
    showPassText: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },

    btn: { marginTop: SPACING.xs },
    linkRow: { alignItems: 'center', marginTop: SPACING.md },
    link: { fontSize: FONT_SIZE.sm, color: COLORS.emerald },

    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.sm },
    footerText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
    footerLink: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold },
});