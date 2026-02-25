import { Request, Response } from "express";
import { container } from "tsyringe";
import { MagicMoverService } from "../services/MagicMoverService";

/**
 * Controller handling Magic Mover HTTP requests.
 */
export class MagicMoverController {
  /**
   * POST /api/movers - Create a new Magic Mover
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, weightLimit } = req.body;

      if (!name || weightLimit === undefined) {
        res.status(400).json({ error: "Name and weightLimit are required" });
        return;
      }

      const service = container.resolve(MagicMoverService);
      const mover = await service.createMover(name, weightLimit);
      res.status(201).json(mover);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/movers - Get all Magic Movers
   */
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const service = container.resolve(MagicMoverService);
      const movers = await service.getAllMovers();
      res.json(movers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/movers/:id - Get a Magic Mover by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const service = container.resolve(MagicMoverService);
      const mover = await service.getMoverById(req.params.id as string);

      if (!mover) {
        res.status(404).json({ error: "Magic Mover not found" });
        return;
      }

      res.json(mover);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/movers/:id/load - Load an item onto a Magic Mover
   */
  static async loadItem(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.body;

      if (!itemId) {
        res.status(400).json({ error: "itemId is required" });
        return;
      }

      const service = container.resolve(MagicMoverService);
      const mover = await service.loadItem(req.params.id as string, itemId);
      res.json(mover);
    } catch (error: any) {
      if (
        error.message.includes("not found") ||
        error.message.includes("already loaded")
      ) {
        res.status(404).json({ error: error.message });
      } else if (
        error.message.includes("Cannot load") ||
        error.message.includes("Weight limit")
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * PUT /api/movers/:id/start-mission - Start a mission
   */
  static async startMission(req: Request, res: Response): Promise<void> {
    try {
      const service = container.resolve(MagicMoverService);
      const mover = await service.startMission(req.params.id as string);
      res.json(mover);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else if (
        error.message.includes("already on") ||
        error.message.includes("no items")
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * PUT /api/movers/:id/end-mission - End a mission
   */
  static async endMission(req: Request, res: Response): Promise<void> {
    try {
      const service = container.resolve(MagicMoverService);
      const mover = await service.endMission(req.params.id as string);
      res.json(mover);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes("not on a mission")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * GET /api/movers/leaderboard - Get movers sorted by completed missions
   */
  static async getLeaderboard(_req: Request, res: Response): Promise<void> {
    try {
      const service = container.resolve(MagicMoverService);
      const movers = await service.getLeaderboard();
      res.json(movers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
