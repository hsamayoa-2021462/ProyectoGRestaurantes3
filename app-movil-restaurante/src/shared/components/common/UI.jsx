// src/shared/components/common/UI.jsx
import React, { useRef, useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, StyleSheet, Animated, Platform,
} from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING, SHADOWS } from '../../constants/theme.js';

// ── GInput ── Input de texto elegante
export function GInput({ label, error, icon, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <View style={ui.inputWrap}>
            {label && <Text style={ui.inputLabel}>{label}</Text>}
            <View style={[ui.inputBox, focused && ui.inputFocused, error && ui.inputError]}>
                {icon && <View style={ui.inputIcon}>{icon}</View>}
                <TextInput
                    style={[ui.input, icon && { paddingLeft: 0 }]}
                    placeholderTextColor={COLORS.textMuted}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...props}
                />
            </View>
            {error && <Text style={ui.inputErrorText}>{error}</Text>}
        </View>
    );
}

// ── GButton ── Botón principal / secundario
export function GButton({ label, onPress, loading, variant = 'primary', disabled, style }) {
    const isPrimary = variant === 'primary';
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[isPrimary ? ui.btnPrimary : ui.btnSecondary, (disabled || loading) && ui.btnDisabled, style]}>
            {loading
                ? <ActivityIndicator color={isPrimary ? COLORS.bg : COLORS.emerald} size="small" />
                : <Text style={isPrimary ? ui.btnPrimaryText : ui.btnSecondaryText}>{label}</Text>}
        </TouchableOpacity>
    );
}

// ── GBadge ── Badge de estado
export function GBadge({ label, type = 'neutral' }) {
    const colors = {
        success: { bg: 'rgba(46,204,143,0.12)', border: 'rgba(46,204,143,0.3)', text: COLORS.emerald },
        error: { bg: 'rgba(224,84,84,0.12)', border: 'rgba(224,84,84,0.3)', text: COLORS.error },
        warning: { bg: 'rgba(232,168,56,0.12)', border: 'rgba(232,168,56,0.3)', text: COLORS.warning },
        neutral: { bg: COLORS.glass, border: COLORS.glassBorder, text: COLORS.textSecondary },
        info: { bg: 'rgba(100,160,220,0.12)', border: 'rgba(100,160,220,0.3)', text: '#64a0dc' },
    };
    const c = colors[type] || colors.neutral;
    return (
        <View style={{ backgroundColor: c.bg, borderWidth: 1, borderColor: c.border, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ fontSize: FONT_SIZE.xs, color: c.text, fontWeight: FONT_WEIGHT.semibold }}>{label}</Text>
        </View>
    );
}

// ── GCard ── Tarjeta con borde glass
export function GCard({ children, style, onPress }) {
    const Comp = onPress ? TouchableOpacity : View;
    return (
        <Comp onPress={onPress} activeOpacity={0.85} style={[ui.card, style]}>
            {children}
        </Comp>
    );
}

// ── LoadingSpinner ──
export function LoadingSpinner({ fullScreen, message, color }) {
    if (fullScreen) {
        return (
            <View style={ui.fullScreenLoader}>
                <ActivityIndicator color={color || COLORS.emerald} size="large" />
                {message && <Text style={ui.loaderText}>{message}</Text>}
            </View>
        );
    }
    return (
        <View style={{ padding: SPACING.xl, alignItems: 'center' }}>
            <ActivityIndicator color={color || COLORS.emerald} />
            {message && <Text style={[ui.loaderText, { marginTop: SPACING.sm }]}>{message}</Text>}
        </View>
    );
}

// ── Toast ──
export function Toast({ message, type = 'success', visible, onHide }) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.delay(2800),
                Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start(() => onHide?.());
        }
    }, [visible]);

    const bgColor = type === 'error' ? COLORS.errorDim : COLORS.emeraldDim;
    const bdColor = type === 'error' ? 'rgba(224,84,84,0.3)' : COLORS.emeraldBorder;
    const txColor = type === 'error' ? COLORS.error : COLORS.emerald;

    return (
        <Animated.View style={[ui.toast, { opacity, backgroundColor: bgColor, borderColor: bdColor }]}>
            <Text style={[ui.toastText, { color: txColor }]}>{message}</Text>
        </Animated.View>
    );
}

// ── GDivider ──
export function GDivider({ label }) {
    return (
        <View style={ui.dividerRow}>
            <View style={ui.dividerLine} />
            {label && <Text style={ui.dividerLabel}>{label}</Text>}
            <View style={ui.dividerLine} />
        </View>
    );
}

// ── Separator ──
export const Separator = () => <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md }} />;

// ── SectionHeader ──
export function SectionHeader({ title, action, onAction }) {
    return (
        <View style={ui.sectionHeaderRow}>
            <Text style={ui.sectionHeaderTitle}>{title}</Text>
            {action && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={ui.sectionHeaderAction}>{action}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// ── EmptyState ──
export function EmptyState({ title, subtitle, action, onAction }) {
    return (
        <View style={ui.emptyState}>
            <View style={ui.emptyIcon}>
                <Text style={{ fontSize: 28, color: COLORS.textMuted }}>—</Text>
            </View>
            <Text style={ui.emptyTitle}>{title}</Text>
            {subtitle && <Text style={ui.emptySubtitle}>{subtitle}</Text>}
            {action && <GButton label={action} onPress={onAction} style={{ marginTop: SPACING.lg, alignSelf: 'center', paddingHorizontal: SPACING.xl }} />}
        </View>
    );
}

// ── Styles ──
const ui = StyleSheet.create({
    inputWrap: { marginBottom: SPACING.md },
    inputLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginBottom: 6, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: FONT_WEIGHT.medium },
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgInput, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, minHeight: 48 },
    inputFocused: { borderColor: COLORS.borderFocus },
    inputError: { borderColor: COLORS.error },
    inputIcon: { marginRight: SPACING.sm },
    input: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textPrimary, paddingVertical: SPACING.sm },
    inputErrorText: { fontSize: FONT_SIZE.xs, color: COLORS.error, marginTop: 4 },

    btnPrimary: { backgroundColor: COLORS.emerald, borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', ...SHADOWS.emerald },
    btnSecondary: { backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.emeraldBorder, borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
    btnDisabled: { opacity: 0.45 },
    btnPrimaryText: { fontSize: FONT_SIZE.md, color: COLORS.bg, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 0.3 },
    btnSecondaryText: { fontSize: FONT_SIZE.md, color: COLORS.emerald, fontWeight: FONT_WEIGHT.medium },

    card: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOWS.sm },

    fullScreenLoader: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
    loaderText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },

    toast: { position: 'absolute', bottom: 36, left: SPACING.lg, right: SPACING.lg, borderRadius: RADIUS.md, borderWidth: 1, padding: SPACING.md, alignItems: 'center', zIndex: 999 },
    toastText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium },

    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.md },
    dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    dividerLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, paddingHorizontal: SPACING.sm },

    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
    sectionHeaderTitle: { fontSize: FONT_SIZE.lg, color: COLORS.textPrimary, fontWeight: FONT_WEIGHT.semibold },
    sectionHeaderAction: { fontSize: FONT_SIZE.sm, color: COLORS.emerald },

    emptyState: { padding: SPACING.xxl, alignItems: 'center' },
    emptyIcon: { width: 64, height: 64, borderRadius: RADIUS.full, backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
    emptyTitle: { fontSize: FONT_SIZE.lg, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium, marginBottom: SPACING.xs, textAlign: 'center' },
    emptySubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, textAlign: 'center' },
});