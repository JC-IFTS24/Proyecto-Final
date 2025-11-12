import usuarioService from '../services/usuario.service.js';
import { ApiResponse } from '../utils/responses.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * Controlador de usuarios
 * Maneja las peticiones HTTP relacionadas con usuarios
 */
class UsuarioController {
  /**
   * GET /api/usuarios
   * Obtener todos los usuarios
   */
  async getAll(req, res, next) {
    try {
      const usuarios = await usuarioService.getAllUsuarios();
      return ApiResponse.success(
        res, 
        usuarios, 
        'Usuarios obtenidos exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/usuarios/:id
   * Obtener un usuario por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.getUsuarioById(id);
      return ApiResponse.success(
        res, 
        usuario, 
        'Usuario obtenido exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/usuarios/create
   * Crear un nuevo usuario
   */
  async create(req, res, next) {
    try {
      const usuario = await usuarioService.createUsuario(req.body);
      return ApiResponse.created(
        res, 
        usuario, 
        'Usuario creado exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/usuarios/:id
   * Actualizar un usuario
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.updateUsuario(id, req.body);
      return ApiResponse.success(
        res, 
        usuario, 
        'Usuario actualizado exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/usuarios/:id
   * Eliminar un usuario
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await usuarioService.deleteUsuario(id);
      return ApiResponse.success(
        res, 
        null, 
        'Usuario eliminado exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/usuarios/:id/upload
   * Subir imagen de perfil
   */
  async uploadImage(req, res, next) {
    try {
      // Verificar que se subió un archivo
      if (!req.file) {
        throw new BadRequestError('No se proporcionó ningún archivo');
      }

      const { id } = req.params;
      const imageUrl = `/uploads/${req.file.filename}`;
      
      // Actualizar el usuario con la URL de la imagen
      await usuarioService.updateUsuario(id, { imagen_url: imageUrl });
      
      return ApiResponse.success(
        res, 
        { imageUrl }, 
        'Imagen subida exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/usuarios/:id/role
   * Cambiar rol de un usuario (solo admin)
   */
  async changeRole(req, res, next) {
    try {
      const { id } = req.params;
      const { rol } = req.body;

      if (!rol) {
        throw new BadRequestError('El campo rol es requerido');
      }

      const usuario = await usuarioService.changeRole(id, rol);
      return ApiResponse.success(
        res, 
        usuario, 
        'Rol actualizado exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/usuarios/stats
   * Obtener estadísticas de usuarios (solo admin)
   */
  async getStats(req, res, next) {
    try {
      const stats = await usuarioService.getStats();
      return ApiResponse.success(
        res, 
        stats, 
        'Estadísticas obtenidas exitosamente'
      );
    } catch (error) {
      next(error);
    }
  }
}

// Exportar instancia única
export default new UsuarioController();