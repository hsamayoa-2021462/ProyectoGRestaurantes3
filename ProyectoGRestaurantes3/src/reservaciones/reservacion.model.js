'use strict';

import mongoose from 'mongoose';

const estadoReservacionSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_SHOW'],
        uppercase: true,
        trim: true
    },
    descripcion: String
}, { timestamps: true, versionKey: false });

const reservacionSchema = mongoose.Schema({
    // El usuario viene del sistema SQL (Sequelize), su ID es un STRING(16), no un ObjectId de MongoDB
    usuario: {
        type: String,
        required: true,
        trim: true
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
    // estado ahora referencia a la colección EstadoReservacion
    estado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EstadoReservacion',
        required: true
    },
    observaciones: String,
    fechaExpiracion: Date
}, { timestamps: true, versionKey: false });

export const EstadoReservacion = mongoose.model('EstadoReservacion', estadoReservacionSchema);
export const Reservacion = mongoose.model('Reservacion', reservacionSchema);
