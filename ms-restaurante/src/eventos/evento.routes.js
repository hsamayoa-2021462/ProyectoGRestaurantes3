import { Router } from 'express';
import {
    listarEventos, obtenerEvento, crearEvento, actualizarEvento, eliminarEvento,
    listarInscripciones, obtenerInscripcion, crearInscripcion, actualizarInscripcion, eliminarInscripcion,
    listarRecursos, obtenerRecurso, crearRecurso, actualizarRecurso, eliminarRecurso
} from './evento.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

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

// ─── EVENTOS ────────────────────────────────────────────────────────────────

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
 *       401:
 *         description: No autorizado
 */
router.get('/eventos', validateJWT, listarEventos);

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
router.get('/eventos/:id', validateJWT, obtenerEvento);

/**
 * @swagger
 * /eventos/eventos:
 *   post:
 *     summary: Crear un evento
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
 *       400:
 *         description: Datos inválidos
 */
router.post('/eventos', validateJWT, crearEvento);

/**
 * @swagger
 * /eventos/eventos/{id}:
 *   put:
 *     summary: Actualizar un evento
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
 *       404:
 *         description: Evento no encontrado
 */
router.put('/eventos/:id', validateJWT, actualizarEvento);

/**
 * @swagger
 * /eventos/eventos/{id}:
 *   delete:
 *     summary: Eliminar un evento
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
 *       404:
 *         description: Evento no encontrado
 */
router.delete('/eventos/:id', validateJWT, eliminarEvento);

// ─── INSCRIPCIONES ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /eventos/inscripciones:
 *   get:
 *     summary: Listar todas las inscripciones
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscripciones
 */
router.get('/inscripciones', validateJWT, listarInscripciones);

/**
 * @swagger
 * /eventos/inscripciones/{id}:
 *   get:
 *     summary: Obtener una inscripción por ID
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
router.get('/inscripciones/:id', validateJWT, obtenerInscripcion);

/**
 * @swagger
 * /eventos/inscripciones:
 *   post:
 *     summary: Crear una inscripción
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
 *       400:
 *         description: Datos inválidos
 */
router.post('/inscripciones', validateJWT, crearInscripcion);

/**
 * @swagger
 * /eventos/inscripciones/{id}:
 *   put:
 *     summary: Actualizar una inscripción
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
 *       404:
 *         description: Inscripción no encontrada
 */
router.put('/inscripciones/:id', validateJWT, actualizarInscripcion);

/**
 * @swagger
 * /eventos/inscripciones/{id}:
 *   delete:
 *     summary: Eliminar una inscripción
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
 *       404:
 *         description: Inscripción no encontrada
 */
router.delete('/inscripciones/:id', validateJWT, eliminarInscripcion);

// ─── RECURSOS DE EVENTO ─────────────────────────────────────────────────────

/**
 * @swagger
 * /eventos/recursos-evento:
 *   get:
 *     summary: Listar todos los recursos de eventos
 *     tags: [Recursos de Evento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de recursos
 */
router.get('/recursos-evento', validateJWT, listarRecursos);

/**
 * @swagger
 * /eventos/recursos-evento/{id}:
 *   get:
 *     summary: Obtener un recurso por ID
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
router.get('/recursos-evento/:id', validateJWT, obtenerRecurso);

/**
 * @swagger
 * /eventos/recursos-evento:
 *   post:
 *     summary: Crear un recurso de evento
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
 *       400:
 *         description: Datos inválidos
 */
router.post('/recursos-evento', validateJWT, crearRecurso);

/**
 * @swagger
 * /eventos/recursos-evento/{id}:
 *   put:
 *     summary: Actualizar un recurso de evento
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
 *       404:
 *         description: Recurso no encontrado
 */
router.put('/recursos-evento/:id', validateJWT, actualizarRecurso);

/**
 * @swagger
 * /eventos/recursos-evento/{id}:
 *   delete:
 *     summary: Eliminar un recurso de evento
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
 *       404:
 *         description: Recurso no encontrado
 */
router.delete('/recursos-evento/:id', validateJWT, eliminarRecurso);

export default router;