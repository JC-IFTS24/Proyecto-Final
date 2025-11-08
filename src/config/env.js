import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }
};

// Validar variables críticas
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`❌ Variable de entorno ${envVar} no está definida`);
  }
});

export default config;