import database from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Modelo para interactuar con la tabla refugios
 * Incluye relaciones con la tabla usuarios
 */
class RefugioModel {
  constructor() {
    this.tableName = 'refugios';
  }

  /**
   * Obtener todos los refugios con información del responsable
   * @returns {Promise<Array>} Lista de refugios
   */
  async findAll() {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select(`
        *,
        usuario_responsable:usuarios(id, nombre, email, rol)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Buscar refugio por ID con información del responsable
   * @param {string} id - UUID del refugio
   * @returns {Promise<Object>} Refugio encontrado
   * @throws {NotFoundError} Si el refugio no existe
   */
  async findById(id) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select(`
        *,
        usuario_responsable:usuarios(id, nombre, email, rol)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Refugio no encontrado');
      }
      throw error;
    }
    
    return data;
  }

  /**
   * Buscar refugios por usuario responsable
   * @param {string} usuarioId - UUID del usuario
   * @returns {Promise<Array>} Lista de refugios del usuario
   */
  async findByUsuario(usuarioId) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('*')
      .eq('usuario_responsable_id', usuarioId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Crear un nuevo refugio
   * @param {Object} refugioData - Datos del refugio
   * @returns {Promise<Object>} Refugio creado
   */
  async create(refugioData) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .insert(refugioData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Actualizar un refugio existente
   * @param {string} id - UUID del refugio
   * @param {Object} refugioData - Datos a actualizar
   * @returns {Promise<Object>} Refugio actualizado
   * @throws {NotFoundError} Si el refugio no existe
   */
  async update(id, refugioData) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .update(refugioData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Refugio no encontrado');
      }
      throw error;
    }
    
    return data;
  }

  /**
   * Eliminar un refugio
   * @param {string} id - UUID del refugio
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async delete(id) {
    const { error } = await database.getClient()
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * Obtener estadísticas de refugios
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats() {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('capacidad, activo');

    if (error) throw error;

    const stats = {
      total: data.length,
      activos: data.filter(r => r.activo).length,
      capacidadTotal: data.reduce((sum, r) => sum + (r.capacidad || 0), 0)
    };

    return stats;
  }
}

// Exportar instancia única
export default new RefugioModel();