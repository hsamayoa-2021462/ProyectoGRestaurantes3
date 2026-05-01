import { Router } from 'express';
import {
    listarPedidos, obtenerPedido, crearPedido, actualizarPedido, eliminarPedido,
    listarMetodosPago, obtenerMetodoPago, crearMetodoPago, actualizarMetodoPago, eliminarMetodoPago,
    listarFacturas, obtenerFactura, crearFactura, actualizarFactura, eliminarFactura
} from './pedido.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isAnyRole, isClient } from '../../middlewares/checkRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Pedidos
 *     description: Gestión de pedidos del restaurante
 *   - name: Métodos de Pago
 *     description: Gestión de métodos de pago disponibles
 *   - name: Facturas
 *     description: Gestión de facturas
 */

router.get('/pedidos', validateJWT, isAdmin, listarPedidos);
router.get('/pedidos/:id', validateJWT, isAdmin, obtenerPedido);
router.post('/pedidos', validateJWT, isClient, crearPedido);
router.put('/pedidos/:id', validateJWT, isAdmin, actualizarPedido);
router.delete('/pedidos/:id', validateJWT, isAdmin, eliminarPedido);

router.get('/metodos-pago', validateJWT, isAnyRole, listarMetodosPago);
router.get('/metodos-pago/:id', validateJWT, isAnyRole, obtenerMetodoPago);
router.post('/metodos-pago', validateJWT, isAdmin, crearMetodoPago);
router.put('/metodos-pago/:id', validateJWT, isAdmin, actualizarMetodoPago);
router.delete('/metodos-pago/:id', validateJWT, isAdmin, eliminarMetodoPago);

router.get('/facturas', validateJWT, isAdmin, listarFacturas);
router.get('/facturas/:id', validateJWT, isAdmin, obtenerFactura);
router.post('/facturas', validateJWT, isAdmin, crearFactura);
router.put('/facturas/:id', validateJWT, isAdmin, actualizarFactura);
router.delete('/facturas/:id', validateJWT, isAdmin, eliminarFactura);

export default router;