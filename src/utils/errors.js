/**
 * Clase base para errores de la aplicación
 * Todos los errores personalizados heredan de esta clase
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indica que es un error esperado
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error 400 - Solicitud incorrecta
 * Se usa cuando el cliente envía datos inválidos
 */
export class BadRequestError extends AppError {
  constructor(message = 'Solicitud incorrecta') {
    super(message, 400);
  }
}

/**
 * Error 401 - No autorizado
 * Se usa cuando el usuario no está autenticado
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

/**
 * Error 403 - Prohibido
 * Se usa cuando el usuario no tiene permisos
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Acceso prohibido') {
    super(message, 403);
  }
}

/**
 * Error 404 - No encontrado
 * Se usa cuando un recurso no existe
 */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

/**
 * Error 500 - Error interno del servidor
 * Se usa para errores inesperados
 */
export class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500);
  }
}