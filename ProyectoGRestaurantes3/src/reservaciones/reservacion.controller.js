'use strict';

import { Reservacion, EstadoReservacion } from './reservacion.model.js';

export const listarReservaciones = async (req, res) => {
    try {
        const reservaciones = await Reservacion.find()
            .populate('usuario', 'name email')
            .populate('restaurante')
            .populate('mesa');
        res.status(200).json({ success: true, data: reservaciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar reservaciones', error: error.message });
    }
};

export const crearReservacion = async (req, res) => {
    try {
        const reservacion = new Reservacion(req.body);
        await reservacion.save();
        res.status(201).json({ success: true, message: 'Reservación creada', data: reservacion });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear reservación', error: error.message });
    }
};

export const listarEstadosReservacion = async (req, res) => {
    try {
        const estados = await EstadoReservacion.find();
        res.status(200).json({ success: true, data: estados });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar estados', error: error.message });
    }
};

export const crearEstadoReservacion = async (req, res) => {
    try {
        const estado = new EstadoReservacion(req.body);
        await estado.save();
        res.status(201).json({ success: true, message: 'Estado creado', data: estado });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear estado', error: error.message });
    }
};