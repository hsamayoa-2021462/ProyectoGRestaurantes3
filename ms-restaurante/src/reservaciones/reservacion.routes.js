import { Router } from 'express';
import {
    listarReservaciones, obtenerReservacion, crearReservacion, actualizarReservacion, eliminarReservacion,
    listarEstadosReservacion, obtenerEstadoReservacion, crearEstadoReservacion, actualizarEstadoReservacion, eliminarEstadoReservacion
} from './reservacion.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reservaciones
 *     description: Gestión de reservaciones de mesas
 *   - name: Estados de Reservación
 *     description: Gestión de estados de las reservaciones
 */

// ─── RESERVACIONES ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /reservaciones/reservaciones:
 *   get:
 *     summary: Listar todas las reservaciones
 *     tags: [Reservaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 */
router.get('/reservaciones', validateJWT, listarReservaciones);

/**
 * @swagger
 * /reservaciones/reservaciones/{id}:
 *   get:
 *     summary: Obtener una reservación por ID
 *     tags: [Reservaciones]
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
 *         description: Reservación encontrada
 *       404:
 *         description: Reservación no encontrada
 */
router.get('/reservaciones/:id', validateJWT, obtenerReservacion);

/**
 * @swagger
 * /reservaciones/reservaciones:
 *   post:
 *     summary: Crear una reservación
 *     tags: [Reservaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *               mesaId:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               personas:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reservación creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/reservaciones', validateJWT, crearReservacion);

/**
 * @swagger
 * /reservaciones/reservaciones/{id}:
 *   put:
 *     summary: Actualizar una reservación
 *     tags: [Reservaciones]
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
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               personas:
 *                 type: integer
 *               estadoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservación actualizada
 *       404:
 *         description: Reservación no encontrada
 */
router.put('/reservaciones/:id', validateJWT, actualizarReservacion);

/**
 * @swagger
 * /reservaciones/reservaciones/{id}:
 *   delete:
 *     summary: Eliminar una reservación
 *     tags: [Reservaciones]
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
 *         description: Reservación eliminada
 *       404:
 *         description: Reservación no encontrada
 */
router.delete('/reservaciones/:id', validateJWT, eliminarReservacion);

// ─── ESTADOS DE RESERVACIÓN ───────────────────────────────────────────────────

/**
 * @swagger
 * /reservaciones/estados-reservacion:
 *   get:
 *     summary: Listar todos los estados de reservación
 *     tags: [Estados de Reservación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados
 */
router.get('/estados-reservacion', validateJWT, listarEstadosReservacion);

/**
 * @swagger
 * /reservaciones/estados-reservacion/{id}:
 *   get:
 *     summary: Obtener un estado de reservación por ID
 *     tags: [Estados de Reservación]
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
 *         description: Estado encontrado
 *       404:
 *         description: Estado no encontrado
 */
router.get('/estados-reservacion/:id', validateJWT, obtenerEstadoReservacion);

/**
 * @swagger
 * /reservaciones/estados-reservacion:
 *   post:
 *     summary: Crear un estado de reservación
 *     tags: [Estados de Reservación]
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
 *     responses:
 *       201:
 *         description: Estado creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/estados-reservacion', validateJWT, crearEstadoReservacion);

/**
 * @swagger
 * /reservaciones/estados-reservacion/{id}:
 *   put:
 *     summary: Actualizar un estado de reservación
 *     tags: [Estados de Reservación]
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
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       404:
 *         description: Estado no encontrado
 */
router.put('/estados-reservacion/:id', validateJWT, actualizarEstadoReservacion);

/**
 * @swagger
 * /reservaciones/estados-reservacion/{id}:
 *   delete:
 *     summary: Eliminar un estado de reservación
 *     tags: [Estados de Reservación]
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
 *         description: Estado eliminado
 *       404:
 *         description: Estado no encontrado
 */
router.delete('/estados-reservacion/:id', validateJWT, eliminarEstadoReservacion);

export default router;