import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin } from '../../middlewares/validate-admin.js';
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
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener todos los usuarios
 *     description: Devuelve la lista completa de usuarios. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado. Se requiere rol de administrador
 */
router.get('/', validateJWT, isAdmin, getAllUsers);

/**
 * @swagger
 * /api/v1/users/{userId}/role:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar el rol de un usuario
 *     description: Cambia el rol de un usuario específico. Solo accesible para administradores.
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
 *                 description: Nombre del nuevo rol (ADMIN_ROLE, USER_ROLE)
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado. Se requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:userId/role', validateJWT, isAdmin, ...updateUserRole, validateUpdateUserRole);

/**
 * @swagger
 * /api/v1/users/{userId}/roles:
 *   get:
 *     tags: [Users]
 *     summary: Obtener los roles de un usuario
 *     description: Devuelve los roles asignados a un usuario específico. Solo accesible para administradores.
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
 *         description: Roles del usuario obtenidos exitosamente
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado. Se requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:userId/roles', validateJWT, isAdmin, ...getUserRoles, validateGetUserRoles);

/**
 * @swagger
 * /api/v1/users/by-role/{roleName}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuarios por rol
 *     description: Devuelve todos los usuarios que tienen un rol específico. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleName
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del rol (ADMIN_ROLE, USER_ROLE)
 *     responses:
 *       200:
 *         description: Lista de usuarios con ese rol
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado. Se requiere rol de administrador
 *       404:
 *         description: Rol no encontrado
 */
router.get('/by-role/:roleName', validateJWT, isAdmin, ...getUsersByRole, validateGetUsersByRole);

export default router;