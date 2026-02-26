/**
 * Base class for custom API errors.
 * Extends the native Error class with an HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when a requested resource is not found.
 * Returns HTTP 404.
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

/**
 * Error thrown when input validation fails.
 * Returns HTTP 400.
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * Error thrown when an action conflicts with current state.
 * Returns HTTP 409.
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
