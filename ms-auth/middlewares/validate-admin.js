export const isAdmin = (req, res, next) => {
    if (req.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requiere rol de administrador.',
        });
    }
    next();
};