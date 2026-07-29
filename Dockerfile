# Dockerfile combinado para hosting en la nube (ej. Render) donde solo se
# puede desplegar UN servicio: construye frontend y backend, y el backend
# sirve el build del frontend desde el mismo origen (ver backend/src/app.ts).
#
# El Docker Compose local (docker-compose.yml) NO usa este archivo -- ese
# sigue usando backend/Dockerfile y frontend/Dockerfile por separado.

FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
ENV VITE_API_BASE_URL=/api
RUN npm run build

FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install
COPY backend/ ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm install --omit=dev

COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/src/prisma ./backend/src/prisma
COPY --from=backend-build /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 4000

CMD ["sh", "-c", "cd backend && npx prisma migrate deploy --schema src/prisma/schema.prisma && node dist/server.js"]
