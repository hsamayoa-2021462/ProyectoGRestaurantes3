// ms-restaurante/src/notificaciones/notificaciones.routes.js
import { Router } from 'express';
import {
    listarMisNotificaciones,
    listarNotificacionesAdmin,
    marcarLeida,
    marcarTodasLeidas,
} from './notificaciones.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isClient, isAnyRole } from '../../middlewares/checkRole.js';

const router = Router();

// Cliente — sus propias notificaciones
router.get('/mis-notificaciones', validateJWT, isClient, listarMisNotificaciones);

// Admin — notificaciones del panel
router.get('/admin', validateJWT, isAdmin, listarNotificacionesAdmin);

// Marcar como leída (cualquier rol)
router.put('/:id/leer', validateJWT, isAnyRole, marcarLeida);
router.put('/leer-todas', validateJWT, isAnyRole, marcarTodasLeidas);

export default router;