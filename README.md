<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/WebSockets-010101?style=flat-square&logo=websocket&logoColor=white" alt="WebSockets" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white" alt="Turborepo" />
</p>

# DrawBoard — Real-Time Collaborative Whiteboard

A **collaborative whiteboard** application (inspired by Excalidraw) that lets multiple users draw on a shared canvas in real time. Built as a TypeScript monorepo with a Next.js frontend, Express HTTP API, WebSocket server, and PostgreSQL database.

---

## Architecture

```mermaid
graph LR
    subgraph Frontend
        A[excalidraw-fe<br/>Next.js :3002]
    end

    subgraph Backend
        B[http-backend<br/>Express :3001]
        C[ws-backend<br/>WebSocket :8080]
    end

    subgraph Data
        D[(PostgreSQL<br/>:5432)]
    end

    A -- REST API --> B
    A -- WebSocket --> C
    B -- Prisma --> D
    C -- Prisma --> D
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19, Canvas API, Tailwind CSS | Infinite-canvas drawing UI with pan/zoom |
| **HTTP API** | Express 5, JWT, cookie-based auth | Auth (signup/signin), room CRUD, chat history |
| **WebSocket Server** | `ws` library | Real-time shape broadcasting between clients |
| **Database** | PostgreSQL 16 + Prisma ORM | Users, rooms, and chat/shape persistence |
| **Monorepo** | Turborepo + pnpm workspaces | Shared packages, unified dev/build pipeline |

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9 (`npm install -g pnpm`)
- **Docker** & **Docker Compose** (for the database)

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/draw-app.git
cd draw-app
pnpm install
```

### 2. Start the Database

```bash
docker compose up -d
```

This spins up a PostgreSQL 16 container on port `5432` with persistent storage.

### 3. Configure Environment

Copy the example env file to each service that needs it:

```bash
cp .env.example packages/db/.env
cp .env.example apps/http-backend/.env
cp .env.example apps/ws-backend/.env
```

> **Note:** The defaults in `.env.example` match the Docker Compose config and work out of the box for local development.

### 4. Run Database Migrations

```bash
cd packages/db
npx prisma migrate dev --name init
cd ../..
```

### 5. Start All Services

```bash
pnpm dev
```

This starts all apps and packages in development mode via Turborepo:

| Service | URL |
|---------|-----|
| Frontend (excalidraw-fe) | [http://localhost:3002](http://localhost:3002) |
| HTTP API | [http://localhost:3001](http://localhost:3001) |
| WebSocket Server | [ws://localhost:8080](ws://localhost:8080) |
| PostgreSQL | `localhost:5432` |

### 6. Try It Out

1. Open [http://localhost:3002](http://localhost:3002)
2. Create an account (Sign Up)
3. Sign in with your credentials
4. Create a room and start drawing
5. Open a second browser tab, sign in, join the same room — see real-time sync!

---

## Project Structure

```
draw-app/
├── apps/
│   ├── excalidraw-fe/          # Next.js collaborative whiteboard frontend
│   │   ├── app/
│   │   │   ├── canvas/[roomId] # Drawing canvas route
│   │   │   ├── components/     # AuthPage, Canvas, RoomCanvas
│   │   │   ├── draw/           # Game engine, HTTP utils, coordinate utils
│   │   │   ├── home/           # Dashboard (create/join rooms)
│   │   │   ├── signin/         # Sign in page
│   │   │   └── signup/         # Sign up page
│   │   └── ...
│   ├── http-backend/           # Express REST API
│   │   └── src/
│   │       ├── index.ts        # Routes: signup, signin, room, chats
│   │       └── middleware.ts   # JWT cookie auth middleware
│   ├── ws-backend/             # WebSocket server
│   │   └── src/
│   │       ├── index.ts        # Connection handling, room management
│   │       └── types.ts        # User type definition
│   └── web/                    # Legacy chat frontend (unused)
├── packages/
│   ├── backend-common/         # Shared backend config (JWT_SECRET)
│   ├── common/                 # Shared Zod schemas (signup, signin, room)
│   ├── db/                     # Prisma client, schema, migrations
│   │   ├── prisma/
│   │   │   └── schema.prisma   # User, Room, Chat models
│   │   └── src/index.ts        # PrismaClient singleton export
│   ├── eslint-config/          # Shared ESLint configuration
│   ├── typescript-config/      # Shared tsconfig presets
│   └── ui/                     # Shared React components
├── docker-compose.yml          # PostgreSQL 16 container
├── .env.example                # Environment variable template
├── turbo.json                  # Turborepo pipeline config
├── pnpm-workspace.yaml         # pnpm workspace definition
└── package.json                # Root scripts & devDependencies
```

---

## Environment Variables

| Variable | Description | Default (local dev) |
|----------|-------------|---------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://drawapp:drawapp@localhost:5432/drawapp` |
| `JWT_SECRET` | Secret key for signing JWTs | `Secret123123!` |

All services read `DATABASE_URL` from their respective `.env` files. The HTTP and WebSocket backends also read `JWT_SECRET` (falling back to a hardcoded default if unset).

---

## Key Concepts

### Authentication Flow

1. **Sign Up** → `POST /signup` — creates user in DB, returns `userId`
2. **Sign In** → `POST /signin` — verifies credentials, sets `access_token` HTTP-only cookie
3. **Authenticated requests** — cookie is sent automatically (REST via `withCredentials`, WebSocket via cookie header)

### Real-Time Drawing

1. Client connects to WebSocket server with auth cookie
2. Client sends `join_room` message
3. On draw, client sends `chat` message with serialised shape data
4. Server persists shape to DB and broadcasts to all clients in the room
5. On page load, existing shapes are fetched via `GET /chats/:roomId`

### Canvas Engine

The `Game` class (`apps/excalidraw-fe/app/draw/Game.ts`) manages:
- **Viewport transforms** — pan (pointer tool) and zoom (scroll wheel)
- **Shape rendering** — rectangles, circles, freehand pencil paths
- **Coordinate mapping** — screen ↔ world coordinate conversion
- **WebSocket sync** — incoming shapes are appended and re-rendered

---

## Development

### Running Individual Services

```bash
# Frontend only
pnpm --filter excalidraw-fe dev

# HTTP backend only
pnpm --filter http-backend dev

# WebSocket backend only
pnpm --filter ws-backend dev
```

### Database Operations

```bash
cd packages/db

# Generate Prisma client after schema changes
npx prisma generate

# Create and apply a new migration
npx prisma migrate dev --name <migration-name>

# Open Prisma Studio (DB GUI)
npx prisma studio

# Reset database (warning: deletes all data)
npx prisma migrate reset
```

### Building for Production

```bash
pnpm build
```

---

## Docker

### Start Database

```bash
docker compose up -d        # Start Postgres in background
docker compose logs -f       # View logs
docker compose down          # Stop containers
docker compose down -v       # Stop & remove volumes (reset data)
```

### Verify Database Health

```bash
docker compose ps            # Check container status
docker exec -it drawapp-postgres psql -U drawapp -d drawapp
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes and ensure `pnpm build` passes
4. Commit with a descriptive message
5. Push and open a pull request

---

## License

This project is open source under the [MIT License](LICENSE).
