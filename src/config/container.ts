import "reflect-metadata";
import { container } from "tsyringe";
import { MagicMoverService } from "../services/MagicMoverService";
import { MagicItemService } from "../services/MagicItemService";

/**
 * Registers all services in the DI container.
 * Call this once at application startup.
 */
export function setupContainer(): void {
  container.registerSingleton<MagicMoverService>(MagicMoverService);
  container.registerSingleton<MagicItemService>(MagicItemService);
}

export { container };
