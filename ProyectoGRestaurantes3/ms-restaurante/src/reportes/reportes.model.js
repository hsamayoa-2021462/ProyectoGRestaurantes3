'use strict';

import mongoose from 'mongoose';

const estadisticaDiariaSchema = mongoose.Schema({
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    totalPedidos: {
        type: Number,
        default: 0
    },
    totalIngresos: {
        type: Number,
        default: 0
    },
    totalClientes: {
        type: Number,
        default: 0
    },
    pedidosCancelados: {
        type: Number,
        default: 0
    },
    platoMasVendido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plato'
    },
    calificacionPromedio: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, { timestamps: true, versionKey: false });

const configuracionSistemaSchema = mongoose.Schema({
    clave: {
        type: String,
        required: true,
        unique: true
    },
    valor: mongoose.Schema.Types.Mixed,
    descripcion: String,
    tipo: {
        type: String,
        enum: ['TEXTO', 'NUMERO', 'BOOLEANO', 'JSON'],
        default: 'TEXTO'
    }
}, { timestamps: true, versionKey: false });

const impuestoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    porcentaje: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    aplicableA: {
        type: String,
        enum: ['TODOS', 'PRODUCTOS', 'SERVICIOS', 'DOMICILIOS'],
        default: 'TODOS'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

const idiomaSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        minlength: 2,
        maxlength: 5
    },
    nombre: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    defecto: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });

const traduccionSchema = mongoose.Schema({
    idioma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Idioma',
        required: true
    },
    clave: {
        type: String,
        required: true
    },
    valor: {
        type: String,
        required: true
    },
    modulo: String // Ej: 'menu', 'pedidos', etc.
}, { timestamps: true, versionKey: false });

export const EstadisticaDiaria = mongoose.model('EstadisticaDiaria', estadisticaDiariaSchema);
export const ConfiguracionSistema = mongoose.model('ConfiguracionSistema', configuracionSistemaSchema);
export const Impuesto = mongoose.model('Impuesto', impuestoSchema);
export const Idioma = mongoose.model('Idioma', idiomaSchema);
export const Traduccion = mongoose.model('Traduccion', traduccionSchema);