const mongoose = require("mongoose");

const { Schema } = mongoose;

const SubCategoryIdSchema = new mongoose.Schema({
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subCode: {
    type: String,
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    default: null,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SubCategoryID", SubCategoryIdSchema);
