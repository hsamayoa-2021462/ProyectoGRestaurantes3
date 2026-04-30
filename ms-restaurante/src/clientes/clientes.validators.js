'use strict';

// ─── Helpers ────────────────────────────────────────────────────────────────

const isEmpty = (value) =>
    value === undefined || value === null || String(value).trim() === '';

const isValidEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

// Lista negra de Dominios de correo desechable
const DISPOSABLE_DOMAINS = [
    'mailinator.com',
    'tempmail.com',
    'guerrillamail.com',
    'guerrillamail.net',
    'guerrillamail.org',
    'trashmail.com',
    'trashmail.net',
    'trashmail.me',
    'yopmail.com',
    'yopmail.fr',
    'fakeinbox.com',
    'sharklasers.com',
    'spam4.me',
    'dispostable.com',
    'mailnull.com',
    'spamgourmet.com',
    'maildrop.cc',
    'throwam.com',
    'throwaway.email',
    'tempr.email',
    'discard.email',
    'cfl.ws',
    'filzmail.com',
    'drdrb.net',
    'gufum.com',
    'tmail.com',
    'mytemp.email',
    'tempinbox.com',
    'tempinbox.co.uk',
    'getairmail.com',
    'filzmail.com',
    'spambog.com',
    'spambog.ru',
    'spambog.de',
    'emailondeck.com',
    'owlpic.com',
    'burnthespam.info',
    'deadaddress.com',
    'despam.it',
    'mailexpire.com',
    'spamhereplease.com',
    'spam.la',
    'spamspot.com',
    'spamthisplease.com',
    'jetable.fr.nf',
    'noref.in',
    'nospam.ze.tc',
    'hulapla.de',
    'instant-mail.de',
    'klzlk.com',
    'spamfree24.org',
    'spamfree24.de',
    'spamfree24.eu',
    'spamfree24.info',
    'spamfree24.net'
];

const isDisposableEmail = (email) => {
    const domain = email.trim().toLowerCase().split('@')[1];
    return DISPOSABLE_DOMAINS.includes(domain);
};

// DPI guatemalteco: exactamente 13 dígitos numéricos
const isValidDPI = (dpi) => /^\d{13}$/.test(dpi);

// Teléfono guatemalteco: 8 dígitos, puede llevar prefijo +502
const isValidPhone = (phone) =>
    /^(\+502)?[2-9]\d{7}$/.test(phone.replace(/\s/g, ''));

const isValidMongoId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.#\-])[A-Za-z\d@$!%*?&_.#\-]{8,}$/.test(
        password
    );

// ─── Validador: crear usuario ────────────────────────────────────────────────

export const validateCreateUser = (data) => {
    const errors = [];

    // name
    if (isEmpty(data.name)) {
        errors.push('El nombre es requerido');
    } else if (String(data.name).trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres');
    } else if (String(data.name).trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(data.name.trim())) {
        errors.push('El nombre solo puede contener letras y espacios');
    }

    // username
    if (isEmpty(data.username)) {
        errors.push('El nombre de usuario es requerido');
    } else if (String(data.username).trim().length < 4) {
        errors.push('El username debe tener al menos 4 caracteres');
    } else if (String(data.username).trim().length > 50) {
        errors.push('El username no puede exceder 50 caracteres');
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(data.username.trim())) {
        errors.push('El username solo puede contener letras, números, guiones, puntos y guiones bajos');
    }

    // email
    if (isEmpty(data.email)) {
        errors.push('El correo electrónico es requerido');
    } else if (!isValidEmail(data.email.trim())) {
        errors.push('El correo electrónico no tiene un formato válido');
    } else if (isDisposableEmail(data.email)) {
        errors.push('No se permiten correos temporales o desechables. Usa un correo real');
    }

    // password
    if (isEmpty(data.password)) {
        errors.push('La contraseña es requerida');
    } else if (!isStrongPassword(data.password)) {
        errors.push(
            'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&_.#-)'
        );
    }

    // dpi
    if (isEmpty(data.dpi)) {
        errors.push('El DPI es requerido');
    } else if (!isValidDPI(String(data.dpi).trim())) {
        errors.push('El DPI debe contener exactamente 13 dígitos numéricos');
    }

    // phone
    if (isEmpty(data.phone)) {
        errors.push('El número de celular es requerido');
    } else if (!isValidPhone(String(data.phone).trim())) {
        errors.push('El número de celular no es válido (debe ser un número guatemalteco de 8 dígitos)');
    }

    // address
    if (isEmpty(data.address)) {
        errors.push('La dirección es requerida');
    } else if (String(data.address).trim().length < 10) {
        errors.push('La dirección debe tener al menos 10 caracteres');
    } else if (String(data.address).trim().length > 200) {
        errors.push('La dirección no puede exceder 200 caracteres');
    }

    // jobName
    if (isEmpty(data.jobName)) {
        errors.push('El nombre del trabajo es requerido');
    } else if (String(data.jobName).trim().length < 3) {
        errors.push('El nombre del trabajo debe tener al menos 3 caracteres');
    } else if (String(data.jobName).trim().length > 100) {
        errors.push('El nombre del trabajo no puede exceder 100 caracteres');
    }

    // monthlyIncome
    if (isEmpty(data.monthlyIncome)) {
        errors.push('Los ingresos mensuales son requeridos');
    } else {
        const income = Number(data.monthlyIncome);
        if (isNaN(income)) {
            errors.push('Los ingresos mensuales deben ser un número');
        } else if (income < 100) {
            errors.push('Los ingresos mensuales deben ser mayores o iguales a Q100');
        } else if (income > 9_999_999) {
            errors.push('Los ingresos mensuales ingresados no son válidos');
        }
    }

    // role — no debe venir desde el cliente, pero si viene se valida
    if (!isEmpty(data.role) && !['CLIENT', 'ADMIN'].includes(data.role)) {
        errors.push('El rol proporcionado no es válido');
    }

    return errors;
};

// ─── Validador: actualizar usuario ───────────────────────────────────────────

export const validateUpdateUser = (data) => {
    const errors = [];

    // name (opcional, pero si viene se valida)
    if (!isEmpty(data.name)) {
        if (String(data.name).trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        } else if (String(data.name).trim().length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres');
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(data.name.trim())) {
            errors.push('El nombre solo puede contener letras y espacios');
        }
    }

    // username (opcional)
    if (!isEmpty(data.username)) {
        if (String(data.username).trim().length < 4) {
            errors.push('El username debe tener al menos 4 caracteres');
        } else if (String(data.username).trim().length > 50) {
            errors.push('El username no puede exceder 50 caracteres');
        } else if (!/^[a-zA-Z0-9_.-]+$/.test(data.username.trim())) {
            errors.push('El username solo puede contener letras, números, guiones, puntos y guiones bajos');
        }
    }

    // email (opcional)
    if (!isEmpty(data.email)) {
        if (!isValidEmail(data.email.trim())) {
            errors.push('El correo electrónico no tiene un formato válido');
        } else if (isDisposableEmail(data.email)) {
            errors.push('No se permiten correos temporales o desechables. Usa un correo real');
        }
    }

    // phone (opcional)
    if (!isEmpty(data.phone)) {
        if (!isValidPhone(String(data.phone).trim())) {
            errors.push('El número de celular no es válido (debe ser un número guatemalteco de 8 dígitos)');
        }
    }

    // address (opcional)
    if (!isEmpty(data.address)) {
        if (String(data.address).trim().length < 10) {
            errors.push('La dirección debe tener al menos 10 caracteres');
        } else if (String(data.address).trim().length > 200) {
            errors.push('La dirección no puede exceder 200 caracteres');
        }
    }

    // jobName (opcional)
    if (!isEmpty(data.jobName)) {
        if (String(data.jobName).trim().length < 3) {
            errors.push('El nombre del trabajo debe tener al menos 3 caracteres');
        } else if (String(data.jobName).trim().length > 100) {
            errors.push('El nombre del trabajo no puede exceder 100 caracteres');
        }
    }

    // monthlyIncome (opcional)
    if (!isEmpty(data.monthlyIncome)) {
        const income = Number(data.monthlyIncome);
        if (isNaN(income)) {
            errors.push('Los ingresos mensuales deben ser un número');
        } else if (income < 100) {
            errors.push('Los ingresos mensuales deben ser mayores o iguales a Q100');
        } else if (income > 9_999_999) {
            errors.push('Los ingresos mensuales ingresados no son válidos');
        }
    }

    // Campos no permitidos explícitamente
    if (!isEmpty(data.dpi)) {
        errors.push('El DPI no puede ser modificado');
    }
    if (!isEmpty(data.password)) {
        errors.push('La contraseña no puede actualizarse desde este endpoint');
    }
    if (!isEmpty(data.role) && data.role === 'ADMIN') {
        errors.push('No se puede asignar el rol de administrador desde este endpoint');
    }

    // Al menos un campo válido debe venir
    const allowedFields = ['name', 'username', 'email', 'phone', 'address', 'jobName', 'monthlyIncome'];
    const hasAtLeastOne = allowedFields.some((f) => !isEmpty(data[f]));
    if (!hasAtLeastOne) {
        errors.push('Debes enviar al menos un campo válido para actualizar');
    }

    return errors;
};

// ─── Validador: parámetro ID de MongoDB ──────────────────────────────────────

export const validateMongoId = (id) => {
    if (isEmpty(id)) return 'El ID es requerido';
    if (!isValidMongoId(id)) return 'El ID proporcionado no es válido';
    return null;
};

// ─── Validador: query params de listado ──────────────────────────────────────

export const validateGetUsersQuery = (query) => {
    const errors = [];

    const { page, limit, role } = query;

    if (!isEmpty(page)) {
        const p = Number(page);
        if (!Number.isInteger(p) || p < 1) {
            errors.push('El parámetro "page" debe ser un entero mayor a 0');
        }
    }

    if (!isEmpty(limit)) {
        const l = Number(limit);
        if (!Number.isInteger(l) || l < 1 || l > 100) {
            errors.push('El parámetro "limit" debe ser un entero entre 1 y 100');
        }
    }

    if (!isEmpty(role) && !['CLIENT', 'ADMIN'].includes(role)) {
        errors.push('El rol de filtro no es válido. Usa CLIENT o ADMIN');
    }

    return errors;
};