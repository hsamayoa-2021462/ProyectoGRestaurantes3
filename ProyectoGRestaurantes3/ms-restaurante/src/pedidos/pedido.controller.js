'use strict';

import { Pedido, MetodoPago, Factura } from './pedido.model.js';
import { crearNotificacion } from '../notificaciones/notificaciones.controller.js';
import { descontarInventarioPorPedido, devolverInventarioPorPedido } from '../menu/menu.controller.js';
import { sendFacturaEmail } from '../../helpers/email-service.js';

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

export const listarMisPedidos = async (req, res) => {
    try {
        const usuarioId = req.userId;
        const pedidos = await Pedido.find({ usuario: usuarioId })
            .populate('restaurante')
            .populate('detalles.plato')
            .populate('zonaEntrega')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: pedidos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar pedidos', error: error.message });
    }
};

export const obtenerPedido = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de pedido inválido' });
        const pedido = await Pedido.findById(id)
            .populate('usuario', 'name email')
            .populate('restaurante')
            .populate('detalles.plato')
            .populate('zonaEntrega');
        if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
        res.status(200).json({ success: true, data: pedido });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener pedido', error: error.message });
    }
};

export const crearPedido = async (req, res) => {
    try {
        const { usuario, restaurante, detalles, tipoEntrega, pago } = req.body;

        if (!usuario) return res.status(400).json({ success: false, message: 'El campo "usuario" es obligatorio' });
        if (!restaurante) return res.status(400).json({ success: false, message: 'El campo "restaurante" es obligatorio' });
        if (!tipoEntrega) return res.status(400).json({ success: false, message: 'El campo "tipoEntrega" es obligatorio' });
        if (!['DOMICILIO', 'RECOGER'].includes(tipoEntrega)) return res.status(400).json({ success: false, message: 'tipoEntrega debe ser DOMICILIO o RECOGER' });

        if (tipoEntrega === 'DOMICILIO') {
            const dir = req.body.direccionEntrega;
            if (!dir) return res.status(400).json({ success: false, message: 'Se requiere "direccionEntrega" para entregas a domicilio' });
            if (!dir.calle || dir.calle.trim() === '') return res.status(400).json({ success: false, message: 'La dirección debe incluir "calle"' });
            if (!dir.ciudad || dir.ciudad.trim() === '') return res.status(400).json({ success: false, message: 'La dirección debe incluir "ciudad"' });
        }

        if (!detalles || !Array.isArray(detalles) || detalles.length === 0) return res.status(400).json({ success: false, message: 'Debe incluir al menos un detalle de pedido' });

        for (let i = 0; i < detalles.length; i++) {
            const d = detalles[i];
            if (!d.plato) return res.status(400).json({ success: false, message: `El detalle ${i + 1} debe tener un "plato"` });
            if (!d.cantidad || d.cantidad < 1) return res.status(400).json({ success: false, message: `El detalle ${i + 1} debe tener "cantidad" mayor a 0` });
        }

        const pedido = new Pedido(req.body);
        if (!pedido.total && pedido.detalles) {
            pedido.total = pedido.detalles.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        }
        await pedido.save();

        try { await descontarInventarioPorPedido(pedido.detalles); } catch (e) { console.warn('Error inventario:', e.message); }

        try {
            await crearNotificacion({
                para: 'admin', tipo: 'PEDIDO_NUEVO', titulo: 'Nuevo pedido recibido',
                mensaje: `Un cliente realizó un pedido por Q ${pedido.total?.toFixed(2) || '0.00'}`,
                refId: pedido._id.toString(), refTipo: 'pedido',
            });
        } catch (e) { console.warn('Error notificacion:', e.message); }

        res.status(201).json({ success: true, message: 'Pedido creado exitosamente', data: pedido });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', errors: Object.values(error.errors).map(e => e.message) });
        }
        res.status(400).json({ success: false, message: 'Error al crear pedido', error: error.message });
    }
};

export const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const pedidoActual = await Pedido.findById(id).populate('restaurante').populate('detalles.plato');
        if (!pedidoActual) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });

        // Devolver inventario si se cancela
        if (estado === 'CANCELADO' && pedidoActual.estado !== 'CANCELADO') {
            try { await devolverInventarioPorPedido(pedidoActual.detalles); } catch (e) { console.warn('Error devolver inventario:', e.message); }
        }

        const pedido = await Pedido.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .populate('restaurante')
            .populate('detalles.plato');

        // Notificar al cliente
        const estadosMensaje = {
            CONFIRMADO: { titulo: 'Pedido confirmado ✅', mensaje: 'Tu pedido ha sido confirmado y está siendo procesado.' },
            PREPARANDO: { titulo: 'Tu pedido está en cocina 🍳', mensaje: 'El restaurante está preparando tu pedido.' },
            EN_CAMINO:  { titulo: 'Tu pedido va en camino 🛵', mensaje: 'Tu pedido está en camino. ¡Prepárate para recibirlo!' },
            ENTREGADO:  { titulo: 'Pedido entregado ✅', mensaje: '¡Tu pedido fue entregado! Esperamos que lo disfrutes.' },
            CANCELADO:  { titulo: 'Pedido cancelado ❌', mensaje: 'Lamentablemente tu pedido fue cancelado.' },
        };

        if (estado && estadosMensaje[estado] && pedido?.usuario) {
            try {
                const { titulo, mensaje } = estadosMensaje[estado];
                await crearNotificacion({ para: pedido.usuario, tipo: `PEDIDO_${estado}`, titulo, mensaje, refId: pedido._id.toString(), refTipo: 'pedido' });
            } catch (e) { console.warn('Error notificacion estado:', e.message); }

            if (estado === 'ENTREGADO') {
                try { await sendFacturaEmail(pedido); } catch (e) { console.warn('Error email factura:', e.message); }
            }
        }

        res.status(200).json({ success: true, message: 'Pedido actualizado exitosamente', data: pedido });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', errors: Object.values(error.errors).map(e => e.message) });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar pedido', error: error.message });
    }
};

export const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de pedido inválido' });
        const pedido = await Pedido.findById(id);
        if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
        if (['PREPARANDO', 'EN_CAMINO'].includes(pedido.estado)) return res.status(400).json({ success: false, message: `No se puede eliminar un pedido en estado ${pedido.estado}` });
        const facturaAsociada = await Factura.findOne({ pedido: id });
        if (facturaAsociada) return res.status(400).json({ success: false, message: 'No se puede eliminar un pedido con factura asociada' });
        await Pedido.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Pedido eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar pedido', error: error.message });
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

export const obtenerMetodoPago = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const metodo = await MetodoPago.findById(id);
        if (!metodo) return res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
        res.status(200).json({ success: true, data: metodo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener método de pago', error: error.message });
    }
};

export const crearMetodoPago = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre || nombre.trim() === '') return res.status(400).json({ success: false, message: 'El campo "nombre" es obligatorio' });
        if (nombre.trim().length < 3) return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 3 caracteres' });
        const existe = await MetodoPago.findOne({ nombre: nombre.trim() });
        if (existe) return res.status(409).json({ success: false, message: `Ya existe un método de pago con el nombre "${nombre}"` });
        const metodo = new MetodoPago({ ...req.body, nombre: nombre.trim() });
        await metodo.save();
        res.status(201).json({ success: true, message: 'Método de pago creado exitosamente', data: metodo });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un método de pago con ese nombre' });
        res.status(400).json({ success: false, message: 'Error al crear método de pago', error: error.message });
    }
};

export const actualizarMetodoPago = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const { nombre } = req.body;
        if (nombre !== undefined) {
            if (nombre.trim() === '') return res.status(400).json({ success: false, message: 'El nombre no puede estar vacío' });
            if (nombre.trim().length < 3) return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 3 caracteres' });
            const existe = await MetodoPago.findOne({ nombre: nombre.trim(), _id: { $ne: id } });
            if (existe) return res.status(409).json({ success: false, message: `Ya existe otro método con el nombre "${nombre}"` });
            req.body.nombre = nombre.trim();
        }
        const metodo = await MetodoPago.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!metodo) return res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
        res.status(200).json({ success: true, message: 'Método de pago actualizado exitosamente', data: metodo });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un método de pago con ese nombre' });
        res.status(400).json({ success: false, message: 'Error al actualizar método de pago', error: error.message });
    }
};

export const eliminarMetodoPago = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const metodo = await MetodoPago.findById(id);
        if (!metodo) return res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
        const enUso = await Pedido.findOne({ 'pago.metodoPago': id });
        if (enUso) return res.status(400).json({ success: false, message: 'No se puede eliminar un método de pago en uso' });
        await MetodoPago.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Método de pago eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar método de pago', error: error.message });
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

export const obtenerFactura = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const factura = await Factura.findById(id).populate('pedido');
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        res.status(200).json({ success: true, data: factura });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener factura', error: error.message });
    }
};

export const crearFactura = async (req, res) => {
    try {
        const { pedido, numeroFactura, total } = req.body;
        if (!pedido) return res.status(400).json({ success: false, message: 'El campo "pedido" es obligatorio' });
        if (!pedido.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de pedido inválido' });
        if (!numeroFactura || numeroFactura.trim() === '') return res.status(400).json({ success: false, message: 'El campo "numeroFactura" es obligatorio' });
        if (total !== undefined && total < 0) return res.status(400).json({ success: false, message: 'El total no puede ser negativo' });
        const pedidoExiste = await Pedido.findById(pedido);
        if (!pedidoExiste) return res.status(404).json({ success: false, message: 'El pedido indicado no existe' });
        if (pedidoExiste.estado !== 'ENTREGADO') return res.status(400).json({ success: false, message: 'Solo se puede facturar un pedido ENTREGADO' });
        const facturaExistente = await Factura.findOne({ pedido });
        if (facturaExistente) return res.status(409).json({ success: false, message: 'Ya existe una factura para este pedido' });
        const numeroExistente = await Factura.findOne({ numeroFactura: numeroFactura.trim() });
        if (numeroExistente) return res.status(409).json({ success: false, message: `Ya existe una factura con el número "${numeroFactura}"` });
        const factura = new Factura({ ...req.body, numeroFactura: numeroFactura.trim() });
        await factura.save();
        res.status(201).json({ success: true, message: 'Factura creada exitosamente', data: factura });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'Número de factura o pedido duplicado' });
        res.status(400).json({ success: false, message: 'Error al crear factura', error: error.message });
    }
};

export const actualizarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID inválido' });
        for (const campo of ['pedido', 'numeroFactura']) {
            if (req.body[campo]) return res.status(400).json({ success: false, message: `El campo "${campo}" no puede modificarse` });
        }
        if (req.body.total !== undefined && req.body.total < 0) return res.status(400).json({ success: false, message: 'El total no puede ser negativo' });
        const factura = await Factura.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        res.status(200).json({ success: true, message: 'Factura actualizada exitosamente', data: factura });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al actualizar factura', error: error.message });
    }
};

export const eliminarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID inválido' });
        const factura = await Factura.findById(id);
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        await Factura.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Factura eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar factura', error: error.message });
    }
};