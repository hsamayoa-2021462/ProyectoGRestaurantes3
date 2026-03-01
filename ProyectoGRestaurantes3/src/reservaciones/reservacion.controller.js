'use strict';

import { Reservacion, EstadoReservacion } from './reservacion.model.js';
import mongoose from 'mongoose';

// ==================== HELPERS ====================

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isValidUserId = (id) =>
    typeof id === 'string' && id.trim().length > 0 && id.trim().length <= 16;

const isValidHora = (hora) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);

// Busca un EstadoReservacion por su ObjectId
const buscarEstado = async (estadoId) => {
    if (!isValidObjectId(estadoId)) return null;
    return await EstadoReservacion.findById(estadoId);
};

// ==================== RESERVACIONES ====================

export const listarReservaciones = async (req, res) => {
    try {
        const { usuario, restaurante, fecha } = req.query;
        const filtro = {};

        if (usuario) {
            if (!isValidUserId(usuario)) return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
            filtro.usuario = usuario.trim();
        }
        if (restaurante) {
            if (!isValidObjectId(restaurante)) return res.status(400).json({ success: false, message: 'ID de restaurante inválido' });
            filtro.restaurante = restaurante;
        }
        if (fecha) {
            const fechaDate = new Date(fecha);
            if (isNaN(fechaDate)) return res.status(400).json({ success: false, message: 'Formato de fecha inválido' });
            const inicioDia = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate());
            const finDia = new Date(inicioDia);
            finDia.setDate(finDia.getDate() + 1);
            filtro.fecha = { $gte: inicioDia, $lt: finDia };
        }

        const reservaciones = await Reservacion.find(filtro)
            .populate('estado')       // trae el objeto completo con nombre y descripción
            .populate('restaurante')
            .populate('mesa');
        res.status(200).json({ success: true, total: reservaciones.length, data: reservaciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar reservaciones', error: error.message });
    }
};

export const obtenerReservacion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de reservación inválido' });

        const reservacion = await Reservacion.findById(id)
            .populate('estado')
            .populate('restaurante')
            .populate('mesa');
        if (!reservacion) return res.status(404).json({ success: false, message: 'Reservación no encontrada' });

        res.status(200).json({ success: true, data: reservacion });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener reservación', error: error.message });
    }
};

export const crearReservacion = async (req, res) => {
    try {
        const { usuario, restaurante, mesa, fecha, hora, numPersonas, estado, observaciones, fechaExpiracion } = req.body;

        // Validaciones obligatorias
        if (!usuario || !isValidUserId(usuario)) {
            return res.status(400).json({ success: false, message: 'El usuario es obligatorio y debe ser un ID de usuario válido (máx. 16 caracteres)' });
        }
        if (!restaurante || !isValidObjectId(restaurante)) {
            return res.status(400).json({ success: false, message: 'El restaurante es obligatorio y debe ser un ID válido' });
        }
        if (mesa !== undefined && mesa !== null && mesa !== '' && !isValidObjectId(mesa)) {
            return res.status(400).json({ success: false, message: 'El ID de mesa no es válido' });
        }
        if (!fecha) {
            return res.status(400).json({ success: false, message: 'La fecha es obligatoria' });
        }
        const fechaDate = new Date(fecha);
        if (isNaN(fechaDate)) {
            return res.status(400).json({ success: false, message: 'Formato de fecha inválido' });
        }
        if (fechaDate < new Date(new Date().toDateString())) {
            return res.status(400).json({ success: false, message: 'La fecha de reservación no puede ser en el pasado' });
        }
        if (!hora) {
            return res.status(400).json({ success: false, message: 'La hora es obligatoria' });
        }
        if (!isValidHora(hora)) {
            return res.status(400).json({ success: false, message: 'Formato de hora inválido. Use HH:MM (ej: 19:30)' });
        }
        if (numPersonas === undefined || numPersonas === null) {
            return res.status(400).json({ success: false, message: 'El número de personas es obligatorio' });
        }
        if (!Number.isInteger(Number(numPersonas)) || Number(numPersonas) < 1) {
            return res.status(400).json({ success: false, message: 'El número de personas debe ser un entero mayor a 0' });
        }

        // Validar estado — debe ser un ObjectId que exista en EstadoReservacion
        if (!estado || !isValidObjectId(estado)) {
            return res.status(400).json({ success: false, message: 'El estado es obligatorio y debe ser un ID válido de EstadoReservacion' });
        }
        const estadoDoc = await buscarEstado(estado);
        if (!estadoDoc) {
            return res.status(404).json({ success: false, message: 'El estado especificado no existe. Primero créalo en /estados-reservacion' });
        }

        if (fechaExpiracion !== undefined) {
            if (isNaN(new Date(fechaExpiracion))) {
                return res.status(400).json({ success: false, message: 'Formato de fechaExpiracion inválido' });
            }
            if (new Date(fechaExpiracion) <= fechaDate) {
                return res.status(400).json({ success: false, message: 'La fecha de expiración debe ser posterior a la fecha de reservación' });
            }
        }

        // Verificar capacidad de la mesa si se proporcionó una
        if (mesa && mesa !== '') {
            const mesaDoc = await mongoose.connection.collection('mesas').findOne({ _id: new mongoose.Types.ObjectId(mesa) });
            if (!mesaDoc) {
                return res.status(404).json({ success: false, message: 'La mesa especificada no existe' });
            }
            if (Number(numPersonas) > mesaDoc.capacidad) {
                return res.status(400).json({ success: false, message: `La mesa solo tiene capacidad para ${mesaDoc.capacidad} persona(s), pero se indicaron ${numPersonas}` });
            }
        }

        // Verificar duplicado: mismo usuario, restaurante, fecha y hora (excluyendo estados CANCELADA)
        const inicioDia = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate());
        const finDia = new Date(inicioDia);
        finDia.setDate(finDia.getDate() + 1);

        // Obtener el ID del estado CANCELADA para excluirlo del chequeo de duplicados
        const estadoCancelada = await EstadoReservacion.findOne({ nombre: 'CANCELADA' });
        const filtrosDuplicado = {
            usuario: usuario.trim(),
            restaurante,
            fecha: { $gte: inicioDia, $lt: finDia },
            hora
        };
        if (estadoCancelada) {
            filtrosDuplicado.estado = { $ne: estadoCancelada._id };
        }

        const reservacionExistente = await Reservacion.findOne(filtrosDuplicado);
        if (reservacionExistente) {
            return res.status(409).json({ success: false, message: 'Ya existe una reservación para este usuario en el mismo restaurante, fecha y hora' });
        }

        const reservacion = new Reservacion({ ...req.body, usuario: usuario.trim() });
        await reservacion.save();

        // Retornar con populate para ver el estado completo
        const reservacionPopulada = await Reservacion.findById(reservacion._id)
            .populate('estado')
            .populate('restaurante')
            .populate('mesa');

        res.status(201).json({ success: true, message: 'Reservación creada exitosamente', data: reservacionPopulada });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al crear reservación', error: error.message });
    }
};

export const actualizarReservacion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de reservación inválido' });

        const reservacion = await Reservacion.findById(id).populate('estado');
        if (!reservacion) return res.status(404).json({ success: false, message: 'Reservación no encontrada' });

        // No se puede modificar una reservación cancelada o completada
        if (reservacion.estado?.nombre === 'CANCELADA' || reservacion.estado?.nombre === 'COMPLETADA') {
            return res.status(400).json({ success: false, message: `No se puede modificar una reservación en estado ${reservacion.estado.nombre}` });
        }

        // No permitir cambiar usuario ni restaurante
        if (req.body.usuario !== undefined) {
            return res.status(400).json({ success: false, message: 'No se permite modificar el campo "usuario"' });
        }
        if (req.body.restaurante !== undefined) {
            return res.status(400).json({ success: false, message: 'No se permite modificar el campo "restaurante"' });
        }

        const { mesa, fecha, hora, numPersonas, estado, fechaExpiracion } = req.body;

        if (mesa !== undefined && mesa !== null && mesa !== '' && !isValidObjectId(mesa)) {
            return res.status(400).json({ success: false, message: 'El ID de mesa no es válido' });
        }
        if (fecha !== undefined) {
            const fechaDate = new Date(fecha);
            if (isNaN(fechaDate)) return res.status(400).json({ success: false, message: 'Formato de fecha inválido' });
            if (fechaDate < new Date(new Date().toDateString())) {
                return res.status(400).json({ success: false, message: 'La fecha de reservación no puede ser en el pasado' });
            }
        }
        if (hora !== undefined && !isValidHora(hora)) {
            return res.status(400).json({ success: false, message: 'Formato de hora inválido. Use HH:MM (ej: 19:30)' });
        }
        if (numPersonas !== undefined && (!Number.isInteger(Number(numPersonas)) || Number(numPersonas) < 1)) {
            return res.status(400).json({ success: false, message: 'El número de personas debe ser un entero mayor a 0' });
        }

        // Validar nuevo estado si se envió
        if (estado !== undefined) {
            if (!isValidObjectId(estado)) {
                return res.status(400).json({ success: false, message: 'El estado debe ser un ID válido de EstadoReservacion' });
            }
            const estadoDoc = await buscarEstado(estado);
            if (!estadoDoc) {
                return res.status(404).json({ success: false, message: 'El estado especificado no existe' });
            }
        }

        if (fechaExpiracion !== undefined && isNaN(new Date(fechaExpiracion))) {
            return res.status(400).json({ success: false, message: 'Formato de fechaExpiracion inválido' });
        }

        // Verificar capacidad de mesa si se está cambiando
        if (mesa && mesa !== '') {
            const mesaDoc = await mongoose.connection.collection('mesas').findOne({ _id: new mongoose.Types.ObjectId(mesa) });
            if (!mesaDoc) {
                return res.status(404).json({ success: false, message: 'La mesa especificada no existe' });
            }
            const personasRef = numPersonas !== undefined ? Number(numPersonas) : reservacion.numPersonas;
            if (personasRef > mesaDoc.capacidad) {
                return res.status(400).json({ success: false, message: `La mesa solo tiene capacidad para ${mesaDoc.capacidad} persona(s), pero se indicaron ${personasRef}` });
            }
        }

        const reservacionActualizada = await Reservacion.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .populate('estado')
            .populate('restaurante')
            .populate('mesa');
        res.status(200).json({ success: true, message: 'Reservación actualizada exitosamente', data: reservacionActualizada });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar reservación', error: error.message });
    }
};

export const eliminarReservacion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de reservación inválido' });

        const reservacion = await Reservacion.findById(id).populate('estado');
        if (!reservacion) return res.status(404).json({ success: false, message: 'Reservación no encontrada' });

        if (reservacion.estado?.nombre === 'CONFIRMADA' || reservacion.estado?.nombre === 'COMPLETADA') {
            return res.status(400).json({ success: false, message: `No se puede eliminar una reservación en estado ${reservacion.estado.nombre}. Primero cancélala` });
        }

        await Reservacion.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Reservación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar reservación', error: error.message });
    }
};

// ==================== ESTADOS DE RESERVACIÓN ====================

export const listarEstadosReservacion = async (req, res) => {
    try {
        const estados = await EstadoReservacion.find();
        res.status(200).json({ success: true, total: estados.length, data: estados });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar estados', error: error.message });
    }
};

export const obtenerEstadoReservacion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de estado inválido' });

        const estado = await EstadoReservacion.findById(id);
        if (!estado) return res.status(404).json({ success: false, message: 'Estado no encontrado' });

        res.status(200).json({ success: true, data: estado });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener estado', error: error.message });
    }
};

export const crearEstadoReservacion = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ success: false, message: 'El nombre del estado es obligatorio' });
        }

        const ESTADOS_VALIDOS = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_SHOW'];
        if (!ESTADOS_VALIDOS.includes(nombre.trim().toUpperCase())) {
            return res.status(400).json({ success: false, message: `Nombre inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
        }

        // Verificar duplicado
        const estadoExistente = await EstadoReservacion.findOne({ nombre: nombre.trim().toUpperCase() });
        if (estadoExistente) {
            return res.status(409).json({ success: false, message: `El estado "${nombre.toUpperCase()}" ya existe` });
        }

        const estado = new EstadoReservacion({ nombre: nombre.trim().toUpperCase(), descripcion });
        await estado.save();
        res.status(201).json({ success: true, message: 'Estado creado exitosamente', data: estado });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'El estado ya existe' });
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al crear estado', error: error.message });
    }
};

export const actualizarEstadoReservacion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de estado inválido' });

        const estado = await EstadoReservacion.findById(id);
        if (!estado) return res.status(404).json({ success: false, message: 'Estado no encontrado' });

        const { nombre, descripcion } = req.body;
        const ESTADOS_VALIDOS = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_SHOW'];

        if (nombre !== undefined) {
            if (typeof nombre !== 'string' || nombre.trim() === '') {
                return res.status(400).json({ success: false, message: 'El nombre no puede estar vacío' });
            }
            if (!ESTADOS_VALIDOS.includes(nombre.trim().toUpperCase())) {
                return res.status(400).json({ success: false, message: `Nombre inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
            }
            const existe = await EstadoReservacion.findOne({ nombre: nombre.trim().toUpperCase(), _id: { $ne: id } });
            if (existe) return res.status(409).json({ success: false, message: `El estado "${nombre.toUpperCase()}" ya existe` });
        }

        const actualizado = await EstadoReservacion.findByIdAndUpdate(
            id,
            { nombre: nombre ? nombre.trim().toUpperCase() : estado.nombre, descripcion },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, message: 'Estado actualizado exitosamente', data: actualizado });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'El estado ya existe' });
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al actualizar estado', error: error.message });
    }
};

export const eliminarEstadoReservacion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de estado inválido' });

        const estado = await EstadoReservacion.findById(id);
        if (!estado) return res.status(404).json({ success: false, message: 'Estado no encontrado' });

        // Verificar que no haya reservaciones usando este estado
        const enUso = await Reservacion.countDocuments({ estado: id });
        if (enUso > 0) {
            return res.status(400).json({ success: false, message: `No se puede eliminar el estado "${estado.nombre}" porque está siendo usado por ${enUso} reservación(es)` });
        }

        await EstadoReservacion.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Estado eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar estado', error: error.message });
    }
};
