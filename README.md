# Libro Reviews — Plataforma de Descubrimiento y Reseñas de Libros

Una plataforma completa para descubrir libros, escribir reseñas y mantener listas de favoritos, con integración de MongoDB y sistema de autenticación JWT.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación Completo
- Registro de usuarios con email y contraseña
- Inicio de sesión seguro con JWT tokens
- Hash de contraseñas con bcryptjs
- Protección de rutas y middleware de autorización
- Sesiones persistentes con cookies HttpOnly

### 📚 Gestión de Reseñas
- Solo usuarios autenticados pueden escribir reseñas
- Los usuarios solo pueden editar/eliminar sus propias reseñas
- Sistema de votación (upvote/downvote) en reseñas
- Calificaciones de 1 a 5 estrellas
- Ordenamiento por fecha de creación

### ❤️ Lista de Favoritos
- Usuarios autenticados pueden marcar libros como favoritos
- Gestión completa de favoritos (agregar/quitar)
- Visualización en perfil de usuario

### 👤 Perfil de Usuario
- Página de perfil personalizada (`/profile`)
- Estadísticas del usuario (total de reseñas, favoritos, calificación promedio)
- Historial de reseñas recientes
- Lista de libros favoritos

### 🗄️ Base de Datos NoSQL (MongoDB)
- Modelos bien definidos para Users, Reviews, Votes, y Favorites
- Conexión con MongoDB local o MongoDB Atlas
- Índices optimizados para consultas eficientes
- Cache de conexión para hot-reload en desarrollo

### 🔍 Integración con APIs Externas
- Google Books API para búsqueda de libros
- Límite gratuito: 1,000 requests/día

### 🧪 Testing Completo
- Tests unitarios con Vitest
- MongoDB Memory Server para tests aislados
- Cobertura de autenticación, CRUD, y autorización
- Tests de integración para servicios MongoDB

## 📋 Requisitos

- **Node.js** 20+
- **npm**
- **MongoDB** (local o MongoDB Atlas)
- (Opcional) **Docker Desktop**

## 🛠️ Instalación y Configuración

### 1. Instalación de Dependencias

```bash
npm ci
```

### 2. Configuración de Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/libro-reviews
# Para MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/libro-reviews

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-change-in-production
AUTH_COOKIE_NAME=auth

# Environment
NODE_ENV=development
```

### 3. Configuración de MongoDB

#### Opción A: MongoDB Local
```bash
# Instalar MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Iniciar MongoDB
mongod
```

#### Opción B: MongoDB con Docker
```bash
docker run -d -p 27017:27017 --name mongo-libro mongo:latest
```

#### Opción C: MongoDB Atlas (Recomendado para producción)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito
3. Obtener connection string
4. Actualizar `MONGODB_URI` en `.env`

### 4. Desarrollo

```bash
npm run dev
# http://localhost:3000
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con UI
npm run test:ui

# Ejecutar tests una sola vez
npm run test:run
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticación (register, login, logout)
│   │   ├── reviews/       # CRUD de reseñas y votaciones
│   │   ├── favorites/     # Gestión de favoritos
│   │   ├── profile/       # Perfil de usuario
│   │   └── search/        # Búsqueda de libros
│   ├── book/[id]/         # Página individual de libro
│   ├── login/             # Página de inicio de sesión
│   ├── register/          # Página de registro
│   └── profile/           # Página de perfil de usuario
├── lib/                   # Utilidades y configuración
│   ├── auth.ts           # Funciones de autenticación
│   ├── jwt.ts            # Manejo de JWT tokens
│   ├── mongo.ts          # Conexión a MongoDB
│   └── validation.ts     # Esquemas de validación con Zod
├── models/               # Modelos de MongoDB (Mongoose)
│   ├── User.ts          # Modelo de usuario
│   ├── Review.ts        # Modelo de reseña
│   ├── Vote.ts          # Modelo de votación
│   └── Favorite.ts      # Modelo de favoritos
├── services/            # Lógica de negocio
│   ├── auth.ts         # Servicios de autenticación
│   ├── reviews.mongo.ts # Servicios de reseñas con MongoDB
│   ├── favorites.mongo.ts # Servicios de favoritos
│   ├── profile.ts      # Servicios de perfil
│   └── books.ts        # Integración con Google Books API
└── test/               # Configuración de testing
    └── mongoTest.ts    # Setup de MongoDB Memory Server
```

## 🔐 Autenticación y Autorización

### Endpoints Protegidos
- `POST /api/reviews` - Crear reseña (requiere autenticación)
- `PUT /api/reviews/[id]` - Editar reseña (solo el autor)
- `DELETE /api/reviews/[id]` - Eliminar reseña (solo el autor)
- `POST /api/reviews/[id]/vote` - Votar reseña (requiere autenticación)
- `GET/PUT/DELETE /api/favorites` - Gestión de favoritos (requiere autenticación)
- `GET /api/profile` - Perfil de usuario (requiere autenticación)

### Middleware de Protección
- Verificación automática de JWT tokens
- Protección de rutas sensibles
- Validación de ownership para operaciones CRUD

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión

### Reseñas
- `GET /api/reviews?bookId=...` - Listar reseñas de un libro
- `POST /api/reviews` - Crear reseña
- `PUT /api/reviews/[id]` - Actualizar reseña
- `DELETE /api/reviews/[id]` - Eliminar reseña
- `POST /api/reviews/[id]/vote` - Votar reseña

### Favoritos
- `GET /api/favorites` - Listar favoritos del usuario
- `PUT /api/favorites/[bookId]` - Agregar a favoritos
- `DELETE /api/favorites/[bookId]` - Quitar de favoritos

### Perfil
- `GET /api/profile` - Obtener perfil completo del usuario

### Búsqueda
- `GET /api/search?q=...` - Buscar libros (Google Books API)

## 🐳 Docker

* `PR - Build` (`.github/workflows/pr-build.yml`): corre en cada PR → `npm ci && npm run build`. Si falla, el PR no se mergea.
### Build local

```bash
docker build -t libro-reviews:local .
```

### Run con MongoDB local

```bash
# Con MongoDB en host
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/libro-reviews" \
  -e JWT_SECRET="your-secret-key" \
  libro-reviews:local
```

### Run con MongoDB Atlas

```bash
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/libro-reviews" \
  -e JWT_SECRET="your-secret-key" \
  libro-reviews:local
```

## 🚀 GitHub Actions

* `PR - Build` (`.github/workflows/pr-build.yml`): Build en cada PR
* `PR - Tests` (`.github/workflows/pr-test.yml`): Tests en cada PR
* `Main - Docker → GHCR` (`.github/workflows/main-docker.yml`): Build y publish a GHCR en push a main

## 🌍 Variables de Entorno para Producción

### Desarrollo Local
```env
MONGODB_URI=mongodb://localhost:27017/libro-reviews
JWT_SECRET=your-development-secret
AUTH_COOKIE_NAME=auth
NODE_ENV=development
```

### Producción (Vercel/Netlify)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/libro-reviews
JWT_SECRET=your-super-secure-production-secret-key
AUTH_COOKIE_NAME=auth
NODE_ENV=production
```

## 📝 Tecnologías Utilizadas

- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Next.js API Routes, Node.js
- **Base de Datos:** MongoDB con Mongoose
- **Autenticación:** JWT (jose), bcryptjs
- **Validación:** Zod
- **Testing:** Vitest, Testing Library, MongoDB Memory Server
- **Styling:** CSS Modules, Inline Styles
- **APIs Externas:** Google Books API
- **DevOps:** Docker, GitHub Actions, GHCR

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar ESLint
npm test             # Tests en modo watch
npm run test:run     # Tests una sola vez
npm run test:ui      # Tests con interfaz UI
```

## 📱 Funcionalidades de Usuario

### Usuario No Autenticado
- Buscar libros con Google Books API
- Ver reseñas existentes y sus puntuaciones
- Ver información detallada de libros
- Acceder a páginas de login y registro

### Usuario Autenticado
- **Todo lo anterior más:**
- Escribir reseñas con calificación de 1-5 estrellas
- Editar y eliminar sus propias reseñas
- Votar reseñas de otros usuarios (upvote/downvote)
- Agregar/quitar libros de su lista de favoritos
- Acceder a su perfil con estadísticas personales
- Ver historial completo de sus reseñas

## 🎯 Casos de Uso Principales

1. **Descubrimiento de Libros:** Buscar libros por título, autor o ISBN
2. **Lectura de Reseñas:** Ver opiniones y calificaciones de otros lectores
3. **Escritura de Reseñas:** Compartir experiencias de lectura
4. **Curación de Contenido:** Sistema de votación para promover reseñas útiles
5. **Gestión Personal:** Lista de favoritos y perfil de lectura
6. **Estadísticas:** Seguimiento de actividad de lectura y reseñas

## 🛡️ Seguridad

- Contraseñas hasheadas con bcryptjs (10 rounds)
- JWT tokens con expiración configurable
- Cookies HttpOnly para prevenir XSS
- Validación de entrada con Zod
- Middleware de autorización en rutas protegidas
- Verificación de ownership para operaciones CRUD

## 🔄 Estado del Proyecto

✅ **Completado:**
- Sistema de autenticación JWT completo
- Integración MongoDB con modelos optimizados
- CRUD completo de reseñas con autorización
- Sistema de votación de reseñas
- Gestión de favoritos
- Perfil de usuario con estadísticas
- Testing comprehensivo
- Documentación completa

✅ **Características Avanzadas:**
- Middleware de protección de rutas
- Manejo de errores personalizado
- Validación robusta con Zod
- Tests de integración con MongoDB Memory Server
- Docker support completo
- CI/CD con GitHub Actions

## 📞 Soporte

Para reportar bugs o solicitar nuevas características, crear un issue en el repositorio de GitHub.

---

**🎉 ¡Disfruta explorando y reseñando libros!**
