import { Router } from 'express';
import {
    listarResenas, obtenerResena, crearResena, actualizarResena, eliminarResena,
    listarPromociones, obtenerPromocion, crearPromocion, actualizarPromocion, eliminarPromocion,
    listarCupones, obtenerCupon, crearCupon, actualizarCupon, eliminarCupon,
    listarCuponesUsuario, obtenerCuponUsuario, asignarCuponUsuario, actualizarCuponUsuario, eliminarCuponUsuario
} from './experiencia.controller.js';

const router = Router();

router.get('/resenas', listarResenas);
router.get('/resenas/:id', obtenerResena);
router.post('/resenas', crearResena);
router.put('/resenas/:id', actualizarResena);
router.delete('/resenas/:id', eliminarResena);

router.get('/promociones', listarPromociones);
router.get('/promociones/:id', obtenerPromocion);
router.post('/promociones', crearPromocion);
router.put('/promociones/:id', actualizarPromocion);
router.delete('/promociones/:id', eliminarPromocion);

router.get('/cupones', listarCupones);
router.get('/cupones/:id', obtenerCupon);
router.post('/cupones', crearCupon);
router.put('/cupones/:id', actualizarCupon);
router.delete('/cupones/:id', eliminarCupon);

router.get('/cupones-usuario', listarCuponesUsuario);
router.get('/cupones-usuario/:id', obtenerCuponUsuario);
router.post('/cupones-usuario', asignarCuponUsuario);
router.put('/cupones-usuario/:id', actualizarCuponUsuario);
router.delete('/cupones-usuario/:id', eliminarCuponUsuario);

export default router;