import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { BadRequestError } from '../utils/errors.js';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuración de almacenamiento de multer
 * Define dónde y cómo se guardan los archivos
 */
const storage = multer.diskStorage({
  /**
   * Define el directorio de destino
   */
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  
  /**
   * Define el nombre del archivo
   * Formato: fieldname-timestamp-random.ext
   */
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * Filtro de tipos de archivo permitidos
 * Solo permite imágenes
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    // Archivo válido
    cb(null, true);
  } else {
    // Archivo no válido
    cb(new BadRequestError('Solo se permiten imágenes (jpeg, jpg, png, webp)'), false);
  }
};

/**
 * Configuración final de multer
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

export default upload;