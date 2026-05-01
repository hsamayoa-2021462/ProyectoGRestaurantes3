'use strict';

import { Restaurante, CategoriaGastronomica, Mesa, ZonaEntrega } from './restaurante.model.js';
import {
    validateMongoId,
    validateQueryParams,
    validateCreateRestaurante,
    validateUpdateRestaurante,
    validateCreateCategoria,
    validateUpdateCategoria,
    validateCreateMesa,
    validateUpdateMesa,
    validateCreateZonaEntrega,
    validateUpdateZonaEntrega
} from './restaurante.validators.js';

// ==================== RESTAURANTE ====================

export const listarRestaurantes = async (req, res) => {
    try {
        const queryErrors = validateQueryParams(req.query);
        if (queryErrors.length > 0) {
            return res.status(400).json({ success: false, message: 'Parámetros inválidos', errors: queryErrors });
        }

        const { page = 1, limit = 10 } = req.query;
        const parsedPage  = parseInt(page);
        const parsedLimit = parseInt(limit);

        const [restaurantes, total] = await Promise.all([
            Restaurante.find({ estado: true })
                .populate('categorias')
                .sort({ createdAt: -1 })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit),
            Restaurante.countDocuments({ estado: true })
        ]);

        return res.status(200).json({
            success: true,
            data: restaurantes,
            pagination: {
                currentPage: parsedPage,
                totalPages:  Math.ceil(total / parsedLimit),
                totalItems:  total,
                limit:       parsedLimit
            }
        });
    } catch (error) {
        console.error('Error en listarRestaurantes:', error);
        return res.status(500).json({ success: false, message: 'Error al listar restaurantes', error: error.message });
    }
};

export const obtenerRestaurantePorId = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const restaurante = await Restaurante.findById(req.params.id).populate('categorias');
        if (!restaurante) {
            return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        }

        return res.status(200).json({ success: true, data: restaurante });
    } catch (error) {
        console.error('Error en obtenerRestaurantePorId:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener restaurante', error: error.message });
    }
};

export const crearRestaurante = async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateCreateRestaurante(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        // Verificar nombre duplicado
        const existe = await Restaurante.findOne({ nombre: body.nombre.trim() });
        if (existe) {
            return res.status(409).json({ success: false, message: 'Ya existe un restaurante con ese nombre' });
        }

        const restaurante = new Restaurante({
            nombre:          body.nombre.trim(),
            direccion:       body.direccion.trim(),
            telefono:        body.telefono.trim(),
            email:           body.email.trim().toLowerCase(),
            horarioApertura: body.horarioApertura ?? null,
            horarioCierre:   body.horarioCierre ?? null,
            categorias:      body.categorias ?? [],
            estado:          true
        });

        await restaurante.save();

        return res.status(201).json({ success: true, message: 'Restaurante creado exitosamente', data: restaurante });
    } catch (error) {
        console.error('Error en crearRestaurante:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación del modelo', errors: Object.values(error.errors).map(e => e.message) });
        }
        return res.status(500).json({ success: false, message: 'Error al crear restaurante', error: error.message });
    }
};

export const actualizarRestaurante = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateUpdateRestaurante(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const restaurante = await Restaurante.findById(req.params.id);
        if (!restaurante) {
            return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        }

        // Verificar nombre duplicado si viene en el body
        if (body.nombre) {
            const existe = await Restaurante.findOne({ nombre: body.nombre.trim(), _id: { $ne: req.params.id } });
            if (existe) {
                return res.status(409).json({ success: false, message: 'Ya existe otro restaurante con ese nombre' });
            }
        }

        const sanitized = {};
        if (body.nombre)          sanitized.nombre          = body.nombre.trim();
        if (body.direccion)       sanitized.direccion       = body.direccion.trim();
        if (body.telefono)        sanitized.telefono        = body.telefono.trim();
        if (body.email)           sanitized.email           = body.email.trim().toLowerCase();
        if (body.horarioApertura) sanitized.horarioApertura = body.horarioApertura;
        if (body.horarioCierre)   sanitized.horarioCierre   = body.horarioCierre;
        if (body.categorias)      sanitized.categorias      = body.categorias;
        if (body.estado !== undefined) sanitized.estado     = body.estado;

        const updated = await Restaurante.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true }).populate('categorias');

        return res.status(200).json({ success: true, message: 'Restaurante actualizado exitosamente', data: updated });
    } catch (error) {
        console.error('Error en actualizarRestaurante:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación del modelo', errors: Object.values(error.errors).map(e => e.message) });
        }
        return res.status(500).json({ success: false, message: 'Error al actualizar restaurante', error: error.message });
    }
};

export const eliminarRestaurante = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const restaurante = await Restaurante.findById(req.params.id);
        if (!restaurante) {
            return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        }

        if (!restaurante.estado) {
            return res.status(400).json({ success: false, message: 'El restaurante ya se encuentra inactivo' });
        }

        restaurante.estado = false;
        await restaurante.save();

        return res.status(200).json({ success: true, message: 'Restaurante eliminado exitosamente' });
    } catch (error) {
        console.error('Error en eliminarRestaurante:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar restaurante', error: error.message });
    }
};

// ==================== CATEGORÍAS ====================

export const listarCategorias = async (req, res) => {
    try {
        const categorias = await CategoriaGastronomica.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: categorias });
    } catch (error) {
        console.error('Error en listarCategorias:', error);
        return res.status(500).json({ success: false, message: 'Error al listar categorías', error: error.message });
    }
};

export const obtenerCategoriaPorId = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const categoria = await CategoriaGastronomica.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        return res.status(200).json({ success: true, data: categoria });
    } catch (error) {
        console.error('Error en obtenerCategoriaPorId:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener categoría', error: error.message });
    }
};

export const crearCategoria = async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateCreateCategoria(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const existe = await CategoriaGastronomica.findOne({ nombre: body.nombre.trim() });
        if (existe) {
            return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' });
        }

        const categoria = new CategoriaGastronomica({
            nombre:      body.nombre.trim(),
            descripcion: body.descripcion?.trim() ?? ''
        });

        await categoria.save();

        return res.status(201).json({ success: true, message: 'Categoría creada exitosamente', data: categoria });
    } catch (error) {
        console.error('Error en crearCategoria:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' });
        }
        return res.status(500).json({ success: false, message: 'Error al crear categoría', error: error.message });
    }
};

export const actualizarCategoria = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateUpdateCategoria(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const categoria = await CategoriaGastronomica.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        if (body.nombre) {
            const existe = await CategoriaGastronomica.findOne({ nombre: body.nombre.trim(), _id: { $ne: req.params.id } });
            if (existe) {
                return res.status(409).json({ success: false, message: 'Ya existe otra categoría con ese nombre' });
            }
        }

        const sanitized = {};
        if (body.nombre)      sanitized.nombre      = body.nombre.trim();
        if (body.descripcion) sanitized.descripcion = body.descripcion.trim();

        const updated = await CategoriaGastronomica.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true });

        return res.status(200).json({ success: true, message: 'Categoría actualizada exitosamente', data: updated });
    } catch (error) {
        console.error('Error en actualizarCategoria:', error);
        return res.status(500).json({ success: false, message: 'Error al actualizar categoría', error: error.message });
    }
};

export const eliminarCategoria = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const categoria = await CategoriaGastronomica.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        // Verificar si hay restaurantes usando esta categoría
        const enUso = await Restaurante.findOne({ categorias: req.params.id });
        if (enUso) {
            return res.status(400).json({ success: false, message: 'No se puede eliminar la categoría porque está asignada a uno o más restaurantes' });
        }

        await CategoriaGastronomica.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error en eliminarCategoria:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar categoría', error: error.message });
    }
};

// ==================== MESAS ====================

export const listarMesas = async (req, res) => {
    try {
        const queryErrors = validateQueryParams(req.query);
        if (queryErrors.length > 0) {
            return res.status(400).json({ success: false, message: 'Parámetros inválidos', errors: queryErrors });
        }

        const { restaurante, estado } = req.query;
        const filter = {};

        if (restaurante) {
            const idError = validateMongoId(restaurante);
            if (idError) return res.status(400).json({ success: false, message: 'ID de restaurante inválido en el filtro' });
            filter.restaurante = restaurante;
        }

        if (estado) {
            if (!['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO'].includes(estado)) {
                return res.status(400).json({ success: false, message: 'El estado del filtro no es válido' });
            }
            filter.estado = estado;
        }

        const mesas = await Mesa.find(filter).populate('restaurante').sort({ numeroMesa: 1 });

        return res.status(200).json({ success: true, data: mesas });
    } catch (error) {
        console.error('Error en listarMesas:', error);
        return res.status(500).json({ success: false, message: 'Error al listar mesas', error: error.message });
    }
};

export const obtenerMesaPorId = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const mesa = await Mesa.findById(req.params.id).populate('restaurante');
        if (!mesa) {
            return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
        }

        return res.status(200).json({ success: true, data: mesa });
    } catch (error) {
        console.error('Error en obtenerMesaPorId:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener mesa', error: error.message });
    }
};

export const crearMesa = async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateCreateMesa(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        // Verificar que el restaurante existe
        const restaurante = await Restaurante.findById(body.restaurante);
        if (!restaurante) {
            return res.status(404).json({ success: false, message: 'El restaurante especificado no existe' });
        }

        // Verificar número de mesa duplicado en el mismo restaurante
        const mesaExiste = await Mesa.findOne({ restaurante: body.restaurante, numeroMesa: body.numeroMesa });
        if (mesaExiste) {
            return res.status(409).json({ success: false, message: `Ya existe la mesa número ${body.numeroMesa} en este restaurante` });
        }

        const mesa = new Mesa({
            restaurante: body.restaurante,
            numeroMesa:  Number(body.numeroMesa),
            capacidad:   Number(body.capacidad),
            ubicacion:   body.ubicacion ?? 'INTERIOR',
            estado:      body.estado    ?? 'DISPONIBLE'
        });

        await mesa.save();

        return res.status(201).json({ success: true, message: 'Mesa creada exitosamente', data: mesa });
    } catch (error) {
        console.error('Error en crearMesa:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación del modelo', errors: Object.values(error.errors).map(e => e.message) });
        }
        return res.status(500).json({ success: false, message: 'Error al crear mesa', error: error.message });
    }
};

export const actualizarMesa = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateUpdateMesa(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const mesa = await Mesa.findById(req.params.id);
        if (!mesa) {
            return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
        }

        // Verificar número de mesa duplicado si viene en el body
        if (body.numeroMesa) {
            const mesaExiste = await Mesa.findOne({
                restaurante: mesa.restaurante,
                numeroMesa:  body.numeroMesa,
                _id:         { $ne: req.params.id }
            });
            if (mesaExiste) {
                return res.status(409).json({ success: false, message: `Ya existe la mesa número ${body.numeroMesa} en este restaurante` });
            }
        }

        const sanitized = {};
        if (body.numeroMesa) sanitized.numeroMesa = Number(body.numeroMesa);
        if (body.capacidad)  sanitized.capacidad  = Number(body.capacidad);
        if (body.ubicacion)  sanitized.ubicacion  = body.ubicacion;
        if (body.estado)     sanitized.estado     = body.estado;

        const updated = await Mesa.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true }).populate('restaurante');

        return res.status(200).json({ success: true, message: 'Mesa actualizada exitosamente', data: updated });
    } catch (error) {
        console.error('Error en actualizarMesa:', error);
        return res.status(500).json({ success: false, message: 'Error al actualizar mesa', error: error.message });
    }
};

export const eliminarMesa = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const mesa = await Mesa.findById(req.params.id);
        if (!mesa) {
            return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
        }

        if (mesa.estado === 'OCUPADA' || mesa.estado === 'RESERVADA') {
            return res.status(400).json({ success: false, message: `No se puede eliminar la mesa porque está ${mesa.estado.toLowerCase()}` });
        }

        await Mesa.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: 'Mesa eliminada exitosamente' });
    } catch (error) {
        console.error('Error en eliminarMesa:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar mesa', error: error.message });
    }
};

// ==================== ZONAS ENTREGA ====================

export const listarZonasEntrega = async (req, res) => {
    try {
        const { restaurante } = req.query;
        const filter = { activo: true };

        if (restaurante) {
            const idError = validateMongoId(restaurante);
            if (idError) return res.status(400).json({ success: false, message: 'ID de restaurante inválido en el filtro' });
            filter.restaurante = restaurante;
        }

        const zonas = await ZonaEntrega.find(filter).populate('restaurante').sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: zonas });
    } catch (error) {
        console.error('Error en listarZonasEntrega:', error);
        return res.status(500).json({ success: false, message: 'Error al listar zonas de entrega', error: error.message });
    }
};

export const obtenerZonaEntregaPorId = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const zona = await ZonaEntrega.findById(req.params.id).populate('restaurante');
        if (!zona) {
            return res.status(404).json({ success: false, message: 'Zona de entrega no encontrada' });
        }

        return res.status(200).json({ success: true, data: zona });
    } catch (error) {
        console.error('Error en obtenerZonaEntregaPorId:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener zona de entrega', error: error.message });
    }
};

export const crearZonaEntrega = async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateCreateZonaEntrega(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        // Verificar que el restaurante existe
        const restaurante = await Restaurante.findById(body.restaurante);
        if (!restaurante) {
            return res.status(404).json({ success: false, message: 'El restaurante especificado no existe' });
        }

        // Verificar nombre duplicado en el mismo restaurante
        const zonaExiste = await ZonaEntrega.findOne({ restaurante: body.restaurante, nombre: body.nombre.trim() });
        if (zonaExiste) {
            return res.status(409).json({ success: false, message: 'Ya existe una zona con ese nombre en este restaurante' });
        }

        const zona = new ZonaEntrega({
            restaurante:    body.restaurante,
            nombre:         body.nombre.trim(),
            costoEntrega:   Number(body.costoEntrega),
            tiempoEstimado: body.tiempoEstimado ? Number(body.tiempoEstimado) : null,
            activo:         true
        });

        await zona.save();

        return res.status(201).json({ success: true, message: 'Zona de entrega creada exitosamente', data: zona });
    } catch (error) {
        console.error('Error en crearZonaEntrega:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación del modelo', errors: Object.values(error.errors).map(e => e.message) });
        }
        return res.status(500).json({ success: false, message: 'Error al crear zona de entrega', error: error.message });
    }
};

export const actualizarZonaEntrega = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateUpdateZonaEntrega(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const zona = await ZonaEntrega.findById(req.params.id);
        if (!zona) {
            return res.status(404).json({ success: false, message: 'Zona de entrega no encontrada' });
        }

        if (body.nombre) {
            const zonaExiste = await ZonaEntrega.findOne({
                restaurante: zona.restaurante,
                nombre:      body.nombre.trim(),
                _id:         { $ne: req.params.id }
            });
            if (zonaExiste) {
                return res.status(409).json({ success: false, message: 'Ya existe otra zona con ese nombre en este restaurante' });
            }
        }

        const sanitized = {};
        if (body.nombre)                                    sanitized.nombre         = body.nombre.trim();
        if (!isEmpty(body.costoEntrega) || body.costoEntrega === 0) sanitized.costoEntrega = Number(body.costoEntrega);
        if (body.tiempoEstimado)                            sanitized.tiempoEstimado = Number(body.tiempoEstimado);
        if (body.activo !== undefined)                      sanitized.activo         = body.activo;

        const updated = await ZonaEntrega.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true }).populate('restaurante');

        return res.status(200).json({ success: true, message: 'Zona de entrega actualizada exitosamente', data: updated });
    } catch (error) {
        console.error('Error en actualizarZonaEntrega:', error);
        return res.status(500).json({ success: false, message: 'Error al actualizar zona de entrega', error: error.message });
    }
};

export const eliminarZonaEntrega = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const zona = await ZonaEntrega.findById(req.params.id);
        if (!zona) {
            return res.status(404).json({ success: false, message: 'Zona de entrega no encontrada' });
        }

        if (!zona.activo) {
            return res.status(400).json({ success: false, message: 'La zona de entrega ya se encuentra inactiva' });
        }

        zona.activo = false;
        await zona.save();

        return res.status(200).json({ success: true, message: 'Zona de entrega eliminada exitosamente' });
    } catch (error) {
        console.error('Error en eliminarZonaEntrega:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar zona de entrega', error: error.message });
    }
};

// Helper interno reutilizado en actualizarZonaEntrega
function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === '';
}