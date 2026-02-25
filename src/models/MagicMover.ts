import mongoose, { Schema, Document } from "mongoose";

/**
 * Represents the possible quest states of a Magic Mover.
 */
export type QuestState = "resting" | "loading" | "on-mission";

/**
 * Interface for a Magic Mover document.
 */
export interface IMagicMover extends Document {
  /** The name of the Magic Mover */
  name: string;
  /** Maximum weight the mover can carry */
  weightLimit: number;
  /** Current quest state */
  questState: QuestState;
  /** Items currently loaded on this mover */
  items: mongoose.Types.ObjectId[];
  /** Total number of completed missions */
  missionsCompleted: number;
}

const MagicMoverSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Mover name is required"],
      trim: true,
    },
    weightLimit: {
      type: Number,
      required: [true, "Weight limit is required"],
      min: [1, "Weight limit must be at least 1"],
    },
    questState: {
      type: String,
      enum: ["resting", "loading", "on-mission"],
      default: "resting",
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "MagicItem",
      },
    ],
    missionsCompleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const MagicMover = mongoose.model<IMagicMover>(
  "MagicMover",
  MagicMoverSchema
);
