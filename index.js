import app from './src/app.js';
import config from './src/config/env.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorio uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('📁 Directorio uploads creado');
}

const server = app.listen(config.port, () => {
  console.log('===========================================');
  console.log('🚀 Servidor de Refugios de Mascotas');
  console.log('===========================================');
  console.log(`📦 Entorno: ${config.nodeEnv}`);
  console.log(`🌐 URL: http://localhost:${config.port}`);
  console.log(`💚 Health: http://localhost:${config.port}/health`);
  console.log(`🗄️  Base de datos: Supabase`);
  console.log('===========================================');
  console.log('📋 Endpoints disponibles:');
  console.log('   POST   /auth/login');
  console.log('   POST   /auth/register');
  console.log('   GET    /api/usuarios');
  console.log('   POST   /api/usuarios/create');
  console.log('   GET    /api/refugios');
  console.log('   POST   /api/refugios/create');
  console.log('===========================================');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Cerrando servidor...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor gracefully...');
  server.close(() => {
    console.log('💥 Proceso terminado');
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Cerrando aplicación...');
  console.error(err);
  process.exit(1);
});