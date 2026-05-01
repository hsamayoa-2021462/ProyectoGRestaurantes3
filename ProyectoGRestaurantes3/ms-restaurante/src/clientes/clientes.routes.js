import { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from './clientes.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isClient } from '../../middlewares/checkRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes (Solo ADMIN)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       403:
 *         description: Acceso denegado
 */
router.get('/', validateJWT, isAdmin, getUsers);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID (Solo ADMIN)
 *     tags: [Clientes]
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
 *         description: Cliente encontrado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', validateJWT, isAdmin, getUserById);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un cliente (Cliente)
 *     tags: [Clientes]
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
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', validateJWT, isClient, createUser);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente (Solo ADMIN)
 *     tags: [Clientes]
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
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', validateJWT, isAdmin, updateUser);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente (Solo ADMIN)
 *     tags: [Clientes]
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
 *         description: Cliente eliminado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', validateJWT, isAdmin, deleteUser);

export default router;