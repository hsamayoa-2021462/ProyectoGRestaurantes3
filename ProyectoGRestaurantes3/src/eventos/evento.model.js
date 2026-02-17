'use strict';
 
import { Evento, EventoUsuario, RecursoEvento } from './evento.model.js';
 
export const listarEventos = async (req, res) => {
    try {
        const eventos = await Evento.find().populate('restaurante');
        res.status(200).json({ success: true, data: eventos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar eventos', error: error.message });
    }
};
 
export const crearEvento = async (req, res) => {
    try {
        const evento = new Evento(req.body);
        await evento.save();
        res.status(201).json({ success: true, message: 'Evento creado', data: evento });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear evento', error: error.message });
    }
};
 
export const listarInscripciones = async (req, res) => {
    try {
        const inscripciones = await EventoUsuario.find()
            .populate('evento')
            .populate('usuario', 'name email');
        res.status(200).json({ success: true, data: inscripciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar inscripciones', error: error.message });
    }
};
 
export const crearInscripcion = async (req, res) => {
    try {
        const inscripcion = new EventoUsuario(req.body);
        await inscripcion.save();
        res.status(201).json({ success: true, message: 'Inscripción creada', data: inscripcion });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear inscripción', error: error.message });
    }
};
 
export const listarRecursos = async (req, res) => {
    try {
        const recursos = await RecursoEvento.find().populate('evento');
        res.status(200).json({ success: true, data: recursos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar recursos', error: error.message });
    }
};
 
export const crearRecurso = async (req, res) => {
    try {
        const recurso = new RecursoEvento(req.body);
        await recurso.save();
        res.status(201).json({ success: true, message: 'Recurso creado', data: recurso });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear recurso', error: error.message });
    }
};
 
'use strict';
 
import mongoose from 'mongoose';
 
const eventoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: String,
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: Date,
    capacidad: {
        type: Number,
        required: true,
        min: 1
    },
    precio: {
        type: Number,
        default: 0
    },
    imagen: String,
    estado: {
        type: String,
        enum: ['PROXIMO', 'ACTIVO', 'FINALIZADO', 'CANCELADO'],
        default: 'PROXIMO'
    }
}, { timestamps: true, versionKey: false });
 
const eventoUsuarioSchema = mongoose.Schema({
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fechaInscripcion: {
        type: Date,
        default: Date.now
    },
    asistio: {
        type: Boolean,
        default: false
    },
    pagoRealizado: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });
 
const recursoEventoSchema = mongoose.Schema({
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['AUDIO', 'VIDEO', 'MOBILIARIO', 'DECORACION', 'OTRO'],
        default: 'OTRO'
    },
    cantidad: Number,
    descripcion: String
}, { timestamps: true, versionKey: false });
 
export const Evento = mongoose.model('Evento', eventoSchema);
export const EventoUsuario = mongoose.model('EventoUsuario', eventoUsuarioSchema);
export const RecursoEvento = mongoose.model('RecursoEvento', recursoEventoSchema);
 