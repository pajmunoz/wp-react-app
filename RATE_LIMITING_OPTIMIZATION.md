# 🚀 Optimizaciones de Rate Limiting

## ❌ Problema: "ERR_INSUFFICIENT_RESOURCES"

Si estás viendo errores como `ERR_INSUFFICIENT_RESOURCES` o `Failed to fetch`, significa que el servidor de WordPress está siendo sobrecargado por demasiadas peticiones simultáneas. Esto es común en hosting compartido como Hostinger.

## 🔧 Soluciones Implementadas

### 1. **Sistema de Rate Limiting**
- **Cola de Peticiones**: Todas las peticiones se encolan y se procesan de forma controlada
- **Límites Configurables**: Máximo 3 peticiones por segundo en producción
- **Delays Automáticos**: 500ms entre peticiones para evitar sobrecarga
- **Ventanas de Tiempo**: Control de peticiones por ventanas de 1 segundo

### 2. **Precarga Secuencial**
- **Antes**: Todas las peticiones se ejecutaban en paralelo
- **Después**: Las peticiones se ejecutan una por una para evitar sobrecarga
- **Beneficio**: Menor impacto en el servidor, mayor estabilidad

### 3. **Configuración Adaptativa**
- **Desarrollo**: 10 peticiones/segundo, 100ms entre peticiones
- **Producción**: 3 peticiones/segundo, 500ms entre peticiones
- **Hosting Compartido**: Configuración conservadora para evitar límites

## 📊 Configuración del Rate Limiter

### Para Hosting Compartido (Hostinger, etc.):
```typescript
const hostingConfig = {
  maxRequests: 3,           // Máximo 3 peticiones
  timeWindow: 1000,         // Por segundo
  delayBetweenRequests: 500, // 500ms entre peticiones
};
```

### Para Desarrollo Local:
```typescript
const developmentConfig = {
  maxRequests: 10,          // Más permisivo
  timeWindow: 1000,         // Por segundo
  delayBetweenRequests: 100, // 100ms entre peticiones
};
```

## 🔄 Cómo Funciona

### 1. **Cola de Peticiones**
```
Petición 1 → [Cola] → Procesamiento → Respuesta
Petición 2 → [Cola] → Espera 500ms → Procesamiento → Respuesta
Petición 3 → [Cola] → Espera 500ms → Procesamiento → Respuesta
```

### 2. **Control de Límites**
- Si se alcanzan 3 peticiones en 1 segundo, se espera
- Cada petición espera al menos 500ms antes de la siguiente
- El sistema se adapta automáticamente

### 3. **Manejo de Errores**
- Si una petición falla, no afecta las siguientes
- Errores de sobrecarga se manejan graciosamente
- Logs detallados para debugging

## 📈 Monitoreo en Desarrollo

### Indicador de Rendimiento
En desarrollo, verás un indicador en la esquina inferior derecha con:
- **Cache Stats**: Elementos en caché
- **Rate Limiter Stats**: Estado de la cola de peticiones
- **Queue Length**: Peticiones en espera
- **Processing**: Si está procesando peticiones

### Logs de Consola
```
🚀 Iniciando precarga de datos...
✅ Página 1main precargada
✅ Página 2description precargada
✅ Página 3links precargada
✅ Categorías precargadas
✅ Posts generales precargados
📊 Resultado de precarga: 3/3 páginas, categorías: ✅, posts: ✅
```

## 🛠️ Optimizaciones Específicas

### 1. **DataPreloader Optimizado**
- **Antes**: `Promise.all()` - todas las peticiones simultáneas
- **Después**: Bucle `for...of` - peticiones secuenciales
- **Beneficio**: Menor impacto en el servidor

### 2. **Precarga de Categorías**
- **Antes**: Todas las categorías se precargaban en paralelo
- **Después**: Categorías se precargan una por una
- **Beneficio**: Evita sobrecarga al cambiar categorías

### 3. **Precarga de Idioma Alternativo**
- **Antes**: Peticiones paralelas para ambos idiomas
- **Después**: Peticiones secuenciales con delays
- **Beneficio**: Cambio de idioma más estable

## 🎯 Beneficios

### Para el Servidor:
- ✅ Menos sobrecarga
- ✅ Menos errores `ERR_INSUFFICIENT_RESOURCES`
- ✅ Mejor estabilidad
- ✅ Menor uso de recursos

### Para el Usuario:
- ✅ Cambios de idioma más rápidos
- ✅ Cambios de categoría más estables
- ✅ Menos errores de carga
- ✅ Experiencia más fluida

### Para el Desarrollador:
- ✅ Logs detallados
- ✅ Monitoreo en tiempo real
- ✅ Configuración flexible
- ✅ Fácil debugging

## 🔧 Configuración Avanzada

### Ajustar Límites
Si necesitas ajustar los límites, modifica `src/lib/rateLimiter.ts`:

```typescript
// Para servidores más potentes
const powerfulServerConfig = {
  maxRequests: 5,           // Más peticiones
  timeWindow: 1000,         // Por segundo
  delayBetweenRequests: 200, // Menos delay
};

// Para servidores más limitados
const limitedServerConfig = {
  maxRequests: 2,           // Menos peticiones
  timeWindow: 1000,         // Por segundo
  delayBetweenRequests: 1000, // Más delay
};
```

### Monitoreo de Errores
Los errores se registran automáticamente:
```
⚠️ Error precargando página 1main: Error: El servidor está sobrecargado
⚠️ Error precargando posts de categoría 21: Error: Failed to fetch
```

## 🚀 Resultado Final

Con estas optimizaciones:
- **Menos errores** de sobrecarga del servidor
- **Mejor rendimiento** en hosting compartido
- **Experiencia más fluida** para el usuario
- **Monitoreo completo** del sistema

La aplicación ahora es mucho más respetuosa con los recursos del servidor y debería funcionar sin problemas en hosting compartido como Hostinger. 