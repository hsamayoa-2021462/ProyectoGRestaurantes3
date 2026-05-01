import { Router } from 'express';
import {
    listarEstadisticas, obtenerEstadistica, crearEstadistica, actualizarEstadistica, eliminarEstadistica,
    listarConfiguraciones, obtenerConfiguracion, crearConfiguracion, actualizarConfiguracion, eliminarConfiguracion,
    listarImpuestos, obtenerImpuesto, crearImpuesto, actualizarImpuesto, eliminarImpuesto,
    listarIdiomas, obtenerIdioma, crearIdioma, actualizarIdioma, eliminarIdioma,
    listarTraducciones, obtenerTraduccion, crearTraduccion, actualizarTraduccion, eliminarTraduccion
} from './reportes.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin } from '../../middlewares/checkRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Estadísticas
 *     description: Reportes y estadísticas del sistema
 *   - name: Configuraciones
 *     description: Configuraciones del sistema
 *   - name: Impuestos
 *     description: Gestión de impuestos
 *   - name: Idiomas
 *     description: Gestión de idiomas disponibles
 *   - name: Traducciones
 *     description: Gestión de traducciones
 */

/**
 * @swagger
 * /reportes/estadisticas:
 *   get:
 *     summary: Listar todas las estadísticas (Solo ADMIN)
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estadísticas
 *       403:
 *         description: Acceso denegado
 */
router.get('/estadisticas', validateJWT, isAdmin, listarEstadisticas);
router.get('/estadisticas/:id', validateJWT, isAdmin, obtenerEstadistica);
router.post('/estadisticas', validateJWT, isAdmin, crearEstadistica);
router.put('/estadisticas/:id', validateJWT, isAdmin, actualizarEstadistica);
router.delete('/estadisticas/:id', validateJWT, isAdmin, eliminarEstadistica);

router.get('/configuraciones', validateJWT, isAdmin, listarConfiguraciones);
router.get('/configuraciones/:id', validateJWT, isAdmin, obtenerConfiguracion);
router.post('/configuraciones', validateJWT, isAdmin, crearConfiguracion);
router.put('/configuraciones/:id', validateJWT, isAdmin, actualizarConfiguracion);
router.delete('/configuraciones/:id', validateJWT, isAdmin, eliminarConfiguracion);

router.get('/impuestos', validateJWT, isAdmin, listarImpuestos);
router.get('/impuestos/:id', validateJWT, isAdmin, obtenerImpuesto);
router.post('/impuestos', validateJWT, isAdmin, crearImpuesto);
router.put('/impuestos/:id', validateJWT, isAdmin, actualizarImpuesto);
router.delete('/impuestos/:id', validateJWT, isAdmin, eliminarImpuesto);

router.get('/idiomas', validateJWT, isAdmin, listarIdiomas);
router.get('/idiomas/:id', validateJWT, isAdmin, obtenerIdioma);
router.post('/idiomas', validateJWT, isAdmin, crearIdioma);
router.put('/idiomas/:id', validateJWT, isAdmin, actualizarIdioma);
router.delete('/idiomas/:id', validateJWT, isAdmin, eliminarIdioma);

router.get('/traducciones', validateJWT, isAdmin, listarTraducciones);
router.get('/traducciones/:id', validateJWT, isAdmin, obtenerTraduccion);
router.post('/traducciones', validateJWT, isAdmin, crearTraduccion);
router.put('/traducciones/:id', validateJWT, isAdmin, actualizarTraduccion);
router.delete('/traducciones/:id', validateJWT, isAdmin, eliminarTraduccion);

export default router;