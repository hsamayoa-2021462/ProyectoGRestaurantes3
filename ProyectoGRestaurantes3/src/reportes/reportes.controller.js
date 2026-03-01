'use strict';

import { EstadisticaDiaria, ConfiguracionSistema, Impuesto, Idioma, Traduccion } from './reportes.model.js';
import mongoose from 'mongoose';

// ==================== HELPERS ====================
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==================== ESTADÍSTICAS ====================

export const listarEstadisticas = async (req, res) => {
    try {
        const { restaurante, fechaDesde, fechaHasta } = req.query;
        const filtro = {};
        if (restaurante) {
            if (!isValidObjectId(restaurante)) return res.status(400).json({ success: false, message: 'ID de restaurante inválido' });
            filtro.restaurante = restaurante;
        }
        if (fechaDesde || fechaHasta) {
            filtro.fecha = {};
            if (fechaDesde) {
                const d = new Date(fechaDesde);
                if (isNaN(d)) return res.status(400).json({ success: false, message: 'Formato de fechaDesde inválido' });
                filtro.fecha.$gte = d;
            }
            if (fechaHasta) {
                const d = new Date(fechaHasta);
                if (isNaN(d)) return res.status(400).json({ success: false, message: 'Formato de fechaHasta inválido' });
                filtro.fecha.$lte = d;
            }
        }
        const estadisticas = await EstadisticaDiaria.find(filtro)
            .populate('restaurante')
            .populate('platoMasVendido');
        res.status(200).json({ success: true, total: estadisticas.length, data: estadisticas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar estadísticas', error: error.message });
    }
};

export const obtenerEstadistica = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de estadística inválido' });
        const estadistica = await EstadisticaDiaria.findById(id)
            .populate('restaurante')
            .populate('platoMasVendido');
        if (!estadistica) return res.status(404).json({ success: false, message: 'Estadística no encontrada' });
        res.status(200).json({ success: true, data: estadistica });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener estadística', error: error.message });
    }
};

export const crearEstadistica = async (req, res) => {
    try {
        const { restaurante, fecha, totalPedidos, totalIngresos, totalClientes, pedidosCancelados, calificacionPromedio } = req.body;

        if (!restaurante || !isValidObjectId(restaurante)) {
            return res.status(400).json({ success: false, message: 'El restaurante es obligatorio y debe ser un ID válido' });
        }
        if (fecha) {
            if (isNaN(new Date(fecha))) return res.status(400).json({ success: false, message: 'Formato de fecha inválido' });
        }
        const camposNumericos = { totalPedidos, totalIngresos, totalClientes, pedidosCancelados };
        for (const [campo, valor] of Object.entries(camposNumericos)) {
            if (valor !== undefined && (isNaN(Number(valor)) || Number(valor) < 0)) {
                return res.status(400).json({ success: false, message: `El campo ${campo} debe ser un número mayor o igual a 0` });
            }
        }
        if (calificacionPromedio !== undefined) {
            const cal = Number(calificacionPromedio);
            if (isNaN(cal) || cal < 0 || cal > 5) {
                return res.status(400).json({ success: false, message: 'La calificación promedio debe estar entre 0 y 5' });
            }
        }

        // Verificar duplicado: misma fecha y mismo restaurante
        const fechaRef = fecha ? new Date(fecha) : new Date();
        const inicioDia = new Date(fechaRef.getFullYear(), fechaRef.getMonth(), fechaRef.getDate());
        const finDia = new Date(inicioDia);
        finDia.setDate(finDia.getDate() + 1);
        const estadisticaExistente = await EstadisticaDiaria.findOne({ restaurante, fecha: { $gte: inicioDia, $lt: finDia } });
        if (estadisticaExistente) {
            return res.status(409).json({ success: false, message: 'Ya existe una estadística para este restaurante en la fecha indicada' });
        }

        const estadistica = new EstadisticaDiaria(req.body);
        await estadistica.save();
        res.status(201).json({ success: true, message: 'Estadística creada exitosamente', data: estadistica });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al crear estadística', error: error.message });
    }
};

export const actualizarEstadistica = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de estadística inválido' });

        const estadistica = await EstadisticaDiaria.findById(id);
        if (!estadistica) return res.status(404).json({ success: false, message: 'Estadística no encontrada' });

        const { totalPedidos, totalIngresos, totalClientes, pedidosCancelados, calificacionPromedio } = req.body;
        const camposNumericos = { totalPedidos, totalIngresos, totalClientes, pedidosCancelados };
        for (const [campo, valor] of Object.entries(camposNumericos)) {
            if (valor !== undefined && (isNaN(Number(valor)) || Number(valor) < 0)) {
                return res.status(400).json({ success: false, message: `El campo ${campo} debe ser un número mayor o igual a 0` });
            }
        }
        if (calificacionPromedio !== undefined) {
            const cal = Number(calificacionPromedio);
            if (isNaN(cal) || cal < 0 || cal > 5) {
                return res.status(400).json({ success: false, message: 'La calificación promedio debe estar entre 0 y 5' });
            }
        }

        const actualizada = await EstadisticaDiaria.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .populate('restaurante')
            .populate('platoMasVendido');
        res.status(200).json({ success: true, message: 'Estadística actualizada exitosamente', data: actualizada });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar estadística', error: error.message });
    }
};

export const eliminarEstadistica = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de estadística inválido' });
        const estadistica = await EstadisticaDiaria.findByIdAndDelete(id);
        if (!estadistica) return res.status(404).json({ success: false, message: 'Estadística no encontrada' });
        res.status(200).json({ success: true, message: 'Estadística eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar estadística', error: error.message });
    }
};

// ==================== CONFIGURACIÓN ====================

export const listarConfiguraciones = async (req, res) => {
    try {
        const { tipo } = req.query;
        const filtro = {};
        if (tipo) {
            const tiposValidos = ['TEXTO', 'NUMERO', 'BOOLEANO', 'JSON'];
            if (!tiposValidos.includes(tipo.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Tipo inválido. Valores permitidos: ${tiposValidos.join(', ')}` });
            }
            filtro.tipo = tipo.toUpperCase();
        }
        const configuraciones = await ConfiguracionSistema.find(filtro);
        res.status(200).json({ success: true, total: configuraciones.length, data: configuraciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar configuraciones', error: error.message });
    }
};

export const obtenerConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de configuración inválido' });
        const config = await ConfiguracionSistema.findById(id);
        if (!config) return res.status(404).json({ success: false, message: 'Configuración no encontrada' });
        res.status(200).json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener configuración', error: error.message });
    }
};

export const crearConfiguracion = async (req, res) => {
    try {
        const { clave, valor, tipo } = req.body;

        if (!clave || typeof clave !== 'string' || clave.trim() === '') {
            return res.status(400).json({ success: false, message: 'La clave es obligatoria' });
        }
        if (valor === undefined || valor === null) {
            return res.status(400).json({ success: false, message: 'El valor es obligatorio' });
        }
        if (tipo !== undefined) {
            const tiposValidos = ['TEXTO', 'NUMERO', 'BOOLEANO', 'JSON'];
            if (!tiposValidos.includes(tipo.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Tipo inválido. Valores permitidos: ${tiposValidos.join(', ')}` });
            }
        }

        // Verificar clave duplicada
        const existe = await ConfiguracionSistema.findOne({ clave: clave.trim() });
        if (existe) return res.status(409).json({ success: false, message: `Ya existe una configuración con la clave "${clave}"` });

        const config = new ConfiguracionSistema({ ...req.body, clave: clave.trim() });
        await config.save();
        res.status(201).json({ success: true, message: 'Configuración creada exitosamente', data: config });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'La clave ya existe' });
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al crear configuración', error: error.message });
    }
};

export const actualizarConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de configuración inválido' });

        const config = await ConfiguracionSistema.findById(id);
        if (!config) return res.status(404).json({ success: false, message: 'Configuración no encontrada' });

        const { clave, tipo } = req.body;
        if (clave !== undefined) {
            if (typeof clave !== 'string' || clave.trim() === '') {
                return res.status(400).json({ success: false, message: 'La clave no puede estar vacía' });
            }
            const existe = await ConfiguracionSistema.findOne({ clave: clave.trim(), _id: { $ne: id } });
            if (existe) return res.status(409).json({ success: false, message: `Ya existe una configuración con la clave "${clave}"` });
        }
        if (tipo !== undefined) {
            const tiposValidos = ['TEXTO', 'NUMERO', 'BOOLEANO', 'JSON'];
            if (!tiposValidos.includes(tipo.toUpperCase())) {
                return res.status(400).json({ success: false, message: `Tipo inválido. Valores permitidos: ${tiposValidos.join(', ')}` });
            }
        }

        const actualizada = await ConfiguracionSistema.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Configuración actualizada exitosamente', data: actualizada });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'La clave ya existe' });
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al actualizar configuración', error: error.message });
    }
};

export const eliminarConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de configuración inválido' });
        const config = await ConfiguracionSistema.findByIdAndDelete(id);
        if (!config) return res.status(404).json({ success: false, message: 'Configuración no encontrada' });
        res.status(200).json({ success: true, message: 'Configuración eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar configuración', error: error.message });
    }
};

// ==================== IMPUESTOS ====================

export const listarImpuestos = async (req, res) => {
    try {
        const { activo, aplicableA } = req.query;
        const filtro = {};
        if (activo !== undefined) {
            filtro.activo = activo === 'true';
        }
        if (aplicableA) {
            const validos = ['TODOS', 'PRODUCTOS', 'SERVICIOS', 'DOMICILIOS'];
            if (!validos.includes(aplicableA.toUpperCase())) {
                return res.status(400).json({ success: false, message: `aplicableA inválido. Valores permitidos: ${validos.join(', ')}` });
            }
            filtro.aplicableA = aplicableA.toUpperCase();
        }
        const impuestos = await Impuesto.find(filtro);
        res.status(200).json({ success: true, total: impuestos.length, data: impuestos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar impuestos', error: error.message });
    }
};

export const obtenerImpuesto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de impuesto inválido' });
        const impuesto = await Impuesto.findById(id);
        if (!impuesto) return res.status(404).json({ success: false, message: 'Impuesto no encontrado' });
        res.status(200).json({ success: true, data: impuesto });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener impuesto', error: error.message });
    }
};

export const crearImpuesto = async (req, res) => {
    try {
        const { nombre, porcentaje, aplicableA } = req.body;

        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ success: false, message: 'El nombre del impuesto es obligatorio' });
        }
        if (porcentaje === undefined || porcentaje === null) {
            return res.status(400).json({ success: false, message: 'El porcentaje es obligatorio' });
        }
        const pct = Number(porcentaje);
        if (isNaN(pct) || pct < 0 || pct > 100) {
            return res.status(400).json({ success: false, message: 'El porcentaje debe estar entre 0 y 100' });
        }
        if (aplicableA !== undefined) {
            const validos = ['TODOS', 'PRODUCTOS', 'SERVICIOS', 'DOMICILIOS'];
            if (!validos.includes(aplicableA.toUpperCase())) {
                return res.status(400).json({ success: false, message: `aplicableA inválido. Valores permitidos: ${validos.join(', ')}` });
            }
        }

        // Verificar duplicado: mismo nombre de impuesto
        const impuestoExistente = await Impuesto.findOne({ nombre: nombre.trim() });
        if (impuestoExistente) {
            return res.status(409).json({ success: false, message: `Ya existe un impuesto con el nombre "${nombre.trim()}"` });
        }

        const impuesto = new Impuesto({ ...req.body, nombre: nombre.trim() });
        await impuesto.save();
        res.status(201).json({ success: true, message: 'Impuesto creado exitosamente', data: impuesto });
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al crear impuesto', error: error.message });
    }
};

export const actualizarImpuesto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de impuesto inválido' });

        const impuesto = await Impuesto.findById(id);
        if (!impuesto) return res.status(404).json({ success: false, message: 'Impuesto no encontrado' });

        const { nombre, porcentaje, aplicableA } = req.body;
        if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
            return res.status(400).json({ success: false, message: 'El nombre no puede estar vacío' });
        }
        if (porcentaje !== undefined) {
            const pct = Number(porcentaje);
            if (isNaN(pct) || pct < 0 || pct > 100) {
                return res.status(400).json({ success: false, message: 'El porcentaje debe estar entre 0 y 100' });
            }
        }
        if (aplicableA !== undefined) {
            const validos = ['TODOS', 'PRODUCTOS', 'SERVICIOS', 'DOMICILIOS'];
            if (!validos.includes(aplicableA.toUpperCase())) {
                return res.status(400).json({ success: false, message: `aplicableA inválido. Valores permitidos: ${validos.join(', ')}` });
            }
        }

        const actualizado = await Impuesto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Impuesto actualizado exitosamente', data: actualizado });
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al actualizar impuesto', error: error.message });
    }
};

export const eliminarImpuesto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de impuesto inválido' });
        const impuesto = await Impuesto.findByIdAndDelete(id);
        if (!impuesto) return res.status(404).json({ success: false, message: 'Impuesto no encontrado' });
        res.status(200).json({ success: true, message: 'Impuesto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar impuesto', error: error.message });
    }
};

// ==================== IDIOMAS ====================

export const listarIdiomas = async (req, res) => {
    try {
        const { activo } = req.query;
        const filtro = {};
        if (activo !== undefined) filtro.activo = activo === 'true';
        const idiomas = await Idioma.find(filtro);
        res.status(200).json({ success: true, total: idiomas.length, data: idiomas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar idiomas', error: error.message });
    }
};

export const obtenerIdioma = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de idioma inválido' });
        const idioma = await Idioma.findById(id);
        if (!idioma) return res.status(404).json({ success: false, message: 'Idioma no encontrado' });
        res.status(200).json({ success: true, data: idioma });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener idioma', error: error.message });
    }
};

export const crearIdioma = async (req, res) => {
    try {
        const { codigo, nombre } = req.body;

        if (!codigo || typeof codigo !== 'string' || codigo.trim() === '') {
            return res.status(400).json({ success: false, message: 'El código del idioma es obligatorio' });
        }
        if (codigo.trim().length < 2 || codigo.trim().length > 5) {
            return res.status(400).json({ success: false, message: 'El código debe tener entre 2 y 5 caracteres' });
        }
        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ success: false, message: 'El nombre del idioma es obligatorio' });
        }

        // Verificar código duplicado
        const existe = await Idioma.findOne({ codigo: codigo.trim().toUpperCase() });
        if (existe) return res.status(409).json({ success: false, message: `Ya existe un idioma con el código "${codigo.toUpperCase()}"` });

        // Si se marca como defecto, quitar defecto de otros
        if (req.body.defecto === true) {
            await Idioma.updateMany({ defecto: true }, { defecto: false });
        }

        const idioma = new Idioma({ ...req.body, codigo: codigo.trim().toUpperCase(), nombre: nombre.trim() });
        await idioma.save();
        res.status(201).json({ success: true, message: 'Idioma creado exitosamente', data: idioma });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'El código de idioma ya existe' });
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al crear idioma', error: error.message });
    }
};

export const actualizarIdioma = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de idioma inválido' });

        const idioma = await Idioma.findById(id);
        if (!idioma) return res.status(404).json({ success: false, message: 'Idioma no encontrado' });

        const { codigo, nombre } = req.body;
        if (codigo !== undefined) {
            if (typeof codigo !== 'string' || codigo.trim().length < 2 || codigo.trim().length > 5) {
                return res.status(400).json({ success: false, message: 'El código debe tener entre 2 y 5 caracteres' });
            }
            const existe = await Idioma.findOne({ codigo: codigo.trim().toUpperCase(), _id: { $ne: id } });
            if (existe) return res.status(409).json({ success: false, message: `Ya existe un idioma con el código "${codigo.toUpperCase()}"` });
        }
        if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
            return res.status(400).json({ success: false, message: 'El nombre no puede estar vacío' });
        }

        // Si se marca como defecto, quitar defecto de otros
        if (req.body.defecto === true) {
            await Idioma.updateMany({ _id: { $ne: id }, defecto: true }, { defecto: false });
        }

        const actualizado = await Idioma.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Idioma actualizado exitosamente', data: actualizado });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'El código de idioma ya existe' });
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al actualizar idioma', error: error.message });
    }
};

export const eliminarIdioma = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de idioma inválido' });

        const idioma = await Idioma.findById(id);
        if (!idioma) return res.status(404).json({ success: false, message: 'Idioma no encontrado' });
        if (idioma.defecto) return res.status(400).json({ success: false, message: 'No se puede eliminar el idioma predeterminado. Asigna otro idioma como predeterminado primero' });

        // Eliminar traducciones relacionadas
        await Traduccion.deleteMany({ idioma: id });
        await Idioma.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Idioma y sus traducciones eliminados exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar idioma', error: error.message });
    }
};

// ==================== TRADUCCIONES ====================

export const listarTraducciones = async (req, res) => {
    try {
        const { idioma, modulo } = req.query;
        const filtro = {};
        if (idioma) {
            if (!isValidObjectId(idioma)) return res.status(400).json({ success: false, message: 'ID de idioma inválido' });
            filtro.idioma = idioma;
        }
        if (modulo) filtro.modulo = modulo;
        const traducciones = await Traduccion.find(filtro).populate('idioma');
        res.status(200).json({ success: true, total: traducciones.length, data: traducciones });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al listar traducciones', error: error.message });
    }
};

export const obtenerTraduccion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de traducción inválido' });
        const traduccion = await Traduccion.findById(id).populate('idioma');
        if (!traduccion) return res.status(404).json({ success: false, message: 'Traducción no encontrada' });
        res.status(200).json({ success: true, data: traduccion });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener traducción', error: error.message });
    }
};

export const crearTraduccion = async (req, res) => {
    try {
        const { idioma, clave, valor } = req.body;

        if (!idioma || !isValidObjectId(idioma)) {
            return res.status(400).json({ success: false, message: 'El idioma es obligatorio y debe ser un ID válido' });
        }
        if (!clave || typeof clave !== 'string' || clave.trim() === '') {
            return res.status(400).json({ success: false, message: 'La clave es obligatoria' });
        }
        if (!valor || typeof valor !== 'string' || valor.trim() === '') {
            return res.status(400).json({ success: false, message: 'El valor es obligatorio' });
        }

        // Verificar que el idioma existe
        const idiomaExiste = await Idioma.findById(idioma);
        if (!idiomaExiste) return res.status(404).json({ success: false, message: 'El idioma especificado no existe' });

        // Verificar duplicado clave+idioma
        const existe = await Traduccion.findOne({ idioma, clave: clave.trim() });
        if (existe) return res.status(409).json({ success: false, message: `Ya existe una traducción para la clave "${clave}" en este idioma` });

        const traduccion = new Traduccion({ ...req.body, clave: clave.trim(), valor: valor.trim() });
        await traduccion.save();
        res.status(201).json({ success: true, message: 'Traducción creada exitosamente', data: traduccion });
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al crear traducción', error: error.message });
    }
};

export const actualizarTraduccion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de traducción inválido' });

        const traduccion = await Traduccion.findById(id);
        if (!traduccion) return res.status(404).json({ success: false, message: 'Traducción no encontrada' });

        const { clave, valor } = req.body;
        if (clave !== undefined && (typeof clave !== 'string' || clave.trim() === '')) {
            return res.status(400).json({ success: false, message: 'La clave no puede estar vacía' });
        }
        if (valor !== undefined && (typeof valor !== 'string' || valor.trim() === '')) {
            return res.status(400).json({ success: false, message: 'El valor no puede estar vacío' });
        }
        // Verificar duplicado si se cambia la clave
        if (clave !== undefined) {
            const existe = await Traduccion.findOne({ idioma: traduccion.idioma, clave: clave.trim(), _id: { $ne: id } });
            if (existe) return res.status(409).json({ success: false, message: `Ya existe una traducción para la clave "${clave}" en este idioma` });
        }

        const actualizada = await Traduccion.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('idioma');
        res.status(200).json({ success: true, message: 'Traducción actualizada exitosamente', data: actualizada });
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Error de validación', error: error.message });
        res.status(500).json({ success: false, message: 'Error al actualizar traducción', error: error.message });
    }
};

export const eliminarTraduccion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'ID de traducción inválido' });
        const traduccion = await Traduccion.findByIdAndDelete(id);
        if (!traduccion) return res.status(404).json({ success: false, message: 'Traducción no encontrada' });
        res.status(200).json({ success: true, message: 'Traducción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar traducción', error: error.message });
    }
};