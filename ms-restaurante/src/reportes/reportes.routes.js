import { Router } from 'express';
import {
    listarEstadisticas, obtenerEstadistica, crearEstadistica, actualizarEstadistica, eliminarEstadistica,
    listarConfiguraciones, obtenerConfiguracion, crearConfiguracion, actualizarConfiguracion, eliminarConfiguracion,
    listarImpuestos, obtenerImpuesto, crearImpuesto, actualizarImpuesto, eliminarImpuesto,
    listarIdiomas, obtenerIdioma, crearIdioma, actualizarIdioma, eliminarIdioma,
    listarTraducciones, obtenerTraduccion, crearTraduccion, actualizarTraduccion, eliminarTraduccion
} from './reportes.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

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

// ─── ESTADÍSTICAS ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /reportes/estadisticas:
 *   get:
 *     summary: Listar todas las estadísticas
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estadísticas
 */
router.get('/estadisticas', validateJWT, listarEstadisticas);

/**
 * @swagger
 * /reportes/estadisticas/{id}:
 *   get:
 *     summary: Obtener una estadística por ID
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estadística encontrada
 *       404:
 *         description: Estadística no encontrada
 */
router.get('/estadisticas/:id', validateJWT, obtenerEstadistica);

/**
 * @swagger
 * /reportes/estadisticas:
 *   post:
 *     summary: Crear una estadística
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               valor:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Estadística creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/estadisticas', validateJWT, crearEstadistica);

/**
 * @swagger
 * /reportes/estadisticas/{id}:
 *   put:
 *     summary: Actualizar una estadística
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               valor:
 *                 type: number
 *     responses:
 *       200:
 *         description: Estadística actualizada
 *       404:
 *         description: Estadística no encontrada
 */
router.put('/estadisticas/:id', validateJWT, actualizarEstadistica);

/**
 * @swagger
 * /reportes/estadisticas/{id}:
 *   delete:
 *     summary: Eliminar una estadística
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estadística eliminada
 *       404:
 *         description: Estadística no encontrada
 */
router.delete('/estadisticas/:id', validateJWT, eliminarEstadistica);

// ─── CONFIGURACIONES ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /reportes/configuraciones:
 *   get:
 *     summary: Listar todas las configuraciones
 *     tags: [Configuraciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de configuraciones
 */
router.get('/configuraciones', validateJWT, listarConfiguraciones);

/**
 * @swagger
 * /reportes/configuraciones/{id}:
 *   get:
 *     summary: Obtener una configuración por ID
 *     tags: [Configuraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuración encontrada
 *       404:
 *         description: Configuración no encontrada
 */
router.get('/configuraciones/:id', validateJWT, obtenerConfiguracion);

/**
 * @swagger
 * /reportes/configuraciones:
 *   post:
 *     summary: Crear una configuración
 *     tags: [Configuraciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clave:
 *                 type: string
 *               valor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Configuración creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/configuraciones', validateJWT, crearConfiguracion);

/**
 * @swagger
 * /reportes/configuraciones/{id}:
 *   put:
 *     summary: Actualizar una configuración
 *     tags: [Configuraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clave:
 *                 type: string
 *               valor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Configuración actualizada
 *       404:
 *         description: Configuración no encontrada
 */
router.put('/configuraciones/:id', validateJWT, actualizarConfiguracion);

/**
 * @swagger
 * /reportes/configuraciones/{id}:
 *   delete:
 *     summary: Eliminar una configuración
 *     tags: [Configuraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuración eliminada
 *       404:
 *         description: Configuración no encontrada
 */
router.delete('/configuraciones/:id', validateJWT, eliminarConfiguracion);

// ─── IMPUESTOS ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /reportes/impuestos:
 *   get:
 *     summary: Listar todos los impuestos
 *     tags: [Impuestos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de impuestos
 */
router.get('/impuestos', validateJWT, listarImpuestos);

/**
 * @swagger
 * /reportes/impuestos/{id}:
 *   get:
 *     summary: Obtener un impuesto por ID
 *     tags: [Impuestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Impuesto encontrado
 *       404:
 *         description: Impuesto no encontrado
 */
router.get('/impuestos/:id', validateJWT, obtenerImpuesto);

/**
 * @swagger
 * /reportes/impuestos:
 *   post:
 *     summary: Crear un impuesto
 *     tags: [Impuestos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               porcentaje:
 *                 type: number
 *     responses:
 *       201:
 *         description: Impuesto creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/impuestos', validateJWT, crearImpuesto);

/**
 * @swagger
 * /reportes/impuestos/{id}:
 *   put:
 *     summary: Actualizar un impuesto
 *     tags: [Impuestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               porcentaje:
 *                 type: number
 *     responses:
 *       200:
 *         description: Impuesto actualizado
 *       404:
 *         description: Impuesto no encontrado
 */
router.put('/impuestos/:id', validateJWT, actualizarImpuesto);

/**
 * @swagger
 * /reportes/impuestos/{id}:
 *   delete:
 *     summary: Eliminar un impuesto
 *     tags: [Impuestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Impuesto eliminado
 *       404:
 *         description: Impuesto no encontrado
 */
router.delete('/impuestos/:id', validateJWT, eliminarImpuesto);

// ─── IDIOMAS ──────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /reportes/idiomas:
 *   get:
 *     summary: Listar todos los idiomas
 *     tags: [Idiomas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de idiomas
 */
router.get('/idiomas', validateJWT, listarIdiomas);

/**
 * @swagger
 * /reportes/idiomas/{id}:
 *   get:
 *     summary: Obtener un idioma por ID
 *     tags: [Idiomas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idioma encontrado
 *       404:
 *         description: Idioma no encontrado
 */
router.get('/idiomas/:id', validateJWT, obtenerIdioma);

/**
 * @swagger
 * /reportes/idiomas:
 *   post:
 *     summary: Crear un idioma
 *     tags: [Idiomas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Idioma creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/idiomas', validateJWT, crearIdioma);

/**
 * @swagger
 * /reportes/idiomas/{id}:
 *   put:
 *     summary: Actualizar un idioma
 *     tags: [Idiomas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Idioma actualizado
 *       404:
 *         description: Idioma no encontrado
 */
router.put('/idiomas/:id', validateJWT, actualizarIdioma);

/**
 * @swagger
 * /reportes/idiomas/{id}:
 *   delete:
 *     summary: Eliminar un idioma
 *     tags: [Idiomas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idioma eliminado
 *       404:
 *         description: Idioma no encontrado
 */
router.delete('/idiomas/:id', validateJWT, eliminarIdioma);

// ─── TRADUCCIONES ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /reportes/traducciones:
 *   get:
 *     summary: Listar todas las traducciones
 *     tags: [Traducciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de traducciones
 */
router.get('/traducciones', validateJWT, listarTraducciones);

/**
 * @swagger
 * /reportes/traducciones/{id}:
 *   get:
 *     summary: Obtener una traducción por ID
 *     tags: [Traducciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Traducción encontrada
 *       404:
 *         description: Traducción no encontrada
 */
router.get('/traducciones/:id', validateJWT, obtenerTraduccion);

/**
 * @swagger
 * /reportes/traducciones:
 *   post:
 *     summary: Crear una traducción
 *     tags: [Traducciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idiomaId:
 *                 type: string
 *               clave:
 *                 type: string
 *               valor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Traducción creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/traducciones', validateJWT, crearTraduccion);

/**
 * @swagger
 * /reportes/traducciones/{id}:
 *   put:
 *     summary: Actualizar una traducción
 *     tags: [Traducciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Traducción actualizada
 *       404:
 *         description: Traducción no encontrada
 */
router.put('/traducciones/:id', validateJWT, actualizarTraduccion);

/**
 * @swagger
 * /reportes/traducciones/{id}:
 *   delete:
 *     summary: Eliminar una traducción
 *     tags: [Traducciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Traducción eliminada
 *       404:
 *         description: Traducción no encontrada
 */
router.delete('/traducciones/:id', validateJWT, eliminarTraduccion);

export default router;