const mongoose = require("mongoose");

const { Schema } = mongoose;

const TaskSchema = new mongoose.Schema({
  subCategory: {
    type: Schema.Types.ObjectId, ref: 'SubCategory'
  },
  subCategoriesId:{
    type: Schema.Types.ObjectId, ref: 'SubCategoryID',
  },
  organization: {
    type: Schema.Types.ObjectId, ref: 'Organization'
  },
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  due_date: {
    type: String,
  },
  status: {
    type: String,
  },
  files: [{
    type: Object,
    default: []
  }],
  deliverables: [{
    type: Object,
    default: []
  }],
  assignees: [{
    type: Schema.Types.ObjectId, ref: 'User',
    default: null
  }],
  priority: {
    type: Number,
    default: 1
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: false
  },
});

module.exports = mongoose.model("Task", TaskSchema);
