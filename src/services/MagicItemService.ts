import { injectable } from "tsyringe";
import { MagicItem, IMagicItem } from "../models";

/**
 * Service responsible for Magic Item business logic.
 */
@injectable()
export class MagicItemService {
  /**
   * Creates a new Magic Item.
   * @param name - The name of the item
   * @param weight - The weight of the item
   * @returns The created Magic Item
   */
  async createItem(name: string, weight: number): Promise<IMagicItem> {
    const item = new MagicItem({ name, weight });
    return item.save();
  }

  /**
   * Retrieves all Magic Items.
   * @returns Array of all Magic Items
   */
  async getAllItems(): Promise<IMagicItem[]> {
    return MagicItem.find();
  }

  /**
   * Retrieves a Magic Item by its ID.
   * @param id - The item ID
   * @returns The Magic Item or null
   */
  async getItemById(id: string): Promise<IMagicItem | null> {
    return MagicItem.findById(id);
  }
}
