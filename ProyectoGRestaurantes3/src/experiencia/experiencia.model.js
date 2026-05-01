'use strict';

import mongoose from 'mongoose';

const resenaSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    },
    pedido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido'
    },
    calificacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comentario: String,
    fecha: {
        type: Date,
        default: Date.now
    },
    respondida: {
        type: Boolean,
        default: false
    },
    respuesta: String
}, { timestamps: true, versionKey: false });

const promocionSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: String,
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante'
    },
    tipo: {
        type: String,
        enum: ['DESCUENTO', '2x1', 'COMBO', 'OTRO'],
        required: true
    },
    valor: Number, // porcentaje o monto fijo
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    activa: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

const cuponSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    promocion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promocion',
        required: true
    },
    descuento: {
        type: Number,
        required: true
    },
    tipoDescuento: {
        type: String,
        enum: ['PORCENTAJE', 'MONTO_FIJO'],
        default: 'PORCENTAJE'
    },
    fechaExpiracion: Date,
    usoMaximo: Number,
    usosActuales: {
        type: Number,
        default: 0
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

const cuponUsuarioSchema = mongoose.Schema({
    cupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cupon',
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fechaAsignacion: {
        type: Date,
        default: Date.now
    },
    fechaUso: Date,
    utilizado: {
        type: Boolean,
        default: false
    },
    pedido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido'
    }
}, { timestamps: true, versionKey: false });

export const Resena = mongoose.model('Resena', resenaSchema);
export const Promocion = mongoose.model('Promocion', promocionSchema);
export const Cupon = mongoose.model('Cupon', cuponSchema);
export const CuponUsuario = mongoose.model('CuponUsuario', cuponUsuarioSchema);