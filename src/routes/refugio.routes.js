import express from 'express';
import refugioController from '../controllers/refugio.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas CRUD
router.get('/', refugioController.getAll);
router.get('/:id', refugioController.getById);
router.get('/usuario/:usuarioId', refugioController.getByUsuario);
router.post('/create', refugioController.create);
router.put('/:id', refugioController.update);
router.delete('/:id', refugioController.delete);

// Estadísticas (solo admin)
router.get('/stats/general', isAdmin, refugioController.getStats);

export default router;