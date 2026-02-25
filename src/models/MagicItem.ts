import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface for a Magic Item document.
 */
export interface IMagicItem extends Document {
  /** The name of the magic item */
  name: string;
  /** The weight (magic power needed) of the item */
  weight: number;
}

const MagicItemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    weight: {
      type: Number,
      required: [true, "Item weight is required"],
      min: [0.1, "Weight must be at least 0.1"],
    },
  },
  {
    timestamps: true,
  }
);

export const MagicItem = mongoose.model<IMagicItem>(
  "MagicItem",
  MagicItemSchema
);
