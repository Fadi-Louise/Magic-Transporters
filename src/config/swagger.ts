import swaggerJsdoc from "swagger-jsdoc";

/**
 * Swagger/OpenAPI configuration for live API documentation.
 */
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Magic Transporters API",
      version: "1.0.0",
      description:
        "REST API for managing Magic Movers and Magic Items. " +
        "Magic Movers carry items on missions fueled by virtual magic.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Magic Movers",
        description: "Endpoints for managing Magic Movers",
      },
      {
        name: "Magic Items",
        description: "Endpoints for managing Magic Items",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
