'use strict';

import { Resena, Promocion, Cupon, CuponUsuario } from './experiencia.model.js';

// ==================== RESEÑAS ====================
export const listarResenas = async (req, res) => {
    try {
        const resenas = await Resena.find()
            .populate('usuario', 'name email')
            .populate('restaurante')
            .populate('pedido');
        res.status(200).json({ success: true, data: resenas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar reseñas', error: error.message });
    }
};

export const crearResena = async (req, res) => {
    try {
        const resena = new Resena(req.body);
        await resena.save();
        res.status(201).json({ success: true, message: 'Reseña creada', data: resena });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear reseña', error: error.message });
    }
};

// ==================== PROMOCIONES ====================
export const listarPromociones = async (req, res) => {
    try {
        const promociones = await Promocion.find({ activa: true }).populate('restaurante');
        res.status(200).json({ success: true, data: promociones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar promociones', error: error.message });
    }
};

export const crearPromocion = async (req, res) => {
    try {
        const promocion = new Promocion(req.body);
        await promocion.save();
        res.status(201).json({ success: true, message: 'Promoción creada', data: promocion });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear promoción', error: error.message });
    }
};

// ==================== CUPONES ====================
export const listarCupones = async (req, res) => {
    try {
        const cupones = await Cupon.find({ activo: true }).populate('promocion');
        res.status(200).json({ success: true, data: cupones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar cupones', error: error.message });
    }
};

export const crearCupon = async (req, res) => {
    try {
        const cupon = new Cupon(req.body);
        await cupon.save();
        res.status(201).json({ success: true, message: 'Cupón creado', data: cupon });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear cupón', error: error.message });
    }
};

// ==================== CUPONES USUARIO ====================
export const listarCuponesUsuario = async (req, res) => {
    try {
        const cuponesUsuario = await CuponUsuario.find()
            .populate('cupon')
            .populate('usuario', 'name email')
            .populate('pedido');
        res.status(200).json({ success: true, data: cuponesUsuario });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar cupones de usuario', error: error.message });
    }
};

export const asignarCuponUsuario = async (req, res) => {
    try {
        const cuponUsuario = new CuponUsuario(req.body);
        await cuponUsuario.save();
        res.status(201).json({ success: true, message: 'Cupón asignado', data: cuponUsuario });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al asignar cupón', error: error.message });
    }
};