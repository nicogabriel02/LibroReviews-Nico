# Libro Reviews — README

## 1) Cómo hacer el deploy **local**

**Requisitos:** Node 20, npm, (opcional) Docker Desktop.

1. Instalar deps

   ```bash
   npm ci
   ```
2. Crear `.env` (no lo subas al repo)

   ```env
   DATABASE_URL="postgresql://libro:libro@localhost:5433/libro?schema=public"
   ```
3. (Opcional) Levantar Postgres con Docker Compose:

   ```yaml
   # docker-compose.yml
   services:
     db:
       image: postgres:16-alpine
       environment:
         POSTGRES_USER: libro
         POSTGRES_PASSWORD: libro
         POSTGRES_DB: libro
       ports:
         - "5433:5432"
       volumes:
         - dbdata:/var/lib/postgresql/data
   volumes: { dbdata: {} }
   ```

   ```bash
   docker compose up -d
   ```
4. Migraciones + dev

   ```bash
   npx prisma migrate dev -n init
   npm run dev
   # http://localhost:3000
   ```

---

## 2) Cómo funcionan los **GitHub Actions**

* `PR - Build` (`.github/workflows/pr-build.yml`): corre en cada PR → `npm ci && npm run build`. Si falla, el PR no se mergea.
* `PR - Tests` (`.github/workflows/pr-test.yml`): corre en cada PR → `npm run test -- --run`. Si falla, el PR no se mergea.
* `Main - Docker → GHCR` (`.github/workflows/main-docker.yml`): al pushear a `main` construye la imagen con el `Dockerfile` y la publica en **ghcr.io/OWNER/REPO** con tags `latest`, `version` y `sha`.

> En Vercel (producción) el Build Command recomendado es:
> `npx prisma generate && npx prisma migrate deploy && next build`

---

## 3) Variables de entorno necesarias

* `DATABASE_URL`

  * **Local:** `postgresql://libro:libro@localhost:5433/libro?schema=public`
  * **Prod (Vercel):** cadena **remota** (Prisma Postgres/Neon), p. ej.
    `postgresql://USER:PASS@HOST:5432/DB?sslmode=require`
* (Opcional) `NEXT_TELEMETRY_DISABLED=1`

> Asegurate de **no** commitear `.env`.

---

## 4) Ejecutar con **Docker**

### Build local

```bash
docker build -t libro-reviews:local .
```

### Run contra DB **local** (compose en 5433)

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://libro:libro@host.docker.internal:5433/libro?schema=public" \
  libro-reviews:local
```

### Run contra DB **remota**

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://USER:PASS@HOST:5432/DB?sslmode=require" \
  libro-reviews:local
```

### (Opcional) Usar imagen publicada en GHCR

```bash
docker pull ghcr.io/OWNER/REPO:latest
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://USER:PASS@HOST:5432/DB?sslmode=require" \
  ghcr.io/OWNER/REPO:latest
```
