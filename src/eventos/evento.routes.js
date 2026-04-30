import { Router } from 'express';
import {
    listarEventos, obtenerEvento, crearEvento, actualizarEvento, eliminarEvento,
    listarInscripciones, obtenerInscripcion, crearInscripcion, actualizarInscripcion, eliminarInscripcion,
    listarRecursos, obtenerRecurso, crearRecurso, actualizarRecurso, eliminarRecurso
} from './evento.controller.js';

const router = Router();

// EVENTOS
router.get('/eventos', listarEventos);
router.get('/eventos/:id', obtenerEvento);
router.post('/eventos', crearEvento);
router.put('/eventos/:id', actualizarEvento);
router.delete('/eventos/:id', eliminarEvento);

// INSCRIPCIONES
router.get('/inscripciones', listarInscripciones);
router.get('/inscripciones/:id', obtenerInscripcion);
router.post('/inscripciones', crearInscripcion);
router.put('/inscripciones/:id', actualizarInscripcion);
router.delete('/inscripciones/:id', eliminarInscripcion);

// RECURSOS DE EVENTO
router.get('/recursos-evento', listarRecursos);
router.get('/recursos-evento/:id', obtenerRecurso);
router.post('/recursos-evento', crearRecurso);
router.put('/recursos-evento/:id', actualizarRecurso);
router.delete('/recursos-evento/:id', eliminarRecurso);

export default router;
