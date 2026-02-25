import { Request, Response } from "express";
import { container } from "tsyringe";
import { MagicItemService } from "../services/MagicItemService";

/**
 * Controller handling Magic Item HTTP requests.
 */
export class MagicItemController {
  /**
   * POST /api/items - Create a new Magic Item
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, weight } = req.body;

      if (!name || weight === undefined) {
        res.status(400).json({ error: "Name and weight are required" });
        return;
      }

      const service = container.resolve(MagicItemService);
      const item = await service.createItem(name, weight);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/items - Get all Magic Items
   */
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const service = container.resolve(MagicItemService);
      const items = await service.getAllItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/items/:id - Get a Magic Item by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const service = container.resolve(MagicItemService);
      const item = await service.getItemById(req.params.id as string);

      if (!item) {
        res.status(404).json({ error: "Magic Item not found" });
        return;
      }

      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
