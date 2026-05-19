'use strict';
// ms-restaurante/src/resenas/resena.model.js

import mongoose from 'mongoose';

const resenaSchema = mongoose.Schema({
    usuario: {
        type: String, // ID de PostgreSQL (ms-auth)
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
    estrellas: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comentario: {
        type: String,
        maxlength: 500
    },
    nombreUsuario: {
        type: String // guardado para no depender del ms-auth al mostrar
    }
}, { timestamps: true, versionKey: false });

// Un usuario solo puede reseñar una vez por restaurante
resenaSchema.index({ usuario: 1, restaurante: 1 }, { unique: true });

// Eliminar modelo cacheado para evitar OverwriteModelError con schema incorrecto
if (mongoose.models.Resena) delete mongoose.models.Resena;
export const Resena = mongoose.model('Resena', resenaSchema);