import { Router } from 'express';
import {
    listarReservaciones, obtenerReservacion, crearReservacion, actualizarReservacion, eliminarReservacion,
    listarEstadosReservacion, obtenerEstadoReservacion, crearEstadoReservacion, actualizarEstadoReservacion, eliminarEstadoReservacion
} from './reservacion.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isAnyRole, isClient } from '../../middlewares/checkRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reservaciones
 *     description: Gestión de reservaciones de mesas
 *   - name: Estados de Reservación
 *     description: Gestión de estados de las reservaciones
 */

/**
 * @swagger
 * /reservaciones/reservaciones:
 *   get:
 *     summary: Listar todas las reservaciones (Solo ADMIN)
 *     tags: [Reservaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 *       403:
 *         description: Acceso denegado
 */
router.get('/reservaciones', validateJWT, isAdmin, listarReservaciones);
router.get('/reservaciones/:id', validateJWT, isAdmin, obtenerReservacion);
router.post('/reservaciones', validateJWT, isClient, crearReservacion);
router.put('/reservaciones/:id', validateJWT, isAdmin, actualizarReservacion);
router.delete('/reservaciones/:id', validateJWT, isAdmin, eliminarReservacion);

router.get('/estados-reservacion', validateJWT, isAnyRole, listarEstadosReservacion);
router.get('/estados-reservacion/:id', validateJWT, isAnyRole, obtenerEstadoReservacion);
router.post('/estados-reservacion', validateJWT, isAdmin, crearEstadoReservacion);
router.put('/estados-reservacion/:id', validateJWT, isAdmin, actualizarEstadoReservacion);
router.delete('/estados-reservacion/:id', validateJWT, isAdmin, eliminarEstadoReservacion);

export default router;