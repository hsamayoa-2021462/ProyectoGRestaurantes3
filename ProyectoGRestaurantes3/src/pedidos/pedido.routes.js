import { Router } from 'express';
import {
    listarPedidos, obtenerPedido, crearPedido, actualizarPedido, eliminarPedido,
    listarMetodosPago, obtenerMetodoPago, crearMetodoPago, actualizarMetodoPago, eliminarMetodoPago,
    listarFacturas, obtenerFactura, crearFactura, actualizarFactura, eliminarFactura
} from './pedido.controller.js';

const router = Router();

// Pedidos
router.get('/pedidos', listarPedidos);
router.get('/pedidos/:id', obtenerPedido);
router.post('/pedidos', crearPedido);
router.put('/pedidos/:id', actualizarPedido);
router.delete('/pedidos/:id', eliminarPedido);

// Métodos de pago
router.get('/metodos-pago', listarMetodosPago);
router.get('/metodos-pago/:id', obtenerMetodoPago);
router.post('/metodos-pago', crearMetodoPago);
router.put('/metodos-pago/:id', actualizarMetodoPago);
router.delete('/metodos-pago/:id', eliminarMetodoPago);

// Facturas
router.get('/facturas', listarFacturas);
router.get('/facturas/:id', obtenerFactura);
router.post('/facturas', crearFactura);
router.put('/facturas/:id', actualizarFactura);
router.delete('/facturas/:id', eliminarFactura);

export default router;