'use strict';

// ─── Helpers ────────────────────────────────────────────────────────────────

const isEmpty = (value) =>
    value === undefined || value === null || String(value).trim() === '';

const isValidMongoId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

// Teléfono guatemalteco: 8 dígitos, puede llevar prefijo +502
const isValidPhone = (phone) =>
    /^(\+502)?[2-9]\d{7}$/.test(String(phone).replace(/\s/g, ''));

const isValidEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

// Horario formato HH:MM (00:00 - 23:59)
const isValidHorario = (horario) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(horario);

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

// ─── Validador: query params de listado ──────────────────────────────────────

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

// ─── Validador: Restaurante ───────────────────────────────────────────────────

export const validateCreateRestaurante = (data) => {
    const errors = [];

    // nombre
    if (isEmpty(data.nombre)) {
        errors.push('El nombre del restaurante es requerido');
    } else if (String(data.nombre).trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres');
    } else if (String(data.nombre).trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    }

    // direccion
    if (isEmpty(data.direccion)) {
        errors.push('La dirección es requerida');
    } else if (String(data.direccion).trim().length < 10) {
        errors.push('La dirección debe tener al menos 10 caracteres');
    } else if (String(data.direccion).trim().length > 200) {
        errors.push('La dirección no puede exceder 200 caracteres');
    }

    // telefono
    if (isEmpty(data.telefono)) {
        errors.push('El teléfono es requerido');
    } else if (!isValidPhone(data.telefono)) {
        errors.push('El teléfono no es válido (debe ser un número guatemalteco de 8 dígitos)');
    }

    // email
    if (isEmpty(data.email)) {
        errors.push('El email es requerido');
    } else if (!isValidEmail(data.email.trim())) {
        errors.push('El email no tiene un formato válido');
    }

    // horarioApertura (opcional pero si viene se valida)
    if (!isEmpty(data.horarioApertura)) {
        if (!isValidHorario(data.horarioApertura)) {
            errors.push('El horario de apertura debe tener formato HH:MM (ejemplo: 08:00)');
        }
    }

    // horarioCierre (opcional pero si viene se valida)
    if (!isEmpty(data.horarioCierre)) {
        if (!isValidHorario(data.horarioCierre)) {
            errors.push('El horario de cierre debe tener formato HH:MM (ejemplo: 22:00)');
        }
    }

    // validar que apertura sea antes que cierre si ambos vienen
    if (!isEmpty(data.horarioApertura) && !isEmpty(data.horarioCierre)) {
        if (isValidHorario(data.horarioApertura) && isValidHorario(data.horarioCierre)) {
            const [hA, mA] = data.horarioApertura.split(':').map(Number);
            const [hC, mC] = data.horarioCierre.split(':').map(Number);
            const apertura = hA * 60 + mA;
            const cierre   = hC * 60 + mC;
            if (apertura >= cierre) {
                errors.push('El horario de apertura debe ser menor al horario de cierre');
            }
        }
    }

    // categorias (opcional, pero si viene debe ser array de ObjectIds válidos)
    if (!isEmpty(data.categorias)) {
        if (!Array.isArray(data.categorias)) {
            errors.push('Las categorías deben ser un arreglo de IDs');
        } else if (data.categorias.length === 0) {
            errors.push('El arreglo de categorías no puede estar vacío');
        } else {
            const invalidIds = data.categorias.filter((id) => !isValidMongoId(id));
            if (invalidIds.length > 0) {
                errors.push('Uno o más IDs de categorías no son válidos');
            }
        }
    }

    return errors;
};

export const validateUpdateRestaurante = (data) => {
    const errors = [];

    if (isEmpty(data) || Object.keys(data).length === 0) {
        errors.push('Debes enviar al menos un campo para actualizar');
        return errors;
    }

    if (!isEmpty(data.nombre)) {
        if (String(data.nombre).trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        } else if (String(data.nombre).trim().length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres');
        }
    }

    if (!isEmpty(data.direccion)) {
        if (String(data.direccion).trim().length < 10) {
            errors.push('La dirección debe tener al menos 10 caracteres');
        } else if (String(data.direccion).trim().length > 200) {
            errors.push('La dirección no puede exceder 200 caracteres');
        }
    }

    if (!isEmpty(data.telefono)) {
        if (!isValidPhone(data.telefono)) {
            errors.push('El teléfono no es válido (debe ser un número guatemalteco de 8 dígitos)');
        }
    }

    if (!isEmpty(data.email)) {
        if (!isValidEmail(data.email.trim())) {
            errors.push('El email no tiene un formato válido');
        }
    }

    if (!isEmpty(data.horarioApertura)) {
        if (!isValidHorario(data.horarioApertura)) {
            errors.push('El horario de apertura debe tener formato HH:MM (ejemplo: 08:00)');
        }
    }

    if (!isEmpty(data.horarioCierre)) {
        if (!isValidHorario(data.horarioCierre)) {
            errors.push('El horario de cierre debe tener formato HH:MM (ejemplo: 22:00)');
        }
    }

    if (!isEmpty(data.horarioApertura) && !isEmpty(data.horarioCierre)) {
        if (isValidHorario(data.horarioApertura) && isValidHorario(data.horarioCierre)) {
            const [hA, mA] = data.horarioApertura.split(':').map(Number);
            const [hC, mC] = data.horarioCierre.split(':').map(Number);
            if ((hA * 60 + mA) >= (hC * 60 + mC)) {
                errors.push('El horario de apertura debe ser menor al horario de cierre');
            }
        }
    }

    if (!isEmpty(data.categorias)) {
        if (!Array.isArray(data.categorias)) {
            errors.push('Las categorías deben ser un arreglo de IDs');
        } else {
            const invalidIds = data.categorias.filter((id) => !isValidMongoId(id));
            if (invalidIds.length > 0) {
                errors.push('Uno o más IDs de categorías no son válidos');
            }
        }
    }

    const allowedFields = ['nombre', 'direccion', 'telefono', 'email', 'horarioApertura', 'horarioCierre', 'categorias', 'estado'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]));
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar');
    }

    return errors;
};

// ─── Validador: CategoriaGastronomica ────────────────────────────────────────

export const validateCreateCategoria = (data) => {
    const errors = [];

    if (isEmpty(data.nombre)) {
        errors.push('El nombre de la categoría es requerido');
    } else if (String(data.nombre).trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres');
    } else if (String(data.nombre).trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(data.nombre.trim())) {
        errors.push('El nombre de la categoría solo puede contener letras y espacios');
    }

    if (!isEmpty(data.descripcion)) {
        if (String(data.descripcion).trim().length > 300) {
            errors.push('La descripción no puede exceder 300 caracteres');
        }
    }

    return errors;
};

export const validateUpdateCategoria = (data) => {
    const errors = [];

    if (!isEmpty(data.nombre)) {
        if (String(data.nombre).trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        } else if (String(data.nombre).trim().length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres');
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(data.nombre.trim())) {
            errors.push('El nombre de la categoría solo puede contener letras y espacios');
        }
    }

    if (!isEmpty(data.descripcion)) {
        if (String(data.descripcion).trim().length > 300) {
            errors.push('La descripción no puede exceder 300 caracteres');
        }
    }

    const allowedFields = ['nombre', 'descripcion'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]));
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar');
    }

    return errors;
};

// ─── Validador: Mesa ──────────────────────────────────────────────────────────

export const validateCreateMesa = (data) => {
    const errors = [];

    // restaurante
    if (isEmpty(data.restaurante)) {
        errors.push('El ID del restaurante es requerido');
    } else if (!isValidMongoId(data.restaurante)) {
        errors.push('El ID del restaurante no es válido');
    }

    // numeroMesa
    if (isEmpty(data.numeroMesa)) {
        errors.push('El número de mesa es requerido');
    } else {
        const num = Number(data.numeroMesa);
        if (isNaN(num) || !Number.isInteger(num)) {
            errors.push('El número de mesa debe ser un entero');
        } else if (num < 1) {
            errors.push('El número de mesa debe ser mayor a 0');
        } else if (num > 999) {
            errors.push('El número de mesa no puede exceder 999');
        }
    }

    // capacidad
    if (isEmpty(data.capacidad)) {
        errors.push('La capacidad de la mesa es requerida');
    } else {
        const cap = Number(data.capacidad);
        if (isNaN(cap) || !Number.isInteger(cap)) {
            errors.push('La capacidad debe ser un número entero');
        } else if (cap < 1) {
            errors.push('La capacidad debe ser al menos 1 persona');
        } else if (cap > 50) {
            errors.push('La capacidad no puede exceder 50 personas');
        }
    }

    // ubicacion (opcional)
    if (!isEmpty(data.ubicacion)) {
        if (!['INTERIOR', 'TERRAZA', 'VIP'].includes(data.ubicacion)) {
            errors.push('La ubicación debe ser INTERIOR, TERRAZA o VIP');
        }
    }

    // estado (opcional)
    if (!isEmpty(data.estado)) {
        if (!['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO'].includes(data.estado)) {
            errors.push('El estado debe ser DISPONIBLE, OCUPADA, RESERVADA o MANTENIMIENTO');
        }
    }

    return errors;
};

export const validateUpdateMesa = (data) => {
    const errors = [];

    // restaurante no se puede cambiar
    if (!isEmpty(data.restaurante)) {
        errors.push('El restaurante de la mesa no puede ser modificado');
    }

    if (!isEmpty(data.numeroMesa)) {
        const num = Number(data.numeroMesa);
        if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 999) {
            errors.push('El número de mesa debe ser un entero entre 1 y 999');
        }
    }

    if (!isEmpty(data.capacidad)) {
        const cap = Number(data.capacidad);
        if (isNaN(cap) || !Number.isInteger(cap) || cap < 1 || cap > 50) {
            errors.push('La capacidad debe ser un entero entre 1 y 50');
        }
    }

    if (!isEmpty(data.ubicacion)) {
        if (!['INTERIOR', 'TERRAZA', 'VIP'].includes(data.ubicacion)) {
            errors.push('La ubicación debe ser INTERIOR, TERRAZA o VIP');
        }
    }

    if (!isEmpty(data.estado)) {
        if (!['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO'].includes(data.estado)) {
            errors.push('El estado debe ser DISPONIBLE, OCUPADA, RESERVADA o MANTENIMIENTO');
        }
    }

    const allowedFields = ['numeroMesa', 'capacidad', 'ubicacion', 'estado'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]));
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar');
    }

    return errors;
};

// ─── Validador: ZonaEntrega ───────────────────────────────────────────────────

export const validateCreateZonaEntrega = (data) => {
    const errors = [];

    // restaurante
    if (isEmpty(data.restaurante)) {
        errors.push('El ID del restaurante es requerido');
    } else if (!isValidMongoId(data.restaurante)) {
        errors.push('El ID del restaurante no es válido');
    }

    // nombre
    if (isEmpty(data.nombre)) {
        errors.push('El nombre de la zona de entrega es requerido');
    } else if (String(data.nombre).trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres');
    } else if (String(data.nombre).trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    }

    // costoEntrega
    if (isEmpty(data.costoEntrega) && data.costoEntrega !== 0) {
        errors.push('El costo de entrega es requerido');
    } else {
        const costo = Number(data.costoEntrega);
        if (isNaN(costo)) {
            errors.push('El costo de entrega debe ser un número');
        } else if (costo < 0) {
            errors.push('El costo de entrega no puede ser negativo');
        } else if (costo > 9999) {
            errors.push('El costo de entrega no puede exceder Q9,999');
        }
    }

    // tiempoEstimado (opcional)
    if (!isEmpty(data.tiempoEstimado)) {
        const tiempo = Number(data.tiempoEstimado);
        if (isNaN(tiempo) || !Number.isInteger(tiempo)) {
            errors.push('El tiempo estimado debe ser un número entero en minutos');
        } else if (tiempo < 1) {
            errors.push('El tiempo estimado debe ser al menos 1 minuto');
        } else if (tiempo > 300) {
            errors.push('El tiempo estimado no puede exceder 300 minutos');
        }
    }

    return errors;
};

export const validateUpdateZonaEntrega = (data) => {
    const errors = [];

    // restaurante no se puede cambiar
    if (!isEmpty(data.restaurante)) {
        errors.push('El restaurante de la zona no puede ser modificado');
    }

    if (!isEmpty(data.nombre)) {
        if (String(data.nombre).trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        } else if (String(data.nombre).trim().length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres');
        }
    }

    if (!isEmpty(data.costoEntrega) || data.costoEntrega === 0) {
        const costo = Number(data.costoEntrega);
        if (isNaN(costo)) {
            errors.push('El costo de entrega debe ser un número');
        } else if (costo < 0) {
            errors.push('El costo de entrega no puede ser negativo');
        } else if (costo > 9999) {
            errors.push('El costo de entrega no puede exceder Q9,999');
        }
    }

    if (!isEmpty(data.tiempoEstimado)) {
        const tiempo = Number(data.tiempoEstimado);
        if (isNaN(tiempo) || !Number.isInteger(tiempo) || tiempo < 1 || tiempo > 300) {
            errors.push('El tiempo estimado debe ser un entero entre 1 y 300 minutos');
        }
    }

    const allowedFields = ['nombre', 'costoEntrega', 'tiempoEstimado', 'activo'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]) || data[f] === 0 || data[f] === false);
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar');
    }

    return errors;
};