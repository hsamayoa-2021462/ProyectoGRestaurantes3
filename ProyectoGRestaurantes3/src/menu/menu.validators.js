'use strict';

// ─── Helpers ────────────────────────────────────────────────────────────────

const isEmpty = (value) =>
    value === undefined || value === null || String(value).trim() === '';

const isValidMongoId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// ─── Validador: ID de MongoDB ─────────────────────────────────────────────────

export const validateMongoId = (id) => {
    if (isEmpty(id)) return 'El ID es requerido';
    if (!isValidMongoId(id)) return 'El ID proporcionado no es válido';
    return null;
};

// ─── Validador: query params ──────────────────────────────────────────────────

export const validateQueryParams = (query) => {
    const errors = [];
    const { page, limit } = query;

    if (!isEmpty(page)) {
        const p = Number(page);
        if (!Number.isInteger(p) || p < 1 || p > 10000) {
            errors.push('El parámetro "page" debe ser un entero entre 1 y 10000');
        }
    }

    if (!isEmpty(limit)) {
        const l = Number(limit);
        if (!Number.isInteger(l) || l < 1 || l > 100) {
            errors.push('El parámetro "limit" debe ser un entero entre 1 y 100');
        }
    }

    return errors;
};

// ─── Validador: CategoriaPlato ────────────────────────────────────────────────

export const validateCreateCategoriaPlato = (data) => {
    const errors = [];

    if (isEmpty(data.nombre)) {
        errors.push('El nombre de la categoría es requerido');
    } else if (String(data.nombre).trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres');
    } else if (String(data.nombre).trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    }

    if (!isEmpty(data.descripcion) && String(data.descripcion).trim().length > 300) {
        errors.push('La descripción no puede exceder 300 caracteres');
    }

    if (isEmpty(data.restaurante)) {
        errors.push('El ID del restaurante es requerido');
    } else if (!isValidMongoId(data.restaurante)) {
        errors.push('El ID del restaurante no es válido');
    }

    return errors;
};

export const validateUpdateCategoriaPlato = (data) => {
    const errors = [];

    if (!isEmpty(data.restaurante)) {
        errors.push('El restaurante de la categoría no puede ser modificado');
    }

    if (!isEmpty(data.nombre)) {
        if (String(data.nombre).trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        } else if (String(data.nombre).trim().length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres');
        }
    }

    if (!isEmpty(data.descripcion) && String(data.descripcion).trim().length > 300) {
        errors.push('La descripción no puede exceder 300 caracteres');
    }

    const allowedFields = ['nombre', 'descripcion'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]));
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar');
    }

    return errors;
};

// ─── Validador: Ingrediente ───────────────────────────────────────────────────

export const validateCreateIngrediente = (data) => {
    const errors = [];

    if (isEmpty(data.nombre)) {
        errors.push('El nombre del ingrediente es requerido');
    } else if (String(data.nombre).trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    } else if (String(data.nombre).trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    }

    if (!isEmpty(data.unidadMedida)) {
        if (!['UNIDAD', 'GRAMOS', 'KILOS', 'LITROS', 'ML'].includes(data.unidadMedida)) {
            errors.push('La unidad de medida debe ser UNIDAD, GRAMOS, KILOS, LITROS o ML');
        }
    }

    if (!isEmpty(data.costo)) {
        const costo = Number(data.costo);
        if (isNaN(costo)) {
            errors.push('El costo debe ser un número');
        } else if (costo < 0) {
            errors.push('El costo no puede ser negativo');
        } else if (costo > 99999) {
            errors.push('El costo no puede exceder Q99,999');
        }
    }

    return errors;
};

export const validateUpdateIngrediente = (data) => {
    const errors = [];

    if (!isEmpty(data.nombre)) {
        if (String(data.nombre).trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        } else if (String(data.nombre).trim().length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres');
        }
    }

    if (!isEmpty(data.unidadMedida)) {
        if (!['UNIDAD', 'GRAMOS', 'KILOS', 'LITROS', 'ML'].includes(data.unidadMedida)) {
            errors.push('La unidad de medida debe ser UNIDAD, GRAMOS, KILOS, LITROS o ML');
        }
    }

    if (!isEmpty(data.costo)) {
        const costo = Number(data.costo);
        if (isNaN(costo)) {
            errors.push('El costo debe ser un número');
        } else if (costo < 0) {
            errors.push('El costo no puede ser negativo');
        } else if (costo > 99999) {
            errors.push('El costo no puede exceder Q99,999');
        }
    }

    const allowedFields = ['nombre', 'unidadMedida', 'costo'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]));
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar');
    }

    return errors;
};

// ─── Validador: Plato ─────────────────────────────────────────────────────────

export const validateCreatePlato = (data) => {
    const errors = [];

    if (isEmpty(data.nombre)) {
        errors.push('El nombre del plato es requerido');
    } else if (String(data.nombre).trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres');
    } else if (String(data.nombre).trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    }

    if (!isEmpty(data.descripcion) && String(data.descripcion).trim().length > 500) {
        errors.push('La descripción no puede exceder 500 caracteres');
    }

    if (isEmpty(data.precio) && data.precio !== 0) {
        errors.push('El precio del plato es requerido');
    } else {
        const precio = Number(data.precio);
        if (isNaN(precio)) {
            errors.push('El precio debe ser un número');
        } else if (precio < 0) {
            errors.push('El precio no puede ser negativo');
        } else if (precio > 99999) {
            errors.push('El precio no puede exceder Q99,999');
        }
    }

    if (isEmpty(data.categoria)) {
        errors.push('El ID de la categoría es requerido');
    } else if (!isValidMongoId(data.categoria)) {
        errors.push('El ID de la categoría no es válido');
    }

    if (isEmpty(data.restaurante)) {
        errors.push('El ID del restaurante es requerido');
    } else if (!isValidMongoId(data.restaurante)) {
        errors.push('El ID del restaurante no es válido');
    }

    if (!isEmpty(data.imagen) && !isValidUrl(data.imagen)) {
        errors.push('La imagen debe ser una URL válida (ejemplo: https://mi-imagen.com/foto.jpg)');
    }

    return errors;
};

export const validateUpdatePlato = (data) => {
    const errors = [];

    if (!isEmpty(data.restaurante)) {
        errors.push('El restaurante del plato no puede ser modificado');
    }

    if (!isEmpty(data.nombre)) {
        if (String(data.nombre).trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        } else if (String(data.nombre).trim().length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres');
        }
    }

    if (!isEmpty(data.descripcion) && String(data.descripcion).trim().length > 500) {
        errors.push('La descripción no puede exceder 500 caracteres');
    }

    if (!isEmpty(data.precio) || data.precio === 0) {
        const precio = Number(data.precio);
        if (isNaN(precio)) {
            errors.push('El precio debe ser un número');
        } else if (precio < 0) {
            errors.push('El precio no puede ser negativo');
        } else if (precio > 99999) {
            errors.push('El precio no puede exceder Q99,999');
        }
    }

    if (!isEmpty(data.categoria) && !isValidMongoId(data.categoria)) {
        errors.push('El ID de la categoría no es válido');
    }

    if (!isEmpty(data.imagen) && !isValidUrl(data.imagen)) {
        errors.push('La imagen debe ser una URL válida');
    }

    const allowedFields = ['nombre', 'descripcion', 'precio', 'categoria', 'imagen', 'disponible'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]) || data[f] === 0 || data[f] === false);
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar');
    }

    return errors;
};

// ─── Validador: Inventario ────────────────────────────────────────────────────

export const validateCreateInventario = (data) => {
    const errors = [];

    if (isEmpty(data.ingrediente)) {
        errors.push('El ID del ingrediente es requerido');
    } else if (!isValidMongoId(data.ingrediente)) {
        errors.push('El ID del ingrediente no es válido');
    }

    if (isEmpty(data.restaurante)) {
        errors.push('El ID del restaurante es requerido');
    } else if (!isValidMongoId(data.restaurante)) {
        errors.push('El ID del restaurante no es válido');
    }

    if (isEmpty(data.cantidadActual) && data.cantidadActual !== 0) {
        errors.push('La cantidad actual es requerida');
    } else {
        const cantidad = Number(data.cantidadActual);
        if (isNaN(cantidad)) {
            errors.push('La cantidad actual debe ser un número');
        } else if (cantidad < 0) {
            errors.push('La cantidad actual no puede ser negativa');
        } else if (cantidad > 999999) {
            errors.push('La cantidad actual no puede exceder 999,999');
        }
    }

    if (!isEmpty(data.cantidadMinima)) {
        const minima = Number(data.cantidadMinima);
        if (isNaN(minima)) {
            errors.push('La cantidad mínima debe ser un número');
        } else if (minima < 0) {
            errors.push('La cantidad mínima no puede ser negativa');
        } else if (minima > 999999) {
            errors.push('La cantidad mínima no puede exceder 999,999');
        }
    }

    return errors;
};

export const validateUpdateInventario = (data) => {
    const errors = [];

    // ingrediente y restaurante no se pueden cambiar
    if (!isEmpty(data.ingrediente)) {
        errors.push('El ingrediente del inventario no puede ser modificado');
    }
    if (!isEmpty(data.restaurante)) {
        errors.push('El restaurante del inventario no puede ser modificado');
    }

    if (!isEmpty(data.cantidadActual) || data.cantidadActual === 0) {
        const cantidad = Number(data.cantidadActual);
        if (isNaN(cantidad)) {
            errors.push('La cantidad actual debe ser un número');
        } else if (cantidad < 0) {
            errors.push('La cantidad actual no puede ser negativa');
        } else if (cantidad > 999999) {
            errors.push('La cantidad actual no puede exceder 999,999');
        }
    }

    if (!isEmpty(data.cantidadMinima)) {
        const minima = Number(data.cantidadMinima);
        if (isNaN(minima)) {
            errors.push('La cantidad mínima debe ser un número');
        } else if (minima < 0) {
            errors.push('La cantidad mínima no puede ser negativa');
        } else if (minima > 999999) {
            errors.push('La cantidad mínima no puede exceder 999,999');
        }
    }

    const allowedFields = ['cantidadActual', 'cantidadMinima'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]) || data[f] === 0);
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar (cantidadActual o cantidadMinima)');
    }

    return errors;
};
