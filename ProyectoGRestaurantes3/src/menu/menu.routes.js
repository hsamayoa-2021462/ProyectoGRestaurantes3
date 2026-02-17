import { Router } from 'express';
import {
    listarCategoriasPlato, crearCategoriaPlato,
    listarPlatos, crearPlato,
    listarIngredientes, crearIngrediente,
    listarInventario, crearInventario
} from './menu.controller.js';

const router = Router();

router.get('/categorias-plato', listarCategoriasPlato);
router.post('/categorias-plato', crearCategoriaPlato);

router.get('/platos', listarPlatos);
router.post('/platos', crearPlato);

router.get('/ingredientes', listarIngredientes);
router.post('/ingredientes', crearIngrediente);

router.get('/inventario', listarInventario);
router.post('/inventario', crearInventario);

export default router;