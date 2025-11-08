import { createClient } from '@supabase/supabase-js';
import config from './env.js';

class Database {
  constructor() {
    this.client = null;
  }

  connect() {
    try {
      this.client = createClient(
        config.supabase.url,
        config.supabase.anonKey,
        {
          auth: {
            persistSession: false
          }
        }
      );
      console.log('✅ Conexión a Supabase establecida');
      return this.client;
    } catch (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
      throw error;
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error('Base de datos no inicializada. Llama a connect() primero.');
    }
    return this.client;
  }
}

export default new Database();