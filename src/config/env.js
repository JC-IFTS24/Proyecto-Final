import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

/**
 * Objeto de configuración centralizado
 * Contiene todas las variables de entorno necesarias para la aplicación
 */
const config = {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuración de Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY
  },
  
  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d'
  },
  
  // Configuración de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }
};

// Validar que las variables críticas estén definidas
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`❌ Variable de entorno ${envVar} no está definida`);
  }
});

export default config;