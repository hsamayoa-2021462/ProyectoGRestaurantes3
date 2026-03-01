import { Router } from 'express';
import {
    listarEstadisticas, obtenerEstadistica, crearEstadistica, actualizarEstadistica, eliminarEstadistica,
    listarConfiguraciones, obtenerConfiguracion, crearConfiguracion, actualizarConfiguracion, eliminarConfiguracion,
    listarImpuestos, obtenerImpuesto, crearImpuesto, actualizarImpuesto, eliminarImpuesto,
    listarIdiomas, obtenerIdioma, crearIdioma, actualizarIdioma, eliminarIdioma,
    listarTraducciones, obtenerTraduccion, crearTraduccion, actualizarTraduccion, eliminarTraduccion
} from './reportes.controller.js';

const router = Router();

// ESTADÍSTICAS
router.get('/estadisticas', listarEstadisticas);
router.get('/estadisticas/:id', obtenerEstadistica);
router.post('/estadisticas', crearEstadistica);
router.put('/estadisticas/:id', actualizarEstadistica);
router.delete('/estadisticas/:id', eliminarEstadistica);

// CONFIGURACIONES
router.get('/configuraciones', listarConfiguraciones);
router.get('/configuraciones/:id', obtenerConfiguracion);
router.post('/configuraciones', crearConfiguracion);
router.put('/configuraciones/:id', actualizarConfiguracion);
router.delete('/configuraciones/:id', eliminarConfiguracion);

// IMPUESTOS
router.get('/impuestos', listarImpuestos);
router.get('/impuestos/:id', obtenerImpuesto);
router.post('/impuestos', crearImpuesto);
router.put('/impuestos/:id', actualizarImpuesto);
router.delete('/impuestos/:id', eliminarImpuesto);

// IDIOMAS
router.get('/idiomas', listarIdiomas);
router.get('/idiomas/:id', obtenerIdioma);
router.post('/idiomas', crearIdioma);
router.put('/idiomas/:id', actualizarIdioma);
router.delete('/idiomas/:id', eliminarIdioma);

// TRADUCCIONES
router.get('/traducciones', listarTraducciones);
router.get('/traducciones/:id', obtenerTraduccion);
router.post('/traducciones', crearTraduccion);
router.put('/traducciones/:id', actualizarTraduccion);
router.delete('/traducciones/:id', eliminarTraduccion);

export default router;
