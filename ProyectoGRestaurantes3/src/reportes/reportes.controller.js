'use strict';

import { EstadisticaDiaria, ConfiguracionSistema, Impuesto, Idioma, Traduccion } from './reportes.model.js';

// ==================== ESTADÍSTICAS ====================
export const listarEstadisticas = async (req, res) => {
    try {
        const estadisticas = await EstadisticaDiaria.find()
            .populate('restaurante')
            .populate('platoMasVendido');
        res.status(200).json({ success: true, data: estadisticas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar estadísticas', error: error.message });
    }
};

export const crearEstadistica = async (req, res) => {
    try {
        const estadistica = new EstadisticaDiaria(req.body);
        await estadistica.save();
        res.status(201).json({ success: true, message: 'Estadística creada', data: estadistica });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear estadística', error: error.message });
    }
};

// ==================== CONFIGURACIÓN ====================
export const listarConfiguraciones = async (req, res) => {
    try {
        const configuraciones = await ConfiguracionSistema.find();
        res.status(200).json({ success: true, data: configuraciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar configuraciones', error: error.message });
    }
};

export const crearConfiguracion = async (req, res) => {
    try {
        const config = new ConfiguracionSistema(req.body);
        await config.save();
        res.status(201).json({ success: true, message: 'Configuración creada', data: config });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear configuración', error: error.message });
    }
};

// ==================== IMPUESTOS ====================
export const listarImpuestos = async (req, res) => {
    try {
        const impuestos = await Impuesto.find({ activo: true });
        res.status(200).json({ success: true, data: impuestos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar impuestos', error: error.message });
    }
};

export const crearImpuesto = async (req, res) => {
    try {
        const impuesto = new Impuesto(req.body);
        await impuesto.save();
        res.status(201).json({ success: true, message: 'Impuesto creado', data: impuesto });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear impuesto', error: error.message });
    }
};

// ==================== IDIOMAS ====================
export const listarIdiomas = async (req, res) => {
    try {
        const idiomas = await Idioma.find({ activo: true });
        res.status(200).json({ success: true, data: idiomas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar idiomas', error: error.message });
    }
};

export const crearIdioma = async (req, res) => {
    try {
        const idioma = new Idioma(req.body);
        await idioma.save();
        res.status(201).json({ success: true, message: 'Idioma creado', data: idioma });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear idioma', error: error.message });
    }
};

// ==================== TRADUCCIONES ====================
export const listarTraducciones = async (req, res) => {
    try {
        const traducciones = await Traduccion.find().populate('idioma');
        res.status(200).json({ success: true, data: traducciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar traducciones', error: error.message });
    }
};

export const crearTraduccion = async (req, res) => {
    try {
        const traduccion = new Traduccion(req.body);
        await traduccion.save();
        res.status(201).json({ success: true, message: 'Traducción creada', data: traduccion });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear traducción', error: error.message });
    }
};