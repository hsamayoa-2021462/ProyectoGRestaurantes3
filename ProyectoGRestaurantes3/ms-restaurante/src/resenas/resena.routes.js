// ms-restaurante/src/resenas/resena.routes.js
import { Router } from 'express';
import { listarResenas, listarMisResenas, crearResena, eliminarResena } from './resena.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { isClient, isAnyRole } from '../../middlewares/checkRole.js';

const router = Router();

router.get('/restaurante/:restId',  validateJWT, isAnyRole, listarResenas);
router.get('/mis-resenas',          validateJWT, isClient,  listarMisResenas);
router.post('/',                    validateJWT, isClient,  crearResena);
router.delete('/:id',               validateJWT, isClient,  eliminarResena);

export default router;