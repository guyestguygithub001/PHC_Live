# Containerization and Deployment Guide

This guide covers how to run PHC Live in a container, what the production deployment looks like, and what a conversion engineering team would need to know before taking this system from development to a live facility.

The system is built to run on modest hardware. The target environment is a PHC or general hospital in a location where electricity may be intermittent, internet connectivity is patchy, and the IT team (if one exists at all) has limited resources. Every decision in this guide is made with that context in mind.

---

## System overview for deployment

PHC Live has two processes that need to run:

| Process | Technology | Default port |
|---|---|---|
| API server (backend) | Go binary | 3001 |
| Web app (frontend) | Static files served by any HTTP server | 5173 (dev) / 80 (prod) |

In production, the frontend is built to a folder of static HTML/CSS/JS files. There is no Node.js running in production — just a lightweight HTTP server (like Nginx or Caddy) serving those files.

The backend connects to a PostgreSQL database. In the current setup that database is Neon (cloud-hosted PostgreSQL). For offline/LAN deployments, a local PostgreSQL instance can be used instead.

---

## Docker setup

### Backend Dockerfile

```dockerfile
# Build stage
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o clinic-server .

# Runtime stage — tiny image, no build tools
FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=builder /app/clinic-server .
EXPOSE 3001
CMD ["./clinic-server"]
```

### Frontend Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage — Nginx serves the static files
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Nginx config for the frontend

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # All routes go to index.html — React handles routing client-side
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API requests are proxied to the Go backend
    location /api/ {
        proxy_pass http://clinic-server:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Compose (full stack)

```yaml
version: '3.9'

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: phclive
      POSTGRES_USER: phc_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  clinic-server:
    build:
      context: ./clinic-server
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://phc_user:${DB_PASSWORD}@db:5432/phclive?sslmode=disable
      PORT: 3001
    depends_on:
      - db
    ports:
      - "3001:3001"

  clinic-app:
    build:
      context: ./clinic-app
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      - clinic-server
    ports:
      - "80:80"

volumes:
  postgres_data:
```

To start everything:

```bash
cp .env.example .env
# fill in DB_PASSWORD in .env
docker compose up -d
```

To run database migrations after first start:

```bash
docker compose exec clinic-server ./clinic-server --migrate
```

> Note: The `--migrate` flag needs to be added to main.go before this command works. It is on the roadmap.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes (for online mode) | Full PostgreSQL connection string |
| `PORT` | No | API port (defaults to 3001) |
| `DB_PASSWORD` | Yes (for Docker Compose) | Postgres password (used in compose only) |

If `DATABASE_URL` is empty or the database is unreachable, the backend automatically falls into offline in-memory mode. Data stored in offline mode is lost when the container restarts, so this mode is intended for demo or emergency-use scenarios only.

---

## Offline / LAN deployment (no internet)

For facilities with no internet connection, the recommended setup is:

1. Run the Docker Compose stack on a laptop or small form-factor PC (e.g. a mini PC with 8GB RAM).
2. Point `DATABASE_URL` at the local Postgres container instead of Neon.
3. Connect a LAN switch or Wi-Fi router to the same machine.
4. Clinic staff connect to the system over the local network using tablets or phones.

The clinic-server serves the API at `http://<server-ip>:3001`.
The clinic-app (via Nginx) serves the web interface at `http://<server-ip>:80`.

No internet connection is needed once the containers are running.

---

## Database backup

For local deployments, set up a daily backup with:

```bash
# Run as a cron job on the host machine
docker compose exec db pg_dump -U phc_user phclive > backup_$(date +%Y%m%d).sql
```

Store backups on a USB drive or external hard disk. In environments where drives fail frequently, keep at least two copies in different physical locations.

---

## Conversion engineering notes

"Conversion engineering" refers to the work of taking a working development system and adapting it to run stably in a specific facility's environment. Here is what that team needs to know.

### Database schema setup

On first deployment, the database schema needs to be created. The SQL files are in `/clinic-server/migrations/`. They should be run in order (001, 002, etc.).

At the time of writing, the migrations need to be run manually. A proper migration runner (using something like `golang-migrate`) is planned but not yet implemented.

### API base URL

The frontend currently hardcodes `http://localhost:3001` as the API base URL. Before deploying to a real network, this needs to be replaced with the server's actual IP address or hostname. The cleanest way to handle this is to set a `VITE_API_BASE_URL` environment variable during the frontend build:

```bash
VITE_API_BASE_URL=http://192.168.1.100:3001 npm run build
```

Then update all fetch calls in the frontend from `http://localhost:3001` to `import.meta.env.VITE_API_BASE_URL`.

This is currently a known gap and is tracked as a required step before any facility pilot.

### PHC identifier prefix

The system currently uses `PHC-PLA-` as the prefix for Plateau State. For a different state or facility, this prefix needs to change in one place: the `createPatient` handler in `clinic-server/handlers.go`. Search for `PHC-PLA-` and update accordingly. Same for `ANC-PLA-`.

### User authentication

There is currently no login system. Every person on the network can access every module. For pilot testing in a controlled setting this is acceptable, but before a wider rollout, role-based access control needs to be added. The planned approach is JWT tokens with roles: `RECORDS`, `NURSE`, `DOCTOR`, `LAB`, `PHARMACY`, `ADMIN`.

### HTTPS

For any deployment where the server is accessible over a real network (even a local one), TLS should be set up. Caddy is a good choice for this because it handles certificate management automatically for internet-accessible deployments.

For local-only deployments, self-signed certificates can be used.

### Monitoring

In production, the `/health` endpoint can be polled by a monitoring tool (e.g. UptimeKuma, which is lightweight and self-hosted). It returns:

```json
{ "status": "ok", "mode": "online" }
```

If `mode` is `offline`, the system is running without database connectivity.
