const mongoose = require("mongoose");

const { Schema } = mongoose;

const SubCategorySchema = new mongoose.Schema({
  category: {
    type: Schema.Types.ObjectId, ref: 'Category'
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  subCatCode: {
    type: String,
    required: false,
  },
  organization: {
    type: Schema.Types.ObjectId, ref: 'Organization',
    default: null
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
  description: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);
