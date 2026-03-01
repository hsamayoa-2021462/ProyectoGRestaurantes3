'use strict';

import { CategoriaPlato, Plato, Ingrediente, Inventario } from './menu.model.js';
import { Restaurante } from '../restaurante/restaurante.model.js';
import {
    validateMongoId,
    validateQueryParams,
    validateCreateCategoriaPlato,
    validateUpdateCategoriaPlato,
    validateCreateIngrediente,
    validateUpdateIngrediente,
    validateCreatePlato,
    validateUpdatePlato,
    validateCreateInventario,
    validateUpdateInventario
} from './menu.validators.js';

// ==================== CATEGORÍAS PLATO ====================

export const listarCategoriasPlato = async (req, res) => {
    try {
        const queryErrors = validateQueryParams(req.query);
        if (queryErrors.length > 0) {
            return res.status(400).json({ success: false, message: 'Parámetros inválidos', errors: queryErrors });
        }

        const { restaurante } = req.query;
        const filter = {};

        if (restaurante) {
            const idError = validateMongoId(restaurante);
            if (idError) return res.status(400).json({ success: false, message: 'ID de restaurante inválido en el filtro' });
            filter.restaurante = restaurante;
        }

        const categorias = await CategoriaPlato.find(filter)
            .populate('restaurante')
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: categorias });
    } catch (error) {
        console.error('Error en listarCategoriasPlato:', error);
        return res.status(500).json({ success: false, message: 'Error al listar categorías', error: error.message });
    }
};

export const obtenerCategoriaPlato = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const categoria = await CategoriaPlato.findById(req.params.id).populate('restaurante');
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        return res.status(200).json({ success: true, data: categoria });
    } catch (error) {
        console.error('Error en obtenerCategoriaPlato:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener categoría', error: error.message });
    }
};

export const crearCategoriaPlato = async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateCreateCategoriaPlato(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        // Verificar que el restaurante existe
        const restaurante = await Restaurante.findById(body.restaurante);
        if (!restaurante) {
            return res.status(404).json({ success: false, message: 'El restaurante especificado no existe' });
        }

        // Verificar nombre duplicado en el mismo restaurante
        const existe = await CategoriaPlato.findOne({ nombre: body.nombre.trim(), restaurante: body.restaurante });
        if (existe) {
            return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre en este restaurante' });
        }

        const categoria = new CategoriaPlato({
            nombre:      body.nombre.trim(),
            descripcion: body.descripcion?.trim() ?? '',
            restaurante: body.restaurante
        });

        await categoria.save();

        return res.status(201).json({ success: true, message: 'Categoría creada exitosamente', data: categoria });
    } catch (error) {
        console.error('Error en crearCategoriaPlato:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' });
        }
        return res.status(500).json({ success: false, message: 'Error al crear categoría', error: error.message });
    }
};

export const actualizarCategoriaPlato = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateUpdateCategoriaPlato(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const categoria = await CategoriaPlato.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        if (body.nombre) {
            const existe = await CategoriaPlato.findOne({
                nombre:      body.nombre.trim(),
                restaurante: categoria.restaurante,
                _id:         { $ne: req.params.id }
            });
            if (existe) {
                return res.status(409).json({ success: false, message: 'Ya existe otra categoría con ese nombre en este restaurante' });
            }
        }

        const sanitized = {};
        if (body.nombre)      sanitized.nombre      = body.nombre.trim();
        if (body.descripcion) sanitized.descripcion = body.descripcion.trim();

        const updated = await CategoriaPlato.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true }).populate('restaurante');

        return res.status(200).json({ success: true, message: 'Categoría actualizada exitosamente', data: updated });
    } catch (error) {
        console.error('Error en actualizarCategoriaPlato:', error);
        return res.status(500).json({ success: false, message: 'Error al actualizar categoría', error: error.message });
    }
};

export const eliminarCategoriaPlato = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const categoria = await CategoriaPlato.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        // Verificar si hay platos usando esta categoría
        const enUso = await Plato.findOne({ categoria: req.params.id });
        if (enUso) {
            return res.status(400).json({ success: false, message: 'No se puede eliminar la categoría porque tiene platos asignados' });
        }

        await CategoriaPlato.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error en eliminarCategoriaPlato:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar categoría', error: error.message });
    }
};

// ==================== INGREDIENTES ====================

export const listarIngredientes = async (req, res) => {
    try {
        const ingredientes = await Ingrediente.find().sort({ nombre: 1 });
        return res.status(200).json({ success: true, data: ingredientes });
    } catch (error) {
        console.error('Error en listarIngredientes:', error);
        return res.status(500).json({ success: false, message: 'Error al listar ingredientes', error: error.message });
    }
};

export const obtenerIngrediente = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const ingrediente = await Ingrediente.findById(req.params.id);
        if (!ingrediente) {
            return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });
        }

        return res.status(200).json({ success: true, data: ingrediente });
    } catch (error) {
        console.error('Error en obtenerIngrediente:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener ingrediente', error: error.message });
    }
};

export const crearIngrediente = async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateCreateIngrediente(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const existe = await Ingrediente.findOne({ nombre: body.nombre.trim() });
        if (existe) {
            return res.status(409).json({ success: false, message: 'Ya existe un ingrediente con ese nombre' });
        }

        const ingrediente = new Ingrediente({
            nombre:       body.nombre.trim(),
            unidadMedida: body.unidadMedida ?? 'UNIDAD',
            costo:        body.costo ? Number(body.costo) : null
        });

        await ingrediente.save();

        return res.status(201).json({ success: true, message: 'Ingrediente creado exitosamente', data: ingrediente });
    } catch (error) {
        console.error('Error en crearIngrediente:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe un ingrediente con ese nombre' });
        }
        return res.status(500).json({ success: false, message: 'Error al crear ingrediente', error: error.message });
    }
};

export const actualizarIngrediente = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateUpdateIngrediente(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const ingrediente = await Ingrediente.findById(req.params.id);
        if (!ingrediente) {
            return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });
        }

        if (body.nombre) {
            const existe = await Ingrediente.findOne({ nombre: body.nombre.trim(), _id: { $ne: req.params.id } });
            if (existe) {
                return res.status(409).json({ success: false, message: 'Ya existe otro ingrediente con ese nombre' });
            }
        }

        const sanitized = {};
        if (body.nombre)       sanitized.nombre       = body.nombre.trim();
        if (body.unidadMedida) sanitized.unidadMedida = body.unidadMedida;
        if (body.costo)        sanitized.costo        = Number(body.costo);

        const updated = await Ingrediente.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true });

        return res.status(200).json({ success: true, message: 'Ingrediente actualizado exitosamente', data: updated });
    } catch (error) {
        console.error('Error en actualizarIngrediente:', error);
        return res.status(500).json({ success: false, message: 'Error al actualizar ingrediente', error: error.message });
    }
};

export const eliminarIngrediente = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const ingrediente = await Ingrediente.findById(req.params.id);
        if (!ingrediente) {
            return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });
        }

        // Verificar si hay inventario usando este ingrediente
        const enUso = await Inventario.findOne({ ingrediente: req.params.id });
        if (enUso) {
            return res.status(400).json({ success: false, message: 'No se puede eliminar el ingrediente porque está registrado en el inventario' });
        }

        await Ingrediente.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: 'Ingrediente eliminado exitosamente' });
    } catch (error) {
        console.error('Error en eliminarIngrediente:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar ingrediente', error: error.message });
    }
};

// ==================== PLATOS ====================

export const listarPlatos = async (req, res) => {
    try {
        const queryErrors = validateQueryParams(req.query);
        if (queryErrors.length > 0) {
            return res.status(400).json({ success: false, message: 'Parámetros inválidos', errors: queryErrors });
        }

        const { restaurante, categoria, disponible = 'true' } = req.query;

        if (disponible !== 'true' && disponible !== 'false') {
            return res.status(400).json({ success: false, message: 'El parámetro "disponible" debe ser "true" o "false"' });
        }

        const filter = { disponible: disponible === 'true' };

        if (restaurante) {
            const idError = validateMongoId(restaurante);
            if (idError) return res.status(400).json({ success: false, message: 'ID de restaurante inválido en el filtro' });
            filter.restaurante = restaurante;
        }

        if (categoria) {
            const idError = validateMongoId(categoria);
            if (idError) return res.status(400).json({ success: false, message: 'ID de categoría inválido en el filtro' });
            filter.categoria = categoria;
        }

        const platos = await Plato.find(filter)
            .populate('categoria')
            .populate('restaurante')
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: platos });
    } catch (error) {
        console.error('Error en listarPlatos:', error);
        return res.status(500).json({ success: false, message: 'Error al listar platos', error: error.message });
    }
};

export const obtenerPlato = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const plato = await Plato.findById(req.params.id).populate('categoria').populate('restaurante');
        if (!plato) {
            return res.status(404).json({ success: false, message: 'Plato no encontrado' });
        }

        return res.status(200).json({ success: true, data: plato });
    } catch (error) {
        console.error('Error en obtenerPlato:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener plato', error: error.message });
    }
};

export const crearPlato = async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateCreatePlato(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        // Verificar que el restaurante existe
        const restaurante = await Restaurante.findById(body.restaurante);
        if (!restaurante) {
            return res.status(404).json({ success: false, message: 'El restaurante especificado no existe' });
        }

        // Verificar que la categoría existe y pertenece al mismo restaurante
        const categoria = await CategoriaPlato.findById(body.categoria);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'La categoría especificada no existe' });
        }
        if (String(categoria.restaurante) !== String(body.restaurante)) {
            return res.status(400).json({ success: false, message: 'La categoría no pertenece al restaurante especificado' });
        }

        // Verificar nombre duplicado en el mismo restaurante
        const existe = await Plato.findOne({ nombre: body.nombre.trim(), restaurante: body.restaurante });
        if (existe) {
            return res.status(409).json({ success: false, message: 'Ya existe un plato con ese nombre en este restaurante' });
        }

        const plato = new Plato({
            nombre:      body.nombre.trim(),
            descripcion: body.descripcion?.trim() ?? '',
            precio:      Number(body.precio),
            categoria:   body.categoria,
            restaurante: body.restaurante,
            imagen:      body.imagen ?? null,
            disponible:  true
        });

        await plato.save();

        return res.status(201).json({ success: true, message: 'Plato creado exitosamente', data: plato });
    } catch (error) {
        console.error('Error en crearPlato:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación del modelo', errors: Object.values(error.errors).map(e => e.message) });
        }
        return res.status(500).json({ success: false, message: 'Error al crear plato', error: error.message });
    }
};

export const actualizarPlato = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateUpdatePlato(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const plato = await Plato.findById(req.params.id);
        if (!plato) {
            return res.status(404).json({ success: false, message: 'Plato no encontrado' });
        }

        // Verificar nombre duplicado si viene en el body
        if (body.nombre) {
            const existe = await Plato.findOne({ nombre: body.nombre.trim(), restaurante: plato.restaurante, _id: { $ne: req.params.id } });
            if (existe) {
                return res.status(409).json({ success: false, message: 'Ya existe otro plato con ese nombre en este restaurante' });
            }
        }

        const sanitized = {};
        if (body.nombre)                                    sanitized.nombre      = body.nombre.trim();
        if (body.descripcion)                               sanitized.descripcion = body.descripcion.trim();
        if (!isEmpty(body.precio) || body.precio === 0)    sanitized.precio      = Number(body.precio);
        if (body.categoria)                                 sanitized.categoria   = body.categoria;
        if (body.imagen)                                    sanitized.imagen      = body.imagen;
        if (body.disponible !== undefined)                  sanitized.disponible  = body.disponible;

        const updated = await Plato.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true })
            .populate('categoria')
            .populate('restaurante');

        return res.status(200).json({ success: true, message: 'Plato actualizado exitosamente', data: updated });
    } catch (error) {
        console.error('Error en actualizarPlato:', error);
        return res.status(500).json({ success: false, message: 'Error al actualizar plato', error: error.message });
    }
};

export const eliminarPlato = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const plato = await Plato.findById(req.params.id);
        if (!plato) {
            return res.status(404).json({ success: false, message: 'Plato no encontrado' });
        }

        // Soft delete — marcar como no disponible
        plato.disponible = false;
        await plato.save();

        return res.status(200).json({ success: true, message: 'Plato eliminado exitosamente' });
    } catch (error) {
        console.error('Error en eliminarPlato:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar plato', error: error.message });
    }
};

// ==================== INVENTARIO ====================

export const listarInventario = async (req, res) => {
    try {
        const { restaurante } = req.query;
        const filter = {};

        if (restaurante) {
            const idError = validateMongoId(restaurante);
            if (idError) return res.status(400).json({ success: false, message: 'ID de restaurante inválido en el filtro' });
            filter.restaurante = restaurante;
        }

        const inventario = await Inventario.find(filter)
            .populate('ingrediente')
            .populate('restaurante')
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: inventario });
    } catch (error) {
        console.error('Error en listarInventario:', error);
        return res.status(500).json({ success: false, message: 'Error al listar inventario', error: error.message });
    }
};

export const obtenerInventario = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const inventario = await Inventario.findById(req.params.id).populate('ingrediente').populate('restaurante');
        if (!inventario) {
            return res.status(404).json({ success: false, message: 'Registro de inventario no encontrado' });
        }

        return res.status(200).json({ success: true, data: inventario });
    } catch (error) {
        console.error('Error en obtenerInventario:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener inventario', error: error.message });
    }
};

export const crearInventario = async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateCreateInventario(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        // Verificar que el restaurante existe
        const restaurante = await Restaurante.findById(body.restaurante);
        if (!restaurante) {
            return res.status(404).json({ success: false, message: 'El restaurante especificado no existe' });
        }

        // Verificar que el ingrediente existe
        const ingrediente = await Ingrediente.findById(body.ingrediente);
        if (!ingrediente) {
            return res.status(404).json({ success: false, message: 'El ingrediente especificado no existe' });
        }

        // Verificar que no exista ya un inventario para ese ingrediente en ese restaurante
        const existe = await Inventario.findOne({ ingrediente: body.ingrediente, restaurante: body.restaurante });
        if (existe) {
            return res.status(409).json({ success: false, message: 'Ya existe un registro de inventario para este ingrediente en este restaurante' });
        }

        const inventario = new Inventario({
            ingrediente:    body.ingrediente,
            restaurante:    body.restaurante,
            cantidadActual: Number(body.cantidadActual),
            cantidadMinima: body.cantidadMinima ? Number(body.cantidadMinima) : 10
        });

        await inventario.save();

        return res.status(201).json({ success: true, message: 'Inventario creado exitosamente', data: inventario });
    } catch (error) {
        console.error('Error en crearInventario:', error);
        return res.status(500).json({ success: false, message: 'Error al crear inventario', error: error.message });
    }
};

export const actualizarInventario = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud no puede estar vacío' });
        }

        const errors = validateUpdateInventario(body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Error de validación', errors });
        }

        const inventario = await Inventario.findById(req.params.id);
        if (!inventario) {
            return res.status(404).json({ success: false, message: 'Registro de inventario no encontrado' });
        }

        const sanitized = {};
        if (!isEmpty(body.cantidadActual) || body.cantidadActual === 0) sanitized.cantidadActual = Number(body.cantidadActual);
        if (!isEmpty(body.cantidadMinima) || body.cantidadMinima === 0) sanitized.cantidadMinima = Number(body.cantidadMinima);

        const updated = await Inventario.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true })
            .populate('ingrediente')
            .populate('restaurante');

        return res.status(200).json({ success: true, message: 'Inventario actualizado exitosamente', data: updated });
    } catch (error) {
        console.error('Error en actualizarInventario:', error);
        return res.status(500).json({ success: false, message: 'Error al actualizar inventario', error: error.message });
    }
};

export const eliminarInventario = async (req, res) => {
    try {
        const idError = validateMongoId(req.params.id);
        if (idError) return res.status(400).json({ success: false, message: idError });

        const inventario = await Inventario.findById(req.params.id);
        if (!inventario) {
            return res.status(404).json({ success: false, message: 'Registro de inventario no encontrado' });
        }

        await Inventario.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: 'Inventario eliminado exitosamente' });
    } catch (error) {
        console.error('Error en eliminarInventario:', error);
        return res.status(500).json({ success: false, message: 'Error al eliminar inventario', error: error.message });
    }
};

// Helper interno
function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === '';
}
