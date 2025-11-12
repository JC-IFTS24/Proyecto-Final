import refugioService from '../services/refugio.service.js';
import { ApiResponse } from '../utils/responses.js';

/**
 * Controlador de refugios
 * Maneja las peticiones HTTP relacionadas con refugios
 */
class RefugioController {
  /**
   * GET /api/refugios
   * Obtener todos los refugios
   */
  async getAll(req, res, next) {
    try {
      const refugios = await refugioService.getAllRefugios();
      return ApiResponse.success(
        res, 
        refugios, 
        'Refugios obtenidos exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/refugios/:id
   * Obtener un refugio por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const refugio = await refugioService.getRefugioById(id);
      return ApiResponse.success(
        res, 
        refugio, 
        'Refugio obtenido exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/refugios/usuario/:usuarioId
   * Obtener refugios de un usuario
   */
  async getByUsuario(req, res, next) {
    try {
      const { usuarioId } = req.params;
      const refugios = await refugioService.getRefugiosByUsuario(usuarioId);
      return ApiResponse.success(
        res, 
        refugios, 
        'Refugios obtenidos exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/refugios/create
   * Crear un nuevo refugio
   */
  async create(req, res, next) {
    try {
      const refugio = await refugioService.createRefugio(req.body);
      return ApiResponse.created(
        res, 
        refugio, 
        'Refugio creado exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/refugios/:id
   * Actualizar un refugio
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const refugio = await refugioService.updateRefugio(id, req.body);
      return ApiResponse.success(
        res, 
        refugio, 
        'Refugio actualizado exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/refugios/:id
   * Eliminar un refugio
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await refugioService.deleteRefugio(id);
      return ApiResponse.success(
        res, 
        null, 
        'Refugio eliminado exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/refugios/stats
   * Obtener estadísticas de refugios (solo admin)
   */
  async getStats(req, res, next) {
    try {
      const stats = await refugioService.getStats();
      return ApiResponse.success(
        res, 
        stats, 
        'Estadísticas obtenidas exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }
}

// Exportar instancia única
export default new RefugioController();