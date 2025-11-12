/**
 * Clase para generar respuestas HTTP estandarizadas
 * Todas las respuestas siguen el mismo formato
 */
export class ApiResponse {
  /**
   * Respuesta exitosa genérica
   * @param {Object} res - Objeto response de Express
   * @param {*} data - Datos a enviar
   * @param {string} message - Mensaje descriptivo
   * @param {number} statusCode - Código HTTP (default: 200)
   */
  static success(res, data, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Respuesta de error
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código HTTP (default: 500)
   * @param {*} errors - Errores adicionales (opcional)
   */
  static error(res, message, statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  /**
   * Respuesta para recursos creados
   * @param {Object} res - Objeto response de Express
   * @param {*} data - Datos del recurso creado
   * @param {string} message - Mensaje descriptivo
   */
  static created(res, data, message = 'Recurso creado exitosamente') {
    return this.success(res, data, message, 201);
  }

  /**
   * Respuesta sin contenido
   * @param {Object} res - Objeto response de Express
   */
  static noContent(res) {
    return res.status(204).send();
  }
}