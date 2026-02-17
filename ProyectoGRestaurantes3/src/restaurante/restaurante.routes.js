import { Router } from 'express';
import {
    listarRestaurantes, crearRestaurante,
    listarCategorias, crearCategoria,
    listarMesas, crearMesa,
    listarZonasEntrega, crearZonaEntrega
} from './restaurante.controller.js';

const router = Router();

// Restaurantes
router.get('/restaurantes', listarRestaurantes);
router.post('/restaurantes', crearRestaurante);

// Categorías
router.get('/categorias', listarCategorias);
router.post('/categorias', crearCategoria);

// Mesas
router.get('/mesas', listarMesas);
router.post('/mesas', crearMesa);

// Zonas de entrega
router.get('/zonas-entrega', listarZonasEntrega);
router.post('/zonas-entrega', crearZonaEntrega);

export default router;