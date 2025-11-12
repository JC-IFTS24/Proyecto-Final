import app from './src/app.js';
import config from './src/config/env.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorios necesarios si no existen
const dirs = ['uploads', 'public'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Directorio ${dir}/ creado`);
  }
});

// Iniciar servidor
const server = app.listen(config.port, () => {
  console.log('===========================================');
  console.log('🚀 Servidor de Refugios de Mascotas');
  console.log('===========================================');
  console.log(`📦 Entorno: ${config.nodeEnv}`);
  console.log(`🌐 API: http://localhost:${config.port}`);
  console.log(`💚 Health: http://localhost:${config.port}/health`);
  console.log(`👨‍💼 Admin: http://localhost:${config.port}/admin/admin.html`);
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
  console.log('🔑 Usuario Admin por defecto:');
  console.log('   Email: admin@refugios.com');
  console.log('   Password: admin123');
  console.log('===========================================');
});

// Manejo de cierre graceful
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