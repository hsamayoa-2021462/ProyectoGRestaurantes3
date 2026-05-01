import { Router } from 'express';
import {
    listarResenas, obtenerResena, crearResena, actualizarResena, eliminarResena,
    listarPromociones, obtenerPromocion, crearPromocion, actualizarPromocion, eliminarPromocion,
    listarCupones, obtenerCupon, crearCupon, actualizarCupon, eliminarCupon,
    listarCuponesUsuario, obtenerCuponUsuario, asignarCuponUsuario, actualizarCuponUsuario, eliminarCuponUsuario
} from './experiencia.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isAnyRole, isClient } from '../../middlewares/checkRole.js';

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

router.get('/resenas', validateJWT, isAnyRole, listarResenas);
router.get('/resenas/:id', validateJWT, isAnyRole, obtenerResena);
router.post('/resenas', validateJWT, isClient, crearResena);
router.put('/resenas/:id', validateJWT, isAnyRole, actualizarResena);
router.delete('/resenas/:id', validateJWT, isAdmin, eliminarResena);

router.get('/promociones', validateJWT, isAnyRole, listarPromociones);
router.get('/promociones/:id', validateJWT, isAnyRole, obtenerPromocion);
router.post('/promociones', validateJWT, isAdmin, crearPromocion);
router.put('/promociones/:id', validateJWT, isAdmin, actualizarPromocion);
router.delete('/promociones/:id', validateJWT, isAdmin, eliminarPromocion);

router.get('/cupones', validateJWT, isAdmin, listarCupones);
router.get('/cupones/:id', validateJWT, isAdmin, obtenerCupon);
router.post('/cupones', validateJWT, isAdmin, crearCupon);
router.put('/cupones/:id', validateJWT, isAdmin, actualizarCupon);
router.delete('/cupones/:id', validateJWT, isAdmin, eliminarCupon);

router.get('/cupones-usuario', validateJWT, isAdmin, listarCuponesUsuario);
router.get('/cupones-usuario/:id', validateJWT, isAdmin, obtenerCuponUsuario);
router.post('/cupones-usuario', validateJWT, isAdmin, asignarCuponUsuario);
router.put('/cupones-usuario/:id', validateJWT, isAdmin, actualizarCuponUsuario);
router.delete('/cupones-usuario/:id', validateJWT, isAdmin, eliminarCuponUsuario);

export default router;