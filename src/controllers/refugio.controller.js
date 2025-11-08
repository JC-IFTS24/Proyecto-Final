import refugioService from '../services/refugio.service.js';
import { ApiResponse } from '../utils/responses.js';

class RefugioController {
  async getAll(req, res, next) {
    try {
      const refugios = await refugioService.getAllRefugios();
      return ApiResponse.success(res, refugios, 'Refugios obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const refugio = await refugioService.getRefugioById(id);
      return ApiResponse.success(res, refugio, 'Refugio obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getByUsuario(req, res, next) {
    try {
      const { usuarioId } = req.params;
      const refugios = await refugioService.getRefugiosByUsuario(usuarioId);
      return ApiResponse.success(res, refugios, 'Refugios obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const refugio = await refugioService.createRefugio(req.body);
      return ApiResponse.created(res, refugio, 'Refugio creado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const refugio = await refugioService.updateRefugio(id, req.body);
      return ApiResponse.success(res, refugio, 'Refugio actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await refugioService.deleteRefugio(id);
      return ApiResponse.success(res, null, 'Refugio eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

export default new RefugioController();