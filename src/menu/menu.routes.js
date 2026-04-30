import { Router } from 'express';
import {
    listarCategoriasPlato,
    obtenerCategoriaPlato,
    crearCategoriaPlato,
    actualizarCategoriaPlato,
    eliminarCategoriaPlato,
    listarIngredientes,
    obtenerIngrediente,
    crearIngrediente,
    actualizarIngrediente,
    eliminarIngrediente,
    listarPlatos,
    obtenerPlato,
    crearPlato,
    actualizarPlato,
    eliminarPlato,
    listarInventario,
    obtenerInventario,
    crearInventario,
    actualizarInventario,
    eliminarInventario
} from './menu.controller.js';

const router = Router();

// ==================== CATEGORÍAS PLATO ====================
router.get('/categorias-plato',         listarCategoriasPlato);
router.get('/categorias-plato/:id',     obtenerCategoriaPlato);
router.post('/categorias-plato',        crearCategoriaPlato);
router.put('/categorias-plato/:id',     actualizarCategoriaPlato);
router.delete('/categorias-plato/:id',  eliminarCategoriaPlato);

// ==================== INGREDIENTES ====================
router.get('/ingredientes',             listarIngredientes);
router.get('/ingredientes/:id',         obtenerIngrediente);
router.post('/ingredientes',            crearIngrediente);
router.put('/ingredientes/:id',         actualizarIngrediente);
router.delete('/ingredientes/:id',      eliminarIngrediente);

// ==================== PLATOS ====================
router.get('/platos',                   listarPlatos);
router.get('/platos/:id',               obtenerPlato);
router.post('/platos',                  crearPlato);
router.put('/platos/:id',               actualizarPlato);
router.delete('/platos/:id',            eliminarPlato);

// ==================== INVENTARIO ====================
router.get('/inventario',               listarInventario);
router.get('/inventario/:id',           obtenerInventario);
router.post('/inventario',              crearInventario);
router.put('/inventario/:id',           actualizarInventario);
router.delete('/inventario/:id',        eliminarInventario);

export default router;
