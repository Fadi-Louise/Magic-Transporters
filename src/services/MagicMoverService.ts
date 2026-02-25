import { injectable } from "tsyringe";
import { MagicMover, IMagicMover, MagicItem, ActivityLog } from "../models";

/**
 * Service responsible for Magic Mover business logic.
 */
@injectable()
export class MagicMoverService {
  /**
   * Creates a new Magic Mover.
   * @param name - The name of the mover
   * @param weightLimit - Maximum weight capacity
   * @returns The created Magic Mover
   */
  async createMover(name: string, weightLimit: number): Promise<IMagicMover> {
    const mover = new MagicMover({ name, weightLimit });
    return mover.save();
  }

  /**
   * Retrieves all Magic Movers.
   * @returns Array of all Magic Movers
   */
  async getAllMovers(): Promise<IMagicMover[]> {
    return MagicMover.find().populate("items");
  }

  /**
   * Retrieves a Magic Mover by ID.
   * @param id - The mover ID
   * @returns The Magic Mover or null
   */
  async getMoverById(id: string): Promise<IMagicMover | null> {
    return MagicMover.findById(id).populate("items");
  }

  /**
   * Loads an item onto a Magic Mover.
   * Validates weight limits and quest state before loading.
   * Creates an activity log entry.
   * @param moverId - The mover ID
   * @param itemId - The item ID to load
   * @returns The updated Magic Mover
   * @throws Error if mover/item not found, mover is on-mission, or weight limit exceeded
   */
  async loadItem(moverId: string, itemId: string): Promise<IMagicMover> {
    const mover = await MagicMover.findById(moverId).populate("items");
    if (!mover) {
      throw new Error("Magic Mover not found");
    }

    if (mover.questState === "on-mission") {
      throw new Error("Cannot load items while on a mission");
    }

    const item = await MagicItem.findById(itemId);
    if (!item) {
      throw new Error("Magic Item not found");
    }

    // Calculate current load weight
    const currentWeight = (mover.items as any[]).reduce(
      (sum: number, i: any) => sum + (i.weight || 0),
      0
    );

    if (currentWeight + item.weight > mover.weightLimit) {
      throw new Error(
        `Weight limit exceeded. Current: ${currentWeight}, Item: ${item.weight}, Limit: ${mover.weightLimit}`
      );
    }

    // Check if item is already loaded
    const alreadyLoaded = mover.items.some(
      (i: any) => i._id.toString() === itemId
    );
    if (alreadyLoaded) {
      throw new Error("Item is already loaded on this mover");
    }

    // Update mover state and add item
    mover.questState = "loading";
    mover.items.push(item._id as any);
    await mover.save();

    // Log the activity
    await ActivityLog.create({ moverId: mover._id, action: "loading" });

    return MagicMover.findById(moverId).populate("items") as Promise<IMagicMover>;
  }

  /**
   * Starts a mission for a Magic Mover.
   * Sets state to "on-mission" and prevents further loading.
   * Creates an activity log entry.
   * @param moverId - The mover ID
   * @returns The updated Magic Mover
   * @throws Error if mover not found, already on mission, or has no items
   */
  async startMission(moverId: string): Promise<IMagicMover> {
    const mover = await MagicMover.findById(moverId);
    if (!mover) {
      throw new Error("Magic Mover not found");
    }

    if (mover.questState === "on-mission") {
      throw new Error("Mover is already on a mission");
    }

    if (mover.items.length === 0) {
      throw new Error("Cannot start a mission with no items loaded");
    }

    mover.questState = "on-mission";
    await mover.save();

    // Log the activity
    await ActivityLog.create({ moverId: mover._id, action: "on-mission" });

    return MagicMover.findById(moverId).populate("items") as Promise<IMagicMover>;
  }

  /**
   * Ends a mission for a Magic Mover.
   * Unloads all items, sets state back to "resting", increments mission count.
   * Creates an activity log entry.
   * @param moverId - The mover ID
   * @returns The updated Magic Mover
   * @throws Error if mover not found or not on a mission
   */
  async endMission(moverId: string): Promise<IMagicMover> {
    const mover = await MagicMover.findById(moverId);
    if (!mover) {
      throw new Error("Magic Mover not found");
    }

    if (mover.questState !== "on-mission") {
      throw new Error("Mover is not on a mission");
    }

    // Unload everything, go back to resting, increment missions
    mover.items = [];
    mover.questState = "resting";
    mover.missionsCompleted += 1;
    await mover.save();

    // Log the activity
    await ActivityLog.create({ moverId: mover._id, action: "resting" });

    return mover;
  }

  /**
   * Returns all Magic Movers sorted by missions completed (descending).
   * @returns Array of Magic Movers in leaderboard order
   */
  async getLeaderboard(): Promise<IMagicMover[]> {
    return MagicMover.find().sort({ missionsCompleted: -1 }).populate("items");
  }
}
