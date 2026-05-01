'use strict';

import { ADMIN_ROLE, USER_ROLE } from '../helpers/role-constants.js';

const getUserRole = (req) => {
    return req.user?.UserRoles?.[0]?.Role?.Name || null;
};

// Solo ADMIN puede acceder
export const isAdmin = (req, res, next) => {
    const role = getUserRole(req);
    if (role === ADMIN_ROLE) return next();
    return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador.'
    });
};

// Solo USER puede acceder
export const isClient = (req, res, next) => {
    const role = getUserRole(req);
    if (role === USER_ROLE) return next();
    return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Solo clientes pueden realizar esta acción.'
    });
};

// ADMIN o USER pueden acceder
export const isAnyRole = (req, res, next) => {
    const role = getUserRole(req);
    if (role === ADMIN_ROLE || role === USER_ROLE) return next();
    return res.status(403).json({
        success: false,
        message: 'Acceso denegado.'
    });
};