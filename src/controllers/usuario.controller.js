import usuarioService from '../services/usuario.service.js';
import { ApiResponse } from '../utils/responses.js';
import { BadRequestError } from '../utils/errors.js';

class UsuarioController {
  async getAll(req, res, next) {
    try {
      const usuarios = await usuarioService.getAllUsuarios();
      return ApiResponse.success(res, usuarios, 'Usuarios obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.getUsuarioById(id);
      return ApiResponse.success(res, usuario, 'Usuario obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const usuario = await usuarioService.getUsuarioByEmail(email);
      return ApiResponse.success(res, usuario, 'Usuario obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const usuario = await usuarioService.createUsuario(req.body);
      return ApiResponse.created(res, usuario, 'Usuario creado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.updateUsuario(id, req.body);
      return ApiResponse.success(res, usuario, 'Usuario actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await usuarioService.deleteUsuario(id);
      return ApiResponse.success(res, null, 'Usuario eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError('No se proporcionó ningún archivo');
      }

      const { id } = req.params;
      const imageUrl = `/uploads/${req.file.filename}`;
      
      // Actualizar el usuario con la URL de la imagen
      await usuarioService.updateUsuario(id, { imagen_url: imageUrl });
      
      return ApiResponse.success(res, { imageUrl }, 'Imagen subida exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

export default new UsuarioController();