'use strict';

import { CategoriaPlato, Plato, Ingrediente, PlatoIngrediente, Inventario } from './menu.model.js';

// ==================== CATEGORÍAS PLATO ====================
export const listarCategoriasPlato = async (req, res) => {
    try {
        const categorias = await CategoriaPlato.find().populate('restaurante');
        res.status(200).json({ success: true, data: categorias });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar categorías', error: error.message });
    }
};

export const crearCategoriaPlato = async (req, res) => {
    try {
        const categoria = new CategoriaPlato(req.body);
        await categoria.save();
        res.status(201).json({ success: true, message: 'Categoría creada', data: categoria });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear categoría', error: error.message });
    }
};

// ==================== PLATOS ====================
export const listarPlatos = async (req, res) => {
    try {
        const platos = await Plato.find({ disponible: true })
            .populate('categoria')
            .populate('restaurante');
        res.status(200).json({ success: true, data: platos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar platos', error: error.message });
    }
};

export const crearPlato = async (req, res) => {
    try {
        const plato = new Plato(req.body);
        await plato.save();
        res.status(201).json({ success: true, message: 'Plato creado', data: plato });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear plato', error: error.message });
    }
};

// ==================== INGREDIENTES ====================
export const listarIngredientes = async (req, res) => {
    try {
        const ingredientes = await Ingrediente.find();
        res.status(200).json({ success: true, data: ingredientes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar ingredientes', error: error.message });
    }
};

export const crearIngrediente = async (req, res) => {
    try {
        const ingrediente = new Ingrediente(req.body);
        await ingrediente.save();
        res.status(201).json({ success: true, message: 'Ingrediente creado', data: ingrediente });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear ingrediente', error: error.message });
    }
};

// ==================== INVENTARIO ====================
export const listarInventario = async (req, res) => {
    try {
        const inventario = await Inventario.find().populate('ingrediente').populate('restaurante');
        res.status(200).json({ success: true, data: inventario });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar inventario', error: error.message });
    }
};

export const crearInventario = async (req, res) => {
    try {
        const inventario = new Inventario(req.body);
        await inventario.save();
        res.status(201).json({ success: true, message: 'Inventario creado', data: inventario });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear inventario', error: error.message });
    }
};