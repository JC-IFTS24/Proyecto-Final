import database from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

class UsuarioModel {
  constructor() {
    this.tableName = 'usuarios';
  }

  async findAll() {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Usuario no encontrado');
      }
      throw error;
    }
    
    return data;
  }

  async findByEmail(email) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(usuarioData) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .insert(usuarioData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id, usuarioData) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .update(usuarioData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Usuario no encontrado');
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

export default new UsuarioModel();