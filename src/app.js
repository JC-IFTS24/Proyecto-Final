import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/env.js';
import database from './config/database.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import refugioRoutes from './routes/refugio.routes.js';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permitir peticiones desde otros dominios
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Body parser - Parsear JSON y URL encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/admin', express.static(path.join(__dirname, '../public')));

// Logger simple (solo en desarrollo)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// CONEXIÓN A BASE DE DATOS
// ============================================
database.connect();

// ============================================
// RUTAS
// ============================================

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de Refugios de Mascotas',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      usuarios: '/api/usuarios',
      refugios: '/api/refugios',
      admin: '/admin/admin.html',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: 'Supabase'
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/refugios', refugioRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada (404)
app.use(notFoundHandler);

// Error handler global
app.use(errorHandler);

export default app;