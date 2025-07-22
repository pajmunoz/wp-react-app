// Sistema de Rate Limiting para evitar saturar el servidor de WordPress

interface RateLimitConfig {
  maxRequests: number; // Máximo número de peticiones
  timeWindow: number;  // Ventana de tiempo en milisegundos
  delayBetweenRequests: number; // Delay entre peticiones en milisegundos
}

class RateLimiter {
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private requestCount = 0;
  private windowStart = Date.now();

  constructor(private config: RateLimitConfig) {}

  // Agregar una petición a la cola
  async enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  // Procesar la cola de peticiones
  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      // Verificar límites de rate limiting
      const now = Date.now();
      
      // Resetear contador si ha pasado la ventana de tiempo
      if (now - this.windowStart > this.config.timeWindow) {
        this.requestCount = 0;
        this.windowStart = now;
      }

      // Verificar si hemos alcanzado el límite de peticiones
      if (this.requestCount >= this.config.maxRequests) {
        const waitTime = this.config.timeWindow - (now - this.windowStart);
        console.log(`⏳ Rate limit alcanzado. Esperando ${waitTime}ms...`);
        await this.delay(waitTime);
        this.requestCount = 0;
        this.windowStart = Date.now();
      }

      // Verificar delay entre peticiones
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.config.delayBetweenRequests) {
        const delayNeeded = this.config.delayBetweenRequests - timeSinceLastRequest;
        await this.delay(delayNeeded);
      }

      // Ejecutar la petición
      const request = this.requestQueue.shift();
      if (request) {
        this.requestCount++;
        this.lastRequestTime = Date.now();
        
        try {
          await request();
        } catch (error) {
          console.error('Error en petición:', error);
        }
      }
    }

    this.isProcessing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtener estadísticas del rate limiter
  getStats() {
    return {
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      requestCount: this.requestCount,
      windowStart: this.windowStart,
      timeWindow: this.config.timeWindow,
    };
  }
}

// Configuración para hosting compartido (como Hostinger)
const hostingConfig: RateLimitConfig = {
  maxRequests: 3,           // Máximo 3 peticiones
  timeWindow: 1000,         // Por segundo
  delayBetweenRequests: 500, // 500ms entre peticiones
};

// Configuración para desarrollo local
const developmentConfig: RateLimitConfig = {
  maxRequests: 10,          // Más permisivo en desarrollo
  timeWindow: 1000,         // Por segundo
  delayBetweenRequests: 100, // 100ms entre peticiones
};

// Crear instancia del rate limiter
export const rateLimiter = new RateLimiter(
  process.env.NODE_ENV === 'development' ? developmentConfig : hostingConfig
);

// Función helper para hacer peticiones con rate limiting
export const rateLimitedFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  return rateLimiter.enqueue(() => fetch(url, options));
};

// Función para obtener estadísticas (solo en desarrollo)
export const getRateLimitStats = () => {
  if (process.env.NODE_ENV === 'development') {
    return rateLimiter.getStats();
  }
  return null;
}; 