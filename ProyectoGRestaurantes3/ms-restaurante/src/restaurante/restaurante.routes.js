import { Router } from 'express';
import {
    listarRestaurantes, obtenerRestaurantePorId, crearRestaurante, actualizarRestaurante, eliminarRestaurante,
    listarCategorias, obtenerCategoriaPorId, crearCategoria, actualizarCategoria, eliminarCategoria,
    listarMesas, obtenerMesaPorId, crearMesa, actualizarMesa, eliminarMesa,
    listarZonasEntrega, obtenerZonaEntregaPorId, crearZonaEntrega, actualizarZonaEntrega, eliminarZonaEntrega
} from './restaurante.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isAnyRole } from '../../middlewares/checkRole.js';

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
router.get('/restaurantes', validateJWT, isAnyRole, listarRestaurantes);
router.get('/restaurantes/:id', validateJWT, isAnyRole, obtenerRestaurantePorId);
router.post('/restaurantes', validateJWT, isAdmin, crearRestaurante);
router.put('/restaurantes/:id', validateJWT, isAdmin, actualizarRestaurante);
router.delete('/restaurantes/:id', validateJWT, isAdmin, eliminarRestaurante);

router.get('/categorias', validateJWT, isAnyRole, listarCategorias);
router.get('/categorias/:id', validateJWT, isAnyRole, obtenerCategoriaPorId);
router.post('/categorias', validateJWT, isAdmin, crearCategoria);
router.put('/categorias/:id', validateJWT, isAdmin, actualizarCategoria);
router.delete('/categorias/:id', validateJWT, isAdmin, eliminarCategoria);

router.get('/mesas', validateJWT, isAnyRole, listarMesas);
router.get('/mesas/:id', validateJWT, isAnyRole, obtenerMesaPorId);
router.post('/mesas', validateJWT, isAdmin, crearMesa);
router.put('/mesas/:id', validateJWT, isAdmin, actualizarMesa);
router.delete('/mesas/:id', validateJWT, isAdmin, eliminarMesa);

router.get('/zonas-entrega', validateJWT, isAnyRole, listarZonasEntrega);
router.get('/zonas-entrega/:id', validateJWT, isAnyRole, obtenerZonaEntregaPorId);
router.post('/zonas-entrega', validateJWT, isAdmin, crearZonaEntrega);
router.put('/zonas-entrega/:id', validateJWT, isAdmin, actualizarZonaEntrega);
router.delete('/zonas-entrega/:id', validateJWT, isAdmin, eliminarZonaEntrega);

export default router;