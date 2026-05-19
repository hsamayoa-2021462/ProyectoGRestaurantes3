'use strict';
// ms-restaurante/src/resenas/resena.controller.js

import { Resena } from './resena.model.js';

// GET /resenas/restaurante/:restId — reseñas públicas de un restaurante
export const listarResenas = async (req, res) => {
    try {
        const { restId } = req.params;
        const resenas = await Resena.find({ restaurante: restId })
            .sort({ createdAt: -1 });
        const promedio = resenas.length
            ? (resenas.reduce((s, r) => s + r.estrellas, 0) / resenas.length).toFixed(1)
            : 0;
        res.status(200).json({ success: true, data: resenas, promedio: Number(promedio), total: resenas.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar reseñas', error: error.message });
    }
};

// GET /resenas/mis-resenas — reseñas del cliente logueado
export const listarMisResenas = async (req, res) => {
    try {
        const resenas = await Resena.find({ usuario: req.userId })
            .populate('restaurante')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: resenas });
    } catch (error) {
        console.error('Error listarMisResenas:', error);
        res.status(500).json({ success: false, message: 'Error al listar reseñas', error: error.message });
    }
};

// POST /resenas — crear reseña
export const crearResena = async (req, res) => {
    try {
        const { restaurante, estrellas, comentario, pedido, nombreUsuario } = req.body;
        const usuario = req.userId;

        if (!restaurante) return res.status(400).json({ success: false, message: 'El restaurante es obligatorio' });
        if (!estrellas || estrellas < 1 || estrellas > 5) return res.status(400).json({ success: false, message: 'Las estrellas deben ser entre 1 y 5' });

        // Verificar si ya existe una reseña de este usuario para este restaurante
        const existe = await Resena.findOne({ usuario, restaurante });
        if (existe) {
            // Actualizar la reseña existente
            existe.estrellas  = estrellas;
            existe.comentario = comentario;
            if (nombreUsuario) existe.nombreUsuario = nombreUsuario;
            await existe.save();
            return res.status(200).json({ success: true, message: 'Reseña actualizada', data: existe });
        }

        const resena = new Resena({ usuario, restaurante, estrellas, comentario, pedido, nombreUsuario });
        await resena.save();
        res.status(201).json({ success: true, message: 'Reseña creada exitosamente', data: resena });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya tienes una reseña para este restaurante' });
        }
        res.status(500).json({ success: false, message: 'Error al crear reseña', error: error.message });
    }
};

// DELETE /resenas/:id — eliminar reseña propia
export const eliminarResena = async (req, res) => {
    try {
        const resena = await Resena.findById(req.params.id);
        if (!resena) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
        if (resena.usuario !== req.userId) return res.status(403).json({ success: false, message: 'No puedes eliminar esta reseña' });
        await Resena.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Reseña eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar reseña', error: error.message });
    }
};