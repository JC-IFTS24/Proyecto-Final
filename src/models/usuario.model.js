import database from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Modelo para interactuar con la tabla usuarios
 * Encapsula todas las operaciones CRUD
 */
class UsuarioModel {
  constructor() {
    this.tableName = 'usuarios';
  }

  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>} Lista de usuarios
   */
  async findAll() {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('id, nombre, email, telefono, rol, imagen_url, activo, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Buscar usuario por ID
   * @param {string} id - UUID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   * @throws {NotFoundError} Si el usuario no existe
   */
  async findById(id) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('id, nombre, email, telefono, rol, imagen_url, activo, created_at')
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

  /**
   * Buscar usuario por email (incluye password para login)
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findByEmail(email) {
    const { data, error} = await database.getClient()
      .from(this.tableName)
      .select('*') // Incluir password para login
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Crear un nuevo usuario
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async create(usuarioData) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .insert(usuarioData)
      .select('id, nombre, email, telefono, rol, imagen_url, activo, created_at')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Actualizar un usuario existente
   * @param {string} id - UUID del usuario
   * @param {Object} usuarioData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   * @throws {NotFoundError} Si el usuario no existe
   */
  async update(id, usuarioData) {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .update(usuarioData)
      .eq('id', id)
      .select('id, nombre, email, telefono, rol, imagen_url, activo, created_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Usuario no encontrado');
      }
      throw error;
    }
    
    return data;
  }

  /**
   * Eliminar un usuario
   * @param {string} id - UUID del usuario
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
   * Contar usuarios por rol
   * @returns {Promise<Object>} Conteo por rol
   */
  async countByRole() {
    const { data, error } = await database.getClient()
      .from(this.tableName)
      .select('rol')
      .eq('activo', true);

    if (error) throw error;

    // Contar manualmente ya que Supabase no tiene COUNT con GROUP BY directo
    const count = { admin: 0, usuario: 0 };
    data.forEach(user => {
      if (user.rol in count) {
        count[user.rol]++;
      }
    });

    return count;
  }
}

// Exportar instancia única
export default new UsuarioModel();