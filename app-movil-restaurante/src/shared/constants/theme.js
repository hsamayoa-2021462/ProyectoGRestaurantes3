// src/shared/constants/theme.js
import { Platform } from 'react-native';

// Paleta: Obsidiana + Esmeralda + Crema
// Concepto: restaurante de noche, elegante, sin emojis, sin dorados bancarios
export const COLORS = {
    // Fondos
    bg: '#0a0c0f',      // negro profundo
    bgCard: '#111318',      // carta elevada
    bgInput: '#1a1e26',      // campo de entrada
    bgMuted: '#161921',      // sutil

    // Esmeralda — color de acento principal
    emerald: '#2ecc8f',
    emeraldDark: '#1a9e6a',
    emeraldDeep: '#0f6647',
    emeraldDim: 'rgba(46,204,143,0.10)',
    emeraldBorder: 'rgba(46,204,143,0.25)',

    // Superficies con vidrio
    glass: 'rgba(255,255,255,0.04)',
    glassBorder: 'rgba(255,255,255,0.08)',
    glassMd: 'rgba(255,255,255,0.07)',

    // Texto
    textPrimary: '#f0ede8',      // crema casi blanco
    textSecondary: '#8a8f99',      // gris medio
    textMuted: '#4a4f5c',      // gris oscuro
    textAccent: '#2ecc8f',      // esmeralda

    // Estados
    error: '#e05454',
    errorDim: 'rgba(224,84,84,0.10)',
    success: '#2ecc8f',
    warning: '#e8a838',
    warningDim: 'rgba(232,168,56,0.10)',

    // Bordes
    border: 'rgba(255,255,255,0.08)',
    borderFocus: 'rgba(46,204,143,0.50)',

    // Overlay
    overlay: 'rgba(0,0,0,0.70)',
};

export const SPACING = {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const FONT_SIZE = {
    xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 26, xxxl: 34,
};

export const FONT_WEIGHT = {
    regular: '400', medium: '500', semibold: '600', bold: '700',
};

export const RADIUS = {
    sm: 8, md: 12, lg: 18, xl: 24, full: 9999,
};

const isWeb = Platform.OS === 'web';

export const SHADOWS = {
    sm: isWeb
        ? { boxShadow: '0 1px 4px rgba(0,0,0,0.30)' }
        : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 4, elevation: 2 },
    md: isWeb
        ? { boxShadow: '0 4px 16px rgba(0,0,0,0.40)' }
        : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.40, shadowRadius: 12, elevation: 6 },
    emerald: isWeb
        ? { boxShadow: '0 4px 20px rgba(46,204,143,0.20)' }
        : { shadowColor: '#2ecc8f', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.20, shadowRadius: 14, elevation: 6 },
};