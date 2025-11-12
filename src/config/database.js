import { createClient } from '@supabase/supabase-js';
import config from './env.js';

/**
 * Clase para gestionar la conexión con Supabase
 * Implementa el patrón Singleton para tener una única instancia
 */
class Database {
  constructor() {
    this.client = null;
  }

  /**
   * Establece la conexión con Supabase
   * @returns {Object} Cliente de Supabase
   */
  connect() {
    try {
      // Crear cliente de Supabase con las credenciales
      this.client = createClient(
        config.supabase.url,
        config.supabase.anonKey,
        {
          auth: {
            persistSession: false // No persistir sesión (backend stateless)
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

  /**
   * Obtiene el cliente de Supabase
   * @returns {Object} Cliente de Supabase
   * @throws {Error} Si la base de datos no está inicializada
   */
  getClient() {
    if (!this.client) {
      throw new Error('Base de datos no inicializada. Llama a connect() primero.');
    }
    return this.client;
  }
}

// Exportar instancia única (Singleton)
export default new Database();