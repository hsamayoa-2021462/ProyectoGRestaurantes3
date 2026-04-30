import { Router } from 'express';
import {
    listarRestaurantes, obtenerRestaurantePorId, crearRestaurante, actualizarRestaurante, eliminarRestaurante,
    listarCategorias, obtenerCategoriaPorId, crearCategoria, actualizarCategoria, eliminarCategoria,
    listarMesas, obtenerMesaPorId, crearMesa, actualizarMesa, eliminarMesa,
    listarZonasEntrega, obtenerZonaEntregaPorId, crearZonaEntrega, actualizarZonaEntrega, eliminarZonaEntrega
} from './restaurante.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Restaurantes
 *     description: Gestión de restaurantes
 *   - name: Categorías
 *     description: Categorías del restaurante
 *   - name: Mesas
 *     description: Gestión de mesas
 *   - name: Zonas de Entrega
 *     description: Gestión de zonas de entrega
 */

// ─── RESTAURANTES ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /restaurante/restaurantes:
 *   get:
 *     summary: Listar todos los restaurantes
 *     tags: [Restaurantes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
router.get('/restaurantes', validateJWT, listarRestaurantes);

/**
 * @swagger
 * /restaurante/restaurantes/{id}:
 *   get:
 *     summary: Obtener un restaurante por ID
 *     tags: [Restaurantes]
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
 *         description: Restaurante encontrado
 *       404:
 *         description: Restaurante no encontrado
 */
router.get('/restaurantes/:id', validateJWT, obtenerRestaurantePorId);

/**
 * @swagger
 * /restaurante/restaurantes:
 *   post:
 *     summary: Crear un restaurante
 *     tags: [Restaurantes]
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
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurante creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/restaurantes', validateJWT, crearRestaurante);

/**
 * @swagger
 * /restaurante/restaurantes/{id}:
 *   put:
 *     summary: Actualizar un restaurante
 *     tags: [Restaurantes]
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
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurante actualizado
 *       404:
 *         description: Restaurante no encontrado
 */
router.put('/restaurantes/:id', validateJWT, actualizarRestaurante);

/**
 * @swagger
 * /restaurante/restaurantes/{id}:
 *   delete:
 *     summary: Eliminar un restaurante
 *     tags: [Restaurantes]
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
 *         description: Restaurante eliminado
 *       404:
 *         description: Restaurante no encontrado
 */
router.delete('/restaurantes/:id', validateJWT, eliminarRestaurante);

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /restaurante/categorias:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/categorias', validateJWT, listarCategorias);

/**
 * @swagger
 * /restaurante/categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categorías]
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
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/categorias/:id', validateJWT, obtenerCategoriaPorId);

/**
 * @swagger
 * /restaurante/categorias:
 *   post:
 *     summary: Crear una categoría
 *     tags: [Categorías]
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
 *         description: Categoría creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/categorias', validateJWT, crearCategoria);

/**
 * @swagger
 * /restaurante/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
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
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/categorias/:id', validateJWT, actualizarCategoria);

/**
 * @swagger
 * /restaurante/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categorías]
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
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
router.delete('/categorias/:id', validateJWT, eliminarCategoria);

// ─── MESAS ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /restaurante/mesas:
 *   get:
 *     summary: Listar todas las mesas
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mesas
 */
router.get('/mesas', validateJWT, listarMesas);

/**
 * @swagger
 * /restaurante/mesas/{id}:
 *   get:
 *     summary: Obtener una mesa por ID
 *     tags: [Mesas]
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
 *         description: Mesa encontrada
 *       404:
 *         description: Mesa no encontrada
 */
router.get('/mesas/:id', validateJWT, obtenerMesaPorId);

/**
 * @swagger
 * /restaurante/mesas:
 *   post:
 *     summary: Crear una mesa
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: integer
 *               capacidad:
 *                 type: integer
 *               restauranteId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mesa creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/mesas', validateJWT, crearMesa);

/**
 * @swagger
 * /restaurante/mesas/{id}:
 *   put:
 *     summary: Actualizar una mesa
 *     tags: [Mesas]
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
 *               numero:
 *                 type: integer
 *               capacidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mesa actualizada
 *       404:
 *         description: Mesa no encontrada
 */
router.put('/mesas/:id', validateJWT, actualizarMesa);

/**
 * @swagger
 * /restaurante/mesas/{id}:
 *   delete:
 *     summary: Eliminar una mesa
 *     tags: [Mesas]
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
 *         description: Mesa eliminada
 *       404:
 *         description: Mesa no encontrada
 */
router.delete('/mesas/:id', validateJWT, eliminarMesa);

// ─── ZONAS DE ENTREGA ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /restaurante/zonas-entrega:
 *   get:
 *     summary: Listar todas las zonas de entrega
 *     tags: [Zonas de Entrega]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de zonas de entrega
 */
router.get('/zonas-entrega', validateJWT, listarZonasEntrega);

/**
 * @swagger
 * /restaurante/zonas-entrega/{id}:
 *   get:
 *     summary: Obtener una zona de entrega por ID
 *     tags: [Zonas de Entrega]
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
 *         description: Zona de entrega encontrada
 *       404:
 *         description: Zona de entrega no encontrada
 */
router.get('/zonas-entrega/:id', validateJWT, obtenerZonaEntregaPorId);

/**
 * @swagger
 * /restaurante/zonas-entrega:
 *   post:
 *     summary: Crear una zona de entrega
 *     tags: [Zonas de Entrega]
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
 *               costoEnvio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Zona de entrega creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/zonas-entrega', validateJWT, crearZonaEntrega);

/**
 * @swagger
 * /restaurante/zonas-entrega/{id}:
 *   put:
 *     summary: Actualizar una zona de entrega
 *     tags: [Zonas de Entrega]
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
 *               costoEnvio:
 *                 type: number
 *     responses:
 *       200:
 *         description: Zona de entrega actualizada
 *       404:
 *         description: Zona de entrega no encontrada
 */
router.put('/zonas-entrega/:id', validateJWT, actualizarZonaEntrega);

/**
 * @swagger
 * /restaurante/zonas-entrega/{id}:
 *   delete:
 *     summary: Eliminar una zona de entrega
 *     tags: [Zonas de Entrega]
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
 *         description: Zona de entrega eliminada
 *       404:
 *         description: Zona de entrega no encontrada
 */
router.delete('/zonas-entrega/:id', validateJWT, eliminarZonaEntrega);

export default router;