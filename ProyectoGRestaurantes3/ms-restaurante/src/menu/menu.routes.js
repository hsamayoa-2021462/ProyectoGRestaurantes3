import { Router } from 'express';
import {
    listarCategoriasPlato, obtenerCategoriaPlato, crearCategoriaPlato, actualizarCategoriaPlato, eliminarCategoriaPlato,
    listarIngredientes, obtenerIngrediente, crearIngrediente, actualizarIngrediente, eliminarIngrediente,
    listarPlatos, obtenerPlato, crearPlato, actualizarPlato, eliminarPlato,
    listarInventario, obtenerInventario, crearInventario, actualizarInventario, eliminarInventario
} from './menu.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isAdmin, isAnyRole } from '../../middlewares/checkRole.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Categorías de Plato
 *     description: Gestión de categorías del menú
 *   - name: Ingredientes
 *     description: Gestión de ingredientes
 *   - name: Platos
 *     description: Gestión de platos del menú
 *   - name: Inventario
 *     description: Gestión de inventario de ingredientes
 */

router.get('/categorias-plato', validateJWT, isAnyRole, listarCategoriasPlato);
router.get('/categorias-plato/:id', validateJWT, isAnyRole, obtenerCategoriaPlato);
router.post('/categorias-plato', validateJWT, isAdmin, crearCategoriaPlato);
router.put('/categorias-plato/:id', validateJWT, isAdmin, actualizarCategoriaPlato);
router.delete('/categorias-plato/:id', validateJWT, isAdmin, eliminarCategoriaPlato);

router.get('/ingredientes', validateJWT, isAnyRole, listarIngredientes);
router.get('/ingredientes/:id', validateJWT, isAnyRole, obtenerIngrediente);
router.post('/ingredientes', validateJWT, isAdmin, crearIngrediente);
router.put('/ingredientes/:id', validateJWT, isAdmin, actualizarIngrediente);
router.delete('/ingredientes/:id', validateJWT, isAdmin, eliminarIngrediente);

router.get('/platos', validateJWT, isAnyRole, listarPlatos);
router.get('/platos/:id', validateJWT, isAnyRole, obtenerPlato);
router.post('/platos', validateJWT, isAdmin, crearPlato);
router.put('/platos/:id', validateJWT, isAdmin, actualizarPlato);
router.delete('/platos/:id', validateJWT, isAdmin, eliminarPlato);

router.get('/inventario', validateJWT, isAdmin, listarInventario);
router.get('/inventario/:id', validateJWT, isAdmin, obtenerInventario);
router.post('/inventario', validateJWT, isAdmin, crearInventario);
router.put('/inventario/:id', validateJWT, isAdmin, actualizarInventario);
router.delete('/inventario/:id', validateJWT, isAdmin, eliminarInventario);

export default router;