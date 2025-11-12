import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

/**
 * Middleware para verificar token JWT
 * Extrae y valida el token del header Authorization
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
export const verifyToken = (req, res, next) => {
  try {
    // Obtener header de autorización
    const authHeader = req.headers.authorization;
    
    // Verificar que el header existe y tiene el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no proporcionado. Use: Authorization: Bearer <token>');
    }

    // Extraer el token (remover "Bearer ")
    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Agregar información del usuario al request
      req.user = decoded;
      
      // Continuar con el siguiente middleware
      next();
    } catch (error) {
      // Manejar errores específicos de JWT
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expirado. Por favor, inicia sesión nuevamente');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Token inválido');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar roles de usuario
 * Permite acceso solo a usuarios con roles específicos
 * @param {...string} roles - Roles permitidos (ej: 'admin', 'usuario')
 * @returns {Function} Middleware de Express
 */
export const checkRole = (...roles) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario está autenticado
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      // Verificar que el usuario tiene uno de los roles permitidos
      if (!roles.includes(req.user.rol)) {
        throw new ForbiddenError(
          `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}`
        );
      }

      // Usuario autorizado, continuar
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware específico para verificar rol de administrador
 * Shortcut para checkRole('admin')
 */
export const isAdmin = checkRole('admin');

/**
 * Middleware para verificar que el usuario accede a sus propios recursos
 * O es administrador
 * @param {string} paramName - Nombre del parámetro con el ID del usuario
 * @returns {Function} Middleware de Express
 */
export const isOwnerOrAdmin = (paramName = 'id') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const resourceUserId = req.params[paramName];
      const currentUserId = req.user.id;
      const isAdmin = req.user.rol === 'admin';

      // Permitir si es admin o si es el dueño del recurso
      if (!isAdmin && resourceUserId !== currentUserId) {
        throw new ForbiddenError('No tienes permiso para acceder a este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};