# ====== Builder ======
FROM node:20-bookworm-slim AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Instalar dependencias (usando lockfile si tenés package-lock.json)
COPY package*.json ./
RUN npm ci

# Generar Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Copiar el resto y buildear Next con output standalone
COPY . .
RUN npm run build

# ====== Runner ======
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copiamos lo mínimo para correr
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "server.js"]
