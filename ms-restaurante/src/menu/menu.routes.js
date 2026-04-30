import { Router } from 'express';
import {
    listarCategoriasPlato, obtenerCategoriaPlato, crearCategoriaPlato, actualizarCategoriaPlato, eliminarCategoriaPlato,
    listarIngredientes, obtenerIngrediente, crearIngrediente, actualizarIngrediente, eliminarIngrediente,
    listarPlatos, obtenerPlato, crearPlato, actualizarPlato, eliminarPlato,
    listarInventario, obtenerInventario, crearInventario, actualizarInventario, eliminarInventario
} from './menu.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Categorías de Plato
 *     description: Gestión de categorías del menú
 *   - name: Ingredientes
 *     description: Gestión de ingredientes
 *   - name: Platos
 *     description: Gestión de platos del menú
 *   - name: Inventario
 *     description: Gestión de inventario de ingredientes
 */

// ─── CATEGORÍAS DE PLATO ─────────────────────────────────────────────────────

/**
 * @swagger
 * /menu/categorias-plato:
 *   get:
 *     summary: Listar todas las categorías de plato
 *     tags: [Categorías de Plato]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/categorias-plato', validateJWT, listarCategoriasPlato);

/**
 * @swagger
 * /menu/categorias-plato/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categorías de Plato]
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
router.get('/categorias-plato/:id', validateJWT, obtenerCategoriaPlato);

/**
 * @swagger
 * /menu/categorias-plato:
 *   post:
 *     summary: Crear una categoría de plato
 *     tags: [Categorías de Plato]
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
router.post('/categorias-plato', validateJWT, crearCategoriaPlato);

/**
 * @swagger
 * /menu/categorias-plato/{id}:
 *   put:
 *     summary: Actualizar una categoría de plato
 *     tags: [Categorías de Plato]
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
router.put('/categorias-plato/:id', validateJWT, actualizarCategoriaPlato);

/**
 * @swagger
 * /menu/categorias-plato/{id}:
 *   delete:
 *     summary: Eliminar una categoría de plato
 *     tags: [Categorías de Plato]
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
router.delete('/categorias-plato/:id', validateJWT, eliminarCategoriaPlato);

// ─── INGREDIENTES ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /menu/ingredientes:
 *   get:
 *     summary: Listar todos los ingredientes
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ingredientes
 */
router.get('/ingredientes', validateJWT, listarIngredientes);

/**
 * @swagger
 * /menu/ingredientes/{id}:
 *   get:
 *     summary: Obtener un ingrediente por ID
 *     tags: [Ingredientes]
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
 *         description: Ingrediente encontrado
 *       404:
 *         description: Ingrediente no encontrado
 */
router.get('/ingredientes/:id', validateJWT, obtenerIngrediente);

/**
 * @swagger
 * /menu/ingredientes:
 *   post:
 *     summary: Crear un ingrediente
 *     tags: [Ingredientes]
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
 *               unidad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingrediente creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/ingredientes', validateJWT, crearIngrediente);

/**
 * @swagger
 * /menu/ingredientes/{id}:
 *   put:
 *     summary: Actualizar un ingrediente
 *     tags: [Ingredientes]
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
 *               unidad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ingrediente actualizado
 *       404:
 *         description: Ingrediente no encontrado
 */
router.put('/ingredientes/:id', validateJWT, actualizarIngrediente);

/**
 * @swagger
 * /menu/ingredientes/{id}:
 *   delete:
 *     summary: Eliminar un ingrediente
 *     tags: [Ingredientes]
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
 *         description: Ingrediente eliminado
 *       404:
 *         description: Ingrediente no encontrado
 */
router.delete('/ingredientes/:id', validateJWT, eliminarIngrediente);

// ─── PLATOS ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /menu/platos:
 *   get:
 *     summary: Listar todos los platos
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de platos
 */
router.get('/platos', validateJWT, listarPlatos);

/**
 * @swagger
 * /menu/platos/{id}:
 *   get:
 *     summary: Obtener un plato por ID
 *     tags: [Platos]
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
 *         description: Plato encontrado
 *       404:
 *         description: Plato no encontrado
 */
router.get('/platos/:id', validateJWT, obtenerPlato);

/**
 * @swagger
 * /menu/platos:
 *   post:
 *     summary: Crear un plato
 *     tags: [Platos]
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
 *               precio:
 *                 type: number
 *               categoriaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Plato creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/platos', validateJWT, crearPlato);

/**
 * @swagger
 * /menu/platos/{id}:
 *   put:
 *     summary: Actualizar un plato
 *     tags: [Platos]
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
 *               precio:
 *                 type: number
 *               categoriaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plato actualizado
 *       404:
 *         description: Plato no encontrado
 */
router.put('/platos/:id', validateJWT, actualizarPlato);

/**
 * @swagger
 * /menu/platos/{id}:
 *   delete:
 *     summary: Eliminar un plato
 *     tags: [Platos]
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
 *         description: Plato eliminado
 *       404:
 *         description: Plato no encontrado
 */
router.delete('/platos/:id', validateJWT, eliminarPlato);

// ─── INVENTARIO ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /menu/inventario:
 *   get:
 *     summary: Listar todo el inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inventario
 */
router.get('/inventario', validateJWT, listarInventario);

/**
 * @swagger
 * /menu/inventario/{id}:
 *   get:
 *     summary: Obtener un registro de inventario por ID
 *     tags: [Inventario]
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
 *         description: Registro encontrado
 *       404:
 *         description: Registro no encontrado
 */
router.get('/inventario/:id', validateJWT, obtenerInventario);

/**
 * @swagger
 * /menu/inventario:
 *   post:
 *     summary: Crear un registro de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredienteId:
 *                 type: string
 *               cantidad:
 *                 type: number
 *               stockMinimo:
 *                 type: number
 *     responses:
 *       201:
 *         description: Registro creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/inventario', validateJWT, crearInventario);

/**
 * @swagger
 * /menu/inventario/{id}:
 *   put:
 *     summary: Actualizar un registro de inventario
 *     tags: [Inventario]
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
 *               cantidad:
 *                 type: number
 *               stockMinimo:
 *                 type: number
 *     responses:
 *       200:
 *         description: Registro actualizado
 *       404:
 *         description: Registro no encontrado
 */
router.put('/inventario/:id', validateJWT, actualizarInventario);

/**
 * @swagger
 * /menu/inventario/{id}:
 *   delete:
 *     summary: Eliminar un registro de inventario
 *     tags: [Inventario]
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
 *         description: Registro eliminado
 *       404:
 *         description: Registro no encontrado
 */
router.delete('/inventario/:id', validateJWT, eliminarInventario);

export default router;