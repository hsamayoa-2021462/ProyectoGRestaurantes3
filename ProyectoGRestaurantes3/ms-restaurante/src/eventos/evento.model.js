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
    // El usuario viene del sistema SQL (Sequelize), su ID es un STRING(16), no un ObjectId de MongoDB
    usuario: {
        type: String,
        required: true,
        trim: true
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
