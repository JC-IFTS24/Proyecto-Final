import { AppError } from '../utils/errors.js';
import { ApiResponse } from '../utils/responses.js';

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error operacional conocido
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Error de Supabase
  if (err.code && err.message) {
    let statusCode = 500;
    let message = err.message;

    // Mapear códigos de error comunes de PostgreSQL
    if (err.code === '23505') {
      statusCode = 409;
      message = 'El registro ya existe (duplicado)';
    } else if (err.code === '23503') {
      statusCode = 400;
      message = 'Referencia inválida a otro registro';
    } else if (err.code === 'PGRST116') {
      statusCode = 404;
      message = 'Recurso no encontrado';
    }

    return ApiResponse.error(res, message, statusCode);
  }

  // Error desconocido
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Error interno del servidor';
  
  return ApiResponse.error(res, message, 500);
};

export const notFoundHandler = (req, res, next) => {
  return ApiResponse.error(
    res, 
    `Ruta ${req.originalUrl} no encontrada`, 
    404
  );
};