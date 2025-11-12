import express from 'express';
import usuarioController from '../controllers/usuario.controller.js';
import { verifyToken, isAdmin, isOwnerOrAdmin } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/create', usuarioController.create);

// Rutas protegidas (requieren autenticación)
router.get('/', verifyToken, usuarioController.getAll);
router.get('/:id', verifyToken, usuarioController.getById);
router.put('/:id', verifyToken, isOwnerOrAdmin(), usuarioController.update);

// Subida de imagen (solo el dueño o admin)
router.post('/:id/upload', verifyToken, isOwnerOrAdmin(), upload.single('image'), usuarioController.uploadImage);

// Rutas solo para administradores
router.put('/:id/role', verifyToken, isAdmin, usuarioController.changeRole);
router.get('/stats/general', verifyToken, isAdmin, usuarioController.getStats);
router.delete('/:id', verifyToken, isAdmin, usuarioController.delete);

export default router;