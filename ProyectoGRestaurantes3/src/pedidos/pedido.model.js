'use strict';

import mongoose from 'mongoose';

const detallePedidoSchema = mongoose.Schema({
    plato: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plato',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precioUnitario: Number,
    subtotal: Number,
    observaciones: String
});

const metodoPagoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: String,
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

const pagoSchema = mongoose.Schema({
    metodoPago: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MetodoPago',
        required: true
    },
    monto: {
        type: Number,
        required: true,
        min: 0
    },
    referencia: String,
    estado: {
        type: String,
        enum: ['PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'],
        default: 'PENDIENTE'
    },
    fechaPago: Date
}, { timestamps: true, versionKey: false });

const pedidoSchema = mongoose.Schema({
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
    detalles: [detallePedidoSchema],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'],
        default: 'PENDIENTE'
    },
    tipoEntrega: {
        type: String,
        enum: ['DOMICILIO', 'RECOGER'],
        required: true
    },
    zonaEntrega: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ZonaEntrega'
    },
    direccionEntrega: {
        calle: { type: String },
        colonia: { type: String },
        ciudad: { type: String },
        departamento: { type: String },
        referencia: { type: String },
        coordenadas: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    pago: pagoSchema,
    observaciones: String
}, { timestamps: true, versionKey: false });

const facturaSchema = mongoose.Schema({
    pedido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido',
        required: true,
        unique: true
    },
    numeroFactura: {
        type: String,
        required: true,
        unique: true
    },
    nit: String,
    nombre: String,
    total: Number,
    pdfUrl: String,
    fechaEmision: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true, versionKey: false });

export const MetodoPago = mongoose.model('MetodoPago', metodoPagoSchema);
export const Pedido = mongoose.model('Pedido', pedidoSchema);
export const Factura = mongoose.model('Factura', facturaSchema);