'use strict';

import { Pedido, MetodoPago, Factura } from './pedido.model.js';

// ==================== PEDIDOS ====================
export const listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .populate('usuario', 'name email')
            .populate('restaurante')
            .populate('detalles.plato')
            .populate('zonaEntrega');
        res.status(200).json({ success: true, data: pedidos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar pedidos', error: error.message });
    }
};

export const crearPedido = async (req, res) => {
    try {
        const pedido = new Pedido(req.body);
        
        // Calcular total si no viene
        if (!pedido.total && pedido.detalles) {
            pedido.total = pedido.detalles.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        }
        
        await pedido.save();
        res.status(201).json({ success: true, message: 'Pedido creado', data: pedido });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear pedido', error: error.message });
    }
};

// ==================== MÉTODOS DE PAGO ====================
export const listarMetodosPago = async (req, res) => {
    try {
        const metodos = await MetodoPago.find({ activo: true });
        res.status(200).json({ success: true, data: metodos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar métodos de pago', error: error.message });
    }
};

export const crearMetodoPago = async (req, res) => {
    try {
        const metodo = new MetodoPago(req.body);
        await metodo.save();
        res.status(201).json({ success: true, message: 'Método de pago creado', data: metodo });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear método de pago', error: error.message });
    }
};

// ==================== FACTURAS ====================
export const listarFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find().populate('pedido');
        res.status(200).json({ success: true, data: facturas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar facturas', error: error.message });
    }
};

export const crearFactura = async (req, res) => {
    try {
        const factura = new Factura(req.body);
        await factura.save();
        res.status(201).json({ success: true, message: 'Factura creada', data: factura });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear factura', error: error.message });
    }
};