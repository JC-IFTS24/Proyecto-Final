import express from 'express';
import refugioController from '../controllers/refugio.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas de refugios están protegidas
router.use(verifyToken);

router.get('/', refugioController.getAll);
router.get('/:id', refugioController.getById);
router.get('/usuario/:usuarioId', refugioController.getByUsuario);
router.post('/create', refugioController.create);
router.put('/:id', refugioController.update);
router.delete('/:id', refugioController.delete);

export default router;