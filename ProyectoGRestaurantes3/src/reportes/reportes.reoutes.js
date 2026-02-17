import { Router } from 'express';
import {
    listarEstadisticas, crearEstadistica,
    listarConfiguraciones, crearConfiguracion,
    listarImpuestos, crearImpuesto,
    listarIdiomas, crearIdioma,
    listarTraducciones, crearTraduccion
} from './reportes.controller.js';

const router = Router();

router.get('/estadisticas', listarEstadisticas);
router.post('/estadisticas', crearEstadistica);

router.get('/configuraciones', listarConfiguraciones);
router.post('/configuraciones', crearConfiguracion);

router.get('/impuestos', listarImpuestos);
router.post('/impuestos', crearImpuesto);

router.get('/idiomas', listarIdiomas);
router.post('/idiomas', crearIdioma);

router.get('/traducciones', listarTraducciones);
router.post('/traducciones', crearTraduccion);

export default router;