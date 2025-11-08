export class ApiResponse {
  static success(res, data, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message, statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  static created(res, data, message = 'Recurso creado exitosamente') {
    return this.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}