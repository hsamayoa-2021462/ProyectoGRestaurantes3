import { Router } from 'express';
import {
    listarResenas, crearResena,
    listarPromociones, crearPromocion,
    listarCupones, crearCupon,
    listarCuponesUsuario, asignarCuponUsuario
} from './experiencia.controller.js';

const router = Router();

router.get('/resenas', listarResenas);
router.post('/resenas', crearResena);

router.get('/promociones', listarPromociones);
router.post('/promociones', crearPromocion);

router.get('/cupones', listarCupones);
router.post('/cupones', crearCupon);

router.get('/cupones-usuario', listarCuponesUsuario);
router.post('/cupones-usuario', asignarCuponUsuario);

export default router;