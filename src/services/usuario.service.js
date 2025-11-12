import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import usuarioModel from '../models/usuario.model.js';
import config from '../config/env.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';

/**
 * Servicio de usuarios
 * Contiene toda la lógica de negocio relacionada con usuarios
 */
class UsuarioService {
  /**
   * Obtener todos los usuarios (sin passwords)
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsuarios() {
    return await usuarioModel.findAll();
  }

  /**
   * Obtener un usuario por ID
   * @param {string} id - UUID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  async getUsuarioById(id) {
    return await usuarioModel.findById(id);
  }

  /**
   * Crear un nuevo usuario
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   * @throws {BadRequestError} Si el email ya existe o faltan datos
   */
  async createUsuario(usuarioData) {
    // Validar campos requeridos
    if (!usuarioData.nombre || !usuarioData.email || !usuarioData.password) {
      throw new BadRequestError('Nombre, email y password son requeridos');
    }

    // Verificar si el email ya existe
    const existingUser = await usuarioModel.findByEmail(usuarioData.email);
    if (existingUser) {
      throw new BadRequestError('El email ya está registrado');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuarioData.email)) {
      throw new BadRequestError('Formato de email inválido');
    }

    // Validar longitud de contraseña
    if (usuarioData.password.length < 6) {
      throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
    }

    // Hash de la contraseña (10 rounds de salt)
    usuarioData.password = await bcrypt.hash(usuarioData.password, 10);

    // Asignar rol por defecto si no se especifica
    if (!usuarioData.rol) {
      usuarioData.rol = 'usuario';
    }

    // Validar que el rol sea válido
    if (!['usuario', 'admin'].includes(usuarioData.rol)) {
      throw new BadRequestError('Rol inválido. Debe ser "usuario" o "admin"');
    }

    // Crear usuario
    const usuario = await usuarioModel.create(usuarioData);
    
    return usuario;
  }

  /**
   * Actualizar un usuario existente
   * @param {string} id - UUID del usuario
   * @param {Object} usuarioData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUsuario(id, usuarioData) {
    // Verificar que el usuario existe
    await usuarioModel.findById(id);

    // Si se actualiza el email, verificar que no exista
    if (usuarioData.email) {
      const existingUser = await usuarioModel.findByEmail(usuarioData.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestError('El email ya está en uso');
      }
    }

    // Si se actualiza la contraseña, hashearla
    if (usuarioData.password) {
      if (usuarioData.password.length < 6) {
        throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
      }
      usuarioData.password = await bcrypt.hash(usuarioData.password, 10);
    }

    // Validar rol si se actualiza
    if (usuarioData.rol && !['usuario', 'admin'].includes(usuarioData.rol)) {
      throw new BadRequestError('Rol inválido. Debe ser "usuario" o "admin"');
    }

    return await usuarioModel.update(id, usuarioData);
  }

  /**
   * Eliminar un usuario
   * @param {string} id - UUID del usuario
   * @returns {Promise<boolean>} true si se eliminó
   */
  async deleteUsuario(id) {
    await usuarioModel.findById(id);
    return await usuarioModel.delete(id);
  }

  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Usuario y token JWT
   * @throws {UnauthorizedError} Si las credenciales son inválidas
   */
  async login(email, password) {
    // Validar que se enviaron las credenciales
    if (!email || !password) {
      throw new BadRequestError('Email y password son requeridos');
    }

    // Buscar usuario por email (incluye password)
    const usuario = await usuarioModel.findByEmail(email);
    
    if (!usuario || !usuario.password) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Verificar que el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedError('Usuario inactivo');
    }

    // Comparar contraseña
    const isValidPassword = await bcrypt.compare(password, usuario.password);
    
    if (!isValidPassword) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar token JWT con información del usuario
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        rol: usuario.rol // Incluir rol en el token
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    // Remover password del objeto de respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    return { usuario: usuarioSinPassword, token };
  }

  /**
   * Registrar un nuevo usuario (alias de createUsuario)
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async register(usuarioData) {
    return await this.createUsuario(usuarioData);
  }

  /**
   * Cambiar rol de un usuario (solo admin)
   * @param {string} userId - UUID del usuario
   * @param {string} newRole - Nuevo rol
   * @returns {Promise<Object>} Usuario actualizado
   */
  async changeRole(userId, newRole) {
    if (!['usuario', 'admin'].includes(newRole)) {
      throw new BadRequestError('Rol inválido');
    }

    return await usuarioModel.update(userId, { rol: newRole });
  }

  /**
   * Obtener estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats() {
    const usuarios = await usuarioModel.findAll();
    const roleCount = await usuarioModel.countByRole();

    return {
      total: usuarios.length,
      activos: usuarios.filter(u => u.activo).length,
      porRol: roleCount
    };
  }
}

// Exportar instancia única
export default new UsuarioService();