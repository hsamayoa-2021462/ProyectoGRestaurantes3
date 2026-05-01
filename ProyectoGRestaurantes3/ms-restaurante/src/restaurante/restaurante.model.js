'use strict';

import mongoose from 'mongoose';

const categoriaGastronomicaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es requerido'],
        unique: true,
        trim: true
    },
    descripcion: String
}, { timestamps: true, versionKey: false });

const restauranteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del restaurante es requerido'],
        trim: true
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es requerida'],
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        lowercase: true,
        trim: true
    },
    horarioApertura: String,
    horarioCierre: String,
    categorias: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriaGastronomica'
    }],
    adminUsuario: {
        type: String,
        default: null
    },
    estado: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

const mesaSchema = mongoose.Schema({
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    },
    numeroMesa: {
        type: Number,
        required: true
    },
    capacidad: {
        type: Number,
        required: true,
        min: 1
    },
    ubicacion: {
        type: String,
        enum: ['INTERIOR', 'TERRAZA', 'VIP'],
        default: 'INTERIOR'
    },
    estado: {
        type: String,
        enum: ['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO'],
        default: 'DISPONIBLE'
    }
}, { timestamps: true, versionKey: false });

const horarioDisponibilidadSchema = mongoose.Schema({
    mesa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mesa',
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    horaInicio: String,
    horaFin: String,
    disponible: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

const fotoRestauranteSchema = mongoose.Schema({
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    descripcion: String,
    principal: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });

const zonaEntregaSchema = mongoose.Schema({
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    costoEntrega: {
        type: Number,
        required: true,
        min: 0
    },
    tiempoEstimado: Number,
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

export const CategoriaGastronomica = mongoose.model('CategoriaGastronomica', categoriaGastronomicaSchema);
export const Restaurante = mongoose.model('Restaurante', restauranteSchema);
export const Mesa = mongoose.model('Mesa', mesaSchema);
export const HorarioDisponibilidad = mongoose.model('HorarioDisponibilidad', horarioDisponibilidadSchema);
export const FotoRestaurante = mongoose.model('FotoRestaurante', fotoRestauranteSchema);
export const ZonaEntrega = mongoose.model('ZonaEntrega', zonaEntregaSchema);