import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { setupContainer } from "./config/container";
import { swaggerSpec } from "./config/swagger";
import routes from "./routes";

// Initialize DI container
setupContainer();

/**
 * Express application instance.
 * Configured with security headers, CORS, JSON parsing,
 * Swagger docs, and API routes.
 */
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root route - redirect to API docs
app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

export default app;
