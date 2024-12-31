const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrganizationSchema = new mongoose.Schema({
  setupCompleted: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  licensePeriod: {
    type: String,
    // required: true,

  },
  licenseEndDate: {
    type: Date,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  framework: {
    type: Schema.Types.ObjectId, ref: 'Framework',
    default: null
  },
  module: {
    type: Schema.Types.ObjectId, ref: 'Module',
    default: null
  },
  categories: [{
    type: Schema.Types.ObjectId, ref: 'Category',
    default: []
  }],
  subCategories: [{
    type: Schema.Types.ObjectId, ref: 'SubCategory',
    default: []
  }],
  subCategoriesId:[{
    type: Schema.Types.ObjectId, ref: 'SubCategoryID',
    default: []
  }],
  targetScore: [{
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    score: { type: Number, required: true }
  }],
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Organization", OrganizationSchema);
