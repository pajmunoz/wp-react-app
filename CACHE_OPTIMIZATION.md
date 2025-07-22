# Optimizaciones de Caché para WordPress API

## 🚀 Mejoras Implementadas

### 1. Sistema de Caché Global
- **Contexto de Caché**: Implementado `CacheContext` para manejar el estado global del caché
- **Almacenamiento Inteligente**: Los datos se almacenan por tipo y clave única
- **Persistencia**: Los datos permanecen en memoria durante la sesión

### 2. Precarga de Datos
- **DataPreloader**: Componente que precarga todos los datos necesarios al inicializar la aplicación
- **Carga Paralela**: Todas las consultas se ejecutan en paralelo para máxima velocidad
- **Indicador de Carga**: Muestra un spinner mientras se precargan los datos

### 3. Hooks Optimizados
- **useWordPressData**: Hook personalizado que maneja todas las consultas con caché
- **Caché Inteligente**: Verifica si los datos ya están en caché antes de hacer nuevas consultas
- **Configuración de TTL**: Tiempos de vida configurados para cada tipo de dato

### 4. Optimización de Cambio de Idioma
- **Precarga de Idioma Alternativo**: Los datos del otro idioma se precargan en segundo plano
- **Cambio Instantáneo**: Al cambiar de idioma, los datos ya están disponibles
- **Sin Llamadas Adicionales**: No se realizan nuevas consultas al cambiar idioma

### 5. Optimización de Categorías
- **Precarga de Posts por Categoría**: Todos los posts de todas las categorías se precargan
- **Cambio Rápido**: Al cambiar de categoría, los posts ya están disponibles
- **Caché por Categoría**: Cada categoría tiene su propio caché independiente

## 📊 Beneficios de Rendimiento

### Antes de las Optimizaciones:
- ❌ Cada cambio de idioma requería nuevas llamadas a la API
- ❌ Cada cambio de categoría requería nuevas llamadas a la API
- ❌ Los datos se perdían al navegar entre páginas
- ❌ Tiempo de carga lento en cada interacción

### Después de las Optimizaciones:
- ✅ Cambio instantáneo de idioma (datos precargados)
- ✅ Cambio instantáneo de categorías (datos precargados)
- ✅ Datos persistentes durante toda la sesión
- ✅ Tiempo de carga optimizado
- ✅ Menos llamadas a la API
- ✅ Mejor experiencia de usuario

## 🛠️ Configuración de TTL (Time To Live)

| Tipo de Dato | Stale Time | GC Time | Descripción |
|--------------|------------|---------|-------------|
| Páginas | 5 min | 10 min | Contenido estático que cambia poco |
| Categorías | 10 min | 30 min | Estructura que cambia ocasionalmente |
| Posts | 5 min | 15 min | Contenido que puede actualizarse |
| Posts por Categoría | 5 min | 15 min | Contenido específico por categoría |

## 🔧 Componentes Creados

### 1. CacheContext (`src/context/CacheContext.tsx`)
- Maneja el estado global del caché
- Proporciona métodos para acceder y modificar el caché
- Gestiona la inicialización de la aplicación

### 2. useWordPressData (`src/hooks/useWordPressData.ts`)
- Hook personalizado para todas las consultas de WordPress
- Integra caché automáticamente
- Maneja precarga de datos

### 3. DataPreloader (`src/components/DataPreloader/DataPreloader.tsx`)
- Precarga todos los datos necesarios al inicializar
- Muestra indicador de carga
- Maneja errores de precarga

### 4. PerformanceIndicator (`src/components/PerformanceIndicator/PerformanceIndicator.tsx`)
- Muestra estadísticas del caché (solo en desarrollo)
- Ayuda a monitorear el rendimiento
- Indica el estado de inicialización

## 📈 Métricas de Rendimiento

### Indicadores Visibles:
- **Total de Items en Caché**: Muestra cuántos elementos están almacenados
- **Estado de Inicialización**: Indica si la app está lista
- **Tipos de Datos**: Desglose por tipo (páginas, categorías, posts, etc.)

### Logs de Consola:
- ✅ "Datos precargados exitosamente"
- ✅ "Datos del idioma [idioma] precargados"
- ❌ "Error precargando datos" (si ocurre algún error)

## 🚀 Uso

### Para Desarrolladores:
1. El sistema funciona automáticamente
2. El indicador de rendimiento aparece en desarrollo
3. Los logs muestran el estado de precarga

### Para Usuarios:
1. Primera carga: Se muestra spinner de carga
2. Navegación: Cambios instantáneos de idioma y categorías
3. Experiencia fluida sin esperas

## 🔮 Futuras Mejoras

1. **Persistencia Local**: Almacenar caché en localStorage
2. **Invalidación Inteligente**: Invalidar caché cuando los datos cambien
3. **Compresión**: Comprimir datos en caché para ahorrar memoria
4. **Métricas Avanzadas**: Tracking de rendimiento más detallado
5. **Lazy Loading**: Cargar datos adicionales bajo demanda

## 📝 Notas Técnicas

- Compatible con React Query v5
- Usa `gcTime` en lugar de `cacheTime` (nueva API)
- Manejo de errores robusto
- No afecta el funcionamiento si falla la precarga
- Optimizado para aplicaciones con múltiples idiomas 