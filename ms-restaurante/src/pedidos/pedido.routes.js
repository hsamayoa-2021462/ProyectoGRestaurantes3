import { Router } from 'express';
import {
    listarPedidos, obtenerPedido, crearPedido, actualizarPedido, eliminarPedido,
    listarMetodosPago, obtenerMetodoPago, crearMetodoPago, actualizarMetodoPago, eliminarMetodoPago,
    listarFacturas, obtenerFactura, crearFactura, actualizarFactura, eliminarFactura
} from './pedido.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

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

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /pedidos/pedidos:
 *   get:
 *     summary: Listar todos los pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/pedidos', validateJWT, listarPedidos);

/**
 * @swagger
 * /pedidos/pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags: [Pedidos]
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
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/pedidos/:id', validateJWT, obtenerPedido);

/**
 * @swagger
 * /pedidos/pedidos:
 *   post:
 *     summary: Crear un pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *               mesaId:
 *                 type: string
 *               platos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     platoId:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/pedidos', validateJWT, crearPedido);

/**
 * @swagger
 * /pedidos/pedidos/{id}:
 *   put:
 *     summary: Actualizar un pedido
 *     tags: [Pedidos]
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
 *               estado:
 *                 type: string
 *               platos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     platoId:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *       404:
 *         description: Pedido no encontrado
 */
router.put('/pedidos/:id', validateJWT, actualizarPedido);

/**
 * @swagger
 * /pedidos/pedidos/{id}:
 *   delete:
 *     summary: Eliminar un pedido
 *     tags: [Pedidos]
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
 *         description: Pedido eliminado
 *       404:
 *         description: Pedido no encontrado
 */
router.delete('/pedidos/:id', validateJWT, eliminarPedido);

// ─── MÉTODOS DE PAGO ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /pedidos/metodos-pago:
 *   get:
 *     summary: Listar todos los métodos de pago
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de métodos de pago
 */
router.get('/metodos-pago', validateJWT, listarMetodosPago);

/**
 * @swagger
 * /pedidos/metodos-pago/{id}:
 *   get:
 *     summary: Obtener un método de pago por ID
 *     tags: [Métodos de Pago]
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
 *         description: Método de pago encontrado
 *       404:
 *         description: Método de pago no encontrado
 */
router.get('/metodos-pago/:id', validateJWT, obtenerMetodoPago);

/**
 * @swagger
 * /pedidos/metodos-pago:
 *   post:
 *     summary: Crear un método de pago
 *     tags: [Métodos de Pago]
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
 *         description: Método de pago creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/metodos-pago', validateJWT, crearMetodoPago);

/**
 * @swagger
 * /pedidos/metodos-pago/{id}:
 *   put:
 *     summary: Actualizar un método de pago
 *     tags: [Métodos de Pago]
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
 *         description: Método de pago actualizado
 *       404:
 *         description: Método de pago no encontrado
 */
router.put('/metodos-pago/:id', validateJWT, actualizarMetodoPago);

/**
 * @swagger
 * /pedidos/metodos-pago/{id}:
 *   delete:
 *     summary: Eliminar un método de pago
 *     tags: [Métodos de Pago]
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
 *         description: Método de pago eliminado
 *       404:
 *         description: Método de pago no encontrado
 */
router.delete('/metodos-pago/:id', validateJWT, eliminarMetodoPago);

// ─── FACTURAS ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /pedidos/facturas:
 *   get:
 *     summary: Listar todas las facturas
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de facturas
 */
router.get('/facturas', validateJWT, listarFacturas);

/**
 * @swagger
 * /pedidos/facturas/{id}:
 *   get:
 *     summary: Obtener una factura por ID
 *     tags: [Facturas]
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
 *         description: Factura encontrada
 *       404:
 *         description: Factura no encontrada
 */
router.get('/facturas/:id', validateJWT, obtenerFactura);

/**
 * @swagger
 * /pedidos/facturas:
 *   post:
 *     summary: Crear una factura
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: string
 *               metodoPagoId:
 *                 type: string
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Factura creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/facturas', validateJWT, crearFactura);

/**
 * @swagger
 * /pedidos/facturas/{id}:
 *   put:
 *     summary: Actualizar una factura
 *     tags: [Facturas]
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
 *               metodoPagoId:
 *                 type: string
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Factura actualizada
 *       404:
 *         description: Factura no encontrada
 */
router.put('/facturas/:id', validateJWT, actualizarFactura);

/**
 * @swagger
 * /pedidos/facturas/{id}:
 *   delete:
 *     summary: Eliminar una factura
 *     tags: [Facturas]
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
 *         description: Factura eliminada
 *       404:
 *         description: Factura no encontrada
 */
router.delete('/facturas/:id', validateJWT, eliminarFactura);

export default router;