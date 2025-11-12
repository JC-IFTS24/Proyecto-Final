import { AppError } from '../utils/errors.js';
import { ApiResponse } from '../utils/responses.js';

/**
 * Middleware global para manejo de errores
 * Captura todos los errores y genera respuestas apropiadas
 * @param {Error} err - Error capturado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log del error para debugging
  console.error('❌ Error capturado:', err);

  // Error operacional conocido (AppError)
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Error de Supabase/PostgreSQL
  if (err.code && err.message) {
    let statusCode = 500;
    let message = err.message;

    // Mapear códigos de error comunes de PostgreSQL
    switch (err.code) {
      case '23505': // Violación de restricción única
        statusCode = 409;
        message = 'El registro ya existe (valor duplicado)';
        break;
      case '23503': // Violación de clave foránea
        statusCode = 400;
        message = 'Referencia inválida a otro registro';
        break;
      case 'PGRST116': // Recurso no encontrado
        statusCode = 404;
        message = 'Recurso no encontrado';
        break;
    }

    return ApiResponse.error(res, message, statusCode);
  }

  // Error desconocido
  // En desarrollo mostramos el mensaje completo, en producción ocultamos detalles
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Error interno del servidor';
  
  return ApiResponse.error(res, message, 500);
};

/**
 * Middleware para rutas no encontradas (404)
 * Se ejecuta cuando ninguna ruta coincide
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
export const notFoundHandler = (req, res, next) => {
  return ApiResponse.error(
    res, 
    `Ruta ${req.method} ${req.originalUrl} no encontrada`, 
    404
  );
};