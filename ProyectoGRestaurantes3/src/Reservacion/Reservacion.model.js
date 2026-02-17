'use strict';

import mongoose from 'mongoose';

const estadoReservacionSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_SHOW']
    },
    descripcion: String
}, { timestamps: true, versionKey: false });

const reservacionSchema = mongoose.Schema({
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
    mesa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mesa'
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    numPersonas: {
        type: Number,
        required: true,
        min: 1
    },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_SHOW'],
        default: 'PENDIENTE'
    },
    observaciones: String,
    fechaExpiracion: Date // Para liberar la mesa si no se confirma
}, { timestamps: true, versionKey: false });

export const EstadoReservacion = mongoose.model('EstadoReservacion', estadoReservacionSchema);
export const Reservacion = mongoose.model('Reservacion', reservacionSchema);