import { Router } from 'express';
import {
    listarEventos, crearEvento,
    listarInscripciones, crearInscripcion,
    listarRecursos, crearRecurso
} from './evento.controller.js';

const router = Router();

router.get('/eventos', listarEventos);
router.post('/eventos', crearEvento);

router.get('/inscripciones', listarInscripciones);
router.post('/inscripciones', crearInscripcion);

router.get('/recursos-evento', listarRecursos);
router.post('/recursos-evento', crearRecurso);

export default router;