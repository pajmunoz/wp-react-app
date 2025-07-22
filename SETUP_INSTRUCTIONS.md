# 🚀 Instrucciones de Configuración

## ❌ Error: "Failed to fetch"

Si estás viendo errores de "Failed to fetch" en la consola, significa que la aplicación no puede conectarse a la API de WordPress. Aquí están las soluciones:

## 🔧 Paso 1: Configurar Variables de Entorno

### 1. Crear archivo `.env` en la raíz del proyecto:

```bash
# En la raíz de tu proyecto (wp-react-app/)
touch .env
```

### 2. Agregar la configuración de WordPress:

```env
# WordPress API Configuration
REACT_APP_WP_DOMAIN=https://tu-wordpress.com
```

### 3. Ejemplos de dominios válidos:

```env
# Ejemplo 1: Dominio personalizado
REACT_APP_WP_DOMAIN=https://mi-blog.com

# Ejemplo 2: Subdominio
REACT_APP_WP_DOMAIN=https://blog.miempresa.com

# Ejemplo 3: WordPress.com
REACT_APP_WP_DOMAIN=https://mi-blog.wordpress.com
```

## 🔍 Paso 2: Verificar la Configuración

### 1. Reiniciar el servidor de desarrollo:

```bash
# Detener el servidor (Ctrl+C)
# Luego ejecutar:
npm start
```

### 2. Verificar en la consola del navegador:

Deberías ver mensajes como:
```
✅ Configuración válida
🌐 WordPress Domain: https://tu-wordpress.com
🔗 API URL: https://tu-wordpress.com/wp-json/wp/v2
```

## 🌐 Paso 3: Verificar Accesibilidad de la API

### 1. Probar la API directamente en el navegador:

Visita: `https://tu-wordpress.com/wp-json/wp/v2/posts`

Deberías ver una respuesta JSON con los posts.

### 2. Si no funciona, verificar:

- ✅ El dominio es correcto
- ✅ HTTPS está habilitado
- ✅ La API REST de WordPress está habilitada
- ✅ No hay restricciones de CORS

## 🛠️ Paso 4: Solucionar Problemas Comunes

### Problema 1: "REACT_APP_WP_DOMAIN no está configurado"

**Solución:**
```bash
# Verificar que el archivo .env existe
ls -la .env

# Si no existe, crearlo
echo "REACT_APP_WP_DOMAIN=https://tu-wordpress.com" > .env
```

### Problema 2: "No se pudo conectar con la API"

**Soluciones:**
1. Verificar que el dominio es accesible
2. Probar en el navegador: `https://tu-wordpress.com/wp-json/wp/v2`
3. Verificar que no hay firewall bloqueando la conexión

### Problema 3: Error de CORS

**Solución:**
Agregar en tu WordPress (wp-config.php o plugin):
```php
// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
```

## 📱 Paso 5: Probar la Aplicación

### 1. Después de configurar correctamente:

- La aplicación debería cargar sin errores
- Verás logs de precarga exitosa en la consola
- El indicador de rendimiento mostrará datos en caché

### 2. Logs esperados:

```
✅ Configuración válida
🌐 WordPress Domain: https://tu-wordpress.com
🔗 API URL: https://tu-wordpress.com/wp-json/wp/v2
🚀 Iniciando precarga de datos...
✅ Página 1main precargada
✅ Página 2description precargada
✅ Página 3links precargada
✅ Categorías precargadas
✅ Posts generales precargados
📊 Resultado de precarga: 3/3 páginas, categorías: ✅, posts: ✅
✅ Datos precargados exitosamente (parcialmente)
```

## 🔄 Paso 6: Reiniciar y Probar

```bash
# 1. Detener el servidor (Ctrl+C)
# 2. Reiniciar
npm start
# 3. Abrir http://localhost:3000
# 4. Verificar la consola del navegador
```

## 📞 Soporte

Si sigues teniendo problemas:

1. **Verificar la URL de la API**: Visita `https://tu-wordpress.com/wp-json/wp/v2/posts` en el navegador
2. **Revisar la consola**: Busca mensajes de error específicos
3. **Verificar la red**: Asegúrate de que no hay problemas de conectividad

## 🎯 Configuración de Ejemplo Completa

```env
# .env
REACT_APP_WP_DOMAIN=https://mi-blog-personal.com
```

Con esta configuración, la aplicación debería funcionar correctamente y mostrar los datos de tu WordPress. 