import { Router } from 'express';
import {
    listarResenas, obtenerResena, crearResena, actualizarResena, eliminarResena,
    listarPromociones, obtenerPromocion, crearPromocion, actualizarPromocion, eliminarPromocion,
    listarCupones, obtenerCupon, crearCupon, actualizarCupon, eliminarCupon,
    listarCuponesUsuario, obtenerCuponUsuario, asignarCuponUsuario, actualizarCuponUsuario, eliminarCuponUsuario
} from './experiencia.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reseñas
 *     description: Gestión de reseñas de clientes
 *   - name: Promociones
 *     description: Gestión de promociones del restaurante
 *   - name: Cupones
 *     description: Gestión de cupones de descuento
 *   - name: Cupones Usuario
 *     description: Asignación de cupones a usuarios
 */

// ─── RESEÑAS ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /experiencia/resenas:
 *   get:
 *     summary: Listar todas las reseñas
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reseñas
 */
router.get('/resenas', validateJWT, listarResenas);

/**
 * @swagger
 * /experiencia/resenas/{id}:
 *   get:
 *     summary: Obtener una reseña por ID
 *     tags: [Reseñas]
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
 *         description: Reseña encontrada
 *       404:
 *         description: Reseña no encontrada
 */
router.get('/resenas/:id', validateJWT, obtenerResena);

/**
 * @swagger
 * /experiencia/resenas:
 *   post:
 *     summary: Crear una reseña
 *     tags: [Reseñas]
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
 *               calificacion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reseña creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/resenas', validateJWT, crearResena);

/**
 * @swagger
 * /experiencia/resenas/{id}:
 *   put:
 *     summary: Actualizar una reseña
 *     tags: [Reseñas]
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
 *               calificacion:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reseña actualizada
 *       404:
 *         description: Reseña no encontrada
 */
router.put('/resenas/:id', validateJWT, actualizarResena);

/**
 * @swagger
 * /experiencia/resenas/{id}:
 *   delete:
 *     summary: Eliminar una reseña
 *     tags: [Reseñas]
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
 *         description: Reseña eliminada
 *       404:
 *         description: Reseña no encontrada
 */
router.delete('/resenas/:id', validateJWT, eliminarResena);

// ─── PROMOCIONES ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /experiencia/promociones:
 *   get:
 *     summary: Listar todas las promociones
 *     tags: [Promociones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de promociones
 */
router.get('/promociones', validateJWT, listarPromociones);

/**
 * @swagger
 * /experiencia/promociones/{id}:
 *   get:
 *     summary: Obtener una promoción por ID
 *     tags: [Promociones]
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
 *         description: Promoción encontrada
 *       404:
 *         description: Promoción no encontrada
 */
router.get('/promociones/:id', validateJWT, obtenerPromocion);

/**
 * @swagger
 * /experiencia/promociones:
 *   post:
 *     summary: Crear una promoción
 *     tags: [Promociones]
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
 *               descuento:
 *                 type: number
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Promoción creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/promociones', validateJWT, crearPromocion);

/**
 * @swagger
 * /experiencia/promociones/{id}:
 *   put:
 *     summary: Actualizar una promoción
 *     tags: [Promociones]
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
 *               descuento:
 *                 type: number
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Promoción actualizada
 *       404:
 *         description: Promoción no encontrada
 */
router.put('/promociones/:id', validateJWT, actualizarPromocion);

/**
 * @swagger
 * /experiencia/promociones/{id}:
 *   delete:
 *     summary: Eliminar una promoción
 *     tags: [Promociones]
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
 *         description: Promoción eliminada
 *       404:
 *         description: Promoción no encontrada
 */
router.delete('/promociones/:id', validateJWT, eliminarPromocion);

// ─── CUPONES ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /experiencia/cupones:
 *   get:
 *     summary: Listar todos los cupones
 *     tags: [Cupones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cupones
 */
router.get('/cupones', validateJWT, listarCupones);

/**
 * @swagger
 * /experiencia/cupones/{id}:
 *   get:
 *     summary: Obtener un cupón por ID
 *     tags: [Cupones]
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
 *         description: Cupón encontrado
 *       404:
 *         description: Cupón no encontrado
 */
router.get('/cupones/:id', validateJWT, obtenerCupon);

/**
 * @swagger
 * /experiencia/cupones:
 *   post:
 *     summary: Crear un cupón
 *     tags: [Cupones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               descuento:
 *                 type: number
 *               fechaExpiracion:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Cupón creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/cupones', validateJWT, crearCupon);

/**
 * @swagger
 * /experiencia/cupones/{id}:
 *   put:
 *     summary: Actualizar un cupón
 *     tags: [Cupones]
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
 *               codigo:
 *                 type: string
 *               descuento:
 *                 type: number
 *               fechaExpiracion:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Cupón actualizado
 *       404:
 *         description: Cupón no encontrado
 */
router.put('/cupones/:id', validateJWT, actualizarCupon);

/**
 * @swagger
 * /experiencia/cupones/{id}:
 *   delete:
 *     summary: Eliminar un cupón
 *     tags: [Cupones]
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
 *         description: Cupón eliminado
 *       404:
 *         description: Cupón no encontrado
 */
router.delete('/cupones/:id', validateJWT, eliminarCupon);

// ─── CUPONES USUARIO ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /experiencia/cupones-usuario:
 *   get:
 *     summary: Listar cupones asignados a usuarios
 *     tags: [Cupones Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cupones de usuario
 */
router.get('/cupones-usuario', validateJWT, listarCuponesUsuario);

/**
 * @swagger
 * /experiencia/cupones-usuario/{id}:
 *   get:
 *     summary: Obtener un cupón de usuario por ID
 *     tags: [Cupones Usuario]
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
 *         description: Cupón de usuario encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/cupones-usuario/:id', validateJWT, obtenerCuponUsuario);

/**
 * @swagger
 * /experiencia/cupones-usuario:
 *   post:
 *     summary: Asignar un cupón a un usuario
 *     tags: [Cupones Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cuponId:
 *                 type: string
 *               usuarioId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cupón asignado
 *       400:
 *         description: Datos inválidos
 */
router.post('/cupones-usuario', validateJWT, asignarCuponUsuario);

/**
 * @swagger
 * /experiencia/cupones-usuario/{id}:
 *   put:
 *     summary: Actualizar cupón de usuario
 *     tags: [Cupones Usuario]
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
 *               usado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cupón de usuario actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/cupones-usuario/:id', validateJWT, actualizarCuponUsuario);

/**
 * @swagger
 * /experiencia/cupones-usuario/{id}:
 *   delete:
 *     summary: Eliminar cupón de usuario
 *     tags: [Cupones Usuario]
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
 *         description: Cupón de usuario eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/cupones-usuario/:id', validateJWT, eliminarCuponUsuario);

export default router;