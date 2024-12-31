const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategorySchema = new mongoose.Schema({
  framework: {
    type: Schema.Types.ObjectId, ref: 'Framework'
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
    required: true,
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  displayorder:{
    type: Number,
    default:1
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", CategorySchema);
