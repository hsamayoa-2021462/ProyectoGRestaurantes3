'use strict';

import mongoose from 'mongoose';

const categoriaPlatoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: String,
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    }
}, { timestamps: true, versionKey: false });

const ingredienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    unidadMedida: {
        type: String,
        enum: ['UNIDAD', 'GRAMOS', 'KILOS', 'LITROS', 'ML'],
        default: 'UNIDAD'
    },
    costo: Number
}, { timestamps: true, versionKey: false });

const platoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: String,
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriaPlato',
        required: true
    },
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    },
    imagen: String
}, { timestamps: true, versionKey: false });

const platoIngredienteSchema = mongoose.Schema({
    plato: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plato',
        required: true
    },
    ingrediente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingrediente',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true, versionKey: false });

const inventarioSchema = mongoose.Schema({
    ingrediente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingrediente',
        required: true
    },
    cantidadActual: {
        type: Number,
        required: true,
        min: 0
    },
    cantidadMinima: {
        type: Number,
        default: 10
    },
    restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true
    }
}, { timestamps: true, versionKey: false });

export const CategoriaPlato = mongoose.model('CategoriaPlato', categoriaPlatoSchema);
export const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);
export const Plato = mongoose.model('Plato', platoSchema);
export const PlatoIngrediente = mongoose.model('PlatoIngrediente', platoIngredienteSchema);
export const Inventario = mongoose.model('Inventario', inventarioSchema);