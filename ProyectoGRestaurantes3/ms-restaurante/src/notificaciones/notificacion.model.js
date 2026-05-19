'use strict';
// ms-restaurante/src/notificaciones/notificacion.model.js

import mongoose from 'mongoose';

const notificacionSchema = mongoose.Schema({
    // destinatario: ID del usuario (string de PostgreSQL) o 'admin'
    para: {
        type: String,
        required: true,
        index: true
    },
    tipo: {
        type: String,
        enum: [
            'PEDIDO_NUEVO',       // admin: cliente hizo un pedido
            'PEDIDO_CONFIRMADO',  // cliente: pedido confirmado
            'PEDIDO_PREPARANDO',  // cliente: pedido en cocina
            'PEDIDO_EN_CAMINO',   // cliente: pedido en camino
            'PEDIDO_ENTREGADO',   // cliente: pedido entregado
            'PEDIDO_CANCELADO',   // cliente: pedido cancelado
            'RESERVA_NUEVA',      // admin: cliente hizo una reservación
            'RESERVA_CONFIRMADA', // cliente: reserva confirmada
            'RESERVA_CANCELADA',  // cliente: reserva cancelada
        ],
        required: true
    },
    titulo: { type: String, required: true },
    mensaje: { type: String, required: true },
    leida: { type: Boolean, default: false },
    // Referencia al pedido o reservación relacionada
    refId: { type: String },
    refTipo: { type: String, enum: ['pedido', 'reservacion'] },
    // Datos extra para el frontend
    meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true, versionKey: false });

// Índice para traer notificaciones no leídas rápido
notificacionSchema.index({ para: 1, leida: 1, createdAt: -1 });

export const Notificacion = mongoose.model('Notificacion', notificacionSchema);