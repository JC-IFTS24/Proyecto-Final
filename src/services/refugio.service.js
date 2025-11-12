import refugioModel from '../models/refugio.model.js';
import usuarioModel from '../models/usuario.model.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * Servicio de refugios
 * Contiene toda la lógica de negocio relacionada con refugios
 */
class RefugioService {
  /**
   * Obtener todos los refugios
   * @returns {Promise<Array>} Lista de refugios
   */
  async getAllRefugios() {
    return await refugioModel.findAll();
  }

  /**
   * Obtener un refugio por ID
   * @param {string} id - UUID del refugio
   * @returns {Promise<Object>} Refugio encontrado
   */
  async getRefugioById(id) {
    return await refugioModel.findById(id);
  }

  /**
   * Obtener refugios de un usuario específico
   * @param {string} usuarioId - UUID del usuario
   * @returns {Promise<Array>} Lista de refugios
   */
  async getRefugiosByUsuario(usuarioId) {
    // Verificar que el usuario existe
    await usuarioModel.findById(usuarioId);
    return await refugioModel.findByUsuario(usuarioId);
  }

  /**
   * Crear un nuevo refugio
   * @param {Object} refugioData - Datos del refugio
   * @returns {Promise<Object>} Refugio creado
   * @throws {BadRequestError} Si faltan datos o son inválidos
   */
  async createRefugio(refugioData) {
    // Validar campos requeridos
    if (!refugioData.nombre || !refugioData.direccion) {
      throw new BadRequestError('Nombre y dirección son requeridos');
    }

    // Validar que el usuario responsable existe si se proporciona
    if (refugioData.usuario_responsable_id) {
      await usuarioModel.findById(refugioData.usuario_responsable_id);
    }

    // Validar y convertir coordenadas
    if (refugioData.latitud !== undefined && refugioData.latitud !== null) {
      const lat = parseFloat(refugioData.latitud);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        throw new BadRequestError('Latitud debe ser un número entre -90 y 90');
      }
      refugioData.latitud = lat;
    }

    if (refugioData.longitud !== undefined && refugioData.longitud !== null) {
      const lng = parseFloat(refugioData.longitud);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        throw new BadRequestError('Longitud debe ser un número entre -180 y 180');
      }
      refugioData.longitud = lng;
    }

    // Validar y convertir capacidad
    if (refugioData.capacidad !== undefined && refugioData.capacidad !== null) {
      const cap = parseInt(refugioData.capacidad);
      if (isNaN(cap) || cap < 0) {
        throw new BadRequestError('Capacidad debe ser un número positivo');
      }
      refugioData.capacidad = cap;
    }

    // Validar email si se proporciona
    if (refugioData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(refugioData.email)) {
        throw new BadRequestError('Formato de email inválido');
      }
    }

    return await refugioModel.create(refugioData);
  }

  /**
   * Actualizar un refugio existente
   * @param {string} id - UUID del refugio
   * @param {Object} refugioData - Datos a actualizar
   * @returns {Promise<Object>} Refugio actualizado
   */
  async updateRefugio(id, refugioData) {
    // Verificar que el refugio existe
    await refugioModel.findById(id);

    // Validar usuario responsable si se actualiza
    if (refugioData.usuario_responsable_id) {
      await usuarioModel.findById(refugioData.usuario_responsable_id);
    }

    // Validar coordenadas si se actualizan
    if (refugioData.latitud !== undefined && refugioData.latitud !== null) {
      const lat = parseFloat(refugioData.latitud);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        throw new BadRequestError('Latitud debe ser un número entre -90 y 90');
      }
      refugioData.latitud = lat;
    }

    if (refugioData.longitud !== undefined && refugioData.longitud !== null) {
      const lng = parseFloat(refugioData.longitud);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        throw new BadRequestError('Longitud debe ser un número entre -180 y 180');
      }
      refugioData.longitud = lng;
    }

    // Validar capacidad si se actualiza
    if (refugioData.capacidad !== undefined && refugioData.capacidad !== null) {
      const cap = parseInt(refugioData.capacidad);
      if (isNaN(cap) || cap < 0) {
        throw new BadRequestError('Capacidad debe ser un número positivo');
      }
      refugioData.capacidad = cap;
    }

    return await refugioModel.update(id, refugioData);
  }

  /**
   * Eliminar un refugio
   * @param {string} id - UUID del refugio
   * @returns {Promise<boolean>} true si se eliminó
   */
  async deleteRefugio(id) {
    await refugioModel.findById(id);
    return await refugioModel.delete(id);
  }

  /**
   * Obtener estadísticas de refugios
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats() {
    return await refugioModel.getStats();
  }
}

// Exportar instancia única
export default new RefugioService();