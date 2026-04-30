import { Router } from 'express';
import {
  getAllUsers,
  updateUserRole,
  getUserRoles,
  getUsersByRole,
} from './user.controller.js';
import {
  validateUpdateUserRole,
  validateGetUserRoles,
  validateGetUsersByRole,
} from './user.validators.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios y roles
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /users/{userId}/role:
 *   put:
 *     summary: Actualizar el rol de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 description: Nombre del nuevo rol
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:userId/role', ...updateUserRole, validateUpdateUserRole);

/**
 * @swagger
 * /users/{userId}/roles:
 *   get:
 *     summary: Obtener los roles de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Roles del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:userId/roles', ...getUserRoles, validateGetUserRoles);

/**
 * @swagger
 * /users/by-role/{roleName}:
 *   get:
 *     summary: Obtener usuarios por rol
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleName
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del rol
 *     responses:
 *       200:
 *         description: Lista de usuarios con ese rol
 *       404:
 *         description: Rol no encontrado
 */
router.get('/by-role/:roleName', ...getUsersByRole, validateGetUsersByRole);

export default router;