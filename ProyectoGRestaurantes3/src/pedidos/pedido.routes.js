import { Router } from 'express';
import {
    listarPedidos, crearPedido,
    listarMetodosPago, crearMetodoPago,
    listarFacturas, crearFactura
} from './pedido.controller.js';

const router = Router();

router.get('/pedidos', listarPedidos);
router.post('/pedidos', crearPedido);

router.get('/metodos-pago', listarMetodosPago);
router.post('/metodos-pago', crearMetodoPago);

router.get('/facturas', listarFacturas);
router.post('/facturas', crearFactura);

export default router;