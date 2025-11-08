import express from 'express';
import usuarioService from '../services/usuario.service.js';
import { ApiResponse } from '../utils/responses.js';

const router = express.Router();

// Login
router.post('/login', async (req, res, next) => {
  console.log("📩 Llamada recibida en /auth/login");
  try {
    const { email, password } = req.body;
    const result = await usuarioService.login(email, password);
    return ApiResponse.success(res, result, 'Login exitoso');
  } catch (error) {
    next(error);
  }
});

// Register
router.post('/register', async (req, res, next) => {
  console.log("📩 Llamada recibida en /auth/register");
  try {
    const usuario = await usuarioService.register(req.body);
    return ApiResponse.created(res, usuario, 'Usuario registrado exitosamente');
  } catch (error) {
    next(error);
  }
});

export default router;