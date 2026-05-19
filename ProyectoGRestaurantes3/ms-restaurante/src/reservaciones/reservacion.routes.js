import { Router } from 'express';
import {
    listarReservaciones, obtenerReservacion, crearReservacion, actualizarReservacion, eliminarReservacion,
    listarEstadosReservacion, obtenerEstadoReservacion, crearEstadoReservacion, actualizarEstadoReservacion, eliminarEstadoReservacion,
    listarMisReservaciones, cancelarReservacion, completarReservacion
} from './reservacion.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isAnyRole, isClient } from '../../middlewares/checkRole.js';

const router = Router();

// ── Cliente ──
router.get('/mis-reservaciones',        validateJWT, isClient, listarMisReservaciones);
router.put('/:id/cancelar',             validateJWT, isClient, cancelarReservacion);

// ── Admin ──
router.get('/reservaciones',            validateJWT, isAdmin, listarReservaciones);
router.get('/reservaciones/:id',        validateJWT, isAdmin, obtenerReservacion);
router.post('/reservaciones',           validateJWT, isClient, crearReservacion);
router.put('/reservaciones/:id',        validateJWT, isAdmin, actualizarReservacion);
router.put('/reservaciones/:id/completar', validateJWT, isAdmin, completarReservacion);
router.delete('/reservaciones/:id',     validateJWT, isAdmin, eliminarReservacion);

// ── Estados ──
router.get('/estados-reservacion',      validateJWT, isAnyRole, listarEstadosReservacion);
router.get('/estados-reservacion/:id',  validateJWT, isAnyRole, obtenerEstadoReservacion);
router.post('/estados-reservacion',     validateJWT, isAdmin, crearEstadoReservacion);
router.put('/estados-reservacion/:id',  validateJWT, isAdmin, actualizarEstadoReservacion);
router.delete('/estados-reservacion/:id', validateJWT, isAdmin, eliminarEstadoReservacion);

export default router;