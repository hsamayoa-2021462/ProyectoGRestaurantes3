import { Router } from 'express';
import {
    listarReservaciones, crearReservacion,
    listarEstadosReservacion, crearEstadoReservacion
} from './Reservacio.controller.js';

const router = Router();

router.get('/reservaciones', listarReservaciones);
router.post('/reservaciones', crearReservacion);
router.get('/estados-reservacion', listarEstadosReservacion);
router.post('/estados-reservacion', crearEstadoReservacion);

export default router;