# 🧙 Magic Transporters

A REST API for managing **Magic Movers** and **Magic Items**. Magic Movers are special transporters that use nifty gadgets to move important things. Fueled by virtual magic, they go on quick missions to carry items around.

## 📋 Features

- **Add Magic Movers** with configurable weight limits
- **Add Magic Items** with name and weight
- **Load items** onto movers with weight validation and activity logging
- **Start missions** — sets mover to "on-mission" state, prevents further loading
- **End missions** — unloads items, returns mover to "resting" state
- **Leaderboard** — view who completed the most missions (sorted descending)
- **Activity Logging** — every state change is recorded in the database
- **Live API Docs** — Swagger UI at `/api-docs`

## 🛠️ Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **DI:** tsyringe (Dependency Injection)
- **Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
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

### Example: Create a Mover

```bash
curl -X POST http://localhost:3000/api/movers \
  -H "Content-Type: application/json" \
  -d '{"name": "Swift Carrier", "weightLimit": 100}'
```

### Example: Load an Item

```bash
curl -X POST http://localhost:3000/api/movers/<moverId>/load \
  -H "Content-Type: application/json" \
  -d '{"itemId": "<itemId>"}'
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

## 📁 Project Structure

```
src/
├── config/
│   ├── container.ts    # DI container setup (tsyringe)
│   ├── database.ts     # MongoDB connection
│   └── swagger.ts      # Swagger configuration
├── controllers/
│   ├── MagicItemController.ts
│   └── MagicMoverController.ts
├── models/
│   ├── ActivityLog.ts  # Activity log schema
│   ├── MagicItem.ts    # Magic Item schema
│   └── MagicMover.ts   # Magic Mover schema
├── routes/
│   ├── magicItemRoutes.ts
│   └── magicMoverRoutes.ts
├── services/
│   ├── MagicItemService.ts
│   └── MagicMoverService.ts
├── app.ts              # Express app setup
└── server.ts           # Entry point
tests/
├── setup.ts            # Test DB helpers
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

## 📄 License

ISC
