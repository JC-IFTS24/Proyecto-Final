import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import usuarioModel from '../models/usuario.model.js';
import config from '../config/env.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';

class UsuarioService {
  async getAllUsuarios() {
    const usuarios = await usuarioModel.findAll();
    // Remover passwords de la respuesta
    return usuarios.map(u => {
      const { password, ...usuario } = u;
      return usuario;
    });
  }

  async getUsuarioById(id) {
    const usuario = await usuarioModel.findById(id);
    // Remover password
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  async createUsuario(usuarioData) {
    // Verificar si el email ya existe
    const existingUser = await usuarioModel.findByEmail(usuarioData.email);
    if (existingUser) {
      throw new BadRequestError('El email ya está registrado');
    }

    // Hash de la contraseña
    if (usuarioData.password) {
      usuarioData.password = await bcrypt.hash(usuarioData.password, 10);
    }

    const usuario = await usuarioModel.create(usuarioData);
    
    // Remover password de la respuesta
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

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

    // Hash de la nueva contraseña si existe
    if (usuarioData.password) {
      usuarioData.password = await bcrypt.hash(usuarioData.password, 10);
    }

    const usuario = await usuarioModel.update(id, usuarioData);
    
    // Remover password de la respuesta
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  async deleteUsuario(id) {
    await usuarioModel.findById(id);
    return await usuarioModel.delete(id);
  }

  async login(email, password) {
    const usuario = await usuarioModel.findByEmail(email);
    
    if (!usuario || !usuario.password) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, usuario.password);
    
    if (!isValidPassword) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    // Remover password del objeto de respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    return { usuario: usuarioSinPassword, token };
  }

  async register(usuarioData) {
    return await this.createUsuario(usuarioData);
  }
}

export default new UsuarioService();