'use strict';
// ms-restaurante/src/notificaciones/notificaciones.controller.js

import { Notificacion } from './notificacion.model.js';
import { getIO } from '../../configs/socket.js';

// ── Crear y emitir notificación (uso interno desde otros controllers) ──
export const crearNotificacion = async ({ para, tipo, titulo, mensaje, refId, refTipo, meta }) => {
    try {
        const notif = new Notificacion({ para, tipo, titulo, mensaje, refId, refTipo, meta });
        await notif.save();

        // Emitir por Socket.io a la sala correspondiente
        const io = getIO();
        io.to(para).emit('notificacion', {
            _id: notif._id,
            tipo, titulo, mensaje, refId, refTipo, meta,
            leida: false,
            createdAt: notif.createdAt,
        });

        return notif;
    } catch (err) {
        console.error('Error creando notificación:', err.message);
    }
};

// ── GET /notificaciones/mis-notificaciones ──
export const listarMisNotificaciones = async (req, res) => {
    try {
        const para = req.userId; // string del JWT
        const { limite = 20, soloNoLeidas = false } = req.query;

        const filtro = { para };
        if (soloNoLeidas === 'true') filtro.leida = false;

        const notificaciones = await Notificacion.find(filtro)
            .sort({ createdAt: -1 })
            .limit(Number(limite));

        const totalNoLeidas = await Notificacion.countDocuments({ para, leida: false });

        res.status(200).json({ success: true, data: notificaciones, totalNoLeidas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar notificaciones', error: error.message });
    }
};

// ── GET /notificaciones/admin ── (para admins)
export const listarNotificacionesAdmin = async (req, res) => {
    try {
        const { limite = 30, soloNoLeidas = false } = req.query;

        const filtro = { para: 'admin' };
        if (soloNoLeidas === 'true') filtro.leida = false;

        const notificaciones = await Notificacion.find(filtro)
            .sort({ createdAt: -1 })
            .limit(Number(limite));

        const totalNoLeidas = await Notificacion.countDocuments({ para: 'admin', leida: false });

        res.status(200).json({ success: true, data: notificaciones, totalNoLeidas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar notificaciones', error: error.message });
    }
};

// ── PUT /notificaciones/:id/leer ──
export const marcarLeida = async (req, res) => {
    try {
        const { id } = req.params;
        await Notificacion.findByIdAndUpdate(id, { leida: true });
        res.status(200).json({ success: true, message: 'Notificación marcada como leída' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al marcar notificación', error: error.message });
    }
};

// ── PUT /notificaciones/leer-todas ──
export const marcarTodasLeidas = async (req, res) => {
    try {
        // Puede ser el userId del cliente o 'admin'
        const para = req.query.admin === 'true' ? 'admin' : req.userId;
        await Notificacion.updateMany({ para, leida: false }, { leida: true });
        res.status(200).json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al marcar notificaciones', error: error.message });
    }
};