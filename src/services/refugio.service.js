import refugioModel from '../models/refugio.model.js';
import usuarioModel from '../models/usuario.model.js';
import { BadRequestError } from '../utils/errors.js';

class RefugioService {
  async getAllRefugios() {
    return await refugioModel.findAll();
  }

  async getRefugioById(id) {
    return await refugioModel.findById(id);
  }

  async getRefugiosByUsuario(usuarioId) {
    // Verificar que el usuario existe
    await usuarioModel.findById(usuarioId);
    return await refugioModel.findByUsuario(usuarioId);
  }

  async createRefugio(refugioData) {
    // Validar que el usuario responsable existe si se proporciona
    if (refugioData.usuario_responsable_id) {
      await usuarioModel.findById(refugioData.usuario_responsable_id);
    }

    // Validar coordenadas
    if (refugioData.latitud) {
      const lat = parseFloat(refugioData.latitud);
      if (lat < -90 || lat > 90) {
        throw new BadRequestError('Latitud debe estar entre -90 y 90');
      }
      refugioData.latitud = lat;
    }

    if (refugioData.longitud) {
      const lng = parseFloat(refugioData.longitud);
      if (lng < -180 || lng > 180) {
        throw new BadRequestError('Longitud debe estar entre -180 y 180');
      }
      refugioData.longitud = lng;
    }

    // Validar capacidad
    if (refugioData.capacidad) {
      refugioData.capacidad = parseInt(refugioData.capacidad);
    }

    return await refugioModel.create(refugioData);
  }

  async updateRefugio(id, refugioData) {
    // Verificar que el refugio existe
    await refugioModel.findById(id);

    // Validar que el usuario responsable existe si se proporciona
    if (refugioData.usuario_responsable_id) {
      await usuarioModel.findById(refugioData.usuario_responsable_id);
    }

    // Validar coordenadas
    if (refugioData.latitud) {
      const lat = parseFloat(refugioData.latitud);
      if (lat < -90 || lat > 90) {
        throw new BadRequestError('Latitud debe estar entre -90 y 90');
      }
      refugioData.latitud = lat;
    }

    if (refugioData.longitud) {
      const lng = parseFloat(refugioData.longitud);
      if (lng < -180 || lng > 180) {
        throw new BadRequestError('Longitud debe estar entre -180 y 180');
      }
      refugioData.longitud = lng;
    }

    // Validar capacidad
    if (refugioData.capacidad) {
      refugioData.capacidad = parseInt(refugioData.capacidad);
    }

    return await refugioModel.update(id, refugioData);
  }

  async deleteRefugio(id) {
    await refugioModel.findById(id);
    return await refugioModel.delete(id);
  }
}

export default new RefugioService();