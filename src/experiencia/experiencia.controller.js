'use strict';

import { Resena, Promocion, Cupon, CuponUsuario } from './experiencia.model.js';

// ==================== RESEÑAS ====================
export const listarResenas = async (req, res) => {
    try {
        const resenas = await Resena.find()
            .populate('usuario', 'name email')
            .populate('restaurante')
            .populate('pedido');
        res.status(200).json({ success: true, data: resenas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar reseñas', error: error.message });
    }
};

export const obtenerResena = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de reseña inválido' });
        const resena = await Resena.findById(id)
            .populate('usuario', 'name email')
            .populate('restaurante')
            .populate('pedido');
        if (!resena) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
        res.status(200).json({ success: true, data: resena });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener reseña', error: error.message });
    }
};

export const crearResena = async (req, res) => {
    try {
        const { usuario, restaurante, calificacion, comentario } = req.body;

        if (!usuario) return res.status(400).json({ success: false, message: 'El campo "usuario" es obligatorio' });
        if (!usuario.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
        if (!restaurante) return res.status(400).json({ success: false, message: 'El campo "restaurante" es obligatorio' });
        if (!restaurante.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de restaurante inválido' });
        if (calificacion === undefined || calificacion === null) return res.status(400).json({ success: false, message: 'El campo "calificacion" es obligatorio' });
        if (typeof calificacion !== 'number') return res.status(400).json({ success: false, message: 'La calificación debe ser un número' });
        if (calificacion < 1 || calificacion > 5) return res.status(400).json({ success: false, message: 'La calificación debe estar entre 1 y 5' });
        if (comentario && comentario.trim().length < 5) return res.status(400).json({ success: false, message: 'El comentario debe tener al menos 5 caracteres' });
        if (comentario && comentario.trim().length > 500) return res.status(400).json({ success: false, message: 'El comentario no puede superar los 500 caracteres' });

        const resenaExistente = await Resena.findOne({ usuario, restaurante });
        if (resenaExistente) return res.status(409).json({ success: false, message: 'Este usuario ya dejó una reseña para este restaurante' });

        if (req.body.pedido && !req.body.pedido.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de pedido inválido' });

        const resena = new Resena(req.body);
        await resena.save();
        res.status(201).json({ success: true, message: 'Reseña creada exitosamente', data: resena });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al crear reseña', error: error.message });
    }
};

export const actualizarResena = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de reseña inválido' });

        const resena = await Resena.findById(id);
        if (!resena) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });

        const { calificacion, comentario, respuesta, respondida } = req.body;

        if (calificacion !== undefined) {
            if (typeof calificacion !== 'number') return res.status(400).json({ success: false, message: 'La calificación debe ser un número' });
            if (calificacion < 1 || calificacion > 5) return res.status(400).json({ success: false, message: 'La calificación debe estar entre 1 y 5' });
        }
        if (comentario !== undefined) {
            if (comentario.trim().length < 5) return res.status(400).json({ success: false, message: 'El comentario debe tener al menos 5 caracteres' });
            if (comentario.trim().length > 500) return res.status(400).json({ success: false, message: 'El comentario no puede superar los 500 caracteres' });
        }
        if (respuesta !== undefined) {
            if (respuesta.trim().length < 5) return res.status(400).json({ success: false, message: 'La respuesta debe tener al menos 5 caracteres' });
            if (respuesta.trim().length > 500) return res.status(400).json({ success: false, message: 'La respuesta no puede superar los 500 caracteres' });
            req.body.respondida = true;
        }
        if (respondida !== undefined && typeof respondida !== 'boolean') {
            return res.status(400).json({ success: false, message: 'El campo "respondida" debe ser true o false' });
        }

        const camposNoEditables = ['usuario', 'restaurante', 'pedido'];
        for (const campo of camposNoEditables) {
            if (req.body[campo]) return res.status(400).json({ success: false, message: `El campo "${campo}" no puede modificarse` });
        }

        const resenaActualizada = await Resena.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Reseña actualizada exitosamente', data: resenaActualizada });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al actualizar reseña', error: error.message });
    }
};

export const eliminarResena = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de reseña inválido' });
        const resena = await Resena.findById(id);
        if (!resena) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
        await Resena.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Reseña eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar reseña', error: error.message });
    }
};

// ==================== PROMOCIONES ====================
export const listarPromociones = async (req, res) => {
    try {
        const promociones = await Promocion.find({ activa: true }).populate('restaurante');
        res.status(200).json({ success: true, data: promociones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar promociones', error: error.message });
    }
};

export const obtenerPromocion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de promoción inválido' });
        const promocion = await Promocion.findById(id).populate('restaurante');
        if (!promocion) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
        res.status(200).json({ success: true, data: promocion });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener promoción', error: error.message });
    }
};

export const crearPromocion = async (req, res) => {
    try {
        const { nombre, tipo, fechaInicio, fechaFin, valor, restaurante } = req.body;

        if (!nombre || nombre.trim() === '') return res.status(400).json({ success: false, message: 'El campo "nombre" es obligatorio' });
        if (nombre.trim().length < 3) return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 3 caracteres' });
        if (nombre.trim().length > 100) return res.status(400).json({ success: false, message: 'El nombre no puede superar los 100 caracteres' });
        if (!tipo) return res.status(400).json({ success: false, message: 'El campo "tipo" es obligatorio' });
        if (!['DESCUENTO', '2x1', 'COMBO', 'OTRO'].includes(tipo)) return res.status(400).json({ success: false, message: 'Tipo inválido. Valores permitidos: DESCUENTO, 2x1, COMBO, OTRO' });
        if (!fechaInicio) return res.status(400).json({ success: false, message: 'El campo "fechaInicio" es obligatorio' });
        if (!fechaFin) return res.status(400).json({ success: false, message: 'El campo "fechaFin" es obligatorio' });

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        if (isNaN(inicio.getTime())) return res.status(400).json({ success: false, message: 'Formato de "fechaInicio" inválido' });
        if (isNaN(fin.getTime())) return res.status(400).json({ success: false, message: 'Formato de "fechaFin" inválido' });
        if (fin <= inicio) return res.status(400).json({ success: false, message: 'La "fechaFin" debe ser mayor que "fechaInicio"' });
        if (inicio < new Date()) return res.status(400).json({ success: false, message: 'La "fechaInicio" no puede ser en el pasado' });

        if (valor !== undefined) {
            if (typeof valor !== 'number' || valor < 0) return res.status(400).json({ success: false, message: 'El valor debe ser un número positivo' });
            if (tipo === 'DESCUENTO' && valor > 100) return res.status(400).json({ success: false, message: 'El descuento no puede ser mayor al 100%' });
        }
        if (restaurante && !restaurante.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de restaurante inválido' });

        const promocion = new Promocion(req.body);
        await promocion.save();
        res.status(201).json({ success: true, message: 'Promoción creada exitosamente', data: promocion });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al crear promoción', error: error.message });
    }
};

export const actualizarPromocion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de promoción inválido' });

        const promocion = await Promocion.findById(id);
        if (!promocion) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
        if (!promocion.activa) return res.status(400).json({ success: false, message: 'No se puede modificar una promoción inactiva' });

        const { nombre, tipo, fechaInicio, fechaFin, valor } = req.body;

        if (nombre !== undefined) {
            if (nombre.trim() === '') return res.status(400).json({ success: false, message: 'El nombre no puede estar vacío' });
            if (nombre.trim().length < 3) return res.status(400).json({ success: false, message: 'El nombre debe tener al menos 3 caracteres' });
            if (nombre.trim().length > 100) return res.status(400).json({ success: false, message: 'El nombre no puede superar los 100 caracteres' });
        }
        if (tipo && !['DESCUENTO', '2x1', 'COMBO', 'OTRO'].includes(tipo)) {
            return res.status(400).json({ success: false, message: 'Tipo inválido. Valores permitidos: DESCUENTO, 2x1, COMBO, OTRO' });
        }

        const inicio = fechaInicio ? new Date(fechaInicio) : promocion.fechaInicio;
        const fin = fechaFin ? new Date(fechaFin) : promocion.fechaFin;
        if (fechaInicio && isNaN(inicio.getTime())) return res.status(400).json({ success: false, message: 'Formato de "fechaInicio" inválido' });
        if (fechaFin && isNaN(fin.getTime())) return res.status(400).json({ success: false, message: 'Formato de "fechaFin" inválido' });
        if (fin <= inicio) return res.status(400).json({ success: false, message: 'La "fechaFin" debe ser mayor que "fechaInicio"' });

        if (valor !== undefined) {
            if (typeof valor !== 'number' || valor < 0) return res.status(400).json({ success: false, message: 'El valor debe ser un número positivo' });
            const tipoFinal = tipo || promocion.tipo;
            if (tipoFinal === 'DESCUENTO' && valor > 100) return res.status(400).json({ success: false, message: 'El descuento no puede ser mayor al 100%' });
        }

        const promocionActualizada = await Promocion.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Promoción actualizada exitosamente', data: promocionActualizada });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al actualizar promoción', error: error.message });
    }
};

export const eliminarPromocion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de promoción inválido' });
        const promocion = await Promocion.findById(id);
        if (!promocion) return res.status(404).json({ success: false, message: 'Promoción no encontrada' });

        const cuponesAsociados = await Cupon.findOne({ promocion: id });
        if (cuponesAsociados) return res.status(400).json({ success: false, message: 'No se puede eliminar una promoción que tiene cupones asociados' });

        await Promocion.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Promoción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar promoción', error: error.message });
    }
};

// ==================== CUPONES ====================
export const listarCupones = async (req, res) => {
    try {
        const cupones = await Cupon.find({ activo: true }).populate('promocion');
        res.status(200).json({ success: true, data: cupones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar cupones', error: error.message });
    }
};

export const obtenerCupon = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de cupón inválido' });
        const cupon = await Cupon.findById(id).populate('promocion');
        if (!cupon) return res.status(404).json({ success: false, message: 'Cupón no encontrado' });
        res.status(200).json({ success: true, data: cupon });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener cupón', error: error.message });
    }
};

export const crearCupon = async (req, res) => {
    try {
        const { codigo, promocion, descuento, tipoDescuento, fechaExpiracion, usoMaximo } = req.body;

        if (!codigo || codigo.trim() === '') return res.status(400).json({ success: false, message: 'El campo "codigo" es obligatorio' });
        if (codigo.trim().length < 3) return res.status(400).json({ success: false, message: 'El código debe tener al menos 3 caracteres' });
        if (codigo.trim().length > 20) return res.status(400).json({ success: false, message: 'El código no puede superar los 20 caracteres' });
        if (!/^[A-Z0-9_-]+$/.test(codigo.trim())) return res.status(400).json({ success: false, message: 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos' });
        if (!promocion) return res.status(400).json({ success: false, message: 'El campo "promocion" es obligatorio' });
        if (!promocion.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de promoción inválido' });
        if (descuento === undefined || descuento === null) return res.status(400).json({ success: false, message: 'El campo "descuento" es obligatorio' });
        if (typeof descuento !== 'number' || descuento <= 0) return res.status(400).json({ success: false, message: 'El descuento debe ser un número mayor a 0' });
        if (tipoDescuento === 'PORCENTAJE' && descuento > 100) return res.status(400).json({ success: false, message: 'El descuento en porcentaje no puede superar el 100%' });
        if (tipoDescuento && !['PORCENTAJE', 'MONTO_FIJO'].includes(tipoDescuento)) return res.status(400).json({ success: false, message: 'tipoDescuento debe ser PORCENTAJE o MONTO_FIJO' });

        const promocionExiste = await Promocion.findById(promocion);
        if (!promocionExiste) return res.status(404).json({ success: false, message: 'La promoción indicada no existe' });
        if (!promocionExiste.activa) return res.status(400).json({ success: false, message: 'No se puede crear un cupón para una promoción inactiva' });

        if (fechaExpiracion) {
            const fecha = new Date(fechaExpiracion);
            if (isNaN(fecha.getTime())) return res.status(400).json({ success: false, message: 'Formato de "fechaExpiracion" inválido' });
            if (fecha < new Date()) return res.status(400).json({ success: false, message: 'La fecha de expiración no puede ser en el pasado' });
        }
        if (usoMaximo !== undefined && (typeof usoMaximo !== 'number' || usoMaximo < 1)) {
            return res.status(400).json({ success: false, message: 'El uso máximo debe ser un número entero mayor a 0' });
        }

        const codigoExistente = await Cupon.findOne({ codigo: codigo.trim().toUpperCase() });
        if (codigoExistente) return res.status(409).json({ success: false, message: `Ya existe un cupón con el código "${codigo}"` });

        const cupon = new Cupon({ ...req.body, codigo: codigo.trim().toUpperCase() });
        await cupon.save();
        res.status(201).json({ success: true, message: 'Cupón creado exitosamente', data: cupon });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un cupón con ese código' });
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al crear cupón', error: error.message });
    }
};

export const actualizarCupon = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de cupón inválido' });

        const cupon = await Cupon.findById(id);
        if (!cupon) return res.status(404).json({ success: false, message: 'Cupón no encontrado' });
        if (!cupon.activo) return res.status(400).json({ success: false, message: 'No se puede modificar un cupón inactivo' });
        if (cupon.usosActuales > 0) return res.status(400).json({ success: false, message: 'No se puede modificar un cupón que ya ha sido utilizado' });

        const camposNoEditables = ['codigo', 'promocion', 'usosActuales'];
        for (const campo of camposNoEditables) {
            if (req.body[campo] !== undefined) return res.status(400).json({ success: false, message: `El campo "${campo}" no puede modificarse` });
        }

        const { descuento, tipoDescuento, fechaExpiracion, usoMaximo } = req.body;
        if (descuento !== undefined) {
            if (typeof descuento !== 'number' || descuento <= 0) return res.status(400).json({ success: false, message: 'El descuento debe ser un número mayor a 0' });
            const tipoFinal = tipoDescuento || cupon.tipoDescuento;
            if (tipoFinal === 'PORCENTAJE' && descuento > 100) return res.status(400).json({ success: false, message: 'El descuento en porcentaje no puede superar el 100%' });
        }
        if (tipoDescuento && !['PORCENTAJE', 'MONTO_FIJO'].includes(tipoDescuento)) {
            return res.status(400).json({ success: false, message: 'tipoDescuento debe ser PORCENTAJE o MONTO_FIJO' });
        }
        if (fechaExpiracion) {
            const fecha = new Date(fechaExpiracion);
            if (isNaN(fecha.getTime())) return res.status(400).json({ success: false, message: 'Formato de "fechaExpiracion" inválido' });
            if (fecha < new Date()) return res.status(400).json({ success: false, message: 'La fecha de expiración no puede ser en el pasado' });
        }
        if (usoMaximo !== undefined) {
            if (typeof usoMaximo !== 'number' || usoMaximo < 1) return res.status(400).json({ success: false, message: 'El uso máximo debe ser un número entero mayor a 0' });
            if (usoMaximo < cupon.usosActuales) return res.status(400).json({ success: false, message: 'El uso máximo no puede ser menor a los usos actuales' });
        }

        const cuponActualizado = await Cupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Cupón actualizado exitosamente', data: cuponActualizado });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al actualizar cupón', error: error.message });
    }
};

export const eliminarCupon = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID de cupón inválido' });
        const cupon = await Cupon.findById(id);
        if (!cupon) return res.status(404).json({ success: false, message: 'Cupón no encontrado' });
        if (cupon.usosActuales > 0) return res.status(400).json({ success: false, message: 'No se puede eliminar un cupón que ya ha sido utilizado' });

        const asignadoAUsuario = await CuponUsuario.findOne({ cupon: id });
        if (asignadoAUsuario) return res.status(400).json({ success: false, message: 'No se puede eliminar un cupón que está asignado a usuarios' });

        await Cupon.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Cupón eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar cupón', error: error.message });
    }
};

// ==================== CUPONES USUARIO ====================
export const listarCuponesUsuario = async (req, res) => {
    try {
        const cuponesUsuario = await CuponUsuario.find()
            .populate('cupon')
            .populate('usuario', 'name email')
            .populate('pedido');
        res.status(200).json({ success: true, data: cuponesUsuario });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar cupones de usuario', error: error.message });
    }
};

export const obtenerCuponUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID inválido' });
        const cuponUsuario = await CuponUsuario.findById(id)
            .populate('cupon')
            .populate('usuario', 'name email')
            .populate('pedido');
        if (!cuponUsuario) return res.status(404).json({ success: false, message: 'Asignación de cupón no encontrada' });
        res.status(200).json({ success: true, data: cuponUsuario });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener cupón de usuario', error: error.message });
    }
};

export const asignarCuponUsuario = async (req, res) => {
    try {
        const { cupon, usuario, pedido } = req.body;

        if (!cupon) return res.status(400).json({ success: false, message: 'El campo "cupon" es obligatorio' });
        if (!cupon.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de cupón inválido' });
        if (!usuario) return res.status(400).json({ success: false, message: 'El campo "usuario" es obligatorio' });
        if (!usuario.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
        if (pedido && !pedido.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'ID de pedido inválido' });

        const cuponExiste = await Cupon.findById(cupon);
        if (!cuponExiste) return res.status(404).json({ success: false, message: 'El cupón indicado no existe' });
        if (!cuponExiste.activo) return res.status(400).json({ success: false, message: 'El cupón está inactivo y no puede asignarse' });
        if (cuponExiste.fechaExpiracion && new Date() > cuponExiste.fechaExpiracion) {
            return res.status(400).json({ success: false, message: 'El cupón ha expirado' });
        }
        if (cuponExiste.usoMaximo && cuponExiste.usosActuales >= cuponExiste.usoMaximo) {
            return res.status(400).json({ success: false, message: 'El cupón ha alcanzado su límite máximo de usos' });
        }

        const yaAsignado = await CuponUsuario.findOne({ cupon, usuario });
        if (yaAsignado) return res.status(409).json({ success: false, message: 'Este cupón ya fue asignado a este usuario' });

        const cuponUsuario = new CuponUsuario(req.body);
        await cuponUsuario.save();
        res.status(201).json({ success: true, message: 'Cupón asignado exitosamente', data: cuponUsuario });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al asignar cupón', error: error.message });
    }
};

export const actualizarCuponUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID inválido' });

        const cuponUsuario = await CuponUsuario.findById(id);
        if (!cuponUsuario) return res.status(404).json({ success: false, message: 'Asignación de cupón no encontrada' });
        if (cuponUsuario.utilizado) return res.status(400).json({ success: false, message: 'No se puede modificar un cupón que ya fue utilizado' });

        const camposNoEditables = ['cupon', 'usuario', 'fechaAsignacion'];
        for (const campo of camposNoEditables) {
            if (req.body[campo] !== undefined) return res.status(400).json({ success: false, message: `El campo "${campo}" no puede modificarse` });
        }

        if (req.body.pedido && !req.body.pedido.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de pedido inválido' });
        }
        if (req.body.utilizado === true) {
            req.body.fechaUso = new Date();
            const cupon = await Cupon.findById(cuponUsuario.cupon);
            if (cupon) {
                cupon.usosActuales += 1;
                if (cupon.usoMaximo && cupon.usosActuales >= cupon.usoMaximo) cupon.activo = false;
                await cupon.save();
            }
        }
        if (req.body.utilizado !== undefined && typeof req.body.utilizado !== 'boolean') {
            return res.status(400).json({ success: false, message: 'El campo "utilizado" debe ser true o false' });
        }

        const actualizado = await CuponUsuario.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Cupón de usuario actualizado exitosamente', data: actualizado });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: mensajes });
        }
        res.status(400).json({ success: false, message: 'Error al actualizar cupón de usuario', error: error.message });
    }
};

export const eliminarCuponUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).json({ success: false, message: 'ID inválido' });
        const cuponUsuario = await CuponUsuario.findById(id);
        if (!cuponUsuario) return res.status(404).json({ success: false, message: 'Asignación de cupón no encontrada' });
        if (cuponUsuario.utilizado) return res.status(400).json({ success: false, message: 'No se puede eliminar un cupón que ya fue utilizado' });
        await CuponUsuario.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Asignación de cupón eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar cupón de usuario', error: error.message });
    }
};