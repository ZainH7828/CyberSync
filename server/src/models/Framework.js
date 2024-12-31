const mongoose = require("mongoose");

const FrameworkSchema = new mongoose.Schema({
  module: {
    type: mongoose.Types.ObjectId, 
    ref: 'Modules'
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Framework", FrameworkSchema);
