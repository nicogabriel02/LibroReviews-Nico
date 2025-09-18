# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a poner en funcionamiento el proyecto en menos de 5 minutos.

## ⚡ Inicio Rápido (Desarrollo Local)

### 1. Pre-requisitos
- Node.js 20+ instalado
- MongoDB instalado localmente (o cuenta de MongoDB Atlas)

### 2. Configuración Básica

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd LibroReviews-Nico

# 2. Instalar dependencias
npm ci

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

### 3. Configuración de MongoDB

#### Opción A: MongoDB Local (Más Rápido)
```bash
# Instalar MongoDB si no lo tienes
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Iniciar MongoDB
mongod
```

#### Opción B: Docker (Recomendado)
```bash
docker run -d -p 27017:27017 --name mongo-libro mongo:latest
```

#### Opción C: MongoDB Atlas (Producción)
1. Ir a [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crear cuenta gratuita
3. Crear cluster
4. Obtener connection string
5. Actualizar `MONGODB_URI` en `.env`

### 4. Iniciar el Proyecto

```bash
npm run dev
```

¡Visita http://localhost:3000 y empieza a usar la aplicación!

## 🧪 Verificar que Todo Funciona

### Ejecutar Tests
```bash
npm test
```

### Verificar Funcionalidades Básicas
1. ✅ Ir a `/register` y crear una cuenta
2. ✅ Hacer login en `/login`
3. ✅ Buscar un libro en la página principal
4. ✅ Escribir una reseña
5. ✅ Votar una reseña
6. ✅ Agregar un libro a favoritos
7. ✅ Ver tu perfil en `/profile`

## 🔧 Comandos Útiles para Desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Tests en modo watch
npm run test:watch

# Build para producción
npm run build

# Linter
npm run lint

# Tests con interfaz gráfica
npm run test:ui
```

## 🐛 Solución de Problemas Comunes

### MongoDB Connection Error
```bash
# Verificar que MongoDB está corriendo
mongod --version

# Verificar conexión
mongo --eval "db.stats()"
```

### JWT Secret Error
```bash
# Asegurar que JWT_SECRET está configurado en .env
echo $JWT_SECRET  # Linux/macOS
echo %JWT_SECRET% # Windows
```

### Puertos en Uso
```bash
# Cambiar puerto si 3000 está ocupado
npm run dev -- -p 3001
```

### Limpiar Cache
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📱 Próximos Pasos

Una vez que tengas todo funcionando:

1. **Explora la API:** Revisa los endpoints en `src/app/api/`
2. **Personaliza el Frontend:** Modifica componentes en `src/app/`
3. **Agrega Funcionalidades:** Usa los modelos en `src/models/`
4. **Escribe Tests:** Agrega tests en `src/**/*.test.ts`
5. **Deploy:** Sigue la guía de deployment en el README principal

## 🆘 ¿Necesitas Ayuda?

- 📖 Lee el README completo para documentación detallada
- 🐛 Reporta bugs creando un GitHub Issue
- 💬 Revisa los comentarios en el código para entender la lógica
- 🧪 Ejecuta los tests para ver ejemplos de uso

¡Feliz desarrollo! 🎉