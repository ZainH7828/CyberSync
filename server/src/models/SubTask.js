const mongoose = require("mongoose");

const { Schema } = mongoose;

const SubTaskSchema = new mongoose.Schema({
  taskId: {
    type: Schema.Types.ObjectId, ref: 'Task'
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

module.exports = mongoose.model("SubTask", SubTaskSchema);
