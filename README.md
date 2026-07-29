# ClickUp Clone (interno, TrustCore Services)

Herramienta de gestión de proyectos autoalojada: Espacios > Listas > Tareas, con tablero kanban, usuarios/contraseñas propios y sin dependencias de ClickUp. Pensada para correr en Docker, primero en tu propio computador (accesible por tu equipo vía red local) y después en el hosting que provea IT, sin reescribir nada.

## Stack

- Backend: Node.js + TypeScript + Express + Prisma
- Frontend: React + TypeScript + Vite
- Base de datos: PostgreSQL
- Todo orquestado con Docker Compose

## Requisitos (en la máquina que va a "hostear" la app)

1. **Docker Desktop** (incluye Docker Compose): https://www.docker.com/products/docker-desktop/
2. Eso es todo para correrlo — no necesitas instalar Node.js ni Postgres a mano, quedan dentro de los contenedores.
   - Si además quieres desarrollar (cambiar código) con recarga en caliente fuera de Docker, instala también **Node.js 20 LTS**: https://nodejs.org/

## Puesta en marcha (M1: login funcionando)

1. Copia `.env.example` a `.env` en la raíz del proyecto y cambia `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` por valores aleatorios.
2. Averigua la IP local de la máquina donde vas a correr esto (para que tus compañeros puedan conectarse):
   ```bash
   ipconfig
   ```
   Busca la "Dirección IPv4" de tu adaptador de red (ej. `192.168.1.50`).
3. En `.env`, agrega esa IP a `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=http://localhost:3000,http://192.168.1.50:3000
   ```
4. Levanta todo:
   ```bash
   docker compose up --build
   ```
5. Abre `http://localhost:3000` en tu navegador (o `http://<tu-ip-local>:3000` desde otro computador de la misma red). Crea una cuenta y confirma que el login funciona.
6. Para apagar sin borrar datos: `docker compose down` (sin `-v`, eso sí borraría la base de datos).

## Notas de seguridad para uso en red local

- El tráfico va sin cifrar (HTTP, no HTTPS) porque es solo para la red local. No expongas estos puertos a internet tal cual — cuando IT dé el hosting definitivo, se debe agregar HTTPS.
- Las contraseñas se guardan hasheadas (argon2), nunca en texto plano.
- Cada usuario que quiera entrar debe registrarse desde la pantalla de login (no hay invitaciones todavía — se puede agregar más adelante).

## Estado del proyecto

- [x] M1 — Scaffold, Docker Compose, autenticación (usuario/contraseña, JWT + refresh token)
- [ ] M2 — Espacios y Listas
- [ ] M3 — Tareas + tablero kanban
- [ ] M4 — Asignados, comentarios, prioridad, fecha de entrega
- [ ] M5 — Pulido y hardening
- [ ] Fase 2 (futuro) — Chat interno en tiempo real

## Desarrollo local sin Docker (opcional)

Backend:
```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```
