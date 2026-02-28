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

export const obtenerPedido = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de pedido inválido' });
        }
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
        if (!['DOMICILIO', 'RECOGER'].includes(tipoEntrega)) {
            return res.status(400).json({ success: false, message: 'tipoEntrega debe ser DOMICILIO o RECOGER' });
        }

        if (tipoEntrega === 'DOMICILIO') {
            const dir = req.body.direccionEntrega;
            if (!dir) {
                return res.status(400).json({ success: false, message: 'Se requiere "direccionEntrega" para entregas a domicilio' });
            }
            if (!dir.calle || dir.calle.trim() === '') {
                return res.status(400).json({ success: false, message: 'La dirección debe incluir "calle"' });
            }
            if (!dir.ciudad || dir.ciudad.trim() === '') {
                return res.status(400).json({ success: false, message: 'La dirección debe incluir "ciudad"' });
            }
            if (dir.coordenadas) {
                if (dir.coordenadas.lat === undefined || dir.coordenadas.lng === undefined) {
                    return res.status(400).json({ success: false, message: 'Las coordenadas deben incluir "lat" y "lng"' });
                }
                if (dir.coordenadas.lat < -90 || dir.coordenadas.lat > 90) {
                    return res.status(400).json({ success: false, message: 'Latitud inválida, debe estar entre -90 y 90' });
                }
                if (dir.coordenadas.lng < -180 || dir.coordenadas.lng > 180) {
                    return res.status(400).json({ success: false, message: 'Longitud inválida, debe estar entre -180 y 180' });
                }
            }
        }

        if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({ success: false, message: 'Debe incluir al menos un detalle de pedido' });
        }
        for (let i = 0; i < detalles.length; i++) {
            const d = detalles[i];
            if (!d.plato) return res.status(400).json({ success: false, message: `El detalle ${i + 1} debe tener un "plato"` });
            if (!d.cantidad || d.cantidad < 1) return res.status(400).json({ success: false, message: `El detalle ${i + 1} debe tener "cantidad" mayor a 0` });
        }

        if (pago) {
            if (!pago.metodoPago) return res.status(400).json({ success: false, message: 'El pago debe tener un "metodoPago"' });
            if (pago.monto === undefined || pago.monto < 0) return res.status(400).json({ success: false, message: 'El monto del pago debe ser mayor o igual a 0' });
        }

        const pedido = new Pedido(req.body);
        if (!pedido.total && pedido.detalles) {
            pedido.total = pedido.detalles.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        }

        await pedido.save();
        res.status(201).json({ success: true, message: 'Pedido creado exitosamente', data: pedido });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al crear pedido', error: error.message });
    }
};

export const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de pedido inválido' });
        }

        const { estado, tipoEntrega } = req.body;
        const estadosValidos = ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'];
        if (estado && !estadosValidos.includes(estado)) {
            return res.status(400).json({ success: false, message: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` });
        }
        if (tipoEntrega && !['DOMICILIO', 'RECOGER'].includes(tipoEntrega)) {
            return res.status(400).json({ success: false, message: 'tipoEntrega debe ser DOMICILIO o RECOGER' });
        }

        if (tipoEntrega === 'DOMICILIO' || (!tipoEntrega && req.body.direccionEntrega)) {
            const dir = req.body.direccionEntrega;
            if (dir) {
                if (dir.calle !== undefined && dir.calle.trim() === '') {
                    return res.status(400).json({ success: false, message: 'La calle no puede estar vacía' });
                }
                if (dir.ciudad !== undefined && dir.ciudad.trim() === '') {
                    return res.status(400).json({ success: false, message: 'La ciudad no puede estar vacía' });
                }
                if (dir.coordenadas) {
                    if (dir.coordenadas.lat === undefined || dir.coordenadas.lng === undefined) {
                        return res.status(400).json({ success: false, message: 'Las coordenadas deben incluir "lat" y "lng"' });
                    }
                    if (dir.coordenadas.lat < -90 || dir.coordenadas.lat > 90) {
                        return res.status(400).json({ success: false, message: 'Latitud inválida, debe estar entre -90 y 90' });
                    }
                    if (dir.coordenadas.lng < -180 || dir.coordenadas.lng > 180) {
                        return res.status(400).json({ success: false, message: 'Longitud inválida, debe estar entre -180 y 180' });
                    }
                }
            }
        }

        const pedidoActual = await Pedido.findById(id);
        if (!pedidoActual) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
        if (['ENTREGADO', 'CANCELADO'].includes(pedidoActual.estado)) {
            return res.status(400).json({ success: false, message: `No se puede modificar un pedido en estado ${pedidoActual.estado}` });
        }

        const pedido = await Pedido.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Pedido actualizado exitosamente', data: pedido });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al actualizar pedido', error: error.message });
    }
};

export const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de pedido inválido' });
        }
        const pedido = await Pedido.findById(id);
        if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
        if (['PREPARANDO', 'EN_CAMINO'].includes(pedido.estado)) {
            return res.status(400).json({ success: false, message: `No se puede eliminar un pedido en estado ${pedido.estado}` });
        }
        const facturaAsociada = await Factura.findOne({ pedido: id });
        if (facturaAsociada) {
            return res.status(400).json({ success: false, message: 'No se puede eliminar un pedido que ya tiene factura asociada' });
        }
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
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de método de pago inválido' });
        }
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
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ success: false, message: 'El campo "nombre" es obligatorio' });
        }
        if (nombre.trim().length < 3) {
            return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 3 caracteres' });
        }
        const existe = await MetodoPago.findOne({ nombre: nombre.trim() });
        if (existe) {
            return res.status(409).json({ success: false, message: `Ya existe un método de pago con el nombre "${nombre}"` });
        }
        const metodo = new MetodoPago({ ...req.body, nombre: nombre.trim() });
        await metodo.save();
        res.status(201).json({ success: true, message: 'Método de pago creado exitosamente', data: metodo });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe un método de pago con ese nombre' });
        }
        res.status(400).json({ success: false, message: 'Error al crear método de pago', error: error.message });
    }
};

export const actualizarMetodoPago = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de método de pago inválido' });
        }
        const { nombre } = req.body;
        if (nombre !== undefined) {
            if (nombre.trim() === '') return res.status(400).json({ success: false, message: 'El nombre no puede estar vacío' });
            if (nombre.trim().length < 3) return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 3 caracteres' });
            const existe = await MetodoPago.findOne({ nombre: nombre.trim(), _id: { $ne: id } });
            if (existe) return res.status(409).json({ success: false, message: `Ya existe otro método de pago con el nombre "${nombre}"` });
            req.body.nombre = nombre.trim();
        }
        const metodo = await MetodoPago.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!metodo) return res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
        res.status(200).json({ success: true, message: 'Método de pago actualizado exitosamente', data: metodo });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe un método de pago con ese nombre' });
        }
        res.status(400).json({ success: false, message: 'Error al actualizar método de pago', error: error.message });
    }
};

export const eliminarMetodoPago = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de método de pago inválido' });
        }
        const metodo = await MetodoPago.findById(id);
        if (!metodo) return res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
        const enUso = await Pedido.findOne({ 'pago.metodoPago': id });
        if (enUso) {
            return res.status(400).json({ success: false, message: 'No se puede eliminar un método de pago que está siendo utilizado en pedidos' });
        }
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
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de factura inválido' });
        }
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
        if (!numeroFactura || numeroFactura.trim() === '') {
            return res.status(400).json({ success: false, message: 'El campo "numeroFactura" es obligatorio' });
        }
        if (total !== undefined && total < 0) {
            return res.status(400).json({ success: false, message: 'El total no puede ser negativo' });
        }

        const pedidoExiste = await Pedido.findById(pedido);
        if (!pedidoExiste) return res.status(404).json({ success: false, message: 'El pedido indicado no existe' });
        if (pedidoExiste.estado !== 'ENTREGADO') {
            return res.status(400).json({ success: false, message: 'Solo se puede facturar un pedido en estado ENTREGADO' });
        }

        const facturaExistente = await Factura.findOne({ pedido });
        if (facturaExistente) return res.status(409).json({ success: false, message: 'Ya existe una factura para este pedido' });

        const numeroExistente = await Factura.findOne({ numeroFactura: numeroFactura.trim() });
        if (numeroExistente) return res.status(409).json({ success: false, message: `Ya existe una factura con el número "${numeroFactura}"` });

        const factura = new Factura({ ...req.body, numeroFactura: numeroFactura.trim() });
        await factura.save();
        res.status(201).json({ success: true, message: 'Factura creada exitosamente', data: factura });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Número de factura o pedido duplicado' });
        }
        res.status(400).json({ success: false, message: 'Error al crear factura', error: error.message });
    }
};

export const actualizarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de factura inválido' });
        }
        const camposNoEditables = ['pedido', 'numeroFactura'];
        for (const campo of camposNoEditables) {
            if (req.body[campo]) {
                return res.status(400).json({ success: false, message: `El campo "${campo}" no puede modificarse una vez creada la factura` });
            }
        }
        if (req.body.total !== undefined && req.body.total < 0) {
            return res.status(400).json({ success: false, message: 'El total no puede ser negativo' });
        }
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
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de factura inválido' });
        }
        const factura = await Factura.findById(id);
        if (!factura) return res.status(404).json({ success: false, message: 'Factura no encontrada' });
        await Factura.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Factura eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar factura', error: error.message });
    }
};