import { Router } from 'express';
import {
    listarReservaciones, obtenerReservacion, crearReservacion, actualizarReservacion, eliminarReservacion,
    listarEstadosReservacion, obtenerEstadoReservacion, crearEstadoReservacion, actualizarEstadoReservacion, eliminarEstadoReservacion
} from './reservacion.controller.js';

const router = Router();

// RESERVACIONES
router.get('/reservaciones', listarReservaciones);
router.get('/reservaciones/:id', obtenerReservacion);
router.post('/reservaciones', crearReservacion);
router.put('/reservaciones/:id', actualizarReservacion);
router.delete('/reservaciones/:id', eliminarReservacion);

// ESTADOS DE RESERVACIÓN
router.get('/estados-reservacion', listarEstadosReservacion);
router.get('/estados-reservacion/:id', obtenerEstadoReservacion);
router.post('/estados-reservacion', crearEstadoReservacion);
router.put('/estados-reservacion/:id', actualizarEstadoReservacion);
router.delete('/estados-reservacion/:id', eliminarEstadoReservacion);

export default router;
