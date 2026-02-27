# 🧙 Magic Transporters

A REST API for managing **Magic Movers** and **Magic Items**. Magic Movers are special transporters that use nifty gadgets to move important things. Fueled by virtual magic, these Movers go on quick missions to carry items around.

## 📋 Features

- **Add Magic Movers** with configurable weight limits
- **Add Magic Items** with name and weight
- **Load items** onto movers with weight validation and activity logging
- **Start missions** — sets mover to "on-mission" state, prevents further loading
- **End missions** — unloads items, returns mover to "resting" state
- **Leaderboard** — view who completed the most missions (sorted descending)
- **Activity Logging** — every state change (loading, on-mission, resting) is recorded in the database
- **Custom Error Handling** — structured error classes (NotFoundError, ValidationError, ConflictError)
- **Live API Docs** — Swagger UI at `/api-docs`

## 🛠️ Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **DI:** tsyringe (Dependency Injection)
- **Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Security:** Helmet + CORS
- **Testing:** Jest + Supertest (e2e tests)
- **Containerization:** Docker + Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/Fadi-Louise/Magic-Transporters.git
cd Magic-Transporters

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start in development mode
npm run dev
```

The server will start at `http://localhost:3000` and automatically redirect to the Swagger docs.

### Using Docker

```bash
# Start both API and MongoDB
docker-compose up --build

# Stop
docker-compose down
```

## 📡 API Endpoints

| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| POST   | `/api/movers`                   | Create a new Magic Mover                 |
| GET    | `/api/movers`                   | Get all Magic Movers                     |
| GET    | `/api/movers/:id`               | Get a Magic Mover by ID                  |
| POST   | `/api/movers/:id/load`          | Load an item onto a mover                |
| PUT    | `/api/movers/:id/start-mission` | Start a mission                          |
| PUT    | `/api/movers/:id/end-mission`   | End a mission (unload, back to resting)  |
| GET    | `/api/movers/leaderboard`       | Movers sorted by most completed missions |
| POST   | `/api/items`                    | Create a new Magic Item                  |
| GET    | `/api/items`                    | Get all Magic Items                      |
| GET    | `/api/items/:id`                | Get a Magic Item by ID                   |
| GET    | `/health`                       | Health check endpoint                    |

### Example: Create a Mover

```bash
curl -X POST http://localhost:3000/api/movers \
  -H "Content-Type: application/json" \
  -d '{"name": "Swift Carrier", "weightLimit": 100}'
```

### Example: Create an Item

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Golden Amulet", "weight": 5}'
```

### Example: Load an Item onto a Mover

```bash
curl -X POST http://localhost:3000/api/movers/<moverId>/load \
  -H "Content-Type: application/json" \
  -d '{"itemId": "<itemId>"}'
```

### Example: Start a Mission

```bash
curl -X PUT http://localhost:3000/api/movers/<moverId>/start-mission
```

### Example: End a Mission

```bash
curl -X PUT http://localhost:3000/api/movers/<moverId>/end-mission
```

### Example: View Leaderboard

```bash
curl http://localhost:3000/api/movers/leaderboard
```

## 📚 API Documentation

Live Swagger documentation is available at:

```
http://localhost:3000/api-docs
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

> **Note:** Tests use a separate `magic-transporters-test` database on your local MongoDB to avoid interfering with development data.

## 📁 Project Structure

```
src/
├── config/
│   ├── container.ts    # DI container setup (tsyringe)
│   ├── database.ts     # MongoDB connection
│   └── swagger.ts      # Swagger/OpenAPI configuration
├── controllers/
│   ├── MagicItemController.ts   # Magic Item request handlers
│   └── MagicMoverController.ts  # Magic Mover request handlers
├── models/
│   ├── ActivityLog.ts  # Activity log schema (DB logging)
│   ├── MagicItem.ts    # Magic Item schema
│   └── MagicMover.ts   # Magic Mover schema
├── routes/
│   ├── magicItemRoutes.ts   # Item endpoints + Swagger docs
│   └── magicMoverRoutes.ts  # Mover endpoints + Swagger docs
├── services/
│   ├── MagicItemService.ts  # Item business logic
│   └── MagicMoverService.ts # Mover business logic (load, mission, leaderboard)
├── utils/
│   └── errors.ts       # Custom error classes (AppError, NotFoundError, etc.)
├── app.ts              # Express app setup (middleware, routes, Swagger)
└── server.ts           # Entry point (DB connect + server start)
tests/
├── setup.ts            # Test DB connection helpers
├── magicItem.test.ts   # Magic Item e2e tests
└── magicMover.test.ts  # Magic Mover e2e tests
```

## 📝 Scripts

| Script              | Description                  |
|---------------------|------------------------------|
| `npm run dev`       | Start dev server (hot-reload)|
| `npm run build`     | Compile TypeScript           |
| `npm start`         | Run compiled JS              |
| `npm test`          | Run e2e tests                |
| `npm run test:coverage` | Run tests with coverage  |

## � Future Improvements

- JWT authentication for protected endpoints
- Rate limiting to prevent abuse

## �📄 License

ISC
