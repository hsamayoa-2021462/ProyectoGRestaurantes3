import { body } from 'express-validator';
import { validationResult } from 'express-validator';

// ─── Middleware ejecutor (igual a tu patrón actual) ───────────────────────────
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map((e) => ({
                field: e.path,
                message: e.msg,
            })),
        });
    }
    next();
};

// ─── Register ─────────────────────────────────────────────────────────────────
// Soporta multipart/form-data (viene con multer antes)
export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 50 }).withMessage('Nombre: entre 2 y 50 caracteres'),

    body('surname')
        .trim()
        .notEmpty().withMessage('El apellido es requerido')
        .isLength({ min: 2, max: 50 }).withMessage('Apellido: entre 2 y 50 caracteres'),

    body('username')
        .trim()
        .notEmpty().withMessage('El username es requerido')
        .isLength({ min: 3, max: 30 }).withMessage('Username: entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username solo puede tener letras, números, _, . y -'),

    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe tener al menos una mayúscula')
        .matches(/[0-9]/).withMessage('Debe tener al menos un número'),

    body('phone')
        .trim()
        .notEmpty().withMessage('El teléfono es requerido')
        .matches(/^\d{8}$/).withMessage('Teléfono debe tener exactamente 8 dígitos'),

    handleValidationErrors,
];

// ─── Login ────────────────────────────────────────────────────────────────────
// Acepta email o username en el mismo campo
export const validateLogin = [
    body('emailOrUsername')
        .trim()
        .notEmpty().withMessage('Email o username es requerido'),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),

    handleValidationErrors,
];

// ─── Verify Email ─────────────────────────────────────────────────────────────
export const validateVerifyEmail = [
    body('token')
        .trim()
        .notEmpty().withMessage('El token de verificación es requerido'),

    handleValidationErrors,
];

// ─── Resend Verification ──────────────────────────────────────────────────────
export const validateResendVerification = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    handleValidationErrors,
];

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const validateForgotPassword = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    handleValidationErrors,
];

// ─── Reset Password ───────────────────────────────────────────────────────────
export const validateResetPassword = [
    body('token')
        .trim()
        .notEmpty().withMessage('El token de recuperación es requerido'),

    body('newPassword')
        .notEmpty().withMessage('La nueva contraseña es requerida')
        .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe tener al menos una mayúscula')
        .matches(/[0-9]/).withMessage('Debe tener al menos un número'),

    handleValidationErrors,
];