'use strict';

import { Evento, EventoUsuario, RecursoEvento } from './evento.model.js';
import mongoose from 'mongoose';

// ==================== HELPERS ====================

// Valida ObjectId de MongoDB (para evento, restaurante, recursos)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Valida el ID de usuario del sistema SQL (STRING de hasta 16 chars, no vacío)
const isValidUserId = (id) =>
    typeof id === 'string' && id.trim().length > 0 && id.trim().length <= 16;

// ==================== EVENTOS ====================

export const listarEventos = async (req, res) => {
    try {
        const { estado, restaurante } = req.query;
        const filtro = {};
        if (estado) {
            const estadosValidos = ['PROXIMO', 'ACTIVO', 'FINALIZADO', 'CANCELADO'];
            if (!estadosValidos.includes(estado.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` });
            }
            filtro.estado = estado.toUpperCase();
        }
        if (restaurante) {
            if (!isValidObjectId(restaurante)) {
                return res.status(400).json({ success: false, message: 'ID de restaurante inválido' });
            }
            filtro.restaurante = restaurante;
        }
        const eventos = await Evento.find(filtro).populate('restaurante');
        res.status(200).json({ success: true, total: eventos.length, data: eventos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar eventos', error: error.message });
    }
};

export const obtenerEvento = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'ID de evento inválido' });
        }
        const evento = await Evento.findById(id).populate('restaurante');
        if (!evento) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.status(200).json({ success: true, data: evento });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener evento', error: error.message });
    }
};

export const crearEvento = async (req, res) => {
    try {
        const { nombre, restaurante, fechaInicio, capacidad, fechaFin, precio, estado } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });
        }
        if (!restaurante || !isValidObjectId(restaurante)) {
            return res.status(400).json({ success: false, message: 'El restaurante es obligatorio y debe ser un ID válido' });
        }
        if (!fechaInicio) {
            return res.status(400).json({ success: false, message: 'La fecha de inicio es obligatoria' });
        }
        const fechaInicioDate = new Date(fechaInicio);
        if (isNaN(fechaInicioDate)) {
            return res.status(400).json({ success: false, message: 'Formato de fecha de inicio inválido' });
        }
        if (fechaInicioDate < new Date()) {
            return res.status(400).json({ success: false, message: 'La fecha de inicio no puede ser en el pasado' });
        }
        if (fechaFin) {
            const fechaFinDate = new Date(fechaFin);
            if (isNaN(fechaFinDate)) {
                return res.status(400).json({ success: false, message: 'Formato de fecha fin inválido' });
            }
            if (fechaFinDate <= fechaInicioDate) {
                return res.status(400).json({ success: false, message: 'La fecha fin debe ser posterior a la fecha de inicio' });
            }
        }
        if (capacidad === undefined || capacidad === null) {
            return res.status(400).json({ success: false, message: 'La capacidad es obligatoria' });
        }
        if (!Number.isInteger(Number(capacidad)) || Number(capacidad) < 1) {
            return res.status(400).json({ success: false, message: 'La capacidad debe ser un número entero mayor a 0' });
        }
        if (precio !== undefined && (isNaN(Number(precio)) || Number(precio) < 0)) {
            return res.status(400).json({ success: false, message: 'El precio debe ser un número mayor o igual a 0' });
        }
        if (estado) {
            const estadosValidos = ['PROXIMO', 'ACTIVO', 'FINALIZADO', 'CANCELADO'];
            if (!estadosValidos.includes(estado.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` });
            }
        }

        // Verificar duplicado: mismo nombre en el mismo restaurante
        const eventoExistente = await Evento.findOne({ nombre: nombre.trim(), restaurante });
        if (eventoExistente) {
            return res.status(409).json({ success: false, message: `Ya existe un evento con el nombre "${nombre.trim()}" en este restaurante` });
        }

        const evento = new Evento({ ...req.body, nombre: nombre.trim() });
        await evento.save();
        res.status(201).json({ success: true, message: 'Evento creado exitosamente', data: evento });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al crear evento', error: error.message });
    }
};

export const actualizarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'ID de evento inválido' });
        }
        const evento = await Evento.findById(id);
        if (!evento) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }

        const { nombre, restaurante, fechaInicio, fechaFin, capacidad, precio, estado } = req.body;

        if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
            return res.status(400).json({ success: false, message: 'El nombre no puede estar vacío' });
        }
        if (restaurante !== undefined && !isValidObjectId(restaurante)) {
            return res.status(400).json({ success: false, message: 'ID de restaurante inválido' });
        }
        if (fechaInicio !== undefined && isNaN(new Date(fechaInicio))) {
            return res.status(400).json({ success: false, message: 'Formato de fecha de inicio inválido' });
        }
        if (fechaFin !== undefined) {
            const fechaFinDate = new Date(fechaFin);
            const fechaInicioRef = fechaInicio ? new Date(fechaInicio) : evento.fechaInicio;
            if (isNaN(fechaFinDate)) return res.status(400).json({ success: false, message: 'Formato de fecha fin inválido' });
            if (fechaFinDate <= fechaInicioRef) return res.status(400).json({ success: false, message: 'La fecha fin debe ser posterior a la fecha de inicio' });
        }
        if (capacidad !== undefined && (!Number.isInteger(Number(capacidad)) || Number(capacidad) < 1)) {
            return res.status(400).json({ success: false, message: 'La capacidad debe ser un número entero mayor a 0' });
        }
        if (precio !== undefined && (isNaN(Number(precio)) || Number(precio) < 0)) {
            return res.status(400).json({ success: false, message: 'El precio debe ser un número mayor o igual a 0' });
        }
        if (estado !== undefined) {
            const estadosValidos = ['PROXIMO', 'ACTIVO', 'FINALIZADO', 'CANCELADO'];
            if (!estadosValidos.includes(estado.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` });
            }
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('restaurante');
        res.status(200).json({ success: true, message: 'Evento actualizado exitosamente', data: eventoActualizado });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar evento', error: error.message });
    }
};

export const eliminarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'ID de evento inválido' });
        }
        const evento = await Evento.findById(id);
        if (!evento) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        await EventoUsuario.deleteMany({ evento: id });
        await RecursoEvento.deleteMany({ evento: id });
        await Evento.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Evento y sus datos relacionados eliminados exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar evento', error: error.message });
    }
};

// ==================== INSCRIPCIONES ====================

export const listarInscripciones = async (req, res) => {
    try {
        const { evento, usuario } = req.query;
        const filtro = {};
        if (evento) {
            if (!isValidObjectId(evento)) return res.status(400).json({ success: false, message: 'ID de evento inválido' });
            filtro.evento = evento;
        }
        if (usuario) {
            if (!isValidUserId(usuario)) return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
            filtro.usuario = usuario.trim();
        }
        const inscripciones = await EventoUsuario.find(filtro).populate('evento');
        res.status(200).json({ success: true, total: inscripciones.length, data: inscripciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar inscripciones', error: error.message });
    }
};

export const obtenerInscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de inscripción inválido' });
        const inscripcion = await EventoUsuario.findById(id).populate('evento');
        if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
        res.status(200).json({ success: true, data: inscripcion });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener inscripción', error: error.message });
    }
};

export const crearInscripcion = async (req, res) => {
    try {
        const { evento, usuario } = req.body;

        if (!evento || !isValidObjectId(evento)) {
            return res.status(400).json({ success: false, message: 'El evento es obligatorio y debe ser un ID de MongoDB válido' });
        }
        // usuario viene del sistema SQL → se valida como string, NO como ObjectId
        if (!usuario || !isValidUserId(usuario)) {
            return res.status(400).json({ success: false, message: 'El usuario es obligatorio y debe ser un ID de usuario válido (máx. 16 caracteres)' });
        }

        const eventoExiste = await Evento.findById(evento);
        if (!eventoExiste) {
            return res.status(404).json({ success: false, message: 'El evento especificado no existe' });
        }
        if (eventoExiste.estado === 'CANCELADO' || eventoExiste.estado === 'FINALIZADO') {
            return res.status(400).json({ success: false, message: `No se puede inscribir a un evento en estado ${eventoExiste.estado}` });
        }

        const inscritosCount = await EventoUsuario.countDocuments({ evento });
        if (inscritosCount >= eventoExiste.capacidad) {
            return res.status(400).json({ success: false, message: 'El evento ha alcanzado su capacidad máxima' });
        }

        const yaInscrito = await EventoUsuario.findOne({ evento, usuario: usuario.trim() });
        if (yaInscrito) {
            return res.status(409).json({ success: false, message: 'El usuario ya está inscrito en este evento' });
        }

        const inscripcion = new EventoUsuario({ ...req.body, usuario: usuario.trim() });
        await inscripcion.save();
        res.status(201).json({ success: true, message: 'Inscripción creada exitosamente', data: inscripcion });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al crear inscripción', error: error.message });
    }
};

export const actualizarInscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de inscripción inválido' });

        const inscripcion = await EventoUsuario.findById(id);
        if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });

        const { asistio, pagoRealizado } = req.body;

        if (asistio !== undefined && typeof asistio !== 'boolean') {
            return res.status(400).json({ success: false, message: 'El campo asistio debe ser booleano (true/false)' });
        }
        if (pagoRealizado !== undefined && typeof pagoRealizado !== 'boolean') {
            return res.status(400).json({ success: false, message: 'El campo pagoRealizado debe ser booleano (true/false)' });
        }

        // Solo se permite modificar asistencia y pago, no cambiar evento ni usuario
        const camposPermitidos = {};
        if (asistio !== undefined) camposPermitidos.asistio = asistio;
        if (pagoRealizado !== undefined) camposPermitidos.pagoRealizado = pagoRealizado;

        if (Object.keys(camposPermitidos).length === 0) {
            return res.status(400).json({ success: false, message: 'No se enviaron campos válidos para actualizar. Campos permitidos: asistio, pagoRealizado' });
        }

        const inscripcionActualizada = await EventoUsuario.findByIdAndUpdate(id, camposPermitidos, { new: true, runValidators: true }).populate('evento');
        res.status(200).json({ success: true, message: 'Inscripción actualizada exitosamente', data: inscripcionActualizada });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar inscripción', error: error.message });
    }
};

export const eliminarInscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de inscripción inválido' });
        const inscripcion = await EventoUsuario.findByIdAndDelete(id);
        if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
        res.status(200).json({ success: true, message: 'Inscripción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar inscripción', error: error.message });
    }
};

// ==================== RECURSOS ====================

export const listarRecursos = async (req, res) => {
    try {
        const { evento, tipo } = req.query;
        const filtro = {};
        if (evento) {
            if (!isValidObjectId(evento)) return res.status(400).json({ success: false, message: 'ID de evento inválido' });
            filtro.evento = evento;
        }
        if (tipo) {
            const tiposValidos = ['AUDIO', 'VIDEO', 'MOBILIARIO', 'DECORACION', 'OTRO'];
            if (!tiposValidos.includes(tipo.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Tipo inválido. Valores permitidos: ${tiposValidos.join(', ')}` });
            }
            filtro.tipo = tipo.toUpperCase();
        }
        const recursos = await RecursoEvento.find(filtro).populate('evento');
        res.status(200).json({ success: true, total: recursos.length, data: recursos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar recursos', error: error.message });
    }
};

export const obtenerRecurso = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de recurso inválido' });
        const recurso = await RecursoEvento.findById(id).populate('evento');
        if (!recurso) return res.status(404).json({ success: false, message: 'Recurso no encontrado' });
        res.status(200).json({ success: true, data: recurso });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener recurso', error: error.message });
    }
};

export const crearRecurso = async (req, res) => {
    try {
        const { evento, nombre, tipo, cantidad } = req.body;

        if (!evento || !isValidObjectId(evento)) {
            return res.status(400).json({ success: false, message: 'El evento es obligatorio y debe ser un ID válido' });
        }
        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ success: false, message: 'El nombre del recurso es obligatorio' });
        }
        if (tipo !== undefined) {
            const tiposValidos = ['AUDIO', 'VIDEO', 'MOBILIARIO', 'DECORACION', 'OTRO'];
            if (!tiposValidos.includes(tipo.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Tipo inválido. Valores permitidos: ${tiposValidos.join(', ')}` });
            }
        }
        if (cantidad !== undefined && (isNaN(Number(cantidad)) || Number(cantidad) < 0)) {
            return res.status(400).json({ success: false, message: 'La cantidad debe ser un número mayor o igual a 0' });
        }

        const eventoExiste = await Evento.findById(evento);
        if (!eventoExiste) {
            return res.status(404).json({ success: false, message: 'El evento especificado no existe' });
        }

        // Verificar duplicado: mismo nombre en el mismo evento
        const recursoExistente = await RecursoEvento.findOne({ nombre: nombre.trim(), evento });
        if (recursoExistente) {
            return res.status(409).json({ success: false, message: `Ya existe un recurso con el nombre "${nombre.trim()}" en este evento` });
        }

        const recurso = new RecursoEvento({ ...req.body, nombre: nombre.trim() });
        await recurso.save();
        res.status(201).json({ success: true, message: 'Recurso creado exitosamente', data: recurso });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al crear recurso', error: error.message });
    }
};

export const actualizarRecurso = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de recurso inválido' });

        const recurso = await RecursoEvento.findById(id);
        if (!recurso) return res.status(404).json({ success: false, message: 'Recurso no encontrado' });

        const { nombre, tipo, cantidad } = req.body;

        if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
            return res.status(400).json({ success: false, message: 'El nombre no puede estar vacío' });
        }
        if (tipo !== undefined) {
            const tiposValidos = ['AUDIO', 'VIDEO', 'MOBILIARIO', 'DECORACION', 'OTRO'];
            if (!tiposValidos.includes(tipo.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Tipo inválido. Valores permitidos: ${tiposValidos.join(', ')}` });
            }
        }
        if (cantidad !== undefined && (isNaN(Number(cantidad)) || Number(cantidad) < 0)) {
            return res.status(400).json({ success: false, message: 'La cantidad debe ser un número mayor o igual a 0' });
        }

        const recursoActualizado = await RecursoEvento.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('evento');
        res.status(200).json({ success: true, message: 'Recurso actualizado exitosamente', data: recursoActualizado });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar recurso', error: error.message });
    }
};

export const eliminarRecurso = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de recurso inválido' });
        const recurso = await RecursoEvento.findByIdAndDelete(id);
        if (!recurso) return res.status(404).json({ success: false, message: 'Recurso no encontrado' });
        res.status(200).json({ success: true, message: 'Recurso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar recurso', error: error.message });
    }
};