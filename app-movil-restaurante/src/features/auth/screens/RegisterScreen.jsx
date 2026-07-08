// src/features/auth/screens/RegisterScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../hooks/useAuth.js';
import { GInput, GButton, Toast } from '../../../shared/components/common/UI.jsx';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from '../../../shared/constants/theme.js';

export default function RegisterScreen({ navigation }) {
    const { handleRegister, loading, clearError } = useAuth();
    const [toast, setToast] = useState(null);
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { name: '', surname: '', username: '', email: '', phone: '', password: '', confirmPassword: '' },
    });
    const password = watch('password');

    const onSubmit = async (values) => {
        clearError();
        const result = await handleRegister(values);
        if (result.success) {
            navigation.navigate('VerifyEmail', { email: values.email });
        } else {
            setToast({ msg: result.error, type: 'error' });
        }
    };

    return (
        <SafeAreaView style={s.safe}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

                    <View style={s.topRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                            <Text style={s.backText}>Volver</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={s.title}>Crear cuenta</Text>
                    <Text style={s.sub}>Completa tus datos para registrarte</Text>

                    <View style={s.card}>
                        {[
                            { name: 'name', label: 'Nombre', placeholder: 'Tu nombre', rules: { required: 'Campo obligatorio' } },
                            { name: 'surname', label: 'Apellido', placeholder: 'Tu apellido', rules: { required: 'Campo obligatorio' } },
                            { name: 'username', label: 'Usuario', placeholder: '@usuario', autoCapitalize: 'none', rules: { required: 'Campo obligatorio' } },
                            { name: 'email', label: 'Correo', placeholder: 'correo@ejemplo.com', keyboardType: 'email-address', autoCapitalize: 'none', rules: { required: 'Campo obligatorio', pattern: { value: /\S+@\S+\.\S+/, message: 'Correo inválido' } } },
                            { name: 'phone', label: 'Teléfono', placeholder: '5555-5555', keyboardType: 'phone-pad', rules: { required: 'Campo obligatorio' } },
                        ].map((f) => (
                            <Controller key={f.name} control={control} name={f.name} rules={f.rules}
                                render={({ field: { onChange, value } }) => (
                                    <GInput label={f.label} placeholder={f.placeholder} keyboardType={f.keyboardType} autoCapitalize={f.autoCapitalize} value={value} onChangeText={onChange} error={errors[f.name]?.message} />
                                )}
                            />
                        ))}

                        <Controller control={control} name="password" rules={{ required: 'Campo obligatorio', minLength: { value: 8, message: 'Mínimo 8 caracteres' } }}
                            render={({ field: { onChange, value } }) => (
                                <GInput label="Contraseña" placeholder="Mínimo 8 caracteres" secureTextEntry value={value} onChangeText={onChange} error={errors.password?.message} />
                            )}
                        />

                        <Controller control={control} name="confirmPassword" rules={{ required: 'Campo obligatorio', validate: (v) => v === password || 'Las contraseñas no coinciden' }}
                            render={({ field: { onChange, value } }) => (
                                <GInput label="Confirmar contraseña" placeholder="Repite la contraseña" secureTextEntry value={value} onChangeText={onChange} error={errors.confirmPassword?.message} />
                            )}
                        />

                        <GButton label="Crear cuenta" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: SPACING.xs }} />
                    </View>

                    <View style={s.footer}>
                        <Text style={s.footerText}>¿Ya tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={s.footerLink}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
            {toast && <Toast message={toast.msg} type={toast.type} visible onHide={() => setToast(null)} />}
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    scroll: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
    topRow: { paddingTop: SPACING.lg, marginBottom: SPACING.md },
    backBtn: { alignSelf: 'flex-start' },
    backText: { fontSize: FONT_SIZE.sm, color: COLORS.emerald },
    title: { fontSize: FONT_SIZE.xxl, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold, marginBottom: 4 },
    sub: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginBottom: SPACING.lg },
    card: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg },
    footer: { flexDirection: 'row', justifyContent: 'center' },
    footerText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
    footerLink: { fontSize: FONT_SIZE.sm, color: COLORS.emerald, fontWeight: FONT_WEIGHT.semibold },
});