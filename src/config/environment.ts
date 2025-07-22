// Configuración de variables de entorno
export const config = {
  // WordPress API
  wpDomain: process.env.REACT_APP_WP_DOMAIN || '',
  wpApiUrl: process.env.REACT_APP_WP_DOMAIN ? `${process.env.REACT_APP_WP_DOMAIN}/wp-json/wp/v2` : '',
  
  // Configuración de caché
  cache: {
    defaultStaleTime: 5 * 60 * 1000, // 5 minutos
    defaultGcTime: 10 * 60 * 1000, // 10 minutos
    pagesStaleTime: 5 * 60 * 1000,
    pagesGcTime: 10 * 60 * 1000,
    categoriesStaleTime: 10 * 60 * 1000,
    categoriesGcTime: 30 * 60 * 1000,
    postsStaleTime: 5 * 60 * 1000,
    postsGcTime: 15 * 60 * 1000,
  },
  
  // Configuración de desarrollo
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Configuración de logging
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  }
};

// Validación de configuración
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.wpDomain) {
    errors.push('REACT_APP_WP_DOMAIN no está configurado');
  }
  
  if (errors.length > 0) {
    console.error('❌ Errores de configuración:', errors);
    console.error('📝 Asegúrate de crear un archivo .env con las variables necesarias');
    console.error('📝 Ejemplo: REACT_APP_WP_DOMAIN=https://tu-wordpress.com');
    return false;
  }
  
  console.log('✅ Configuración válida');
  console.log('🌐 WordPress Domain:', config.wpDomain);
  console.log('🔗 API URL:', config.wpApiUrl);
  return true;
};

// Función para obtener la URL de la API con validación
export const getApiUrl = (endpoint: string = '') => {
  if (!config.wpApiUrl) {
    throw new Error('WordPress API URL no está configurada');
  }
  return `${config.wpApiUrl}${endpoint}`;
};

// Función para logging condicional
export const log = {
  debug: (message: string, ...args: any[]) => {
    if (config.logging.enabled && config.logging.level === 'debug') {
      console.log(`🐛 ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (config.logging.enabled) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (config.logging.enabled) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(`❌ ${message}`, ...args);
  },
  success: (message: string, ...args: any[]) => {
    if (config.logging.enabled) {
      console.log(`✅ ${message}`, ...args);
    }
  }
}; 