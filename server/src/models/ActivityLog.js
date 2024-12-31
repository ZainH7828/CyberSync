const mongoose = require("mongoose");

const { Schema } = mongoose;

const ActivityLogSchema = new mongoose.Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  type: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
