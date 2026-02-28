'use strict';

import User from './clientes.model.js';
import bcrypt from 'bcryptjs';
import {
    validateCreateUser,
    validateUpdateUser,
    validateMongoId,
    validateGetUsersQuery
} from './clientes.validators.js';

// ─── Listar usuarios ─────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
    try {
        // Validar query params
        const queryErrors = validateGetUsersQuery(req.query);
        if (queryErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Parámetros de consulta inválidos',
                errors: queryErrors
            });
        }

        const { page = 1, limit = 10, role } = req.query;

        // isActive acepta true/false como string desde query
        let { isActive = 'true' } = req.query;
        if (isActive !== 'true' && isActive !== 'false') {
            return res.status(400).json({
                success: false,
                message: 'El parámetro "isActive" debe ser "true" o "false"'
            });
        }
        isActive = isActive === 'true';

        const filter = { isActive };
        if (role) filter.role = role;

        const parsedPage  = parseInt(page);
        const parsedLimit = parseInt(limit);

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit),
            User.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: users,
            pagination: {
                currentPage:  parsedPage,
                totalPages:   Math.ceil(total / parsedLimit),
                totalItems:   total,
                limit:        parsedLimit
            }
        });

    } catch (error) {
        console.error('Error en getUsers:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno al obtener los usuarios',
            error: error.message
        });
    }
};

// ─── Obtener usuario por ID ──────────────────────────────────────────────────

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que sea un ObjectId válido
        const idError = validateMongoId(id);
        if (idError) {
            return res.status(400).json({ success: false, message: idError });
        }

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({ success: true, data: user });

    } catch (error) {
        console.error('Error en getUserById:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno al obtener el usuario',
            error: error.message
        });
    }
};

// ─── Crear usuario ───────────────────────────────────────────────────────────

export const createUser = async (req, res) => {
    try {
        const userData = req.body;

        // Validar que el body no esté vacío
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El cuerpo de la solicitud no puede estar vacío'
            });
        }

        // Validaciones de negocio y formato
        const errors = validateCreateUser(userData);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors
            });
        }

        // Verificar duplicados antes de intentar guardar (mejor UX que esperar error de Mongo)
        const [existingEmail, existingUsername, existingDpi] = await Promise.all([
            User.findOne({ email: userData.email.trim().toLowerCase() }),
            User.findOne({ username: userData.username.trim().toLowerCase() }),
            User.findOne({ dpi: userData.dpi.trim() })
        ]);

        const duplicates = [];
        if (existingEmail)    duplicates.push('El correo electrónico ya está registrado');
        if (existingUsername) duplicates.push('El nombre de usuario ya está en uso');
        if (existingDpi)      duplicates.push('El DPI ya está registrado');

        if (duplicates.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Datos duplicados',
                errors: duplicates
            });
        }

        // Hash de contraseña
        const salt   = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(userData.password, salt);

        const newUser = new User({
            name:          userData.name.trim(),
            username:      userData.username.trim().toLowerCase(),
            dpi:           userData.dpi.trim(),
            address:       userData.address.trim(),
            phone:         userData.phone.trim(),
            email:         userData.email.trim().toLowerCase(),
            password:      hashed,
            jobName:       userData.jobName.trim(),
            monthlyIncome: Number(userData.monthlyIncome),
            role:          'CLIENT'   // siempre CLIENT desde este endpoint
        });

        const saved = await newUser.save();

        const userResponse = saved.toObject();
        delete userResponse.password;

        return res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: userResponse
        });

    } catch (error) {
        console.error('Error en createUser:', error);

        // Capturar errores de índice único de Mongoose (código 11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const fieldNames = { email: 'correo electrónico', username: 'nombre de usuario', dpi: 'DPI' };
            return res.status(409).json({
                success: false,
                message: `El ${fieldNames[field] ?? field} ya está registrado`
            });
        }

        // Errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación del modelo',
                errors
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error interno al crear el usuario',
            error: error.message
        });
    }
};

// ─── Actualizar usuario ──────────────────────────────────────────────────────

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
        const idError = validateMongoId(id);
        if (idError) {
            return res.status(400).json({ success: false, message: idError });
        }

        // Validar que el body no esté vacío
        const updateData = req.body;
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El cuerpo de la solicitud no puede estar vacío'
            });
        }

        // Validaciones de campos actualizables
        const errors = validateUpdateUser(updateData);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors
            });
        }

        // Verificar que el usuario existe y no es ADMIN
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        if (existingUser.role === 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'No se puede modificar un usuario administrador desde este endpoint'
            });
        }

        // Verificar duplicados en email / username si vienen en el body
        if (updateData.email || updateData.username) {
            const orConditions = [];
            if (updateData.email)    orConditions.push({ email:    updateData.email.trim().toLowerCase() });
            if (updateData.username) orConditions.push({ username: updateData.username.trim().toLowerCase() });

            const conflict = await User.findOne({
                $or: orConditions,
                _id: { $ne: id }    // excluir el mismo usuario
            });

            if (conflict) {
                const msg = conflict.email === updateData.email?.trim().toLowerCase()
                    ? 'El correo electrónico ya está en uso por otro usuario'
                    : 'El nombre de usuario ya está en uso por otro usuario';
                return res.status(409).json({ success: false, message: msg });
            }
        }

        // Construir objeto de actualización con campos saneados
        const sanitized = {};
        if (updateData.name)          sanitized.name          = updateData.name.trim();
        if (updateData.username)      sanitized.username      = updateData.username.trim().toLowerCase();
        if (updateData.email)         sanitized.email         = updateData.email.trim().toLowerCase();
        if (updateData.phone)         sanitized.phone         = updateData.phone.trim();
        if (updateData.address)       sanitized.address       = updateData.address.trim();
        if (updateData.jobName)       sanitized.jobName       = updateData.jobName.trim();
        if (updateData.monthlyIncome) sanitized.monthlyIncome = Number(updateData.monthlyIncome);

        const updated = await User.findByIdAndUpdate(
            id,
            sanitized,
            { new: true, runValidators: true }
        ).select('-password');

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: updated
        });

    } catch (error) {
        console.error('Error en updateUser:', error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const fieldNames = { email: 'correo electrónico', username: 'nombre de usuario' };
            return res.status(409).json({
                success: false,
                message: `El ${fieldNames[field] ?? field} ya está en uso`
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación del modelo',
                errors
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error interno al actualizar el usuario',
            error: error.message
        });
    }
};

// ─── Eliminar usuario (soft delete) ─────────────────────────────────────────

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
        const idError = validateMongoId(id);
        if (idError) {
            return res.status(400).json({ success: false, message: idError });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (user.role === 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'No se puede eliminar un usuario administrador'
            });
        }

        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya se encuentra inactivo'
            });
        }

        user.isActive = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error en deleteUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno al eliminar el usuario',
            error: error.message
        });
    }
};