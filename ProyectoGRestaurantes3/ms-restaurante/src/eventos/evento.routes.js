import { Router } from 'express';
import {
    listarEventos, obtenerEvento, crearEvento, actualizarEvento, eliminarEvento,
    listarInscripciones, obtenerInscripcion, crearInscripcion, actualizarInscripcion, eliminarInscripcion,
    listarRecursos, obtenerRecurso, crearRecurso, actualizarRecurso, eliminarRecurso
} from './evento.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isAnyRole, isClient } from '../../middlewares/checkRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Eventos
 *     description: Gestión de eventos del restaurante
 *   - name: Inscripciones
 *     description: Gestión de inscripciones a eventos
 *   - name: Recursos de Evento
 *     description: Gestión de recursos asignados a eventos
 */

/**
 * @swagger
 * /eventos/eventos:
 *   get:
 *     summary: Listar todos los eventos
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/eventos', validateJWT, isAnyRole, listarEventos);

/**
 * @swagger
 * /eventos/eventos/{id}:
 *   get:
 *     summary: Obtener un evento por ID
 *     tags: [Eventos]
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
 *         description: Evento encontrado
 *       404:
 *         description: Evento no encontrado
 */
router.get('/eventos/:id', validateJWT, isAnyRole, obtenerEvento);

/**
 * @swagger
 * /eventos/eventos:
 *   post:
 *     summary: Crear un evento (Solo ADMIN)
 *     tags: [Eventos]
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
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               capacidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Evento creado
 *       403:
 *         description: Acceso denegado
 */
router.post('/eventos', validateJWT, isAdmin, crearEvento);

/**
 * @swagger
 * /eventos/eventos/{id}:
 *   put:
 *     summary: Actualizar un evento (Solo ADMIN)
 *     tags: [Eventos]
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
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               capacidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Evento actualizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Evento no encontrado
 */
router.put('/eventos/:id', validateJWT, isAdmin, actualizarEvento);

/**
 * @swagger
 * /eventos/eventos/{id}:
 *   delete:
 *     summary: Eliminar un evento (Solo ADMIN)
 *     tags: [Eventos]
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
 *         description: Evento eliminado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Evento no encontrado
 */
router.delete('/eventos/:id', validateJWT, isAdmin, eliminarEvento);

/**
 * @swagger
 * /eventos/inscripciones:
 *   get:
 *     summary: Listar todas las inscripciones (Solo ADMIN)
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscripciones
 */
router.get('/inscripciones', validateJWT, isAdmin, listarInscripciones);

/**
 * @swagger
 * /eventos/inscripciones/{id}:
 *   get:
 *     summary: Obtener una inscripción por ID (Solo ADMIN)
 *     tags: [Inscripciones]
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
 *         description: Inscripción encontrada
 *       404:
 *         description: Inscripción no encontrada
 */
router.get('/inscripciones/:id', validateJWT, isAdmin, obtenerInscripcion);

/**
 * @swagger
 * /eventos/inscripciones:
 *   post:
 *     summary: Crear una inscripción (Cliente)
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventoId:
 *                 type: string
 *               clienteId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscripción creada
 *       403:
 *         description: Acceso denegado
 */
router.post('/inscripciones', validateJWT, isClient, crearInscripcion);

/**
 * @swagger
 * /eventos/inscripciones/{id}:
 *   put:
 *     summary: Actualizar una inscripción (Solo ADMIN)
 *     tags: [Inscripciones]
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
 *               eventoId:
 *                 type: string
 *               clienteId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inscripción actualizada
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Inscripción no encontrada
 */
router.put('/inscripciones/:id', validateJWT, isAdmin, actualizarInscripcion);

/**
 * @swagger
 * /eventos/inscripciones/{id}:
 *   delete:
 *     summary: Eliminar una inscripción (Solo ADMIN)
 *     tags: [Inscripciones]
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
 *         description: Inscripción eliminada
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Inscripción no encontrada
 */
router.delete('/inscripciones/:id', validateJWT, isAdmin, eliminarInscripcion);

/**
 * @swagger
 * /eventos/recursos-evento:
 *   get:
 *     summary: Listar todos los recursos (Solo ADMIN)
 *     tags: [Recursos de Evento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de recursos
 */
router.get('/recursos-evento', validateJWT, isAdmin, listarRecursos);

/**
 * @swagger
 * /eventos/recursos-evento/{id}:
 *   get:
 *     summary: Obtener un recurso por ID (Solo ADMIN)
 *     tags: [Recursos de Evento]
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
 *         description: Recurso encontrado
 *       404:
 *         description: Recurso no encontrado
 */
router.get('/recursos-evento/:id', validateJWT, isAdmin, obtenerRecurso);

/**
 * @swagger
 * /eventos/recursos-evento:
 *   post:
 *     summary: Crear un recurso (Solo ADMIN)
 *     tags: [Recursos de Evento]
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
 *               eventoId:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Recurso creado
 *       403:
 *         description: Acceso denegado
 */
router.post('/recursos-evento', validateJWT, isAdmin, crearRecurso);

/**
 * @swagger
 * /eventos/recursos-evento/{id}:
 *   put:
 *     summary: Actualizar un recurso (Solo ADMIN)
 *     tags: [Recursos de Evento]
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
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Recurso actualizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Recurso no encontrado
 */
router.put('/recursos-evento/:id', validateJWT, isAdmin, actualizarRecurso);

/**
 * @swagger
 * /eventos/recursos-evento/{id}:
 *   delete:
 *     summary: Eliminar un recurso (Solo ADMIN)
 *     tags: [Recursos de Evento]
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
 *         description: Recurso eliminado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Recurso no encontrado
 */
router.delete('/recursos-evento/:id', validateJWT, isAdmin, eliminarRecurso);

export default router;