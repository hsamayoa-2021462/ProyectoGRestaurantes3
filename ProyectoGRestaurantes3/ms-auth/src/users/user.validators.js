import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';
import { ALLOWED_ROLES } from '../../helpers/role-constants.js';

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

// ─── PUT /:userId/role ────────────────────────────────────────────────────────
// Valida que userId exista y que roleName sea un rol permitido
export const validateUpdateUserRole = [
    param('userId')
        .notEmpty().withMessage('El id del usuario es requerido'),

    body('roleName')
        .trim()
        .notEmpty().withMessage('El roleName es requerido')
        .custom((value) => {
            const normalized = value.trim().toUpperCase();
            if (!ALLOWED_ROLES.includes(normalized)) {
                throw new Error(`Role no permitido. Usa: ${ALLOWED_ROLES.join(' o ')}`);
            }
            return true;
        }),

    handleValidationErrors,
];

// ─── GET /:userId/roles ───────────────────────────────────────────────────────
// Valida que userId exista en el param
export const validateGetUserRoles = [
    param('userId')
        .notEmpty().withMessage('El id del usuario es requerido'),

    handleValidationErrors,
];

// ─── GET /by-role/:roleName ───────────────────────────────────────────────────
// Valida que roleName sea un rol permitido
export const validateGetUsersByRole = [
    param('roleName')
        .notEmpty().withMessage('El roleName es requerido')
        .custom((value) => {
            const normalized = value.trim().toUpperCase();
            if (!ALLOWED_ROLES.includes(normalized)) {
                throw new Error(`Role no permitido. Usa: ${ALLOWED_ROLES.join(' o ')}`);
            }
            return true;
        }),

    handleValidationErrors,
];