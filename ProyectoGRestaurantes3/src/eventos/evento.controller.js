'use strict';
 
import { Evento, EventoUsuario, RecursoEvento } from './evento.model.js';
 
export const listarEventos = async (req, res) => {
    try {
        const eventos = await Evento.find().populate('restaurante');
        res.status(200).json({ success: true, data: eventos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar eventos', error: error.message });
    }
};
 
export const crearEvento = async (req, res) => {
    try {
        const evento = new Evento(req.body);
        await evento.save();
        res.status(201).json({ success: true, message: 'Evento creado', data: evento });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear evento', error: error.message });
    }
};
 
export const listarInscripciones = async (req, res) => {
    try {
        const inscripciones = await EventoUsuario.find()
            .populate('evento')
            .populate('usuario', 'name email');
        res.status(200).json({ success: true, data: inscripciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar inscripciones', error: error.message });
    }
};
 
export const crearInscripcion = async (req, res) => {
    try {
        const inscripcion = new EventoUsuario(req.body);
        await inscripcion.save();
        res.status(201).json({ success: true, message: 'Inscripción creada', data: inscripcion });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear inscripción', error: error.message });
    }
};
 
export const listarRecursos = async (req, res) => {
    try {
        const recursos = await RecursoEvento.find().populate('evento');
        res.status(200).json({ success: true, data: recursos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar recursos', error: error.message });
    }
};
 
export const crearRecurso = async (req, res) => {
    try {
        const recurso = new RecursoEvento(req.body);
        await recurso.save();
        res.status(201).json({ success: true, message: 'Recurso creado', data: recurso });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error al crear recurso', error: error.message });
    }
};