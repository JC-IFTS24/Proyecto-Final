import database from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

class RefugioModel {
  constructor() {
    this.tableName = 'refugios';
  }

  async findAll() {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select(`
        *,
        usuario_responsable:usuarios(id, nombre, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select(`
        *,
        usuario_responsable:usuarios(id, nombre, email)
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

  async findByUsuario(usuarioId) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('*')
      .eq('usuario_responsable_id', usuarioId);

    if (error) throw error;
    return data;
  }

  async create(refugioData) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .insert(refugioData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

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

  async delete(id) {
    const { error } = await database.getClient()
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

export default new RefugioModel();