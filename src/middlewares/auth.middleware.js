import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expirado');
      }
      throw new UnauthorizedError('Token inválido');
    }
  } catch (error) {
    next(error);
  }
};

export const checkRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError('No tienes permisos para realizar esta acción');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};