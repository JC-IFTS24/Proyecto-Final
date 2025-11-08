import express from 'express';
import usuarioController from '../controllers/usuario.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/create', usuarioController.create);

// Rutas protegidas
router.get('/', verifyToken, usuarioController.getAll);
router.get('/:id', verifyToken, usuarioController.getById);
router.put('/:id', verifyToken, usuarioController.update);
router.delete('/:id', verifyToken, usuarioController.delete);

// Subida de imagen de perfil
router.post('/:id/upload', verifyToken, upload.single('image'), usuarioController.uploadImage);

export default router;