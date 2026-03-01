import { Router } from 'express';
import {
    listarRestaurantes,
    obtenerRestaurantePorId,
    crearRestaurante,
    actualizarRestaurante,
    eliminarRestaurante,
    listarCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    listarMesas,
    obtenerMesaPorId,
    crearMesa,
    actualizarMesa,
    eliminarMesa,
    listarZonasEntrega,
    obtenerZonaEntregaPorId,
    crearZonaEntrega,
    actualizarZonaEntrega,
    eliminarZonaEntrega
} from './restaurante.controller.js';

const router = Router();

// ==================== RESTAURANTES ====================
router.get('/restaurantes',          listarRestaurantes);
router.get('/restaurantes/:id',      obtenerRestaurantePorId);
router.post('/restaurantes',         crearRestaurante);
router.put('/restaurantes/:id',      actualizarRestaurante);
router.delete('/restaurantes/:id',   eliminarRestaurante);

// ==================== CATEGORÍAS ====================
router.get('/categorias',            listarCategorias);
router.get('/categorias/:id',        obtenerCategoriaPorId);
router.post('/categorias',           crearCategoria);
router.put('/categorias/:id',        actualizarCategoria);
router.delete('/categorias/:id',     eliminarCategoria);

// ==================== MESAS ====================
router.get('/mesas',                 listarMesas);
router.get('/mesas/:id',             obtenerMesaPorId);
router.post('/mesas',                crearMesa);
router.put('/mesas/:id',             actualizarMesa);
router.delete('/mesas/:id',          eliminarMesa);

// ==================== ZONAS DE ENTREGA ====================
router.get('/zonas-entrega',         listarZonasEntrega);
router.get('/zonas-entrega/:id',     obtenerZonaEntregaPorId);
router.post('/zonas-entrega',        crearZonaEntrega);
router.put('/zonas-entrega/:id',     actualizarZonaEntrega);
router.delete('/zonas-entrega/:id',  eliminarZonaEntrega);

export default router;