import mongoose, { Schema, Document } from "mongoose";

/**
 * Possible activity log actions.
 */
export type ActivityAction = "loading" | "on-mission" | "resting";

/**
 * Interface for an Activity Log document.
 * Tracks state changes of Magic Movers.
 */
export interface IActivityLog extends Document {
  /** Reference to the Magic Mover */
  moverId: mongoose.Types.ObjectId;
  /** The action/state that was logged */
  action: ActivityAction;
  /** Timestamp of the activity */
  timestamp: Date;
}

const ActivityLogSchema: Schema = new Schema({
  moverId: {
    type: Schema.Types.ObjectId,
    ref: "MagicMover",
    required: true,
  },
  action: {
    type: String,
    enum: ["loading", "on-mission", "resting"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema
);
