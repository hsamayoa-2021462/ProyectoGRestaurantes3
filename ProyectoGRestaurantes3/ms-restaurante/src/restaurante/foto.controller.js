'use strict';

import { FotoRestaurante } from './restaurante.model.js';
import { upload, handleUploadError } from '../../helpers/file-upload.js';
import { uploadImage } from '../../helpers/cloudinary-service.js';

export const subirFotoRestaurante = [
    upload.single('imagen'),
    handleUploadError,
    async (req, res) => {
        try {
            const { id } = req.params;
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No se envió ninguna imagen' });
            }

            // Subir a Cloudinary
            const url = await uploadImage(req.file.path, req.file.filename);

            // Marcar las anteriores como no principales si esta es principal
            const { principal = false } = req.body;
            if (principal) {
                await FotoRestaurante.updateMany({ restaurante: id }, { principal: false });
            }

            const foto = new FotoRestaurante({
                restaurante: id,
                url,
                descripcion: req.body.descripcion || '',
                principal: principal === 'true' || principal === true,
            });

            await foto.save();

            return res.status(201).json({ success: true, message: 'Foto subida exitosamente', data: foto });
        } catch (error) {
            console.error('Error en subirFotoRestaurante:', error);
            return res.status(500).json({ success: false, message: 'Error al subir la foto', error: error.message });
        }
    }
];

export const listarFotosRestaurante = async (req, res) => {
    try {
        const fotos = await FotoRestaurante.find({ restaurante: req.params.id }).sort({ principal: -1, createdAt: -1 });
        return res.status(200).json({ success: true, data: fotos });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al listar fotos', error: error.message });
    }
};

export const eliminarFotoRestaurante = async (req, res) => {
    try {
        const foto = await FotoRestaurante.findByIdAndDelete(req.params.fotoId);
        if (!foto) return res.status(404).json({ success: false, message: 'Foto no encontrada' });
        return res.status(200).json({ success: true, message: 'Foto eliminada' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error al eliminar foto', error: error.message });
    }
};