'use strict';

import { Restaurante, CategoriaGastronomica, Mesa, HorarioDisponibilidad, FotoRestaurante, ZonaEntrega } from './restaurante.model.js';

// ==================== RESTAURANTE ====================
export const listarRestaurantes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const restaurantes = await Restaurante.find({ estado: true })
            .populate('categorias')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Restaurante.countDocuments({ estado: true });

        res.status(200).json({
            success: true,
            data: restaurantes,
            pagination: {
                page: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar restaurantes', error: error.message });
    }
};

export const crearRestaurante = async (req, res) => {
    try {
        const restaurante = new Restaurante(req.body);
        await restaurante.save();
        res.status(201).json({ success: true, message: 'Restaurante creado', data: restaurante });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear restaurante', error: error.message });
    }
};

// ==================== CATEGORÍAS ====================
export const listarCategorias = async (req, res) => {
    try {
        const categorias = await CategoriaGastronomica.find();
        res.status(200).json({ success: true, data: categorias });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar categorías', error: error.message });
    }
};

export const crearCategoria = async (req, res) => {
    try {
        const categoria = new CategoriaGastronomica(req.body);
        await categoria.save();
        res.status(201).json({ success: true, message: 'Categoría creada', data: categoria });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear categoría', error: error.message });
    }
};

// ==================== MESAS ====================
export const listarMesas = async (req, res) => {
    try {
        const mesas = await Mesa.find().populate('restaurante');
        res.status(200).json({ success: true, data: mesas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar mesas', error: error.message });
    }
};

export const crearMesa = async (req, res) => {
    try {
        const mesa = new Mesa(req.body);
        await mesa.save();
        res.status(201).json({ success: true, message: 'Mesa creada', data: mesa });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear mesa', error: error.message });
    }
};

// ==================== ZONAS ENTREGA ====================
export const listarZonasEntrega = async (req, res) => {
    try {
        const zonas = await ZonaEntrega.find({ activo: true }).populate('restaurante');
        res.status(200).json({ success: true, data: zonas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar zonas', error: error.message });
    }
};

export const crearZonaEntrega = async (req, res) => {
    try {
        const zona = new ZonaEntrega(req.body);
        await zona.save();
        res.status(201).json({ success: true, message: 'Zona de entrega creada', data: zona });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear zona', error: error.message });
    }
};