'use strict';

import { hashPassword } from '../utils/password-utils.js';
import { User, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/roles/role.model.js';
import { generateUserId } from './uuid-generator.js';

// ── Datos del admin por defecto ──
const ADMIN_EMAIL    = 'alejandroarochavirula@gmail.com';
const ADMIN_PASSWORD = 'Admin1234!'; // contraseña por defecto
const ADMIN_NAME     = 'Alejandro';
const ADMIN_SURNAME  = 'Arocha';
const ADMIN_USERNAME = 'admin_gastro';
const ADMIN_PHONE    = '00000000';

export const ensureAdminUser = async () => {
    try {
        // 1. Buscar el rol ADMIN_ROLE
        const adminRole = await Role.findOne({ where: { Name: 'ADMIN_ROLE' } });
        if (!adminRole) {
            console.error('❌ Rol ADMIN_ROLE no encontrado en la base de datos');
            return;
        }

        // 2. Buscar si el usuario ya existe
        let user = await User.findOne({
            where: { Email: ADMIN_EMAIL.toLowerCase() },
            include: [
                { model: UserEmail, as: 'UserEmail' },
                { model: UserRole, as: 'UserRoles', include: [{ model: Role, as: 'Role' }] },
            ],
        });

        // 3. Si no existe, crearlo automáticamente
        if (!user) {
            console.log(`ℹ️  Creando usuario admin ${ADMIN_EMAIL}...`);

            const hashedPassword = await hashPassword(ADMIN_PASSWORD);
            const userId = generateUserId();

            user = await User.create({
                Id:       userId,
                Name:     ADMIN_NAME,
                Surname:  ADMIN_SURNAME,
                Username: ADMIN_USERNAME,
                Email:    ADMIN_EMAIL.toLowerCase(),
                Password: hashedPassword,
                Phone:    ADMIN_PHONE,
                Status:   true,
            });

            // Crear UserEmail verificado (sin necesidad de verificar por correo)
            await UserEmail.create({
                UserId:        userId,
                EmailVerified: true,
            });

            console.log(`✅ Usuario admin creado: ${ADMIN_EMAIL}`);
        } else {
            // Asegurarse de que Status sea true (activo)
            if (!user.Status) {
                await user.update({ Status: true });
            }
            // Asegurarse de que el email esté verificado
            if (user.UserEmail && !user.UserEmail.EmailVerified) {
                await user.UserEmail.update({ EmailVerified: true });
            }
        }

        // 4. Verificar si ya tiene ADMIN_ROLE
        const existingUserRole = await UserRole.findOne({
            where: { UserId: user.Id, RoleId: adminRole.Id }
        });

        if (existingUserRole) {
            console.log(`✅ Usuario ${ADMIN_EMAIL} ya tiene rol ADMIN_ROLE`);
            return;
        }

        // 5. Eliminar roles anteriores y asignar ADMIN_ROLE
        await UserRole.destroy({ where: { UserId: user.Id } });

        const timestamp  = Date.now().toString(36);
        const random     = Math.random().toString(36).substr(2, 5);
        const userRoleId = `ur_${timestamp}${random}`.substring(0, 16);

        await UserRole.create({
            Id:     userRoleId,
            UserId: user.Id,
            RoleId: adminRole.Id,
        });

        console.log(`✅ Usuario ${ADMIN_EMAIL} promovido a ADMIN_ROLE exitosamente`);
        console.log(`📧 Email: ${ADMIN_EMAIL}`);
        console.log(`🔑 Contraseña: ${ADMIN_PASSWORD}`);

    } catch (error) {
        console.error('❌ Error al asegurar usuario admin:', error.message);
    }
};